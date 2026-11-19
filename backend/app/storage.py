"""Validated local image storage for uploaded and annotated images."""

from dataclasses import dataclass
from io import BytesIO
from pathlib import Path
from uuid import uuid4
from urllib.parse import urlparse
import logging
import re

from PIL import Image, UnidentifiedImageError


MAX_UPLOAD_BYTES = 10 * 1024 * 1024
IMAGE_EXTENSIONS = {"JPEG": "jpg", "PNG": "png", "WEBP": "webp"}
STORED_NAME = re.compile(r"^[0-9a-f]{32}\.(?:jpg|png|webp)$")
logger = logging.getLogger(__name__)


class InvalidImageError(ValueError):
    """The image is empty, too large, corrupt, or unsupported."""


@dataclass(frozen=True)
class StoredImage:
    path: Path
    url_path: str


class ImageStorage:
    def __init__(self, root: Path):
        self.root = root.resolve()
        for folder in ("originals", "predictions"):
            (self.root / folder).mkdir(parents=True, exist_ok=True)

    def save_original(self, data: bytes) -> StoredImage:
        return self._save(data, "originals", max_bytes=MAX_UPLOAD_BYTES)

    def save_prediction(self, data: bytes) -> StoredImage:
        return self._save(data, "predictions")

    def _save(self, data: bytes, folder: str, max_bytes: int | None = None) -> StoredImage:
        if not data or (max_bytes is not None and len(data) > max_bytes):
            raise InvalidImageError("Image is empty or exceeds the 10 MB upload limit")

        try:
            with Image.open(BytesIO(data)) as image:
                extension = IMAGE_EXTENSIONS.get(image.format)
                if extension is None:
                    raise InvalidImageError("Only JPEG, PNG, and WEBP images are supported")
                image.verify()
        except InvalidImageError:
            raise
        except (UnidentifiedImageError, OSError, ValueError) as exc:
            raise InvalidImageError("Invalid image data") from exc

        filename = f"{uuid4().hex}.{extension}"
        path = self.root / folder / filename
        with path.open("xb") as output:
            output.write(data)
        return StoredImage(path=path, url_path=f"/uploads/{folder}/{filename}")

    @staticmethod
    def delete(image: StoredImage) -> None:
        image.path.unlink(missing_ok=True)

    def delete_url(self, url: str | None, folder: str) -> None:
        """Remove only a generated upload in the expected storage folder."""
        if not url:
            return
        path = urlparse(url).path
        prefix = f"/uploads/{folder}/"
        name = path.removeprefix(prefix)
        if not path.startswith(prefix) or not STORED_NAME.fullmatch(name):
            logger.warning("Skipping unsafe stored image URL: %s", url)
            return
        target = (self.root / folder / name).resolve()
        if target.parent != (self.root / folder).resolve():
            logger.warning("Skipping image outside storage root: %s", url)
            return
        try:
            target.unlink(missing_ok=True)
        except OSError:
            logger.exception("Could not remove image after database deletion: %s", target)
