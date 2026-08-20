import math
import re
from typing import List, Optional
import httpx
import numpy as np
from app.core.config import settings
from app.core.logging import logger


class EmbeddingService:
    """
    Computes vector embeddings and cosine similarity between text profiles.
    Supports both OpenAI API embeddings and deterministic local TF-IDF / Bag-of-Words vectors.
    """

    DIMENSION = 128  # Dimension for deterministic local hash vector representation

    @classmethod
    def cosine_similarity(cls, vec_a: List[float], vec_b: List[float]) -> float:
        """
        Computes cosine similarity between two numerical vectors.
        Returns a float between 0.0 and 1.0.
        """
        if not vec_a or not vec_b or len(vec_a) != len(vec_b):
            return 0.0

        a = np.array(vec_a, dtype=np.float32)
        b = np.array(vec_b, dtype=np.float32)

        norm_a = np.linalg.norm(a)
        norm_b = np.linalg.norm(b)

        if norm_a == 0 or norm_b == 0:
            return 0.0

        similarity = float(np.dot(a, b) / (norm_a * norm_b))
        # Clamp to [0.0, 1.0]
        return max(0.0, min(1.0, (similarity + 1.0) / 2.0 if similarity < 0 else similarity))

    @classmethod
    def generate_local_embedding(cls, text: str) -> List[float]:
        """
        Generates a deterministic, normalized 128-dimensional dense vector from text
        using hashed n-grams and term frequency weights. Runs offline with zero external API calls.
        """
        if not text:
            return [0.0] * cls.DIMENSION

        tokens = re.findall(r"\b[a-zA-Z0-9_+#.-]+\b", text.lower())
        if not tokens:
            return [0.0] * cls.DIMENSION

        vec = np.zeros(cls.DIMENSION, dtype=np.float32)

        for token in tokens:
            # Hash unigram
            idx1 = abs(hash(token)) % cls.DIMENSION
            vec[idx1] += 1.0

            # Hash character 3-grams for subword similarity (e.g. 'postgres' vs 'postgresql')
            if len(token) >= 3:
                for i in range(len(token) - 2):
                    ngram = token[i : i + 3]
                    idx2 = abs(hash(ngram)) % cls.DIMENSION
                    vec[idx2] += 0.3

        # Apply sublinear TF scaling
        vec = np.log1p(vec)

        # L2 Normalize
        norm = np.linalg.norm(vec)
        if norm > 0:
            vec = vec / norm

        return vec.tolist()

    @classmethod
    async def get_embedding(cls, text: str) -> List[float]:
        """
        Gets embedding vector for given text. Uses OpenAI if real mode and API key configured,
        otherwise uses deterministic local vectorizer.
        """
        if settings.LLM_MODE == "real" and settings.OPENAI_API_KEY:
            try:
                async with httpx.AsyncClient(timeout=settings.LLM_REQUEST_TIMEOUT) as client:
                    response = await client.post(
                        "https://api.openai.com/v1/embeddings",
                        headers={
                            "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
                            "Content-Type": "application/json",
                        },
                        json={
                            "input": text[:8000],  # Truncate to token limit safely
                            "model": settings.OPENAI_EMBEDDING_MODEL,
                        },
                    )
                    if response.status_code == 200:
                        data = response.json()
                        return data["data"][0]["embedding"]
                    else:
                        logger.warning(
                            f"OpenAI Embedding API returned status {response.status_code}. "
                            "Falling back to local embedding vectorizer."
                        )
            except Exception as e:
                logger.warning(f"Error calling OpenAI Embedding API: {e}. Falling back to local embedding.")

        # Default fallback
        return cls.generate_local_embedding(text)
