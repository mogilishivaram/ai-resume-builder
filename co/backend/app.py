"""AI Resume Builder – Flask Backend."""

from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from models import (
    init_db,
    create_resume,
    get_resumes_by_user,
    get_resume_by_id,
    update_resume,
    delete_resume,
)
from auth import auth_bp, get_current_user
from ai_engine import (
    generate_summary,
    generate_experience_bullets,
    generate_skills,
    generate_full_resume,
    improve_text,
)

# ---------------------------------------------------------------- app setup

app = Flask(__name__)
app.secret_key = Config.SECRET_KEY

CORS(app, resources={r"/*": {"origins": Config.FRONTEND_URL}}, supports_credentials=True)

app.register_blueprint(auth_bp)

# -------------------------------------------------------- helper decorator


def login_required(fn):
    """Decorator that ensures the request carries a valid JWT."""
    from functools import wraps

    @wraps(fn)
    def wrapper(*args, **kwargs):
        user = get_current_user()
        if not user:
            return jsonify({"error": "Unauthorized"}), 401
        request.user = user
        return fn(*args, **kwargs)

    return wrapper


# ------------------------------------------------------------------ routes


@app.route("/")
def index():
    return jsonify({"message": "AI Resume Builder API", "version": "1.0.0"})


# ---- Resume CRUD ----


@app.route("/api/resumes", methods=["GET"])
@login_required
def list_resumes():
    resumes = get_resumes_by_user(request.user["user_id"])
    return jsonify(resumes)


@app.route("/api/resumes", methods=["POST"])
@login_required
def create_resume_route():
    data = request.get_json() or {}
    resume = create_resume(request.user["user_id"], data)
    return jsonify(resume), 201


@app.route("/api/resumes/<int:resume_id>", methods=["GET"])
@login_required
def get_resume_route(resume_id):
    resume = get_resume_by_id(resume_id, request.user["user_id"])
    if not resume:
        return jsonify({"error": "Resume not found"}), 404
    return jsonify(resume)


@app.route("/api/resumes/<int:resume_id>", methods=["PUT"])
@login_required
def update_resume_route(resume_id):
    data = request.get_json() or {}
    resume = update_resume(resume_id, request.user["user_id"], data)
    if not resume:
        return jsonify({"error": "Resume not found"}), 404
    return jsonify(resume)


@app.route("/api/resumes/<int:resume_id>", methods=["DELETE"])
@login_required
def delete_resume_route(resume_id):
    ok = delete_resume(resume_id, request.user["user_id"])
    if not ok:
        return jsonify({"error": "Resume not found"}), 404
    return jsonify({"message": "Resume deleted"})


# ---- AI Generation ----


@app.route("/api/ai/generate-summary", methods=["POST"])
@login_required
def ai_summary():
    data = request.get_json() or {}
    try:
        summary = generate_summary(data)
        return jsonify({"summary": summary})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/ai/generate-experience", methods=["POST"])
@login_required
def ai_experience():
    data = request.get_json() or {}
    try:
        bullets = generate_experience_bullets(data)
        return jsonify({"bullets": bullets})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/ai/generate-skills", methods=["POST"])
@login_required
def ai_skills():
    data = request.get_json() or {}
    try:
        skills = generate_skills(data)
        return jsonify({"skills": skills})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/ai/generate-full-resume", methods=["POST"])
@login_required
def ai_full_resume():
    data = request.get_json() or {}
    try:
        resume_content = generate_full_resume(data)
        return jsonify(resume_content)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/ai/improve-text", methods=["POST"])
@login_required
def ai_improve():
    data = request.get_json() or {}
    try:
        improved = improve_text(data)
        return jsonify({"text": improved})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------------------------------------------------- main

if __name__ == "__main__":
    init_db()
    print("✅  Database initialised")
    print("🚀  AI Resume Builder API running on http://localhost:5000")
    app.run(debug=True, port=5000)
