import hashlib
import os
import re
import unicodedata
from typing import Tuple
from app.core.config import settings


# Protected attributes that must be stripped or ignored to prevent algorithmic bias
PROTECTED_PATTERNS = [
    r"\b(male|female|non-binary|genderqueer|transgender)\b",
    r"\b(single|married|divorced|widowed|marital status)\b",
    r"\b(hindu|muslim|christian|sikh|jewish|buddhist|jain|religion)\b",
    r"\b(caste|brahmin|kshatriya|vaishya|shudra|dalit)\b",
    r"\b(nationality:\s*[A-Za-z]+)\b",
    r"\b(dob|date of birth|age:\s*\d{1,2})\b",
]


def sanitize_filename(filename: str) -> str:
    """
    Sanitizes filenames to prevent directory traversal or malicious characters.
    """
    # Normalize unicode characters
    clean_name = unicodedata.normalize("NFKD", filename).encode("ascii", "ignore").decode("ascii")
    # Strip path traversal elements
    clean_name = os.path.basename(clean_name)
    # Replace non-alphanumeric (except dot, dash, underscore) with underscore
    clean_name = re.sub(r"[^a-zA-Z0-9._-]", "_", clean_name)
    # Prevent hidden files (.filename)
    clean_name = clean_name.lstrip(".")
    if not clean_name:
        clean_name = "unnamed_resume"
    return clean_name


def validate_file_upload(filename: str, content: bytes) -> Tuple[bool, str]:
    """
    Validates file extension and size constraints.
    """
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    if ext not in settings.ALLOWED_EXTENSIONS:
        return False, f"Unsupported file extension '.{ext}'. Allowed: {', '.join(settings.ALLOWED_EXTENSIONS)}"

    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if len(content) > max_bytes:
        return False, f"File size exceeds maximum limit of {settings.MAX_UPLOAD_SIZE_MB}MB"

    if len(content) == 0:
        return False, "File is empty"

    return True, "Valid"


def compute_file_hash(content: bytes) -> str:
    """
    Computes SHA-256 hash of file content to detect duplicates.
    """
    return hashlib.sha256(content).hexdigest()


def redact_protected_attributes(text: str) -> str:
    """
    Redacts sensitive personal attributes from text before evaluation to ensure fairness.
    """
    redacted = text
    for pattern in PROTECTED_PATTERNS:
        redacted = re.sub(pattern, "[REDACTED_DEMOGRAPHIC]", redacted, flags=re.IGNORECASE)
    return redacted
