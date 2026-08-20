import re
import unicodedata
from typing import Dict, List

from app.core.security import redact_protected_attributes


class TextCleaner:
    """
    Cleans raw resume and job text, detects standard resume sections,
    and strips noise while preserving important bullet points and structure.
    """

    SECTION_PATTERNS = {
        "summary": [
            r"^\s*(?:professional\s+)?summary\b",
            r"^\s*about\s+me\b",
            r"^\s*profile\b",
            r"^\s*objective\b",
            r"^\s*executive\s+summary\b",
        ],
        "experience": [
            r"^\s*(?:work|professional|employment)\s+experience\b",
            r"^\s*experience\b",
            r"^\s*work\s+history\b",
            r"^\s*career\s+history\b",
        ],
        "skills": [
            r"^\s*(?:technical\s+)?skills\b",
            r"^\s*core\s+competencies\b",
            r"^\s*technologies\b",
            r"^\s*tech\s+stack\b",
            r"^\s*tools\s*&\s*technologies\b",
        ],
        "education": [
            r"^\s*education\b",
            r"^\s*academic\s+background\b",
            r"^\s*degrees\b",
            r"^\s*educational\s+qualifications\b",
        ],
        "projects": [
            r"^\s*(?:key\s+|featured\s+|personal\s+)?projects\b",
            r"^\s*technical\s+projects\b",
        ],
        "certifications": [
            r"^\s*certifications?\b",
            r"^\s*licenses?\s*(?:&|and)\s*certifications?\b",
            r"^\s*certificates?\b",
            r"^\s*credentials\b",
        ],
        "awards": [
            r"^\s*awards?\s*(?:&|and)\s*honors?\b",
            r"^\s*achievements?\b",
        ],
    }

    @classmethod
    def clean_text(cls, text: str) -> str:
        """
        Normalizes unicode, standardizes linebreaks, removes extraneous control characters,
        and ensures clean bullet points.
        """
        if not text:
            return ""

        # Normalize unicode (e.g. smart quotes, em-dashes, special bullets)
        text = unicodedata.normalize("NFKD", text)

        # Replace non-standard bullets with standard dash
        text = re.sub(r"[\u2022\u2023\u25E6\u2043\u2219\u25CB\u25CF\u25AA\u25AB]", "\n- ", text)

        # Standardize linebreaks
        text = text.replace("\r\n", "\n").replace("\r", "\n")

        # Strip unprintable control characters except standard whitespace
        text = "".join(
            ch for ch in text if ch == "\n" or ch == "\t" or unicodedata.category(ch)[0] != "C"
        )

        # Collapse excessive horizontal whitespace
        text = re.sub(r"[ \t]+", " ", text)

        # Collapse more than 2 consecutive newlines into 2
        text = re.sub(r"\n\s*\n\s*\n+", "\n\n", text)

        return text.strip()

    @classmethod
    def segment_sections(cls, text: str) -> Dict[str, str]:
        """
        Heuristically identifies and segments resume text into recognized standard sections.
        """
        lines = text.split("\n")
        sections: Dict[str, List[str]] = {
            "header": [],
            "summary": [],
            "experience": [],
            "skills": [],
            "education": [],
            "projects": [],
            "certifications": [],
            "awards": [],
            "other": [],
        }

        current_section = "header"

        for line in lines:
            trimmed = line.strip()
            if not trimmed:
                continue

            detected_section = None
            # Check if line looks like a section header (usually short, uppercase or capitalized)
            if len(trimmed) < 40:
                for section_name, patterns in cls.SECTION_PATTERNS.items():
                    for pattern in patterns:
                        if re.match(pattern, trimmed, re.IGNORECASE):
                            detected_section = section_name
                            break
                    if detected_section:
                        break

            if detected_section:
                current_section = detected_section
            else:
                sections[current_section].append(trimmed)

        # Join lines for each section
        return {k: "\n".join(v).strip() for k, v in sections.items() if v}

    @classmethod
    def sanitize_for_evaluation(cls, text: str) -> str:
        """
        Prepares text for evaluation by cleaning and applying fairness protections.
        """
        cleaned = cls.clean_text(text)
        return redact_protected_attributes(cleaned)
