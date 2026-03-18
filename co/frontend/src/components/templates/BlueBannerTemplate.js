import React from "react";
import { normalizeResumeData, ensureUrl, formatSkill } from "./templateHelpers";

export default function BlueBannerTemplate({ resume, accentColor, previewId = "resume-preview" }) {
  const { personalInfo, summary, experience, education, skills, projects } = normalizeResumeData(resume);
  const blue = "#2563eb";
  const activeBlue = accentColor || blue;

  return (
    <div id={previewId} className="bg-white rounded-lg shadow-lg overflow-hidden text-slate-800" style={{ fontFamily: "'Inter', sans-serif" }}>
      <header className="px-7 py-6 text-white flex items-start justify-between gap-4" style={{ backgroundColor: blue }}>
        <div>
          <h1 className="text-3xl font-bold">{personalInfo.name || "Your Name"}</h1>
          <p className="text-sm text-white/90 mt-1">{personalInfo.title || "Professional Title"}</p>
        </div>
        <div className="text-xs text-right space-y-1 text-white/95">
          {personalInfo.email && <p>{personalInfo.email}</p>}
          {personalInfo.phone && <p>{personalInfo.phone}</p>}
          {personalInfo.location && <p>{personalInfo.location}</p>}
          {personalInfo.linkedin && (
            <a href={ensureUrl(personalInfo.linkedin)} target="_blank" rel="noreferrer" className="underline block">
              LinkedIn
            </a>
          )}
        </div>
      </header>

      <main className="p-7 space-y-5 text-sm leading-relaxed">
        {summary && <Section title="Summary" color={activeBlue}><p className="text-slate-600">{summary}</p></Section>}

        {experience.length > 0 && (
          <Section title="Experience" color={activeBlue}>
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
          <Section title="Education" color={activeBlue}>
            {education.map((edu, index) => (
              <div key={index} className="mb-2 text-xs">
                <p className="font-semibold">{edu.degree}</p>
                <p className="text-slate-500">{edu.school}</p>
              </div>
            ))}
          </Section>
        )}

        {skills.length > 0 && (
          <Section title="Skills" color={activeBlue}>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span key={index} className="px-2 py-1 rounded text-xs" style={{ backgroundColor: `${activeBlue}14`, color: activeBlue }}>
                  {formatSkill(skill)}
                </span>
              ))}
            </div>
          </Section>
        )}

        {projects.length > 0 && (
          <Section title="Projects" color={activeBlue}>
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
