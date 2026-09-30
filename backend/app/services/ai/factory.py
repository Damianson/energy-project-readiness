"""Factory for instantiating the appropriate AI Risk Analysis provider."""

import os
import logging
from typing import Optional
from .base import BaseAIProvider
from .mock_provider import MockAIProvider
from .gemini_provider import GeminiProvider

logger = logging.getLogger(__name__)


def get_ai_provider(force_provider: Optional[str] = None) -> BaseAIProvider:
    """Return an AI provider instance based on environment configuration.
    
    Selection Strategy:
    1. If force_provider == 'mock' or AI_PROVIDER == 'mock' -> MockAIProvider
    2. If GEMINI_API_KEY is defined and non-empty -> GeminiProvider
    3. Fallback -> MockAIProvider (ensures 100% demo reliability without external keys)
    """
    selected_type = force_provider or os.environ.get("AI_PROVIDER", "").strip().lower()

    if selected_type == "mock":
        logger.info("AI Provider: Explicitly selected MockAIProvider.")
        return MockAIProvider()

    gemini_key = os.environ.get("GEMINI_API_KEY", "").strip()
    # Check if a non-placeholder API key exists
    if gemini_key and not gemini_key.startswith("your-") and len(gemini_key) > 10:
        try:
            logger.info("AI Provider: Initializing GeminiProvider with GEMINI_API_KEY.")
            return GeminiProvider(api_key=gemini_key)
        except Exception as e:
            logger.warning(f"Could not initialize GeminiProvider ({e}), falling back to MockAIProvider.")
            return MockAIProvider()

    logger.info("AI Provider: GEMINI_API_KEY not configured. Using MockAIProvider for offline demo.")
    return MockAIProvider()
