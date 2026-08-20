import os
import uuid
from typing import Tuple

from app.core.config import settings
from app.core.security import sanitize_filename


class StorageService:
    """
    Manages filesystem storage for uploaded resume documents.
    """

    @classmethod
    def save_upload_file(cls, filename: str, content: bytes) -> Tuple[str, str]:
        """
        Saves raw bytes into the upload directory under a unique filename.
        Returns (relative_file_path, sanitized_filename).
        """
        sanitized = sanitize_filename(filename)
        unique_prefix = uuid.uuid4().hex[:8]
        stored_filename = f"{unique_prefix}_{sanitized}"
        target_path = os.path.join(settings.UPLOAD_DIR, stored_filename)

        with open(target_path, "wb") as f:
            f.write(content)

        return target_path, sanitized
