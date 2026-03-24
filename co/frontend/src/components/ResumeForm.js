import React, { useRef, useState } from "react";
import { FiPlus, FiTrash2, FiChevronDown, FiChevronUp, FiZap, FiX } from "react-icons/fi";
import api from "../services/api";

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "YN";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ""}${parts[parts.length - 1][0] || ""}`.toUpperCase();
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Unable to read selected file."));
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Unable to load selected image."));
    img.src = src;
  });
}

async function compressImageToBase64(file, maxWidth = 400, maxHeight = 400) {
  const sourceDataUrl = await fileToDataUrl(file);
  const image = await loadImage(sourceDataUrl);

  const scale = Math.min(maxWidth / image.width, maxHeight / image.height, 1);
  const targetWidth = Math.max(1, Math.round(image.width * scale));
  const targetHeight = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Unable to process selected image.");
  }

  ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

  const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg";
  const quality = mimeType === "image/jpeg" ? 0.85 : undefined;
  return canvas.toDataURL(mimeType, quality);
}

export default function ResumeForm({ resume, onChange }) {
  const [openSection, setOpenSection] = useState("personal");
  const [photoError, setPhotoError] = useState("");
  const fileInputRef = useRef(null);

  const toggle = (key) => setOpenSection(openSection === key ? null : key);

  const update = (field, value) => onChange({ ...resume, [field]: value });

  const updatePersonal = (key, value) =>
    update("personal_info", { ...resume.personal_info, [key]: value });

  const updateListItem = (field, index, key, value) => {
    const list = [...(resume[field] || [])];
    list[index] = { ...list[index], [key]: value };
    update(field, list);
  };

  const addListItem = (field, template) => {
    update(field, [...(resume[field] || []), template]);
  };

  const removeListItem = (field, index) => {
    const list = [...(resume[field] || [])];
    list.splice(index, 1);
    update(field, list);
  };

  const handlePickPhoto = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPhotoError("");
    try {
      const compressedPhoto = await compressImageToBase64(file, 400, 400);
      updatePersonal("profilePhoto", compressedPhoto);
    } catch (error) {
      setPhotoError(error.message || "Unable to process image.");
    } finally {
      event.target.value = "";
    }
  };

  const handleRemovePhoto = () => {
    updatePersonal("profilePhoto", "");
    setPhotoError("");
  };

  const profilePhoto = resume.personal_info?.profilePhoto || "";
  const profileInitials = getInitials(resume.personal_info?.name || "");

  return (
    <div className="space-y-3">
      {/* PERSONAL INFO */}
      <Accordion title="Personal Information" open={openSection === "personal"} onToggle={() => toggle("personal")}>
        <div className="mb-4 flex items-center gap-4">
          <div className="relative w-24 h-24">
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-semibold text-xl">
                {profileInitials}
              </div>
            )}

            <button
              type="button"
              onClick={handlePickPhoto}
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center border-2 border-white shadow-sm hover:bg-primary-700 transition"
              aria-label="Add profile photo"
              title="Add profile photo"
            >
              <FiPlus />
            </button>

            {profilePhoto && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white text-slate-600 border border-slate-200 flex items-center justify-center shadow-sm hover:text-red-500 transition"
                aria-label="Remove profile photo"
                title="Remove profile photo"
              >
                <FiX />
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700">Profile Photo</p>
            <p className="text-xs text-slate-500">Tap/click + to upload. Images are resized to max 400 x 400 px.</p>
            {photoError && <p className="text-xs text-red-500 mt-1">{photoError}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input label="Full Name" value={resume.personal_info?.name || ""} onChange={(v) => updatePersonal("name", v)} />
          <Input label="Professional Title" value={resume.personal_info?.title || ""} onChange={(v) => updatePersonal("title", v)} />
          <Input label="Email" value={resume.personal_info?.email || ""} onChange={(v) => updatePersonal("email", v)} />
          <Input label="Phone" value={resume.personal_info?.phone || ""} onChange={(v) => updatePersonal("phone", v)} />
          <Input label="Location" value={resume.personal_info?.location || ""} onChange={(v) => updatePersonal("location", v)} />
          <Input label="LinkedIn URL" value={resume.personal_info?.linkedin || ""} onChange={(v) => updatePersonal("linkedin", v)} />
          <Input label="Website" value={resume.personal_info?.website || ""} onChange={(v) => updatePersonal("website", v)} />
          <Input label="GitHub" value={resume.personal_info?.github || ""} onChange={(v) => updatePersonal("github", v)} />
        </div>
      </Accordion>

      {/* SUMMARY */}
      <Accordion title="Professional Summary" open={openSection === "summary"} onToggle={() => toggle("summary")}>
        <textarea
          className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary-400 focus:border-transparent resize-y min-h-[100px]"
          placeholder="Write a compelling summary of your professional background..."
          value={resume.summary || ""}
          onChange={(e) => update("summary", e.target.value)}
        />
        <AiGrammarButton
          text={resume.summary || ""}
          onResult={(improved) => update("summary", improved)}
        />
      </Accordion>

      {/* EXPERIENCE */}
      <Accordion title="Work Experience" open={openSection === "experience"} onToggle={() => toggle("experience")}>
        {(resume.experience || []).map((exp, i) => (
          <div key={i} className="border border-slate-100 rounded-lg p-4 mb-3 bg-slate-50 relative animate-fade-in">
            <button
              className="absolute top-2 right-2 text-red-400 hover:text-red-600 transition"
              onClick={() => removeListItem("experience", i)}
            >
              <FiTrash2 />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input label="Job Title" value={exp.title || ""} onChange={(v) => updateListItem("experience", i, "title", v)} />
              <Input label="Company" value={exp.company || ""} onChange={(v) => updateListItem("experience", i, "company", v)} />
              <Input label="Location" value={exp.location || ""} onChange={(v) => updateListItem("experience", i, "location", v)} />
              <Input label="Start Date" value={exp.start_date || ""} onChange={(v) => updateListItem("experience", i, "start_date", v)} />
              <Input label="End Date" value={exp.end_date || ""} onChange={(v) => updateListItem("experience", i, "end_date", v)} placeholder="Present" />
            </div>
            <div className="mt-3">
              <label className="block text-xs font-medium text-slate-500 mb-1">Bullet Points (one per line)</label>
              <textarea
                className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary-400 resize-y min-h-[80px]"
                value={(exp.bullets || []).join("\n")}
                onChange={(e) => updateListItem("experience", i, "bullets", e.target.value.split("\n"))}
              />
            </div>
          </div>
        ))}
        <AddButton label="Add Experience" onClick={() => addListItem("experience", { title: "", company: "", location: "", start_date: "", end_date: "", bullets: [] })} />
      </Accordion>

      {/* EDUCATION */}
      <Accordion title="Education" open={openSection === "education"} onToggle={() => toggle("education")}>
        {(resume.education || []).map((edu, i) => (
          <div key={i} className="border border-slate-100 rounded-lg p-4 mb-3 bg-slate-50 relative animate-fade-in">
            <button className="absolute top-2 right-2 text-red-400 hover:text-red-600" onClick={() => removeListItem("education", i)}><FiTrash2 /></button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input label="Degree" value={edu.degree || ""} onChange={(v) => updateListItem("education", i, "degree", v)} />
              <Input label="School" value={edu.school || ""} onChange={(v) => updateListItem("education", i, "school", v)} />
              <Input label="Location" value={edu.location || ""} onChange={(v) => updateListItem("education", i, "location", v)} />
              <Input label="Year" value={edu.year || ""} onChange={(v) => updateListItem("education", i, "year", v)} />
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Grade Type</label>
                <select
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-white"
                  value={edu.grade_type || "CGPA"}
                  onChange={(e) => updateListItem("education", i, "grade_type", e.target.value)}
                >
                  <option value="CGPA">CGPA</option>
                  <option value="GPA">GPA</option>
                  <option value="Percentage">Percentage</option>
                  <option value="Marks">Marks</option>
                </select>
              </div>
              <Input label={`${edu.grade_type || "CGPA"} Value`} value={edu.gpa || ""} onChange={(v) => updateListItem("education", i, "gpa", v)} />
            </div>
          </div>
        ))}
        <AddButton label="Add Education" onClick={() => addListItem("education", { degree: "", school: "", location: "", year: "", gpa: "", grade_type: "CGPA" })} />
      </Accordion>

      {/* SKILLS */}
      <Accordion title="Skills" open={openSection === "skills"} onToggle={() => toggle("skills")}>
        <TagInput
          tags={resume.skills || []}
          onChange={(tags) => update("skills", tags)}
          placeholder="Type a skill and press Enter or comma to add…"
        />
      </Accordion>

      {/* PROJECTS */}
      <Accordion title="Projects" open={openSection === "projects"} onToggle={() => toggle("projects")}>
        {(resume.projects || []).map((proj, i) => (
          <div key={i} className="border border-slate-100 rounded-lg p-4 mb-3 bg-slate-50 relative animate-fade-in">
            <button className="absolute top-2 right-2 text-red-400 hover:text-red-600" onClick={() => removeListItem("projects", i)}><FiTrash2 /></button>
            <div className="grid grid-cols-1 gap-3">
              <Input label="Project Name" value={proj.name || ""} onChange={(v) => updateListItem("projects", i, "name", v)} />
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                <textarea
                  className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary-400 resize-y min-h-[60px]"
                  value={proj.description || ""}
                  onChange={(e) => updateListItem("projects", i, "description", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Technologies</label>
                <TagInput
                  tags={proj.technologies || []}
                  onChange={(tags) => updateListItem("projects", i, "technologies", tags)}
                  placeholder="Type a technology and press Enter or comma…"
                />
              </div>
            </div>
          </div>
        ))}
        <AddButton label="Add Project" onClick={() => addListItem("projects", { name: "", description: "", technologies: [] })} />
      </Accordion>

      {/* CERTIFICATIONS */}
      <Accordion title="Certifications" open={openSection === "certifications"} onToggle={() => toggle("certifications")}>
        <textarea
          className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary-400 resize-y min-h-[60px]"
          placeholder="Enter certifications, one per line"
          value={(resume.certifications || []).join("\n")}
          onChange={(e) => update("certifications", e.target.value.split("\n").filter(Boolean))}
        />
      </Accordion>

      {/* LANGUAGES */}
      <Accordion title="Languages" open={openSection === "languages"} onToggle={() => toggle("languages")}>
        <textarea
          className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary-400 resize-y min-h-[60px]"
          placeholder="Enter languages, one per line (e.g., English - Native)"
          value={(resume.languages || []).join("\n")}
          onChange={(e) => update("languages", e.target.value.split("\n").filter(Boolean))}
        />
      </Accordion>
    </div>
  );
}

/* ---- tiny sub-components ---- */

function Accordion({ title, open, onToggle, children }) {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      <button
        className="w-full flex justify-between items-center px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
        onClick={onToggle}
      >
        {title}
        {open ? <FiChevronUp /> : <FiChevronDown />}
      </button>
      {open && <div className="px-5 pb-4">{children}</div>}
    </div>
  );
}

function Input({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      <input
        type="text"
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-400 focus:border-transparent"
        value={value}
        placeholder={placeholder || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function AiGrammarButton({ text, onResult }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheck = async () => {
    if (!text || !text.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/api/ai/improve-text", {
        text,
        instruction: "Fix all spelling mistakes, grammar errors, and improve clarity. Keep the same meaning and tone. Return only the corrected text.",
      });
      if (res.data?.text) onResult(res.data.text);
    } catch (e) {
      setError("AI check failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2 flex items-center gap-2">
      <button
        type="button"
        onClick={handleCheck}
        disabled={loading || !text?.trim()}
        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FiZap className={loading ? "animate-spin" : ""} />
        {loading ? "Checking…" : "AI Spell & Grammar Check"}
      </button>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

function TagInput({ tags, onChange, placeholder }) {
  const [input, setInput] = React.useState("");

  const addTag = (raw) => {
    const tag = raw.trim();
    if (tag && !tags.includes(tag)) onChange([...tags, tag]);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input && tags.length) {
      onChange(tags.slice(0, -1));
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    if (val.includes(",")) {
      val.split(",").forEach((part) => {
        const t = part.trim();
        if (t && !tags.includes(t)) tags = [...tags, t];
      });
      onChange(tags);
      setInput("");
    } else {
      setInput(val);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 border border-slate-200 rounded-lg p-2 focus-within:ring-2 focus-within:ring-primary-400 bg-white">
      {tags.map((tag, i) => (
        <span key={i} className="inline-flex items-center gap-1 bg-primary-50 text-primary-700 text-xs font-medium px-2.5 py-1 rounded-full">
          {tag}
          <button type="button" onClick={() => onChange(tags.filter((_, j) => j !== i))} className="hover:text-red-500 transition text-xs leading-none">&times;</button>
        </span>
      ))}
      <input
        type="text"
        className="flex-1 min-w-[120px] border-none outline-none text-sm p-1"
        placeholder={tags.length === 0 ? placeholder : ""}
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={() => { if (input.trim()) addTag(input); }}
      />
    </div>
  );
}

function AddButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium transition"
    >
      <FiPlus /> {label}
    </button>
  );
}
