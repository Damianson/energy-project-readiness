import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file if present
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

class Config:
    """Base application configuration."""
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-key-energy-readiness-mvp")
    
    # Database URL configuration with SQLite default
    database_url = os.environ.get("DATABASE_URL")
    if database_url:
        # Support Render/Heroku postgres:// URLs with modern postgresql://
        if database_url.startswith("postgres://"):
            database_url = database_url.replace("postgres://", "postgresql://", 1)
        SQLALCHEMY_DATABASE_URI = database_url
    else:
        # Default to local SQLite database in backend directory
        db_path = BASE_DIR / "energy_readiness.db"
        SQLALCHEMY_DATABASE_URI = f"sqlite:///{db_path}"

    SQLALCHEMY_TRACK_MODIFICATIONS = False
