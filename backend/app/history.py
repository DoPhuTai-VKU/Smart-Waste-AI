"""History endpoints backed by the existing detection tables."""

import json

from fastapi import APIRouter, HTTPException, Query, Request
from sqlalchemy import text

from app.categories import CATEGORIES
from app.db import session_scope


router = APIRouter()


def _timestamp(value):
    return value.strftime("%Y-%m-%d %H:%M:%S")


@router.get("/history")
def list_history(
    request: Request,
    page: int = Query(1, ge=1),
    limit: int = Query(6, ge=1, le=100),
    category: str | None = None,
    search: str | None = None,
    sortBy: str = Query("newest", pattern="^(newest|oldest|confidence)$"),
):
    if category and category != "all" and category not in CATEGORIES:
        raise HTTPException(422, detail="Unknown waste category")

    conditions = []
    values = {}
    if category and category != "all":
        conditions.append("primary_category = :category")
        values["category"] = category
    if search and search.strip():
        conditions.append("LOWER(primary_label) LIKE :search ESCAPE '!' ")
        escaped = search.strip().lower().replace("!", "!!").replace("%", "!%").replace("_", "!_")
        values["search"] = f"%{escaped}%"
    where = " WHERE " + " AND ".join(conditions) if conditions else ""
    order = {"newest": "created_at DESC, id DESC",
             "oldest": "created_at ASC, id ASC",
             "confidence": "confidence DESC, id DESC"}[sortBy]

    with request.app.state.db_session_factory() as session:
        total = session.execute(text("SELECT COUNT(*) FROM detections" + where), values).scalar_one()
        rows = session.execute(
            text("""SELECT id, original_image_url, processed_image_url, primary_label,
                   primary_category, confidence, created_at, treatment_guide
                   FROM detections""" + where + f" ORDER BY {order} LIMIT :limit OFFSET :offset"),
            {**values, "limit": limit, "offset": (page - 1) * limit},
        ).mappings().all()

    return {"total": total, "page": page, "limit": limit, "items": [
        {"id": row["id"], "original_image_url": row["original_image_url"],
         "processed_image_url": row["processed_image_url"],
         "primary_label": row["primary_label"], "category": row["primary_category"],
         "confidence": row["confidence"], "created_at": _timestamp(row["created_at"]),
         "treatment_guide": row["treatment_guide"]}
        for row in rows]}


@router.get("/history/{detection_id}")
def history_detail(request: Request, detection_id: int):
    with request.app.state.db_session_factory() as session:
        row = session.execute(
            text("""SELECT id, original_image_url, processed_image_url, primary_label,
                   primary_category, confidence, created_at, treatment_guide, raw_predictions_json
                   FROM detections WHERE id = :id"""),
            {"id": detection_id},
        ).mappings().one_or_none()
        if row is None:
            raise HTTPException(404, detail="Detection not found")
        objects = session.execute(
            text("""SELECT id, label, category, confidence, bbox_xmin, bbox_ymin,
                   bbox_xmax, bbox_ymax FROM detected_objects
                   WHERE detection_id = :id ORDER BY id"""),
            {"id": detection_id},
        ).mappings().all()

    # Guides and IDs stored at prediction time preserve the original result.
    raw = row["raw_predictions_json"]
    if isinstance(raw, str):
        raw = json.loads(raw)
    guides = {str(item["id"]): item.get("treatment_guide") for item in (raw or [])}
    predictions = [
        {"id": f"det-{obj['id']}", "label": obj["label"],
         "category": obj["category"], "confidence": obj["confidence"],
         "bbox": [obj["bbox_xmin"], obj["bbox_ymin"],
                  obj["bbox_xmax"], obj["bbox_ymax"]],
         "treatment_guide": guides.get(f"det-{obj['id']}") or CATEGORIES[obj["category"]].treatment_guide}
        for obj in objects
    ]
    return {"id": row["id"], "timestamp": _timestamp(row["created_at"]),
            "original_image_url": row["original_image_url"],
            "processed_image_url": row["processed_image_url"],
            "primary_label": row["primary_label"],
            "primary_category": row["primary_category"],
            "confidence": row["confidence"],
            "treatment_guide": row["treatment_guide"],
            "predictions": predictions}


@router.delete("/history/{detection_id}", status_code=204)
def delete_history(request: Request, detection_id: int):
    with session_scope(request.app.state.db_session_factory) as session:
        row = session.execute(
            text("""SELECT original_image_url, processed_image_url
                FROM detections WHERE id = :id FOR UPDATE"""),
            {"id": detection_id},
        ).mappings().one_or_none()
        if row is None:
            raise HTTPException(404, detail="Detection not found")
        original_url = row["original_image_url"]
        processed_url = row["processed_image_url"]
        session.execute(text("DELETE FROM detections WHERE id = :id"), {"id": detection_id})

    storage = request.app.state.storage
    storage.delete_url(original_url, "originals")
    storage.delete_url(processed_url, "predictions")
