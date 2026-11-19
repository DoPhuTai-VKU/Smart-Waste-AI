"""Backend settings loaded from environment variables and backend/.env."""

import os
from dataclasses import dataclass, field
from pathlib import Path

from dotenv import load_dotenv


BACKEND_DIR = Path(__file__).resolve().parent.parent


@dataclass(frozen=True)
class Settings:
    uploads_dir: Path
    model_path: Path
    confidence_threshold: float
    db_host: str
    db_port: int
    db_name: str
    db_user: str
    db_password: str = field(repr=False)


def load_settings() -> Settings:
    load_dotenv(BACKEND_DIR / ".env", override=False)

    model_path = Path(os.getenv("YOLO_MODEL_PATH", "weights/best.pt"))
    if not model_path.is_absolute():
        model_path = BACKEND_DIR / model_path

    confidence_threshold = float(os.getenv("CONFIDENCE_THRESHOLD", "0.5"))
    if not 0 <= confidence_threshold <= 1:
        raise ValueError("CONFIDENCE_THRESHOLD must be between 0 and 1")

    db_port = int(os.getenv("DB_PORT", "3306"))
    if not 1 <= db_port <= 65535:
        raise ValueError("DB_PORT must be between 1 and 65535")

    return Settings(
        uploads_dir=BACKEND_DIR / "uploads",
        model_path=model_path.resolve(),
        confidence_threshold=confidence_threshold,
        db_host=os.getenv("DB_HOST", "localhost"),
        db_port=db_port,
        db_name=os.getenv("DB_NAME", "smart_waste_db"),
        db_user=os.getenv("DB_USER", "root"),
        db_password=os.getenv("DB_PASSWORD", ""),
    )
