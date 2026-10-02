"""Route blueprints for the Energy Project Readiness REST API."""

from .projects import projects_bp
from .stages import stages_bp
from .tasks import tasks_bp
from .analysis import analysis_bp
from .demo import demo_bp

__all__ = ["projects_bp", "stages_bp", "tasks_bp", "analysis_bp", "demo_bp"]

