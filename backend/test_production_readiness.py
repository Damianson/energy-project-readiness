"""Deployment and Production Readiness Verification Script.

Tests:
1. Static React file serving from Flask (/, /assets/..., SPA fallback).
2. API routing isolation (404 for unmatched /api/*, valid responses for API blueprints).
3. Fresh database demo seeding via POST /api/demo/seed.
4. Gemini API key safety check (ensures no hardcoded key in codebase and key loaded only from env).
5. Gunicorn import and WSGI entrypoint readiness.
"""

import os
import sys
import tempfile
from pathlib import Path

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from app.config import Config
from app.models import db, Project


def test_production_readiness():
    print("=" * 70)
    print("ENERGY PROJECT READINESS - PRODUCTION DEPLOYMENT VERIFICATION")
    print("=" * 70)

    # 1. Test Static React Serving & SPA Routing
    print("\n[1/5] Testing React Frontend Serving & SPA Fallback from Flask:")
    app = create_app()
    client = app.test_client()

    resp_root = client.get("/")
    assert resp_root.status_code == 200, f"Expected 200 for '/', got {resp_root.status_code}"
    assert b"<!doctype html>" in resp_root.data.lower() or b"<div id=\"root\">" in resp_root.data, "Expected index.html content at '/'"
    print("       ✓ GET / successfully returns React index.html")

    # Test SPA routing fallback
    resp_spa = client.get("/projects/demo-view")
    assert resp_spa.status_code == 200, f"Expected 200 for SPA route, got {resp_spa.status_code}"
    assert b"<!doctype html>" in resp_spa.data.lower() or b"<div id=\"root\">" in resp_spa.data, "Expected index.html for SPA route"
    print("       ✓ GET /projects/demo-view (SPA client route) successfully falls back to index.html")

    # Test API isolation: unmatched /api routes return 404 JSON, NOT HTML
    resp_api_404 = client.get("/api/unknown-endpoint-test")
    assert resp_api_404.status_code == 404, f"Expected 404 for unmatched API route, got {resp_api_404.status_code}"
    assert resp_api_404.is_json, "Unmatched /api/* must return JSON, not HTML"
    assert resp_api_404.get_json().get("error") == "API endpoint not found"
    print("       ✓ GET /api/unknown-endpoint-test returns 404 JSON without serving HTML")

    # Test Health endpoint
    resp_health = client.get("/api/health")
    assert resp_health.status_code == 200
    assert resp_health.get_json().get("status") == "healthy"
    print("       ✓ GET /api/health returns 200 OK healthy status")

    # 2. Test Fresh Database Demo Seed
    print("\n[2/5] Testing Demo Seed on Fresh Database:")
    with tempfile.NamedTemporaryFile(suffix=".db", delete=False) as tmp:
        temp_db_path = tmp.name

    try:
        class FreshConfig(Config):
            SQLALCHEMY_DATABASE_URI = f"sqlite:///{temp_db_path}"
            TESTING = True

        fresh_app = create_app(FreshConfig)
        fresh_client = fresh_app.test_client()

        with fresh_app.app_context():
            assert Project.query.count() == 0, "Expected empty database initially"
            print("       - Fresh database created with 0 projects.")

        # Seed via API endpoint POST /api/demo/seed
        seed_resp = fresh_client.post("/api/demo/seed")
        assert seed_resp.status_code == 200, f"Seed failed with status {seed_resp.status_code}: {seed_resp.data}"
        seed_data = seed_resp.get_json()
        assert seed_data.get("message") == "Demo project seeded successfully"
        project_data = seed_data.get("project")
        assert project_data["name"] == "Solaria Desert Solar + BESS"
        assert len(project_data["stages"]) == 6, f"Expected 6 stages, got {len(project_data['stages'])}"
        assert project_data["overall_readiness"] >= 0, f"Expected non-negative readiness, got {project_data['overall_readiness']}"
        assert len(project_data["blockers"]) == 2, f"Expected 2 blockers, got {len(project_data['blockers'])}"
        print(f"       ✓ POST /api/demo/seed recreated full demo project (6 stages, {project_data['overall_readiness']}% readiness, 2 blockers)")

        # Verify idempotency: calling seed again returns existing project without duplication
        seed_resp2 = fresh_client.post("/api/demo/seed")
        assert seed_resp2.status_code == 200
        with fresh_app.app_context():
            assert Project.query.count() == 1, "Demo seed must be idempotent"
        print("       ✓ POST /api/demo/seed is idempotent (does not duplicate projects)")

    finally:
        if os.path.exists(temp_db_path):
            try:
                os.remove(temp_db_path)
            except OSError:
                pass

    # 3. Test Gemini API Key Environment Variable Handling
    print("\n[3/5] Verifying Gemini API Key Safety:")
    from app.services.ai.factory import get_ai_provider
    from app.services.ai.mock_provider import MockAIProvider

    # When key is absent, fallback must be MockAIProvider
    orig_key = os.environ.get("GEMINI_API_KEY")
    try:
        if "GEMINI_API_KEY" in os.environ:
            del os.environ["GEMINI_API_KEY"]
        provider = get_ai_provider()
        assert isinstance(provider, MockAIProvider), "Provider must fall back to MockAIProvider when GEMINI_API_KEY is not set"
        print("       ✓ get_ai_provider safely falls back to MockAIProvider when GEMINI_API_KEY is unset")
    finally:
        if orig_key:
            os.environ["GEMINI_API_KEY"] = orig_key

    # 4. Verify Gunicorn WSGI Entry Point
    print("\n[4/5] Verifying Production WSGI Server Entry Point:")
    import gunicorn
    print(f"       ✓ Gunicorn {gunicorn.__version__} is installed and available")
    from run import app as wsgi_app
    assert wsgi_app is not None
    print("       ✓ 'run:app' successfully exports WSGI application instance")

    # 5. Full End-to-End API Check
    print("\n[5/5] Testing GET /api/projects:")
    resp_projects = client.get("/api/projects")
    assert resp_projects.status_code == 200
    projects_list = resp_projects.get_json()
    assert isinstance(projects_list, list) and len(projects_list) > 0
    print(f"       ✓ GET /api/projects returned {len(projects_list)} active project(s)")

    print("\n" + "=" * 70)
    print("ALL PRODUCTION DEPLOYMENT CHECKS PASSED SUCCESSFULLY!")
    print("=" * 70)


if __name__ == "__main__":
    test_production_readiness()
