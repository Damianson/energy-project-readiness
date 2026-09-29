from flask import Blueprint, request, jsonify
from ..models import db, Project, Stage, Task
from ..services.readiness_service import (
    calculate_project_readiness,
    calculate_stage_readiness,
    get_project_blockers,
    is_stage_blocked,
)
from ..services.default_tasks import create_default_stages_and_tasks

projects_bp = Blueprint("projects", __name__, url_prefix="/api/projects")


def _format_project_detail(project: Project) -> dict:
    """Format full project with stages, tasks, readiness, and blockers."""
    blockers = get_project_blockers(project)
    overall_readiness = calculate_project_readiness(project)

    stages_data = []
    for stage in project.stages:
        stage_readiness = calculate_stage_readiness(stage)
        stage_blocked = is_stage_blocked(stage)
        stages_data.append({
            "id": stage.id,
            "project_id": stage.project_id,
            "name": stage.name,
            "order_index": stage.order_index,
            "readiness": stage_readiness,
            "is_blocked": stage_blocked,
            "created_at": stage.created_at.isoformat() if stage.created_at else None,
            "tasks": [task.to_dict() for task in stage.tasks],
        })

    return {
        "id": project.id,
        "name": project.name,
        "location": project.location,
        "project_type": project.project_type,
        "estimated_capacity_mw": project.estimated_capacity_mw,
        "battery_capacity_mwh": project.battery_capacity_mwh,
        "description": project.description,
        "overall_readiness": overall_readiness,
        "blocker_count": len(blockers),
        "blockers": [b.to_dict() for b in blockers],
        "created_at": project.created_at.isoformat() if project.created_at else None,
        "updated_at": project.updated_at.isoformat() if project.updated_at else None,
        "stages": stages_data,
    }


@projects_bp.route("", methods=["GET"])
def list_projects():
    """GET /api/projects: List all projects with readiness % and blocker count."""
    projects = Project.query.order_by(Project.created_at.desc()).all()
    results = []
    for p in projects:
        results.append({
            "id": p.id,
            "name": p.name,
            "project_type": p.project_type,
            "location": p.location,
            "estimated_capacity_mw": p.estimated_capacity_mw,
            "battery_capacity_mwh": p.battery_capacity_mwh,
            "overall_readiness": calculate_project_readiness(p),
            "blocker_count": len(get_project_blockers(p)),
            "created_at": p.created_at.isoformat() if p.created_at else None,
        })
    return jsonify(results), 200


@projects_bp.route("", methods=["POST"])
def create_project():
    """POST /api/projects: Create project, default 6 stages, and starter tasks."""
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be valid JSON"}), 400

    name = data.get("name")
    project_type = data.get("project_type")
    capacity_raw = data.get("estimated_capacity_mw")

    if not name or not str(name).strip():
        return jsonify({"error": "Field 'name' is required"}), 400
    if not project_type or not str(project_type).strip():
        return jsonify({"error": "Field 'project_type' is required"}), 400
    if capacity_raw is None:
        return jsonify({"error": "Field 'estimated_capacity_mw' is required"}), 400

    try:
        capacity = float(capacity_raw)
        if capacity <= 0:
            return jsonify({"error": "Field 'estimated_capacity_mw' must be positive"}), 400
    except (ValueError, TypeError):
        return jsonify({"error": "Field 'estimated_capacity_mw' must be a valid number"}), 400

    battery_capacity = data.get("battery_capacity_mwh")
    if battery_capacity is not None:
        try:
            battery_capacity = float(battery_capacity)
            if battery_capacity < 0:
                return jsonify({"error": "Field 'battery_capacity_mwh' cannot be negative"}), 400
        except (ValueError, TypeError):
            return jsonify({"error": "Field 'battery_capacity_mwh' must be a valid number"}), 400

    # Instantiate project
    project = Project(
        name=str(name).strip(),
        location=data.get("location"),
        project_type=str(project_type).strip(),
        estimated_capacity_mw=capacity,
        battery_capacity_mwh=battery_capacity,
        description=data.get("description"),
    )

    # Automatically create the 6 stages and populate starter tasks
    create_default_stages_and_tasks(project)

    db.session.add(project)
    db.session.commit()

    return jsonify(_format_project_detail(project)), 201


@projects_bp.route("/<int:project_id>", methods=["GET"])
def get_project(project_id: int):
    """GET /api/projects/<id>: Return complete project with stages, tasks, readiness, and blockers."""
    project = db.session.get(Project, project_id)
    if not project:
        return jsonify({"error": f"Project with id {project_id} not found"}), 404

    return jsonify(_format_project_detail(project)), 200


@projects_bp.route("/<int:project_id>", methods=["DELETE"])
def delete_project(project_id: int):
    """DELETE /api/projects/<id>: Delete project and all cascaded stages/tasks."""
    project = db.session.get(Project, project_id)
    if not project:
        return jsonify({"error": f"Project with id {project_id} not found"}), 404

    db.session.delete(project)
    db.session.commit()

    return jsonify({"message": f"Project {project_id} deleted successfully", "id": project_id}), 200


@projects_bp.route("/<int:project_id>/stages", methods=["GET"])
def get_project_stages(project_id: int):
    """GET /api/projects/<project_id>/stages: Return all 6 stages with readiness % and tasks."""
    project = db.session.get(Project, project_id)
    if not project:
        return jsonify({"error": f"Project with id {project_id} not found"}), 404

    stages_data = []
    for stage in project.stages:
        stages_data.append({
            "id": stage.id,
            "project_id": stage.project_id,
            "name": stage.name,
            "order_index": stage.order_index,
            "readiness": calculate_stage_readiness(stage),
            "is_blocked": is_stage_blocked(stage),
            "created_at": stage.created_at.isoformat() if stage.created_at else None,
            "tasks": [task.to_dict() for task in stage.tasks],
        })

    return jsonify(stages_data), 200
