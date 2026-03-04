"""Google OAuth 2.0 authentication blueprint."""

import json
import jwt
import datetime
import requests
from flask import Blueprint, redirect, request, jsonify, session
from config import Config
from models import get_or_create_user

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

# ------------------------------------------------------------------ helpers


def _create_jwt(user):
    """Create a JWT token for the authenticated user."""
    payload = {
        "user_id": user["id"],
        "email": user["email"],
        "name": user["name"],
        "picture": user.get("picture", ""),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7),
    }
    return jwt.encode(payload, Config.SECRET_KEY, algorithm="HS256")


def decode_jwt(token):
    """Decode and verify a JWT token. Returns payload or None."""
    try:
        return jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None


def get_current_user():
    """Extract user from the Authorization header (Bearer token)."""
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None
    return decode_jwt(auth_header.split(" ", 1)[1])


# -------------------------------------------------------- Google OAuth flow


def _get_google_provider_cfg():
    return requests.get(Config.GOOGLE_DISCOVERY_URL, timeout=10).json()


@auth_bp.route("/google/login")
def google_login():
    """Redirect the user to Google's OAuth consent screen."""
    cfg = _get_google_provider_cfg()
    authorization_endpoint = cfg["authorization_endpoint"]

    params = {
        "client_id": Config.GOOGLE_CLIENT_ID,
        "redirect_uri": Config.REDIRECT_URI,
        "scope": "openid email profile",
        "response_type": "code",
        "access_type": "offline",
        "prompt": "consent",
    }
    qs = "&".join(f"{k}={v}" for k, v in params.items())
    return redirect(f"{authorization_endpoint}?{qs}")


@auth_bp.route("/callback")
def google_callback():
    """Handle the OAuth callback from Google."""
    code = request.args.get("code")
    if not code:
        return redirect(f"{Config.FRONTEND_URL}/login?error=no_code")

    cfg = _get_google_provider_cfg()

    # Exchange code for tokens
    token_response = requests.post(
        cfg["token_endpoint"],
        data={
            "code": code,
            "client_id": Config.GOOGLE_CLIENT_ID,
            "client_secret": Config.GOOGLE_CLIENT_SECRET,
            "redirect_uri": Config.REDIRECT_URI,
            "grant_type": "authorization_code",
        },
        timeout=10,
    )

    if token_response.status_code != 200:
        return redirect(f"{Config.FRONTEND_URL}/login?error=token_exchange_failed")

    tokens = token_response.json()

    # Fetch user info
    userinfo_response = requests.get(
        cfg["userinfo_endpoint"],
        headers={"Authorization": f"Bearer {tokens['access_token']}"},
        timeout=10,
    )

    if userinfo_response.status_code != 200:
        return redirect(f"{Config.FRONTEND_URL}/login?error=userinfo_failed")

    userinfo = userinfo_response.json()

    if not userinfo.get("email_verified", False):
        return redirect(f"{Config.FRONTEND_URL}/login?error=email_not_verified")

    # Upsert user in our database
    user = get_or_create_user(
        google_id=userinfo["sub"],
        email=userinfo["email"],
        name=userinfo.get("name", ""),
        picture=userinfo.get("picture", ""),
    )

    token = _create_jwt(user)

    # Redirect back to frontend with the JWT
    return redirect(f"{Config.FRONTEND_URL}/auth/callback?token={token}")


# --------------------------------------------------- REST helpers for SPA

@auth_bp.route("/me")
def me():
    """Return the current authenticated user."""
    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    return jsonify(user)


@auth_bp.route("/logout", methods=["POST"])
def logout():
    """Client-side logout – just acknowledge."""
    return jsonify({"message": "Logged out successfully"})
