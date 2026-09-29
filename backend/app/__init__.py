from flask import Flask
from flask_cors import CORS
from .config import Config
from .models import db, Project, Stage, Task

def create_app(config_class=Config):
    """Flask application factory.
    
    1. Loads configuration.
    2. Initializes SQLAlchemy.
    3. Registers CORS.
    4. Creates database tables during local development.
    """
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    CORS(app)

    # Create database tables during local development
    with app.app_context():
        db.create_all()

    return app
