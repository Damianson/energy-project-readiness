from datetime import date
from flask import Blueprint, request, jsonify
from ..models import db, Stage, Task, ALLOWED_TASK_STATUSES

stages_bp = Blueprint("stages", __name__, url_prefix="/api/stages")


@stages_bp.route("/<int:stage_id>/tasks", methods=["POST"])
def create_stage_task(stage_id: int):
    """POST /api/stages/<stage_id>/tasks: Create a new task within a stage."""
    stage = db.session.get(Stage, stage_id)
    if not stage:
        return jsonify({"error": f"Stage with id {stage_id} not found"}), 404

    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be valid JSON"}), 400

    title = data.get("title")
    if not title or not str(title).strip():
        return jsonify({"error": "Field 'title' is required"}), 400

    status = data.get("status", "Not started")
    if status not in ALLOWED_TASK_STATUSES:
        return jsonify({
            "error": f"Invalid status '{status}'. Allowed statuses: {list(ALLOWED_TASK_STATUSES)}"
        }), 400

    due_date = None
    due_date_raw = data.get("due_date")
    if due_date_raw:
        try:
            due_date = date.fromisoformat(str(due_date_raw).strip())
        except ValueError:
            return jsonify({"error": "Field 'due_date' must be in YYYY-MM-DD format"}), 400

    is_blocker = bool(data.get("is_blocker", False))
    # If task is marked as Blocked status, also align blocker flag if not set
    if status == "Blocked":
        is_blocker = True

    task = Task(
        stage_id=stage.id,
        title=str(title).strip(),
        description=data.get("description"),
        status=status,
        owner=data.get("owner"),
        due_date=due_date,
        is_blocker=is_blocker,
        notes=data.get("notes"),
    )

    db.session.add(task)
    db.session.commit()

    return jsonify(task.to_dict()), 201
