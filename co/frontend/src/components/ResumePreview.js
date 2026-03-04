import React from "react";

export default function ResumePreview({ resume, template = "professional" }) {
  const {
    personal_info = {},
    summary = "",
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    languages = [],
  } = resume || {};

  const templates = {
    professional: {
      accent: "#1e40af",
      bg: "#ffffff",
      headerBg: "#1e3a5f",
      headerText: "#ffffff",
      sectionTitle: "#1e40af",
    },
    modern: {
      accent: "#7c3aed",
      bg: "#ffffff",
      headerBg: "#4c1d95",
      headerText: "#ffffff",
      sectionTitle: "#7c3aed",
    },
    creative: {
      accent: "#059669",
      bg: "#ffffff",
      headerBg: "#064e3b",
      headerText: "#ffffff",
      sectionTitle: "#059669",
    },
  };

  const t = templates[template] || templates.professional;

  return (
    <div
      className="bg-white shadow-lg rounded-lg overflow-hidden"
      style={{ fontFamily: template === "professional" ? "'Merriweather', serif" : "'Inter', sans-serif" }}
      id="resume-preview"
    >
      {/* Header */}
      <div className="px-4 sm:px-8 py-4 sm:py-6" style={{ backgroundColor: t.headerBg, color: t.headerText }}>
        <h1 className="text-2xl font-bold">{personal_info.name || "Your Name"}</h1>
        <p className="text-sm mt-1 opacity-90">{personal_info.title || "Professional Title"}</p>
        <div className="flex flex-wrap gap-4 mt-3 text-xs opacity-80">
          {personal_info.email && <span>✉ {personal_info.email}</span>}
          {personal_info.phone && <span>☎ {personal_info.phone}</span>}
          {personal_info.location && <span>📍 {personal_info.location}</span>}
          {personal_info.linkedin && <span>🔗 {personal_info.linkedin}</span>}
          {personal_info.website && <span>🌐 {personal_info.website}</span>}
        </div>
      </div>

      <div className="px-4 sm:px-8 py-4 sm:py-6 space-y-5 text-sm leading-relaxed">
        {/* Summary */}
        {summary && (
          <Section title="Professional Summary" color={t.sectionTitle}>
            <p className="text-slate-600">{summary}</p>
          </Section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <Section title="Work Experience" color={t.sectionTitle}>
            {experience.map((exp, i) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-slate-800">{exp.title}</h4>
                    <p className="text-slate-500">{exp.company}{exp.location ? ` — ${exp.location}` : ""}</p>
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap">
                    {exp.start_date} – {exp.end_date || "Present"}
                  </span>
                </div>
                {exp.bullets && (
                  <ul className="mt-2 list-disc list-inside text-slate-600 space-y-1">
                    {exp.bullets.map((b, j) => <li key={j}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </Section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <Section title="Education" color={t.sectionTitle}>
            {education.map((edu, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-800">{edu.degree}</h4>
                    <p className="text-slate-500">{edu.school}{edu.location ? ` — ${edu.location}` : ""}</p>
                  </div>
                  <span className="text-xs text-slate-400">{edu.year || edu.graduation_date}</span>
                </div>
                {edu.gpa && <p className="text-xs text-slate-400 mt-1">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </Section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <Section title="Skills" color={t.sectionTitle}>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: `${t.accent}15`, color: t.accent }}
                >
                  {typeof skill === "string" ? skill : skill.name}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <Section title="Projects" color={t.sectionTitle}>
            {projects.map((proj, i) => (
              <div key={i} className="mb-3">
                <h4 className="font-semibold text-slate-800">{proj.name}</h4>
                <p className="text-slate-600 text-xs mt-1">{proj.description}</p>
                {proj.technologies && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {proj.technologies.map((tech, j) => (
                      <span key={j} className="text-xs text-slate-400">
                        {tech}{j < proj.technologies.length - 1 ? " · " : ""}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </Section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <Section title="Certifications" color={t.sectionTitle}>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              {certifications.map((cert, i) => (
                <li key={i}>{typeof cert === "string" ? cert : `${cert.name}${cert.issuer ? ` — ${cert.issuer}` : ""}`}</li>
              ))}
            </ul>
          </Section>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <Section title="Languages" color={t.sectionTitle}>
            <div className="flex flex-wrap gap-3 text-slate-600">
              {languages.map((lang, i) => (
                <span key={i}>
                  {typeof lang === "string" ? lang : `${lang.name}${lang.level ? ` (${lang.level})` : ""}`}
                </span>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ title, color, children }) {
  return (
    <div>
      <h3
        className="text-sm font-bold uppercase tracking-wider mb-2 pb-1 border-b-2"
        style={{ color, borderColor: color }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}
