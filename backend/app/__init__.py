import os
from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
from .config import Config
from .models import db, Project, Stage, Task

def create_app(config_class=Config):
    """Flask application factory.
    
    1. Loads configuration.
    2. Initializes SQLAlchemy.
    3. Registers CORS.
    4. Registers base routes (health check).
    5. Registers API blueprints.
    6. Configures frontend static serving (SPA fallback).
    7. Initializes database tables if needed.
    """
    # Locate frontend distribution directory (production build)
    frontend_dist = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist")
    )
    has_frontend_build = os.path.isdir(frontend_dist)

    app = Flask(__name__, static_folder=None)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    
    # Configure CORS: permissive for /api/* to allow both cross-origin dev (Vite)
    # and co-located production serving.
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Health check route
    @app.route("/health")
    @app.route("/api/health")
    def health_check():
        return {
            "status": "healthy",
            "service": "energy-project-readiness-backend",
            "version": "0.1.0",
        }

    # Register API blueprints
    from .routes import (
        projects_bp,
        stages_bp,
        tasks_bp,
        analysis_bp,
        demo_bp,
        documents_bp,
    )
    app.register_blueprint(projects_bp)
    app.register_blueprint(stages_bp)
    app.register_blueprint(tasks_bp)
    app.register_blueprint(analysis_bp)
    app.register_blueprint(demo_bp)
    app.register_blueprint(documents_bp)

    # Serve compiled static assets (JS, CSS, images) from frontend/dist/assets
    @app.route("/assets/<path:filename>")
    def serve_assets(filename):
        if has_frontend_build:
            assets_dir = os.path.join(frontend_dist, "assets")
            if os.path.isdir(assets_dir):
                return send_from_directory(assets_dir, filename)
        return jsonify({"error": "Asset not found"}), 404

    # Serve built React frontend with SPA fallback
    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_frontend(path):
        # Do not intercept unmatched /api routes; return 404 JSON instead of HTML
        if path.startswith("api/") or path == "api":
            return jsonify({"error": "API endpoint not found"}), 404

        if has_frontend_build:
            # Check if direct static asset (e.g. favicon.ico, vite.svg) exists in dist root
            file_path = os.path.join(frontend_dist, path)
            if path and os.path.isfile(file_path):
                return send_from_directory(frontend_dist, path)

            # SPA routing fallback: serve index.html for all client routes
            index_path = os.path.join(frontend_dist, "index.html")
            if os.path.isfile(index_path):
                return send_from_directory(frontend_dist, "index.html")

        # Fallback if frontend has not been compiled yet
        return jsonify({
            "message": "Energy Project Readiness API is running. Build frontend with 'npm run build' to view UI.",
            "status": "healthy",
            "docs": "/api/health",
        }), 200

    # Create database tables during startup if not present
    with app.app_context():
        db.create_all()

    return app
