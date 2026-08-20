import json
import re
from typing import Any, Dict, Optional
from app.core.logging import logger


def clean_and_extract_json(text: str) -> Optional[Dict[str, Any]]:
    """
    Extracts and parses JSON object from LLM response text, handling Markdown formatting,
    fences, trailing commas, and stray text.
    """
    if not text or not text.strip():
        return None

    cleaned = text.strip()

    # 1. Check for markdown code blocks ```json ... ``` or ``` ... ```
    match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", cleaned, re.IGNORECASE)
    if match:
        cleaned = match.group(1).strip()

    # 2. Try direct parse
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass

    # 3. Locate outermost curly brackets { ... }
    start_idx = cleaned.find("{")
    end_idx = cleaned.rfind("}")
    if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
        json_candidate = cleaned[start_idx : end_idx + 1]
        try:
            return json.loads(json_candidate)
        except json.JSONDecodeError:
            # 4. Attempt simple cleanup on candidate: remove trailing commas before closing braces/brackets
            fixed = re.sub(r",\s*([\]}])", r"\1", json_candidate)
            try:
                return json.loads(fixed)
            except json.JSONDecodeError as err:
                logger.warning(f"Failed to repair and parse JSON from candidate string: {err}")

    logger.error("Could not parse valid JSON from LLM response.")
    return None
