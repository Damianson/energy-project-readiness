from flask import Blueprint, jsonify
from seed_data import seed_database
from ..models import db, Project
from .projects import _format_project_detail

demo_bp = Blueprint("demo", __name__, url_prefix="/api/demo")


@demo_bp.route("/seed", methods=["POST"])
def seed_demo_project():
    """POST /api/demo/seed: Populate or retrieve the demo project and return its full details."""
    project_id = seed_database()
    project = db.session.get(Project, project_id)
    if not project:
        return jsonify({"error": "Failed to seed demo project"}), 500

    return jsonify({
        "message": "Demo project seeded successfully",
        "project": _format_project_detail(project),
    }), 200
