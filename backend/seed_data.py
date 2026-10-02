"""Seed database with realistic demo project data for sales/demo MVP."""

from flask import current_app, has_app_context
from app import create_app
from app.models import db, Project
from app.services.default_tasks import create_default_stages_and_tasks
from app.services.readiness_service import calculate_project_readiness, get_project_blockers


def seed_database(app=None):
    if app is None and not has_app_context():
        app = create_app()
        ctx = app.app_context()
        ctx.push()

    # Check if project already exists
    existing = Project.query.filter_by(name="Solaria Desert Solar + BESS").first()
    if existing:
        print(f"Project 'Solaria Desert Solar + BESS' already exists with ID: {existing.id}")
        return existing.id

    demo_project = Project(
        name="Solaria Desert Solar + BESS",
        location="Kern County, CA",
        project_type="Solar + Storage",
        estimated_capacity_mw=150.0,
        battery_capacity_mwh=60.0,
        description="150MW utility-scale solar PV facility paired with a 60MWh 4-hour battery energy storage system.",
    )

    create_default_stages_and_tasks(demo_project)

    db.session.add(demo_project)
    db.session.commit()

    readiness = calculate_project_readiness(demo_project)
    blockers = get_project_blockers(demo_project)

    print("=" * 60)
    print("DATABASE SEED SUCCESSFUL!")
    print("=" * 60)
    print(f" Created Project ID : {demo_project.id}")
    print(f" Name               : {demo_project.name}")
    print(f" Location           : {demo_project.location}")
    print(f" Capacity           : {demo_project.estimated_capacity_mw} MW / {demo_project.battery_capacity_mwh} MWh")
    print(f" Overall Readiness  : {readiness}%")
    print(f" Open Blockers      : {len(blockers)}")
    for b in blockers:
        print(f"   - [{b.stage.name}] {b.title} (Status: {b.status})")
    print("=" * 60)
    return demo_project.id


if __name__ == "__main__":
    seed_database()
