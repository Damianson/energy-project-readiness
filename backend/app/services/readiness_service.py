"""Deterministic readiness calculation service.

Calculates:
- Stage readiness percentage (completed tasks / total tasks * 100)
- Overall project readiness (average across the six stages)
- Project blockers (tasks where is_blocker is True OR status is 'Blocked')

Rule-based and transparent: NO AI is used for numerical readiness scoring.
"""

from typing import List
from ..models import Project, Stage, Task


def calculate_stage_readiness(stage: Stage) -> float:
    """Calculate the readiness score of a single stage as a percentage.
    
    Rule:
        Stage readiness = (completed tasks / total tasks) * 100
        If total tasks == 0, returns 0.0.
    
    Args:
        stage: Stage instance containing tasks.
        
    Returns:
        float: Percentage from 0.0 to 100.0, rounded to 1 decimal place.
    """
    if not stage or not stage.tasks:
        return 0.0

    total_tasks = len(stage.tasks)
    completed_tasks = sum(
        1 for task in stage.tasks if task.status and task.status.strip().lower() == "complete"
    )

    score = (completed_tasks / total_tasks) * 100.0
    return round(score, 1)


def calculate_project_readiness(project: Project) -> float:
    """Calculate overall project readiness as the average across the six stages.
    
    Rule:
        Overall readiness = average readiness across the six stages.
        If no stages exist, returns 0.0.
        
    Args:
        project: Project instance containing stages.
        
    Returns:
        float: Average percentage from 0.0 to 100.0, rounded to 1 decimal place.
    """
    if not project or not project.stages:
        return 0.0

    stage_scores = [calculate_stage_readiness(stage) for stage in project.stages]
    # Average across the stages (standard 6 stages)
    avg_score = sum(stage_scores) / len(stage_scores)
    return round(avg_score, 1)


def get_project_blockers(project: Project) -> List[Task]:
    """Retrieve all tasks acting as blockers across all project stages.
    
    Rule:
        A task counts as a blocker when:
        - is_blocker is True, OR
        - status is 'Blocked'
        
    Args:
        project: Project instance containing stages and tasks.
        
    Returns:
        List[Task]: All blocking Task instances found in the project.
    """
    if not project or not project.stages:
        return []

    blockers = []
    for stage in project.stages:
        for task in stage.tasks:
            if task.is_blocker or (task.status and task.status.strip().lower() == "blocked"):
                blockers.append(task)

    return blockers


def is_stage_blocked(stage: Stage) -> bool:
    """Check if a specific stage has any active blockers."""
    if not stage or not stage.tasks:
        return False
    return any(
        task.is_blocker or (task.status and task.status.strip().lower() == "blocked")
        for task in stage.tasks
    )


def get_project_readiness_summary(project: Project) -> dict:
    """Generate a complete readiness and blocker summary for a project.
    
    Returns structured metrics ready for API responses and dashboard rendering.
    """
    if not project:
        return {}

    stage_summaries = []
    for stage in project.stages:
        stage_score = calculate_stage_readiness(stage)
        blocked = is_stage_blocked(stage)
        total_tasks = len(stage.tasks)
        completed_tasks = sum(
            1 for t in stage.tasks if t.status and t.status.strip().lower() == "complete"
        )
        stage_summaries.append({
            "stage_id": stage.id,
            "name": stage.name,
            "order_index": stage.order_index,
            "readiness_pct": stage_score,
            "is_blocked": blocked,
            "completed_tasks": completed_tasks,
            "total_tasks": total_tasks,
        })

    blockers = get_project_blockers(project)
    overall_readiness = calculate_project_readiness(project)

    return {
        "project_id": project.id,
        "name": project.name,
        "overall_readiness_pct": overall_readiness,
        "blocker_count": len(blockers),
        "blockers": [task.to_dict() for task in blockers],
        "stages": stage_summaries,
    }
