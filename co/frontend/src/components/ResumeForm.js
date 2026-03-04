import React, { useState } from "react";
import { FiPlus, FiTrash2, FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function ResumeForm({ resume, onChange }) {
  const [openSection, setOpenSection] = useState("personal");

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

  return (
    <div className="space-y-3">
      {/* PERSONAL INFO */}
      <Accordion title="Personal Information" open={openSection === "personal"} onToggle={() => toggle("personal")}>
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
              <Input label="GPA" value={edu.gpa || ""} onChange={(v) => updateListItem("education", i, "gpa", v)} />
            </div>
          </div>
        ))}
        <AddButton label="Add Education" onClick={() => addListItem("education", { degree: "", school: "", location: "", year: "", gpa: "" })} />
      </Accordion>

      {/* SKILLS */}
      <Accordion title="Skills" open={openSection === "skills"} onToggle={() => toggle("skills")}>
        <textarea
          className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary-400 resize-y min-h-[80px]"
          placeholder="Enter skills separated by commas (e.g., JavaScript, React, Python)"
          value={(resume.skills || []).join(", ")}
          onChange={(e) => update("skills", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
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
              <Input
                label="Technologies (comma separated)"
                value={(proj.technologies || []).join(", ")}
                onChange={(v) => updateListItem("projects", i, "technologies", v.split(",").map((s) => s.trim()).filter(Boolean))}
              />
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
