from app.core.config import settings
from app.core.exceptions import ValidationException


def validate_resume_file(filename: str, content: bytes) -> None:
    """
    Validates file extension, size, and non-emptiness.
    Raises ValidationException if invalid.
    """
    if not filename or "." not in filename:
        raise ValidationException("Invalid filename or missing extension.")

    ext = filename.rsplit(".", 1)[-1].lower()
    if ext not in settings.ALLOWED_EXTENSIONS:
        raise ValidationException(
            f"Unsupported file format '.{ext}'. Supported formats: {', '.join(settings.ALLOWED_EXTENSIONS)}"
        )

    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if len(content) > max_bytes:
        raise ValidationException(
            f"File '{filename}' exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE_MB}MB."
        )

    if len(content) == 0:
        raise ValidationException(f"Uploaded file '{filename}' is empty.")
