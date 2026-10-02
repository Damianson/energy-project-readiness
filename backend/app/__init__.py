from flask import Flask
from flask_cors import CORS
from .config import Config
from .models import db, Project, Stage, Task

def create_app(config_class=Config):
    """Flask application factory.
    
    1. Loads configuration.
    2. Initializes SQLAlchemy.
    3. Registers CORS.
    4. Registers base routes (health check).
    5. Creates database tables during local development.
    """
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    CORS(app)

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
    from .routes import projects_bp, stages_bp, tasks_bp, analysis_bp, demo_bp
    app.register_blueprint(projects_bp)
    app.register_blueprint(stages_bp)
    app.register_blueprint(tasks_bp)
    app.register_blueprint(analysis_bp)
    app.register_blueprint(demo_bp)

    # Create database tables during local development
    with app.app_context():
        db.create_all()

    return app
