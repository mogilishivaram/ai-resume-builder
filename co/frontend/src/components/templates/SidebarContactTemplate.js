import React from "react";
import { normalizeResumeData, ensureUrl, formatSkill, formatLanguage } from "./templateHelpers";

export default function SidebarContactTemplate({ resume, accentColor, previewId = "resume-preview" }) {
  const { personalInfo, summary, experience, education, projects, skills, languages } = normalizeResumeData(resume);
  const sectionColor = accentColor || "#334155";

  return (
    <div id={previewId} className="bg-white rounded-lg shadow-lg overflow-hidden text-slate-800" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="grid grid-cols-[30%_70%] min-h-[900px]">
        <aside className="p-5 bg-slate-100 border-r border-slate-200 text-xs">
          <h1 className="text-lg font-bold text-slate-800">{personalInfo.name || "Your Name"}</h1>
          <p className="mt-1 text-slate-600">{personalInfo.title || "Professional Title"}</p>

          <div className="mt-4 space-y-1 text-slate-600">
            {personalInfo.email && <p>{personalInfo.email}</p>}
            {personalInfo.phone && <p>{personalInfo.phone}</p>}
            {personalInfo.location && <p>{personalInfo.location}</p>}
            {personalInfo.linkedin && <a href={ensureUrl(personalInfo.linkedin)} target="_blank" rel="noreferrer" className="underline block">LinkedIn</a>}
          </div>

          {skills.length > 0 && (
            <section className="mt-5">
              <h2 className="text-[11px] uppercase font-semibold tracking-[0.14em] mb-2" style={{ color: sectionColor }}>Skills</h2>
              <ul className="space-y-1 text-slate-700">
                {skills.map((skill, index) => (
                  <li key={index}>{formatSkill(skill)}</li>
                ))}
              </ul>
            </section>
          )}

          {languages.length > 0 && (
            <section className="mt-5">
              <h2 className="text-[11px] uppercase font-semibold tracking-[0.14em] mb-2" style={{ color: sectionColor }}>Languages</h2>
              <ul className="space-y-1 text-slate-700">
                {languages.map((lang, index) => (
                  <li key={index}>{formatLanguage(lang)}</li>
                ))}
              </ul>
            </section>
          )}
        </aside>

        <main className="p-6 space-y-5 text-sm leading-relaxed">
          {summary && <Section title="Summary" color={sectionColor}><p className="text-slate-600">{summary}</p></Section>}

          {experience.length > 0 && (
            <Section title="Experience" color={sectionColor}>
              {experience.map((exp, index) => (
                <div key={index} className="mb-3">
                  <div className="flex justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{exp.title}</h3>
                      <p className="text-xs text-slate-500">{exp.company}</p>
                    </div>
                    <span className="text-xs text-slate-400">{exp.start_date} - {exp.end_date || "Present"}</span>
                  </div>
                </div>
              ))}
            </Section>
          )}

          {education.length > 0 && (
            <Section title="Education" color={sectionColor}>
              {education.map((edu, index) => (
                <div key={index} className="mb-2 text-xs">
                  <p className="font-semibold">{edu.degree}</p>
                  <p className="text-slate-500">{edu.school}</p>
                </div>
              ))}
            </Section>
          )}

          {projects.length > 0 && (
            <Section title="Projects" color={sectionColor}>
              {projects.map((project, index) => (
                <div key={index} className="mb-2">
                  <h3 className="font-semibold">{project.name}</h3>
                  <p className="text-xs text-slate-600">{project.description}</p>
                </div>
              ))}
            </Section>
          )}
        </main>
      </div>
    </div>
  );
}

function Section({ title, color, children }) {
  return (
    <section>
      <h2 className="text-xs uppercase tracking-[0.16em] font-semibold mb-2" style={{ color }}>{title}</h2>
      {children}
    </section>
  );
}
