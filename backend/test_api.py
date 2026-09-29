"""Automated REST API verification script for Step 2.

Tests the full lifecycle using Flask's test_client:
1. GET /api/projects (initially empty or listed)
2. POST /api/projects (create project, default 6 stages, default tasks)
3. GET /api/projects/<id> (verify full project payload, readiness, blockers)
4. GET /api/projects/<id>/stages (verify all 6 stages with readiness % and tasks)
5. POST /api/stages/<stage_id>/tasks (create custom task)
6. PATCH /api/tasks/<task_id> from 'In progress' to 'Blocked'
7. Verify the blocker appears in project GET /api/projects/<id>
8. PATCH /api/tasks/<task_id> to 'Complete'
9. Verify readiness recalculates deterministically
10. DELETE /api/tasks/<task_id>
11. DELETE /api/projects/<id> (and verify 404 afterward)
"""

import json
from app import create_app
from app.models import db, Project


def run_api_tests():
    print("=" * 65)
    print("STEP 2 REST API TEST: Energy Project Readiness")
    print("=" * 65)

    app = create_app()
    client = app.test_client()

    with app.app_context():
        # Ensure fresh state for test
        db.drop_all()
        db.create_all()

    # 1. GET /api/projects (empty list)
    resp = client.get("/api/projects")
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    projects = resp.get_json()
    assert isinstance(projects, list) and len(projects) == 0
    print(" [1/9] GET /api/projects -> 200 OK (empty list initially)")

    # 2. POST /api/projects
    new_project_payload = {
        "name": "Alta Vista Solar & Storage",
        "location": "Pueblo County, CO",
        "project_type": "Solar + Storage",
        "estimated_capacity_mw": 80.0,
        "battery_capacity_mwh": 30.0,
        "description": "80MW DC solar PV paired with 30MW/120MWh BESS facility.",
    }
    resp = client.post("/api/projects", json=new_project_payload)
    assert resp.status_code == 201, f"Expected 201, got {resp.status_code}: {resp.data}"
    created_project = resp.get_json()
    project_id = created_project["id"]
    assert created_project["name"] == new_project_payload["name"]
    assert len(created_project["stages"]) == 6
    assert created_project["blocker_count"] >= 2
    initial_readiness = created_project["overall_readiness"]
    print(f" [2/9] POST /api/projects -> 201 Created (ID: {project_id})")
    print(f"       - Automatically created 6 stages and starter tasks.")
    print(f"       - Initial readiness: {initial_readiness}%")
    print(f"       - Initial blockers: {created_project['blocker_count']}")

    # 3. GET /api/projects/<id>
    resp = client.get(f"/api/projects/{project_id}")
    assert resp.status_code == 200
    proj_detail = resp.get_json()
    assert proj_detail["id"] == project_id
    assert "stages" in proj_detail and len(proj_detail["stages"]) == 6
    assert "blockers" in proj_detail
    assert "overall_readiness" in proj_detail
    print(f" [3/9] GET /api/projects/{project_id} -> 200 OK (retrieved complete project)")

    # 4. GET /api/projects/<id>/stages
    resp = client.get(f"/api/projects/{project_id}/stages")
    assert resp.status_code == 200
    stages = resp.get_json()
    assert len(stages) == 6
    expected_stage_names = ["Site", "Grid", "Permits", "Commercial", "Procurement", "Construction"]
    assert [s["name"] for s in stages] == expected_stage_names
    for s in stages:
        assert "readiness" in s
        assert "is_blocked" in s
        assert "tasks" in s and len(s["tasks"]) > 0
    print(f" [4/9] GET /api/projects/{project_id}/stages -> 200 OK (all 6 stages verified)")

    # 5. POST /api/stages/<stage_id>/tasks (custom task)
    site_stage = next(s for s in stages if s["name"] == "Site")
    custom_task_payload = {
        "title": "Local Water District Crossing Agreement",
        "description": "Secure encroachment permit for water canal access road.",
        "status": "In progress",
        "owner": "Civil Engineer",
        "is_blocker": False,
        "notes": "District board reviewing application.",
    }
    resp = client.post(f"/api/stages/{site_stage['id']}/tasks", json=custom_task_payload)
    assert resp.status_code == 201
    custom_task = resp.get_json()
    task_id = custom_task["id"]
    assert custom_task["title"] == custom_task_payload["title"]
    assert custom_task["status"] == "In progress"
    print(f" [5/9] POST /api/stages/{site_stage['id']}/tasks -> 201 Created task ID {task_id}")

    # 6. PATCH /api/tasks/<task_id> from 'In progress' to 'Blocked'
    patch_payload = {
        "status": "Blocked",
        "notes": "Water District requires unexpected $500k indemnity bond.",
    }
    resp = client.patch(f"/api/tasks/{task_id}", json=patch_payload)
    assert resp.status_code == 200
    patched_task = resp.get_json()
    assert patched_task["status"] == "Blocked"
    assert patched_task["is_blocker"] is True
    print(f" [6/9] PATCH /api/tasks/{task_id} -> 200 OK (status='Blocked', is_blocker=True)")

    # 7. Verify the blocker appears in the project response
    resp = client.get(f"/api/projects/{project_id}")
    assert resp.status_code == 200
    updated_proj = resp.get_json()
    blocker_titles = [b["title"] for b in updated_proj["blockers"]]
    assert custom_task["title"] in blocker_titles, f"Task {custom_task['title']} not in blockers: {blocker_titles}"
    # Verify Site stage is now marked is_blocked=True
    updated_site = next(s for s in updated_proj["stages"] if s["name"] == "Site")
    assert updated_site["is_blocked"] is True
    print(f" [7/9] Verified: Blocker '{custom_task['title']}' actively surfaced in project response.")
    print(f"       Site stage flagged is_blocked: {updated_site['is_blocked']}")

    # 8. PATCH task to 'Complete' & verify readiness changes
    old_site_readiness = updated_site["readiness"]
    old_overall_readiness = updated_proj["overall_readiness"]

    resp = client.patch(f"/api/tasks/{task_id}", json={"status": "Complete"})
    assert resp.status_code == 200
    completed_task = resp.get_json()
    assert completed_task["status"] == "Complete"

    resp = client.get(f"/api/projects/{project_id}")
    proj_after_complete = resp.get_json()
    new_site_stage = next(s for s in proj_after_complete["stages"] if s["name"] == "Site")
    new_site_readiness = new_site_stage["readiness"]
    new_overall_readiness = proj_after_complete["overall_readiness"]

    assert new_site_readiness > old_site_readiness, "Site readiness should increase"
    assert new_overall_readiness > old_overall_readiness, "Overall readiness should increase"
    print(f" [8/9] PATCH /api/tasks/{task_id} to 'Complete' -> readiness recalculated:")
    print(f"       - Site stage readiness: {old_site_readiness}% -> {new_site_readiness}%")
    print(f"       - Overall readiness: {old_overall_readiness}% -> {new_overall_readiness}%")

    # Clean up custom task
    resp = client.delete(f"/api/tasks/{task_id}")
    assert resp.status_code == 200

    # 9. DELETE /api/projects/<id>
    resp = client.delete(f"/api/projects/{project_id}")
    assert resp.status_code == 200
    print(f" [9/9] DELETE /api/projects/{project_id} -> 200 OK")

    # Verify project is gone (404)
    resp = client.get(f"/api/projects/{project_id}")
    assert resp.status_code == 404
    print("       Verified: Subsequent GET returns 404 Not Found.")

    print("\n" + "=" * 65)
    print("ALL REST API INTEGRATION TESTS PASSED SUCCESSFULLY!")
    print("=" * 65)


if __name__ == "__main__":
    run_api_tests()
