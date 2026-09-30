import json
from flask import Blueprint, jsonify
from ..models import db, Project, AIAnalysis
from ..services.readiness_service import (
    calculate_project_readiness,
    calculate_stage_readiness,
    get_project_blockers,
    is_stage_blocked,
)
from ..services.ai import get_ai_provider

analysis_bp = Blueprint("analysis", __name__, url_prefix="/api/projects")


def _build_project_context(project: Project) -> dict:
    """Extract clean, structured project context for the AI risk analysis provider."""
    overall_readiness = calculate_project_readiness(project)
    raw_blockers = get_project_blockers(project)

    stages_summary = []
    in_progress_tasks = []
    all_tasks = []

    for stage in project.stages:
        stage_readiness = calculate_stage_readiness(stage)
        stage_blocked = is_stage_blocked(stage)
        stages_summary.append({
            "name": stage.name,
            "order_index": stage.order_index,
            "readiness": stage_readiness,
            "is_blocked": stage_blocked,
            "task_count": len(stage.tasks),
        })

        for task in stage.tasks:
            all_tasks.append({
                "stage": stage.name,
                "title": task.title,
                "status": task.status,
                "owner": task.owner,
                "notes": task.notes,
            })
            if task.status == "In progress":
                in_progress_tasks.append({
                    "stage": stage.name,
                    "title": task.title,
                    "owner": task.owner,
                    "notes": task.notes,
                })

    formatted_blockers = [
        {
            "id": b.id,
            "stage": b.stage.name,
            "title": b.title,
            "status": b.status,
            "is_blocker": b.is_blocker,
            "owner": b.owner,
            "notes": b.notes,
        }
        for b in raw_blockers
    ]

    return {
        "project": {
            "id": project.id,
            "name": project.name,
            "location": project.location,
            "project_type": project.project_type,
            "estimated_capacity_mw": project.estimated_capacity_mw,
            "battery_capacity_mwh": project.battery_capacity_mwh,
            "description": project.description,
            "overall_readiness": overall_readiness,
        },
        "stages": stages_summary,
        "blockers": formatted_blockers,
        "in_progress_tasks": in_progress_tasks,
        "all_tasks_summary": all_tasks,
    }


@analysis_bp.route("/<int:project_id>/analyze-risks", methods=["POST"])
def analyze_project_risks(project_id: int):
    """POST /api/projects/<id>/analyze-risks: Execute AI Risk Analysis on project context."""
    project = db.session.get(Project, project_id)
    if not project:
        return jsonify({"error": f"Project with id {project_id} not found"}), 404

    # 1. Collect structured context
    context = _build_project_context(project)

    # 2. Get AI provider (Gemini if key is present, else Mock)
    provider = get_ai_provider()

    # 3. Generate analysis
    analysis_result = provider.analyze_project(context)

    # 4. Save analysis to database
    summary_text = analysis_result.get("summary", "Project risk analysis")
    record = AIAnalysis(
        project_id=project.id,
        summary=summary_text,
        results_json=json.dumps(analysis_result),
    )
    db.session.add(record)
    db.session.commit()

    # 5. Return standardized response
    response_payload = {
        "analysis_id": record.id,
        "project_id": project.id,
        "provider": provider.__class__.__name__,
        "created_at": record.created_at.isoformat() if record.created_at else None,
        "analysis": analysis_result,
    }
    return jsonify(response_payload), 200


@analysis_bp.route("/<int:project_id>/analysis/latest", methods=["GET"])
def get_latest_analysis(project_id: int):
    """GET /api/projects/<id>/analysis/latest: Retrieve most recent analysis run."""
    project = db.session.get(Project, project_id)
    if not project:
        return jsonify({"error": f"Project with id {project_id} not found"}), 404

    latest = (
        AIAnalysis.query.filter_by(project_id=project_id)
        .order_by(AIAnalysis.created_at.desc())
        .first()
    )
    if not latest:
        return jsonify({
            "error": f"No risk analysis has been generated yet for project {project_id}"
        }), 404

    return jsonify(latest.to_dict()), 200
