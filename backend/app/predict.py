"""Image prediction endpoint using the existing MySQL tables and storage."""

import json

from fastapi import APIRouter, File, HTTPException, Request, UploadFile
from sqlalchemy import text

from app.db import session_scope
from app.inference import InferenceService, NoDetectionError
from app.storage import InvalidImageError, MAX_UPLOAD_BYTES


router = APIRouter()


@router.post("/predict")
def predict(request: Request, file: UploadFile = File(...)):
    if file.content_type not in {"image/jpeg", "image/png", "image/webp"}:
        raise HTTPException(422, detail="Chỉ hỗ trợ ảnh JPEG, PNG hoặc WEBP")
    data = file.file.read(MAX_UPLOAD_BYTES + 1)
    storage = request.app.state.storage
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(422, detail="Ảnh vượt quá giới hạn 10 MB")

    try:
        original = storage.save_original(data)
    except InvalidImageError as exc:
        raise HTTPException(422, detail=str(exc)) from exc

    processed = None
    committed = False
    try:
        result = request.app.state.inference.predict(data)
        processed = storage.save_prediction(result.processed_image)
        base = str(request.base_url).rstrip("/")
        original_url = base + original.url_path
        processed_url = base + processed.url_path
        primary = max(result.predictions, key=lambda item: item.confidence)

        with session_scope(request.app.state.db_session_factory) as session:
            row = session.execute(
                text("""INSERT INTO detections
                    (original_image_url, processed_image_url, primary_label,
                     primary_category, confidence, treatment_guide)
                    VALUES (:original, :processed, :label, :category, :confidence, :guide)"""),
                {"original": original_url, "processed": processed_url,
                 "label": primary.label, "category": primary.category,
                 "confidence": primary.confidence, "guide": primary.treatment_guide},
            )
            detection_id = row.lastrowid
            predictions = []
            for item in result.predictions:
                object_row = session.execute(
                    text("""INSERT INTO detected_objects
                        (detection_id, label, category, confidence,
                         bbox_xmin, bbox_ymin, bbox_xmax, bbox_ymax)
                        VALUES (:detection_id, :label, :category, :confidence,
                                :x1, :y1, :x2, :y2)"""),
                    {"detection_id": detection_id, "label": item.label,
                     "category": item.category, "confidence": item.confidence,
                     "x1": item.bbox[0], "y1": item.bbox[1],
                     "x2": item.bbox[2], "y2": item.bbox[3]},
                )
                predictions.append({"id": f"det-{object_row.lastrowid}",
                                    "label": item.label, "category": item.category,
                                    "confidence": item.confidence,
                                    "bbox": list(item.bbox),
                                    "treatment_guide": item.treatment_guide})
            session.execute(
                text("UPDATE detections SET raw_predictions_json = :predictions WHERE id = :id"),
                {"predictions": json.dumps(predictions, ensure_ascii=False),
                 "id": detection_id},
            )
            timestamp = session.execute(
                text("SELECT created_at FROM detections WHERE id = :id"),
                {"id": detection_id},
            ).scalar_one()
        committed = True

        return {"id": detection_id, "timestamp": timestamp.strftime("%Y-%m-%d %H:%M:%S"),
                "original_image_url": original_url, "processed_image_url": processed_url,
                "primary_label": primary.label, "primary_category": primary.category,
                "confidence": primary.confidence,
                "treatment_guide": primary.treatment_guide,
                "predictions": predictions}
    except NoDetectionError as exc:
        raise HTTPException(422, detail=str(exc)) from exc
    finally:
        # Only successful requests retain image files.
        if not committed:
            storage.delete(original)
            if processed is not None:
                storage.delete(processed)
