import React from "react";
import { normalizeResumeData, ensureUrl, formatSkill } from "./templateHelpers";

export default function ModernBoldLeftTemplate({ resume, accentColor, previewId = "resume-preview" }) {
  const { personalInfo, summary, experience, education, skills, projects } = normalizeResumeData(resume);

  return (
    <div id={previewId} className="bg-white rounded-lg shadow-lg p-8 text-slate-800" style={{ fontFamily: "'Inter', sans-serif" }}>
      <header className="mb-6">
        <h1 className="text-4xl font-black leading-none tracking-tight" style={{ color: accentColor }}>
          {personalInfo.name || "Your Name"}
        </h1>
        <p className="text-base mt-2 font-medium">{personalInfo.title || "Professional Title"}</p>
        <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.linkedin && <a href={ensureUrl(personalInfo.linkedin)} target="_blank" rel="noreferrer" className="hover:underline">LinkedIn</a>}
          {personalInfo.github && <a href={ensureUrl(personalInfo.github)} target="_blank" rel="noreferrer" className="hover:underline">GitHub</a>}
        </div>
      </header>

      <div className="grid grid-cols-[1.4fr_1fr] gap-7 text-sm">
        <div className="space-y-5">
          {summary && <Section title="Profile" accentColor={accentColor}><p className="text-slate-600">{summary}</p></Section>}

          {experience.length > 0 && (
            <Section title="Experience" accentColor={accentColor}>
              {experience.map((exp, index) => (
                <div key={index} className="mb-4">
                  <h3 className="font-bold">{exp.title}</h3>
                  <p className="text-xs text-slate-500">{exp.company}</p>
                  <p className="text-xs text-slate-400">{exp.start_date} - {exp.end_date || "Present"}</p>
                  {Array.isArray(exp.bullets) && exp.bullets.filter(Boolean).length > 0 && (
                    <ul className="mt-1 list-disc list-inside text-xs text-slate-600 space-y-1">
                      {exp.bullets.filter(Boolean).map((bullet, bulletIndex) => (
                        <li key={bulletIndex}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </Section>
          )}

          {projects.length > 0 && (
            <Section title="Projects" accentColor={accentColor}>
              {projects.map((project, index) => (
                <div key={index} className="mb-3">
                  <h3 className="font-bold">{project.name}</h3>
                  <p className="text-xs text-slate-600">{project.description}</p>
                </div>
              ))}
            </Section>
          )}
        </div>

        <aside className="space-y-5">
          {skills.length > 0 && (
            <Section title="Skills" accentColor={accentColor}>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span key={index} className="text-xs font-medium px-2 py-1 rounded" style={{ border: `1px solid ${accentColor}80`, color: accentColor }}>
                    {formatSkill(skill)}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {education.length > 0 && (
            <Section title="Education" accentColor={accentColor}>
              {education.map((edu, index) => (
                <div key={index} className="mb-3 text-xs">
                  <p className="font-semibold">{edu.degree}</p>
                  <p className="text-slate-500">{edu.school}</p>
                  <p className="text-slate-400">{edu.year || edu.graduation_date}</p>
                </div>
              ))}
            </Section>
          )}
        </aside>
      </div>
    </div>
  );
}

function Section({ title, accentColor, children }) {
  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-[0.18em] mb-2" style={{ color: accentColor }}>
        {title}
      </h2>
      {children}
    </section>
  );
}
