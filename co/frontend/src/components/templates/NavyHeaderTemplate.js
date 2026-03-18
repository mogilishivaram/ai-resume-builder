import React from "react";
import { normalizeResumeData, ensureUrl, formatSkill } from "./templateHelpers";

export default function NavyHeaderTemplate({ resume, accentColor, previewId = "resume-preview" }) {
  const { personalInfo, summary, experience, education, skills, projects } = normalizeResumeData(resume);
  const navy = "#1a2e4a";
  const sectionColor = accentColor || navy;

  return (
    <div id={previewId} className="bg-white rounded-lg shadow-lg overflow-hidden text-slate-800" style={{ fontFamily: "'Inter', sans-serif" }}>
      <header className="px-7 py-6" style={{ backgroundColor: navy, color: "#ffffff" }}>
        <h1 className="text-3xl font-bold">{personalInfo.name || "Your Name"}</h1>
        <div className="text-xs mt-2 opacity-95 flex flex-wrap gap-3">
          {personalInfo.title && <span>{personalInfo.title}</span>}
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && (
            <a href={ensureUrl(personalInfo.linkedin)} target="_blank" rel="noreferrer" className="underline">
              LinkedIn
            </a>
          )}
        </div>
      </header>

      <main className="p-7 space-y-5 text-sm leading-relaxed">
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
                {Array.isArray(exp.bullets) && exp.bullets.filter(Boolean).length > 0 && (
                  <ul className="list-disc list-inside mt-1 text-xs text-slate-600 space-y-1">
                    {exp.bullets.filter(Boolean).map((bullet, bIndex) => (
                      <li key={bIndex}>{bullet}</li>
                    ))}
                  </ul>
                )}
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

        {skills.length > 0 && (
          <Section title="Skills" color={sectionColor}>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span key={index} className="px-2 py-1 rounded text-xs" style={{ backgroundColor: `${sectionColor}14`, color: sectionColor }}>
                  {formatSkill(skill)}
                </span>
              ))}
            </div>
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
  );
}

function Section({ title, color, children }) {
  return (
    <section>
      <h2 className="text-xs uppercase tracking-[0.16em] font-semibold mb-2" style={{ color }}>
        {title}
      </h2>
      {children}
    </section>
  );
}
