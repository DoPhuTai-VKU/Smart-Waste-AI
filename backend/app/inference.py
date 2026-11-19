"""YOLOv8s inference with pixel boxes and an annotated image."""

from dataclasses import dataclass
from io import BytesIO
from pathlib import Path
from threading import Lock

from PIL import Image, ImageDraw, ImageOps, UnidentifiedImageError
from ultralytics import YOLO

from app.categories import YOLO_CLASS_NAMES, get_category
from app.config import Settings
from app.storage import InvalidImageError


class NoDetectionError(ValueError):
    """No supported object reached the configured confidence threshold."""


@dataclass(frozen=True)
class Detection:
    label: str
    category: str
    confidence: float
    bbox: tuple[int, int, int, int]
    treatment_guide: str


@dataclass(frozen=True)
class InferenceResult:
    predictions: tuple[Detection, ...]
    processed_image: bytes


class InferenceService:
    def __init__(self, settings: Settings):
        self.model_path: Path = settings.model_path
        self.confidence_threshold = settings.confidence_threshold
        self._model: YOLO | None = None
        self._lock = Lock()

    def _load_model(self) -> YOLO:
        if not self.model_path.is_file():
            raise FileNotFoundError(f"YOLO weights not found: {self.model_path}")
        model = YOLO(str(self.model_path))
        names = tuple(model.names[index] for index in range(len(model.names)))
        if names != YOLO_CLASS_NAMES:
            raise ValueError(f"Unexpected YOLO class order: {names}")
        return model

    def predict(self, image_bytes: bytes) -> InferenceResult:
        try:
            with Image.open(BytesIO(image_bytes)) as image:
                original = ImageOps.exif_transpose(image).convert("RGB")
        except (UnidentifiedImageError, OSError, ValueError) as exc:
            raise InvalidImageError("Invalid image data") from exc

        with self._lock:
            if self._model is None:
                self._model = self._load_model()
            result = self._model.predict(
                source=original,
                conf=self.confidence_threshold,
                verbose=False,
            )[0]

        boxes = result.boxes
        if boxes is None or len(boxes) == 0:
            raise NoDetectionError("Không phát hiện loại rác phù hợp")

        width, height = original.size
        predictions = []
        annotated = original.copy()
        draw = ImageDraw.Draw(annotated)
        line_width = max(2, min(width, height) // 250)

        for xyxy, class_id, score in zip(
            boxes.xyxy.cpu().tolist(), boxes.cls.cpu().tolist(), boxes.conf.cpu().tolist()
        ):
            label = self._model.names[int(class_id)]
            category = get_category(label)
            x1, y1, x2, y2 = (
                max(0, min(limit, round(value)))
                for value, limit in zip(xyxy, (width, height, width, height))
            )
            bbox = (x1, y1, x2, y2)
            predictions.append(
                Detection(
                    label=label,
                    category=category.key,
                    confidence=float(score),
                    bbox=bbox,
                    treatment_guide=category.treatment_guide,
                )
            )
            draw.rectangle(bbox, outline=category.color_hex, width=line_width)
            caption = f"{label} {score:.0%}"
            text_box = draw.textbbox((x1, y1), caption)
            caption_width = text_box[2] - text_box[0] + 8
            caption_height = text_box[3] - text_box[1] + 6
            caption_y = max(0, y1 - caption_height)
            draw.rectangle(
                (x1, caption_y, min(width, x1 + caption_width), caption_y + caption_height),
                fill=category.color_hex,
            )
            draw.text(
                (x1 + 4, caption_y + 3),
                caption,
                fill="#334155" if label == "styrofoam" else "#FFFFFF",
            )

        output = BytesIO()
        annotated.save(output, format="JPEG", quality=90)
        return InferenceResult(predictions=tuple(predictions), processed_image=output.getvalue())
