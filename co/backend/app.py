"""AI Resume Builder – Flask Backend."""

import os
import json
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
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
genai.configure(api_key=Config.GEMINI_API_KEY)

# Initialise DB tables on startup (needed for gunicorn / Render)
init_db()

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


jwt_required = login_required


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


@app.route("/api/resume/extract", methods=["POST"])
@jwt_required
def extract_resume():
    try:
        data = request.get_json() or {}
        file_data = data.get("fileData")
        media_type = data.get("mediaType")

        if not file_data or not media_type:
            return jsonify({"success": False, "error": "No file data received"}), 400

        supported_media_types = {
            "application/pdf",
            "image/jpeg",
            "image/png",
            "image/webp",
        }
        if media_type not in supported_media_types:
            return jsonify({"success": False, "error": "Only PDF, JPG, PNG and WEBP files are supported"}), 400

        model = genai.GenerativeModel("gemini-1.5-flash")

        prompt = """You are a resume parser. Extract ALL information from this resume document/image and return ONLY a valid JSON object with exactly this structure. Do not include any explanation, markdown, or extra text - ONLY the raw JSON:
        {
          "personalInfo": {
            "fullName": "",
            "email": "",
            "phone": "",
            "location": "",
            "linkedin": "",
            "github": "",
            "website": "",
            "professionalTitle": ""
          },
          "summary": "",
          "experience": [
            {
              "jobTitle": "",
              "company": "",
              "location": "",
              "startDate": "",
              "endDate": "",
              "bullets": ["", ""]
            }
          ],
          "education": [
            {
              "degree": "",
              "institution": "",
              "location": "",
              "year": "",
              "gradeType": "CGPA",
              "gradeValue": ""
            }
          ],
          "skills": ["", ""],
          "projects": [
            {
              "name": "",
              "description": "",
              "techStack": ["", ""]
            }
          ],
          "certifications": [""],
          "languages": [""]
        }
        Rules:
        - Extract every piece of information visible in the resume
        - If a field is not found, leave it as empty string or empty array
        - For experience bullets, split each bullet point as a separate array item
        - For skills, each skill is a separate array item
        - For gradeType, detect whether it is CGPA, GPA, Percentage or Marks and set accordingly
        - Return ONLY raw JSON, absolutely no markdown backticks, no explanations"""

        response = model.generate_content([
            {
                "mime_type": media_type,
                "data": file_data,
            },
            prompt,
        ])

        text = (response.text or "").strip()
        if not text:
            return jsonify({"success": False, "error": "Could not read resume. Please try a higher quality image"}), 422

        # Remove markdown code blocks if present
        text = re.sub(r"```json\s*|\s*```", "", text).strip()
        text = re.sub(r"^```|```$", "", text, flags=re.MULTILINE).strip()

        extracted = json.loads(text)
        return jsonify({"success": True, "data": extracted})

    except json.JSONDecodeError:
        return jsonify({"success": False, "error": "AI could not extract data. Try a clearer scan or PDF"}), 422
    except Exception as e:
        err = str(e)
        if "429" in err or "ResourceExhausted" in err or "InvalidArgument" in err:
            return jsonify({"success": False, "error": "Could not read resume. Please try a higher quality image"}), 422
        return jsonify({"success": False, "error": err}), 500


# -------------------------------------------------------------------- main

if __name__ == "__main__":
    init_db()
    port = int(os.environ.get("PORT", 5000))
    print("✅  Database initialised")
    print(f"🚀  AI Resume Builder API running on http://0.0.0.0:{port}")
    app.run(host="0.0.0.0", port=port, debug=False)
