"""Base abstract interface for AI Risk Analysis providers."""

from abc import ABC, abstractmethod
from typing import Dict, Any


class BaseAIProvider(ABC):
    """Abstract interface defining the project risk analysis contract.
    
    Any AI provider implementation (Gemini, Claude, OpenAI, Mock)
    must implement this interface.
    """

    @abstractmethod
    def analyze_project(self, project_context: Dict[str, Any]) -> Dict[str, Any]:
        """Examine structured project data and return a standardized risk analysis.

        Args:
            project_context: Dictionary containing:
                - project: metadata (name, type, capacity, location, readiness)
                - stages: list of stages and their progress
                - blockers: list of currently blocked tasks
                - in_progress_tasks: list of active tasks
                - all_tasks_summary: overall task status breakdown
                - notes: optional documents or notes

        Returns:
            Dict[str, Any] matching the required schema:
            {
                "summary": str,
                "current_blockers": [
                    {"stage": str, "issue": str, "impact": str, "owner": str}
                ],
                "major_risks": [
                    {"stage": str, "risk": str, "priority": str, "mitigation": str}
                ],
                "recommended_next_actions": [
                    {"stage": str, "action": str, "priority": str}
                ]
            }
        """
        pass
