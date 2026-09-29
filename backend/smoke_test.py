"""Temporary smoke test script for Step 1 backend foundation.

Verifies:
1. Flask application context.
2. Creation of 'Test Solar Project' with specified fields.
3. Creation of all six canonical stages.
4. Creation of tasks in Site stage (2 Complete, 1 In progress, 1 Blocked).
5. Readiness service calculations (Site readiness, Overall readiness, Project blockers).
6. Clear reporting.
7. Teardown of test data.
"""

from app import create_app
from app.models import db, Project, Stage, Task
from app.services.readiness_service import (
    calculate_stage_readiness,
    calculate_project_readiness,
    get_project_blockers,
)


def run_smoke_test():
    app = create_app()

    with app.app_context():
        print("=" * 60)
        print("SMOKE TEST: Step 1 Backend Foundation")
        print("=" * 60)

        # 1 & 2: Create temporary Project
        project = Project(
            name="Test Solar Project",
            location="Test Location",
            project_type="Solar + BESS",
            estimated_capacity_mw=10.0,
            battery_capacity_mwh=20.0,
            description="Temporary smoke test verification project",
        )
        db.session.add(project)
        db.session.flush()  # Populates project.id
        print(f" [1/5] Created Project: '{project.name}' (ID: {project.id})")
        print(f"       - Location: {project.location}")
        print(f"       - Type: {project.project_type}")
        print(f"       - Capacity: {project.estimated_capacity_mw} MW (Solar) / {project.battery_capacity_mwh} MWh (BESS)")

        # 3: Create the six stages
        stage_names = [
            "Site",
            "Grid",
            "Permits",
            "Commercial",
            "Procurement",
            "Construction",
        ]
        stages = []
        for idx, name in enumerate(stage_names, start=1):
            stage = Stage(
                name=name,
                order_index=idx,
                project=project,
            )
            stages.append(stage)
            db.session.add(stage)

        db.session.flush()
        print(f"\n [2/5] Created all {len(stages)} Stages:")
        for s in stages:
            print(f"       [{s.order_index}] {s.name}")

        # 4: Create tasks in Site stage
        site_stage = next(s for s in stages if s.name == "Site")
        site_tasks = [
            Task(
                title="Site Lease Agreement",
                status="Complete",
                is_blocker=False,
                stage=site_stage,
            ),
            Task(
                title="ALTA Boundary Survey",
                status="Complete",
                is_blocker=False,
                stage=site_stage,
            ),
            Task(
                title="Phase I ESA Study",
                status="In progress",
                is_blocker=False,
                stage=site_stage,
            ),
            Task(
                title="Geotech Soil Resistivity",
                status="Blocked",
                is_blocker=True,
                notes="Awaiting drilling contractor permit approval",
                stage=site_stage,
            ),
        ]
        for t in site_tasks:
            db.session.add(t)

        db.session.commit()
        print(f"\n [3/5] Added {len(site_tasks)} Tasks to '{site_stage.name}' stage:")
        for t in site_tasks:
            print(f"       - {t.title:<26} | Status: {t.status:<11} | Blocker Flag: {t.is_blocker}")

        # 5: Use existing readiness service to calculate
        site_readiness = calculate_stage_readiness(site_stage)
        overall_readiness = calculate_project_readiness(project)
        blockers = get_project_blockers(project)

        # 6: Print results clearly
        print("\n" + "-" * 60)
        print(" [4/5] READINESS SERVICE CALCULATION RESULTS")
        print("-" * 60)
        print(f"   * Site Stage Readiness : {site_readiness}% (2 completed / 4 total = 50.0%)")
        print(f"   * Overall Readiness    : {overall_readiness}% (50.0% Site / 6 stages = 8.3%)")
        print(f"   * Open Blockers Count  : {len(blockers)}")
        for b in blockers:
            print(f"     -> [{b.stage.name}] '{b.title}'")
            print(f"        Status: {b.status} | Blocker Flag: {b.is_blocker}")
            print(f"        Notes: {b.notes}")

        # Assertions to strictly verify business logic
        assert site_readiness == 50.0, f"Expected 50.0%, got {site_readiness}%"
        assert overall_readiness == 8.3, f"Expected 8.3%, got {overall_readiness}%"
        assert len(blockers) == 1, f"Expected 1 blocker, got {len(blockers)}"
        print("   * All assertions passed (50.0% stage, 8.3% overall, 1 blocker).")

        # 7: Clean up test data
        project_id = project.id
        db.session.delete(project)
        db.session.commit()

        # Verify deletion cascaded
        assert db.session.get(Project, project_id) is None
        assert db.session.query(Stage).filter_by(project_id=project_id).count() == 0
        print(f"\n [5/5] Teardown: Test Project ID {project_id} & cascaded records deleted cleanly.")
        print("=" * 60)
        print("SMOKE TEST COMPLETE: SUCCESS")
        print("=" * 60)


if __name__ == "__main__":
    run_smoke_test()
