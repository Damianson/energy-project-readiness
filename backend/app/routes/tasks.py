from datetime import date
from flask import Blueprint, request, jsonify
from ..models import db, Task, ALLOWED_TASK_STATUSES

tasks_bp = Blueprint("tasks", __name__, url_prefix="/api/tasks")


@tasks_bp.route("/<int:task_id>", methods=["PATCH"])
def update_task(task_id: int):
    """PATCH /api/tasks/<task_id>: Update task status, owner, due_date, blocker flag, etc."""
    task = db.session.get(Task, task_id)
    if not task:
        return jsonify({"error": f"Task with id {task_id} not found"}), 404

    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be valid JSON"}), 400

    # Validate and update title if provided
    if "title" in data:
        new_title = str(data["title"]).strip()
        if not new_title:
            return jsonify({"error": "Field 'title' cannot be empty"}), 400
        task.title = new_title

    # Update description if provided
    if "description" in data:
        task.description = data["description"]

    # Validate and update status if provided
    if "status" in data:
        new_status = data["status"]
        if new_status not in ALLOWED_TASK_STATUSES:
            return jsonify({
                "error": f"Invalid status '{new_status}'. Allowed statuses: {list(ALLOWED_TASK_STATUSES)}"
            }), 400
        task.status = new_status

        # If status moved to Blocked and is_blocker was not explicitly passed, set is_blocker=True
        if new_status == "Blocked" and "is_blocker" not in data:
            task.is_blocker = True
        # If status moved to Complete and is_blocker was not explicitly passed, clear blocker
        elif new_status == "Complete" and "is_blocker" not in data:
            task.is_blocker = False

    # Update is_blocker if explicitly provided
    if "is_blocker" in data:
        task.is_blocker = bool(data["is_blocker"])

    # Update owner if provided
    if "owner" in data:
        task.owner = data["owner"]

    # Update notes if provided
    if "notes" in data:
        task.notes = data["notes"]

    # Validate and update due_date if provided
    if "due_date" in data:
        raw_due_date = data["due_date"]
        if raw_due_date is None or raw_due_date == "":
            task.due_date = None
        else:
            try:
                task.due_date = date.fromisoformat(str(raw_due_date).strip())
            except ValueError:
                return jsonify({"error": "Field 'due_date' must be in YYYY-MM-DD format"}), 400

    db.session.commit()

    return jsonify(task.to_dict()), 200


@tasks_bp.route("/<int:task_id>", methods=["DELETE"])
def delete_task(task_id: int):
    """DELETE /api/tasks/<task_id>: Remove a single task."""
    task = db.session.get(Task, task_id)
    if not task:
        return jsonify({"error": f"Task with id {task_id} not found"}), 404

    db.session.delete(task)
    db.session.commit()

    return jsonify({"message": f"Task {task_id} deleted successfully", "id": task_id}), 200
