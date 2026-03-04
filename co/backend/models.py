import sqlite3
import json
from datetime import datetime
from config import Config


def get_db():
    """Get a database connection."""
    conn = sqlite3.connect(Config.DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Initialize database tables."""
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            google_id TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            picture TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS resumes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL DEFAULT 'Untitled Resume',
            template TEXT NOT NULL DEFAULT 'professional',
            personal_info TEXT DEFAULT '{}',
            summary TEXT DEFAULT '',
            experience TEXT DEFAULT '[]',
            education TEXT DEFAULT '[]',
            skills TEXT DEFAULT '[]',
            projects TEXT DEFAULT '[]',
            certifications TEXT DEFAULT '[]',
            languages TEXT DEFAULT '[]',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)

    conn.commit()
    conn.close()


# ---------- User operations ----------

def get_or_create_user(google_id, email, name, picture=""):
    """Find existing user by google_id or create a new one."""
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE google_id = ?", (google_id,))
    user = cursor.fetchone()

    if user:
        conn.close()
        return dict(user)

    cursor.execute(
        "INSERT INTO users (google_id, email, name, picture) VALUES (?, ?, ?, ?)",
        (google_id, email, name, picture),
    )
    conn.commit()
    user_id = cursor.lastrowid

    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user = dict(cursor.fetchone())
    conn.close()
    return user


def get_user_by_id(user_id):
    """Return user dict or None."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None


# ---------- Resume operations ----------

def create_resume(user_id, data):
    """Create a new resume for the user."""
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        """INSERT INTO resumes
           (user_id, title, template, personal_info, summary,
            experience, education, skills, projects, certifications, languages)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (
            user_id,
            data.get("title", "Untitled Resume"),
            data.get("template", "professional"),
            json.dumps(data.get("personal_info", {})),
            data.get("summary", ""),
            json.dumps(data.get("experience", [])),
            json.dumps(data.get("education", [])),
            json.dumps(data.get("skills", [])),
            json.dumps(data.get("projects", [])),
            json.dumps(data.get("certifications", [])),
            json.dumps(data.get("languages", [])),
        ),
    )
    conn.commit()
    resume_id = cursor.lastrowid
    conn.close()
    return get_resume_by_id(resume_id, user_id)


def get_resumes_by_user(user_id):
    """Return all resumes for a user."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM resumes WHERE user_id = ? ORDER BY updated_at DESC",
        (user_id,),
    )
    rows = cursor.fetchall()
    conn.close()
    return [_parse_resume(dict(r)) for r in rows]


def get_resume_by_id(resume_id, user_id):
    """Return a single resume (owned by user_id) or None."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM resumes WHERE id = ? AND user_id = ?",
        (resume_id, user_id),
    )
    row = cursor.fetchone()
    conn.close()
    return _parse_resume(dict(row)) if row else None


def update_resume(resume_id, user_id, data):
    """Update an existing resume."""
    conn = get_db()
    cursor = conn.cursor()

    fields, values = [], []
    for field in [
        "title", "template", "summary",
    ]:
        if field in data:
            fields.append(f"{field} = ?")
            values.append(data[field])

    for field in [
        "personal_info", "experience", "education",
        "skills", "projects", "certifications", "languages",
    ]:
        if field in data:
            fields.append(f"{field} = ?")
            values.append(json.dumps(data[field]))

    if fields:
        fields.append("updated_at = ?")
        values.append(datetime.utcnow().isoformat())
        values.extend([resume_id, user_id])

        cursor.execute(
            f"UPDATE resumes SET {', '.join(fields)} WHERE id = ? AND user_id = ?",
            values,
        )
        conn.commit()

    conn.close()
    return get_resume_by_id(resume_id, user_id)


def delete_resume(resume_id, user_id):
    """Delete a resume."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "DELETE FROM resumes WHERE id = ? AND user_id = ?",
        (resume_id, user_id),
    )
    deleted = cursor.rowcount
    conn.commit()
    conn.close()
    return deleted > 0


def _parse_resume(row: dict) -> dict:
    """Deserialise JSON columns."""
    for col in [
        "personal_info", "experience", "education",
        "skills", "projects", "certifications", "languages",
    ]:
        if col in row and isinstance(row[col], str):
            try:
                row[col] = json.loads(row[col])
            except json.JSONDecodeError:
                pass
    return row
