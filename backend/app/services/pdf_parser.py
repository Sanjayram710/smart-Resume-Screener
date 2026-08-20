import io
from typing import Dict, Any, Tuple
import pymupdf as fitz
from app.core.exceptions import PDFProcessingException
from app.core.logging import logger


class PDFParser:
    """
    Extracts text content and metadata from PDF and TXT documents using PyMuPDF.
    """

    @staticmethod
    def extract_text_from_bytes(file_bytes: bytes, filename: str) -> Tuple[str, Dict[str, Any]]:
        """
        Extracts plain text from file bytes (PDF or TXT).
        Returns a tuple of (extracted_text, metadata).
        """
        ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
        
        if ext == "txt":
            try:
                text = file_bytes.decode("utf-8")
            except UnicodeDecodeError:
                text = file_bytes.decode("latin-1", errors="ignore")
            
            if not text.strip():
                raise PDFProcessingException("Text file contains no readable text.")
                
            return text.strip(), {"pages": 1, "format": "txt", "char_count": len(text)}

        # PDF extraction
        try:
            doc = fitz.open(stream=file_bytes, filetype="pdf")
        except Exception as e:
            logger.error(f"Failed to open PDF '{filename}': {e}")
            raise PDFProcessingException(f"Corrupted or invalid PDF file: {str(e)}")

        if doc.is_encrypted:
            doc.close()
            raise PDFProcessingException("Password-protected or encrypted PDFs are not supported.")

        if doc.page_count == 0:
            doc.close()
            raise PDFProcessingException("PDF file contains no pages.")

        extracted_pages = []
        total_chars = 0
        has_images = False

        for page_num in range(doc.page_count):
            page = doc.load_page(page_num)
            page_text = page.get_text("text")
            if page_text:
                extracted_pages.append(page_text.strip())
                total_chars += len(page_text.strip())
            if len(page.get_images()) > 0:
                has_images = True

        page_count = doc.page_count
        doc.close()

        full_text = "\n\n".join(extracted_pages).strip()

        # Check for scanned or image-only PDF
        if total_chars < 50:
            if has_images:
                raise PDFProcessingException(
                    "This PDF appears to be a scanned image or photograph without embedded text. "
                    "Please upload a standard text-based PDF or TXT resume."
                )
            else:
                raise PDFProcessingException("PDF file contains almost no extractable text.")

        metadata = {
            "pages": page_count,
            "char_count": total_chars,
            "format": "pdf",
            "has_images": has_images,
        }

        return full_text, metadata
