import React from "react";
import { normalizeResumeData, formatSkill, ensureUrl } from "./templateHelpers";

export default function ModernTealHeaderTemplate({ resume, accentColor, previewId = "resume-preview" }) {
  const { personalInfo, summary, experience, education, skills, projects } = normalizeResumeData(resume);

  return (
    <div id={previewId} className="bg-white rounded-lg shadow-lg overflow-hidden text-slate-800" style={{ fontFamily: "'Inter', sans-serif" }}>
      <header className="px-7 py-6 text-white" style={{ backgroundColor: accentColor }}>
        <h1 className="text-3xl font-bold tracking-tight">{personalInfo.name || "Your Name"}</h1>
        <p className="text-sm mt-1 text-white/90">{personalInfo.title || "Professional Title"}</p>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-white/90">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <a href={ensureUrl(personalInfo.linkedin)} target="_blank" rel="noreferrer" className="underline">LinkedIn</a>}
        </div>
      </header>

      <main className="p-7 space-y-5 text-sm leading-relaxed">
        {summary && <Section title="Summary" accentColor={accentColor}><p className="text-slate-600">{summary}</p></Section>}

        {experience.length > 0 && (
          <Section title="Experience" accentColor={accentColor}>
            {experience.map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="font-semibold">{exp.title}</h3>
                    <p className="text-xs text-slate-500">{exp.company}{exp.location ? ` | ${exp.location}` : ""}</p>
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap">{exp.start_date} - {exp.end_date || "Present"}</span>
                </div>
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

        <div className="grid grid-cols-2 gap-6">
          {education.length > 0 && (
            <Section title="Education" accentColor={accentColor}>
              {education.map((edu, index) => (
                <div key={index} className="mb-2 text-xs">
                  <p className="font-semibold">{edu.degree}</p>
                  <p className="text-slate-500">{edu.school}</p>
                  <p className="text-slate-400">{edu.year || edu.graduation_date}</p>
                </div>
              ))}
            </Section>
          )}

          {skills.length > 0 && (
            <Section title="Skills" accentColor={accentColor}>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span key={index} className="text-xs px-2 py-1 rounded-md" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
                    {formatSkill(skill)}
                  </span>
                ))}
              </div>
            </Section>
          )}
        </div>

        {projects.length > 0 && (
          <Section title="Projects" accentColor={accentColor}>
            {projects.map((project, index) => (
              <div key={index} className="mb-3 p-3 border rounded-md" style={{ borderColor: `${accentColor}35` }}>
                <h3 className="font-semibold">{project.name}</h3>
                <p className="text-xs text-slate-600">{project.description}</p>
              </div>
            ))}
          </Section>
        )}
      </main>
    </div>
  );
}

function Section({ title, accentColor, children }) {
  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-[0.16em] mb-2" style={{ color: accentColor }}>
        {title}
      </h2>
      {children}
    </section>
  );
}
