import io
import pytest
import fitz
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from app.core.exceptions import PDFProcessingException
from app.services.pdf_parser import PDFParser


def create_sample_pdf_bytes(content: str) -> bytes:
    buf = io.BytesIO()
    p = canvas.Canvas(buf, pagesize=letter)
    y = 750
    for line in content.split("\n"):
        p.drawString(50, y, line)
        y -= 20
    p.showPage()
    p.save()
    buf.seek(0)
    return buf.read()


def test_extract_text_from_valid_pdf():
    sample_text = "Alice Smith\nSoftware Engineer with Python and FastAPI experience.\nB.S. in Computer Science."
    pdf_bytes = create_sample_pdf_bytes(sample_text)

    extracted, meta = PDFParser.extract_text_from_bytes(pdf_bytes, "alice_resume.pdf")
    assert "Alice Smith" in extracted
    assert "Python" in extracted
    assert meta["pages"] == 1
    assert meta["format"] == "pdf"


def test_extract_text_from_txt():
    txt_bytes = b"Jane Doe\nFrontend React Developer\nSkills: TypeScript, Tailwind, Next.js"
    extracted, meta = PDFParser.extract_text_from_bytes(txt_bytes, "jane.txt")
    assert "Jane Doe" in extracted
    assert "TypeScript" in extracted
    assert meta["format"] == "txt"


def test_extract_empty_or_corrupt_pdf():
    with pytest.raises(PDFProcessingException):
        PDFParser.extract_text_from_bytes(b"not a valid pdf content", "invalid.pdf")
