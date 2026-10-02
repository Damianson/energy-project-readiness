"""Gemini AI Risk Analysis Provider using the official Google GenAI SDK."""

import os
import json
import logging
from typing import Dict, Any
from .base import BaseAIProvider
from .mock_provider import MockAIProvider

logger = logging.getLogger(__name__)

# Primary model recommended by official Google GenAI SDK guidelines
DEFAULT_GEMINI_MODEL = os.environ.get("GEMINI_MODEL", "gemini-3.8-flash")


class GeminiProvider(BaseAIProvider):
    """Google Gemini provider leveraging the official google-genai SDK
    to generate structured risk analysis from project data.
    """

    def __init__(self, api_key: str = None, model: str = None):
        self.api_key = api_key or os.environ.get("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY environment variable is required for GeminiProvider.")
        
        self.model = model or DEFAULT_GEMINI_MODEL
        self._fallback_mock = MockAIProvider()

    def analyze_project(self, project_context: Dict[str, Any]) -> Dict[str, Any]:
        """Send project context to Gemini and return validated structured risk analysis."""
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=self.api_key)

        prompt = (
            "You are a Senior Renewable Energy Development and Risk Advisory expert.\n"
            "Analyze the following energy project context and identify active blockers, "
            "major risks, and recommended next actions.\n\n"
            "STRICT RULES:\n"
            "1. Base your analysis STRICTLY on the real project data and tasks provided below.\n"
            "2. Identify all tasks where status is 'Blocked' or is_blocker is true as current blockers.\n"
            "3. Do not hallucinate or invent stages or company names not present in the context.\n"
            "4. Return ONLY a valid JSON object matching the requested schema.\n"
            "5. If 'project_notes' are present, incorporate their key engineering findings, site constraints, and regulatory memos directly into the summary, major_risks, or recommended_next_actions.\n\n"
            f"PROJECT CONTEXT DATA:\n{json.dumps(project_context, indent=2)}\n\n"
            "REQUIRED JSON SCHEMA:\n"
            "{\n"
            '  "summary": "High-level executive overview of the project readiness situation and primary bottleneck",\n'
            '  "current_blockers": [\n'
            '    {\n'
            '      "stage": "Affected stage name",\n'
            '      "issue": "Specific blocked task title and description",\n'
            '      "impact": "Concrete impact on schedule, interconnection, or commercial operations",\n'
            '      "owner": "Owner name or Unassigned"\n'
            "    }\n"
            "  ],\n"
            '  "major_risks": [\n'
            '    {\n'
            '      "stage": "Affected stage name",\n'
            '      "risk": "Risk description",\n'
            '      "priority": "High | Medium | Low",\n'
            '      "mitigation": "Recommended mitigation strategy"\n'
            "    }\n"
            "  ],\n"
            '  "recommended_next_actions": [\n'
            '    {\n'
            '      "stage": "Affected stage name",\n'
            '      "action": "Immediate concrete action to resolve blocker or progress milestone",\n'
            '      "priority": "Immediate | High | Normal"\n'
            "    }\n"
            "  ]\n"
            "}\n"
        )

        try:
            response = client.models.generate_content(
                model=self.model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.2,
                ),
            )

            raw_text = response.text or ""
            parsed = self._parse_json_response(raw_text)
            if self._validate_schema(parsed):
                return parsed
            
            logger.warning("Gemini response missing required keys, applying fallback.")
            return self._fallback_mock.analyze_project(project_context)

        except Exception as e:
            # Mask API key if ever embedded in exception strings
            safe_err = str(e)
            if self.api_key in safe_err:
                safe_err = safe_err.replace(self.api_key, "[REDACTED_API_KEY]")
            logger.error(f"Gemini API call encountered error: {safe_err}")
            # Gracefully fall back to deterministic mock to prevent application crash
            return self._fallback_mock.analyze_project(project_context)

    def _parse_json_response(self, text: str) -> Dict[str, Any]:
        """Strip code fences and parse JSON safely."""
        cleaned = text.strip()
        if cleaned.startswith("```"):
            lines = cleaned.splitlines()
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].startswith("```"):
                lines = lines[:-1]
            cleaned = "\n".join(lines).strip()
        
        return json.loads(cleaned)

    def _validate_schema(self, data: Any) -> bool:
        """Verify the dictionary conforms to the required output structure."""
        if not isinstance(data, dict):
            return False
        required_keys = {"summary", "current_blockers", "major_risks", "recommended_next_actions"}
        if not required_keys.issubset(data.keys()):
            return False
        if not isinstance(data["current_blockers"], list):
            return False
        if not isinstance(data["major_risks"], list):
            return False
        if not isinstance(data["recommended_next_actions"], list):
            return False
        return True
