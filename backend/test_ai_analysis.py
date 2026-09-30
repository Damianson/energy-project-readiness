"""Automated test suite for Step 3: AI Risk Analysis Service.

Verifies:
1. Factory selection (Mock when no key or forced; Gemini when key is present).
2. POST /api/projects/<id>/analyze-risks (returns structured JSON matching schema).
3. Context fidelity: verifies that actual project blockers (SIS and MPT) are identified.
4. Persistence: verifies record is stored in ai_analyses table.
5. GET /api/projects/<id>/analysis/latest (retrieves the cached latest analysis).
6. 404 behavior for invalid project IDs.
7. Gemini provider validation (if GEMINI_API_KEY is provided in environment).
"""

import os
import json
from app import create_app
from app.models import db, Project, AIAnalysis
from app.services.ai import get_ai_provider, MockAIProvider, GeminiProvider
from seed_data import seed_database


def run_ai_analysis_tests():
    print("=" * 65)
    print("STEP 3 AI RISK ANALYSIS TEST: Energy Project Readiness")
    print("=" * 65)

    app = create_app()
    client = app.test_client()

    with app.app_context():
        # Ensure database has seeded project
        project_id = seed_database()

    # 1. Test Factory Selection
    print("\n [1/5] Testing AI Provider Factory:")
    mock_provider = get_ai_provider(force_provider="mock")
    assert isinstance(mock_provider, MockAIProvider), "Expected MockAIProvider"
    print("       - force_provider='mock' -> Instantiated MockAIProvider")

    # Verify default behavior when no key is set
    original_key = os.environ.get("GEMINI_API_KEY")
    try:
        if "GEMINI_API_KEY" in os.environ:
            del os.environ["GEMINI_API_KEY"]
        default_provider = get_ai_provider()
        assert isinstance(default_provider, MockAIProvider)
        print("       - GEMINI_API_KEY omitted -> Auto-fallback to MockAIProvider")
    finally:
        if original_key:
            os.environ["GEMINI_API_KEY"] = original_key

    # 2. Test POST /api/projects/<id>/analyze-risks (Mock mode)
    print(f"\n [2/5] Testing POST /api/projects/{project_id}/analyze-risks (Mock mode):")
    resp = client.post(f"/api/projects/{project_id}/analyze-risks")
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}: {resp.data}"
    payload = resp.get_json()

    assert "analysis_id" in payload
    assert "provider" in payload and payload["provider"] == "MockAIProvider"
    assert "analysis" in payload
    analysis = payload["analysis"]

    # Validate Schema
    assert "summary" in analysis and isinstance(analysis["summary"], str) and len(analysis["summary"]) > 10
    assert "current_blockers" in analysis and isinstance(analysis["current_blockers"], list)
    assert "major_risks" in analysis and isinstance(analysis["major_risks"], list)
    assert "recommended_next_actions" in analysis and isinstance(analysis["recommended_next_actions"], list)
    print("       - Returned 200 OK with valid top-level schema.")

    # 3. Test Context Fidelity
    print("\n [3/5] Verifying Context Fidelity (actual project blockers identified):")
    blocker_issues = [b["issue"] for b in analysis["current_blockers"]]
    print(f"       Identified Blockers ({len(analysis['current_blockers'])}):")
    for b in analysis["current_blockers"]:
        print(f"       * [{b['stage']}] {b['issue']}")
        print(f"         Impact: {b['impact']}")
        print(f"         Owner:  {b['owner']}")
        assert "stage" in b and "issue" in b and "impact" in b and "owner" in b

    # Assert real project blockers are captured
    assert any("System Impact Study" in issue for issue in blocker_issues), "Expected SIS blocker to be identified"
    assert any("Transformer" in issue for issue in blocker_issues), "Expected Transformer blocker to be identified"
    print("       - Confirmed: AI identified actual blocked tasks from project context!")

    # Validate Major Risks and Next Actions schema
    print(f"\n       Identified Major Risks ({len(analysis['major_risks'])}):")
    for r in analysis["major_risks"]:
        print(f"       * [{r['stage']}] {r['risk']} (Priority: {r['priority']})")
        assert "stage" in r and "risk" in r and "priority" in r and "mitigation" in r

    print(f"\n       Recommended Next Actions ({len(analysis['recommended_next_actions'])}):")
    for a in analysis["recommended_next_actions"]:
        print(f"       * [{a['stage']}] {a['action']} (Priority: {a['priority']})")
        assert "stage" in a and "action" in a and "priority" in a

    # 4. Test GET /api/projects/<id>/analysis/latest
    print(f"\n [4/5] Testing GET /api/projects/{project_id}/analysis/latest:")
    resp_latest = client.get(f"/api/projects/{project_id}/analysis/latest")
    assert resp_latest.status_code == 200
    latest_data = resp_latest.get_json()
    assert latest_data["project_id"] == project_id
    assert "analysis" in latest_data
    assert latest_data["analysis"]["summary"] == analysis["summary"]
    print("       - Successfully retrieved cached latest analysis record from SQLite.")

    # Test 404 for non-existent project
    resp_404 = client.get("/api/projects/99999/analysis/latest")
    assert resp_404.status_code == 404
    print("       - 404 properly returned for non-existent project.")

    # 5. Gemini Provider Verification (if key available)
    print("\n [5/5] Testing Gemini Provider:")
    gemini_key = os.environ.get("GEMINI_API_KEY")
    if gemini_key and len(gemini_key) > 10 and not gemini_key.startswith("your-"):
        print("       GEMINI_API_KEY detected in environment. Running live Gemini test...")
        provider = GeminiProvider(api_key=gemini_key)
        with app.app_context():
            from app.routes.analysis import _build_project_context
            proj = db.session.get(Project, project_id)
            ctx = _build_project_context(proj)
            gemini_result = provider.analyze_project(ctx)
            assert "summary" in gemini_result
            assert "current_blockers" in gemini_result
            assert "major_risks" in gemini_result
            assert "recommended_next_actions" in gemini_result
            print("       - Live Gemini 3.8 Flash returned valid structured JSON!")
    else:
        print("       (No active GEMINI_API_KEY detected in environment; Mock provider verified as safe fallback)")

    print("\n" + "=" * 65)
    print("ALL AI RISK ANALYSIS TESTS PASSED SUCCESSFULLY!")
    print("=" * 65)


if __name__ == "__main__":
    run_ai_analysis_tests()
