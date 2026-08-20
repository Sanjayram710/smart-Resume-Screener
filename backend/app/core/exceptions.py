from typing import Any, Dict, Optional


class AppException(Exception):
    """Base exception for all application errors."""

    def __init__(
        self, message: str, status_code: int = 400, details: Optional[Dict[str, Any]] = None
    ):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.details = details or {}


class ResourceNotFoundException(AppException):
    """Raised when a requested resource (Job, Candidate, Resume, Screening) is not found."""

    def __init__(self, resource: str, identifier: Any):
        super().__init__(
            message=f"{resource} with identifier '{identifier}' was not found.",
            status_code=404,
            details={"resource": resource, "identifier": identifier},
        )


class ValidationException(AppException):
    """Raised when input validation fails."""

    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(message=message, status_code=422, details=details)


class PDFProcessingException(AppException):
    """Raised when PDF extraction or parsing fails."""

    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(message=message, status_code=400, details=details)


class LLMServiceException(AppException):
    """Raised when LLM extraction or evaluation fails."""

    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(message=message, status_code=502, details=details)


class DuplicateResourceException(AppException):
    """Raised when a duplicate resume or job is detected."""

    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(message=message, status_code=409, details=details)


class ScoringException(AppException):
    """Raised when deterministic scoring computation encounters an error."""

    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(message=message, status_code=500, details=details)
