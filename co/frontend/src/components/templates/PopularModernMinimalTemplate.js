import React from "react";
import { normalizeResumeData, ensureUrl, formatSkill, formatLanguage } from "./templateHelpers";

export default function PopularModernMinimalTemplate({ resume, accentColor, previewId = "resume-preview" }) {
  const { personalInfo, summary, experience, education, skills, projects, languages } = normalizeResumeData(resume);

  return (
    <div id={previewId} className="bg-white rounded-lg shadow-lg p-8 text-slate-800" style={{ fontFamily: "'Inter', sans-serif" }}>
      <header className="border-b border-slate-200 pb-4 mb-5">
        <h1 className="text-3xl font-semibold tracking-tight">{personalInfo.name || "Your Name"}</h1>
        <p className="text-sm mt-1" style={{ color: accentColor }}>{personalInfo.title || "Professional Title"}</p>
        <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <a href={ensureUrl(personalInfo.linkedin)} target="_blank" rel="noreferrer" className="hover:underline">LinkedIn</a>}
        </div>
      </header>

      <main className="space-y-5 text-sm leading-relaxed">
        {summary && <Section title="Summary" accentColor={accentColor}><p className="text-slate-600">{summary}</p></Section>}

        {experience.length > 0 && (
          <Section title="Experience" accentColor={accentColor}>
            {experience.map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{exp.title}</h3>
                    <p className="text-slate-500 text-xs">{exp.company}</p>
                  </div>
                  <span className="text-xs text-slate-400">{exp.start_date} - {exp.end_date || "Present"}</span>
                </div>
                {Array.isArray(exp.bullets) && exp.bullets.filter(Boolean).length > 0 && (
                  <ul className="list-disc list-inside mt-1 text-xs text-slate-600 space-y-1">
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
                <h3 className="font-semibold">{project.name}</h3>
                <p className="text-xs text-slate-600">{project.description}</p>
              </div>
            ))}
          </Section>
        )}

        <div className="grid grid-cols-2 gap-6">
          {education.length > 0 && (
            <Section title="Education" accentColor={accentColor}>
              {education.map((edu, index) => (
                <div key={index} className="mb-2 text-xs">
                  <p className="font-medium">{edu.degree}</p>
                  <p className="text-slate-500">{edu.school}</p>
                  <p className="text-slate-400">{edu.year || edu.graduation_date}</p>
                </div>
              ))}
            </Section>
          )}

          <div>
            {skills.length > 0 && (
              <Section title="Skills" accentColor={accentColor}>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span key={index} className="px-2 py-1 rounded text-xs" style={{ backgroundColor: `${accentColor}14`, color: accentColor }}>
                      {formatSkill(skill)}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {languages.length > 0 && (
              <Section title="Languages" accentColor={accentColor}>
                <ul className="mt-2 text-xs text-slate-600 space-y-1">
                  {languages.map((lang, index) => (
                    <li key={index}>{formatLanguage(lang)}</li>
                  ))}
                </ul>
              </Section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function Section({ title, accentColor, children }) {
  return (
    <section>
      <h2 className="text-[11px] uppercase tracking-[0.16em] mb-2 font-semibold" style={{ color: accentColor }}>
        {title}
      </h2>
      {children}
    </section>
  );
}
