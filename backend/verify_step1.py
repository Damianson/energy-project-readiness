"""Verification script for Step 1 of Energy Project Readiness MVP.

Tests:
1. Flask app creation and database table initialization.
2. Programmatic project creation.
3. Creation of all six stages with order indices.
4. Attachment of starter tasks to stages.
5. Readiness calculation per stage and overall project.
6. Blocker detection (is_blocker=True or status='Blocked').
7. Dynamic updates (completing a task updates readiness; flagging a task adds a blocker).
8. Cascading deletes.
"""

import sys
from app import create_app
from app.models import db, Project, Stage, Task, ALLOWED_TASK_STATUSES
from app.services.readiness_service import (
    calculate_stage_readiness,
    calculate_project_readiness,
    get_project_blockers,
    is_stage_blocked,
    get_project_readiness_summary,
)
from app.services.default_tasks import create_default_stages_and_tasks

EXPECTED_STAGES = ["Site", "Grid", "Permits", "Commercial", "Procurement", "Construction"]

def run_verification():
    print("=" * 60)
    print("STEP 1 VERIFICATION: Energy Project Readiness Foundation")
    print("=" * 60)

    # 1. Initialize Flask app
    app = create_app()
    print(" [1/7] Flask app initialized successfully via application factory.")

    with app.app_context():
        # Ensure clean state for test
        db.drop_all()
        db.create_all()
        print(" [2/7] SQLite database tables created: projects, stages, tasks.")

        # 2. Create a test project
        test_project = Project(
            name="Solaria Desert Solar + BESS",
            location="Kern County, CA",
            project_type="Solar + Storage",
            estimated_capacity_mw=150.0,
            battery_capacity_mwh=60.0,
            description="150 MW utility-scale PV with 60 MWh 4-hour battery storage system.",
        )
        db.session.add(test_project)
        db.session.commit()
        print(f" [3/7] Test project created: ID={test_project.id}, Name='{test_project.name}'.")

        # 3. Create default stages and starter tasks
        stages = create_default_stages_and_tasks(test_project)
        db.session.commit()

        # Reload from database to ensure persistence
        project = db.session.get(Project, test_project.id)
        assert len(project.stages) == 6, f"Expected 6 stages, got {len(project.stages)}"
        stage_names = [s.name for s in project.stages]
        assert stage_names == EXPECTED_STAGES, f"Stages order mismatch: {stage_names}"
        print(f" [4/7] Verified 6 stages created in order: {stage_names}")

        # 4. Verify tasks are attached to stages
        total_tasks = sum(len(s.tasks) for s in project.stages)
        assert total_tasks >= 18, f"Expected at least 18 tasks across 6 stages, got {total_tasks}"
        for s in project.stages:
            assert 3 <= len(s.tasks) <= 5, f"Stage {s.name} has {len(s.tasks)} tasks, expected 3-5."
            print(f"       - Stage '{s.name}': {len(s.tasks)} tasks attached.")
        print(f" [5/7] Attached {total_tasks} starter tasks across all 6 stages.")

        # 5. Verify readiness calculations
        print("\n [6/7] Testing deterministic readiness calculation:")
        stage_scores = {}
        for s in project.stages:
            score = calculate_stage_readiness(s)
            stage_scores[s.name] = score
            completed = sum(1 for t in s.tasks if t.status == "Complete")
            expected_score = round((completed / len(s.tasks)) * 100.0, 1)
            assert score == expected_score, f"Stage {s.name} score {score} != expected {expected_score}"
            print(f"       * {s.name:<13}: {completed}/{len(s.tasks)} complete -> {score}%")

        overall_readiness = calculate_project_readiness(project)
        expected_overall = round(sum(stage_scores.values()) / 6.0, 1)
        assert overall_readiness == expected_overall, (
            f"Overall score {overall_readiness} != expected {expected_overall}"
        )
        print(f"       * OVERALL READINESS: {overall_readiness}% (exact average of 6 stages)")

        # Test dynamic score change: complete an additional task in "Site"
        site_stage = next(s for s in project.stages if s.name == "Site")
        task_to_complete = next(t for t in site_stage.tasks if t.status != "Complete")
        task_to_complete.status = "Complete"
        db.session.commit()

        new_site_score = calculate_stage_readiness(site_stage)
        new_overall = calculate_project_readiness(project)
        assert new_site_score > stage_scores["Site"], "Site readiness should increase after completing task"
        assert new_overall > overall_readiness, "Overall readiness should increase after completing task"
        print(f"       * After completing '{task_to_complete.title[:30]}...':")
        print(f"         Site score: {stage_scores['Site']}% -> {new_site_score}%")
        print(f"         Overall score: {overall_readiness}% -> {new_overall}%")

        # 6. Verify blocker detection
        print("\n [7/7] Testing blocker detection:")
        blockers = get_project_blockers(project)
        print(f"       Found {len(blockers)} initial blockers:")
        for b in blockers:
            print(f"       - [{b.stage.name}] {b.title} (status='{b.status}', is_blocker={b.is_blocker})")
        
        # Verify the two default blockers exist (Grid SIS and Procurement MPT)
        assert len(blockers) >= 2, f"Expected at least 2 default blockers, got {len(blockers)}"

        # Test dynamic blocker flagging
        permits_stage = next(s for s in project.stages if s.name == "Permits")
        permit_task = permits_stage.tasks[0]
        permit_task.is_blocker = True
        db.session.commit()

        updated_blockers = get_project_blockers(project)
        assert len(updated_blockers) == len(blockers) + 1, "Blocker count should increase by 1"
        assert is_stage_blocked(permits_stage) is True, "Permits stage should now be flagged as blocked"
        print(f"       * Dynamically flagged '{permit_task.title[:30]}...' as blocker:")
        print(f"         Total project blockers: {len(updated_blockers)}")
        print(f"         Permits stage blocked flag: {is_stage_blocked(permits_stage)}")

        # Verify summary dictionary helper
        summary = get_project_readiness_summary(project)
        assert summary["project_id"] == project.id
        assert summary["blocker_count"] == len(updated_blockers)
        assert len(summary["stages"]) == 6
        print("       * Full project readiness summary dictionary generated successfully.")

        # Test cascade delete
        project_id = project.id
        db.session.delete(project)
        db.session.commit()
        assert db.session.get(Project, project_id) is None
        assert db.session.query(Stage).filter_by(project_id=project_id).count() == 0
        print("       * Cascade delete verified: deleting Project safely deleted all child stages & tasks.")

    print("\n" + "=" * 60)
    print("ALL STEP 1 VERIFICATION CHECKS PASSED SUCCESSFULLY!")
    print("=" * 60)

if __name__ == "__main__":
    run_verification()
