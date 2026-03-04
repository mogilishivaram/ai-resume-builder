import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    """Application configuration loaded from environment variables."""

    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
    GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")
    GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
    DATABASE_PATH = os.path.join(os.path.dirname(__file__), "resume_builder.db")
    GOOGLE_DISCOVERY_URL = "https://accounts.google.com/.well-known/openid-configuration"
    REDIRECT_URI = "http://localhost:5000/auth/callback"
