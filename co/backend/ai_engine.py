"""AI resume content generation using Google Gemini."""

import json
import time
import google.generativeai as genai
from config import Config


def _get_model():
    """Configure and return Gemini model."""
    genai.configure(api_key=Config.GEMINI_API_KEY)
    return genai.GenerativeModel("gemini-2.0-flash")


def _generate_with_retry(model, prompt, max_retries=3):
    """Call Gemini with automatic retry on rate-limit (429) errors."""
    for attempt in range(max_retries):
        try:
            return model.generate_content(prompt)
        except Exception as e:
            if "429" in str(e) or "ResourceExhausted" in str(e):
                wait = 2 ** attempt * 5  # 5s, 10s, 20s
                print(f"⏳ Rate limited, retrying in {wait}s (attempt {attempt + 1}/{max_retries})")
                time.sleep(wait)
            else:
                raise
    raise Exception("Gemini API rate limit exceeded. Please try again in a minute.")


# ---------------------------------------------------------------- prompts


_SUMMARY_PROMPT = """You are an expert resume writer. Generate a professional resume summary/objective
for the following person. Keep it 2-3 sentences, impactful, and tailored to their target role.

Name: {name}
Target Role: {role}
Years of Experience: {experience_years}
Key Skills: {skills}
Additional Context: {context}

Respond with ONLY the summary text, no quotes or extra formatting."""


_EXPERIENCE_PROMPT = """You are an expert resume writer. Generate 3-5 professional bullet points
describing achievements and responsibilities for this role. Use strong action verbs, quantify
results where possible, and make them ATS-friendly.

Job Title: {title}
Company: {company}
Industry: {industry}
Key Responsibilities: {responsibilities}
Additional Context: {context}

Respond with ONLY the bullet points, one per line, starting with a bullet character (•)."""


_SKILLS_PROMPT = """You are an expert resume writer. Based on the following information, suggest
a comprehensive list of relevant skills organised into categories.

Target Role: {role}
Industry: {industry}
Current Skills: {current_skills}
Experience Level: {level}

Respond in JSON format:
{{
  "technical": ["skill1", "skill2"],
  "soft": ["skill1", "skill2"],
  "tools": ["tool1", "tool2"]
}}"""


_FULL_RESUME_PROMPT = """You are an expert resume writer. Generate complete, professional resume
content for the following person. Make it ATS-friendly with quantified achievements.

Name: {name}
Email: {email}
Target Role: {role}
Years of Experience: {experience_years}
Education: {education}
Current Skills: {skills}
Work History: {work_history}
Additional Info: {context}

Respond in this exact JSON format:
{{
  "summary": "Professional summary here",
  "experience": [
    {{
      "title": "Job Title",
      "company": "Company Name",
      "location": "City, State",
      "start_date": "Month Year",
      "end_date": "Present",
      "bullets": ["Achievement 1", "Achievement 2", "Achievement 3"]
    }}
  ],
  "skills": ["skill1", "skill2", "skill3"],
  "projects": [
    {{
      "name": "Project Name",
      "description": "Brief description with impact",
      "technologies": ["tech1", "tech2"]
    }}
  ]
}}"""


# -------------------------------------------------------------- public API


def generate_summary(data: dict) -> str:
    """Generate a professional summary."""
    model = _get_model()
    prompt = _SUMMARY_PROMPT.format(
        name=data.get("name", ""),
        role=data.get("role", ""),
        experience_years=data.get("experience_years", ""),
        skills=data.get("skills", ""),
        context=data.get("context", ""),
    )
    response = _generate_with_retry(model, prompt)
    return response.text.strip()


def generate_experience_bullets(data: dict) -> list:
    """Generate bullet points for a job experience entry."""
    model = _get_model()
    prompt = _EXPERIENCE_PROMPT.format(
        title=data.get("title", ""),
        company=data.get("company", ""),
        industry=data.get("industry", ""),
        responsibilities=data.get("responsibilities", ""),
        context=data.get("context", ""),
    )
    response = _generate_with_retry(model, prompt)
    bullets = [
        line.strip().lstrip("•-").strip()
        for line in response.text.strip().split("\n")
        if line.strip()
    ]
    return bullets


def generate_skills(data: dict) -> dict:
    """Suggest categorised skills."""
    model = _get_model()
    prompt = _SKILLS_PROMPT.format(
        role=data.get("role", ""),
        industry=data.get("industry", ""),
        current_skills=data.get("current_skills", ""),
        level=data.get("level", "mid"),
    )
    response = _generate_with_retry(model, prompt)
    text = response.text.strip()
    # Strip markdown code fences if present
    if text.startswith("```"):
        text = "\n".join(text.split("\n")[1:])
    if text.endswith("```"):
        text = "\n".join(text.split("\n")[:-1])
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return {"technical": [], "soft": [], "tools": [], "raw": response.text}


def generate_full_resume(data: dict) -> dict:
    """Generate complete resume content."""
    model = _get_model()
    prompt = _FULL_RESUME_PROMPT.format(
        name=data.get("name", ""),
        email=data.get("email", ""),
        role=data.get("role", ""),
        experience_years=data.get("experience_years", ""),
        education=data.get("education", ""),
        skills=data.get("skills", ""),
        work_history=data.get("work_history", ""),
        context=data.get("context", ""),
    )
    response = _generate_with_retry(model, prompt)
    text = response.text.strip()
    if text.startswith("```"):
        text = "\n".join(text.split("\n")[1:])
    if text.endswith("```"):
        text = "\n".join(text.split("\n")[:-1])
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return {"raw": response.text}


def improve_text(data: dict) -> str:
    """Improve any piece of resume text."""
    model = _get_model()
    prompt = f"""You are an expert resume writer. Improve the following resume text to be more
professional, impactful, and ATS-friendly. Keep the same general meaning but enhance it.

Original text:
{data.get('text', '')}

Context (section): {data.get('section', 'general')}
Target role: {data.get('role', '')}

Respond with ONLY the improved text, no quotes or extra formatting."""
    response = _generate_with_retry(model, prompt)
    return response.text.strip()
