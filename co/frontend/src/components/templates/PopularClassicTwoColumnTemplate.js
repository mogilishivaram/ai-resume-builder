import React from "react";
import {
  normalizeResumeData,
  ensureUrl,
  formatSkill,
  formatLanguage,
  formatCertification,
} from "./templateHelpers";

export default function PopularClassicTwoColumnTemplate({ resume, accentColor, previewId = "resume-preview" }) {
  const {
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    languages,
  } = normalizeResumeData(resume);

  return (
    <div id={previewId} className="bg-white rounded-lg shadow-lg overflow-hidden text-slate-800" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="grid grid-cols-[1fr_2fr] min-h-[900px]">
        <aside className="p-6 border-r border-slate-200" style={{ backgroundColor: `${accentColor}14` }}>
          <h1 className="text-xl font-bold leading-tight">{personalInfo.name || "Your Name"}</h1>
          <p className="text-sm mt-1" style={{ color: accentColor }}>{personalInfo.title || "Professional Title"}</p>

          <div className="mt-5 space-y-2 text-xs text-slate-600">
            {personalInfo.email && <p>{personalInfo.email}</p>}
            {personalInfo.phone && <p>{personalInfo.phone}</p>}
            {personalInfo.location && <p>{personalInfo.location}</p>}
            {personalInfo.linkedin && <a href={ensureUrl(personalInfo.linkedin)} target="_blank" rel="noreferrer" className="block hover:underline">LinkedIn</a>}
            {personalInfo.website && <a href={ensureUrl(personalInfo.website)} target="_blank" rel="noreferrer" className="block hover:underline">Website</a>}
            {personalInfo.github && <a href={ensureUrl(personalInfo.github)} target="_blank" rel="noreferrer" className="block hover:underline">GitHub</a>}
          </div>

          {skills.length > 0 && (
            <Section title="Skills" accentColor={accentColor} compact>
              <ul className="space-y-1 text-xs text-slate-700">
                {skills.map((skill, index) => (
                  <li key={index}>{formatSkill(skill)}</li>
                ))}
              </ul>
            </Section>
          )}

          {languages.length > 0 && (
            <Section title="Languages" accentColor={accentColor} compact>
              <ul className="space-y-1 text-xs text-slate-700">
                {languages.map((lang, index) => (
                  <li key={index}>{formatLanguage(lang)}</li>
                ))}
              </ul>
            </Section>
          )}
        </aside>

        <main className="p-6 space-y-5 text-sm leading-relaxed">
          {summary && (
            <Section title="Summary" accentColor={accentColor}>
              <p className="text-slate-600">{summary}</p>
            </Section>
          )}

          {experience.length > 0 && (
            <Section title="Experience" accentColor={accentColor}>
              {experience.map((exp, index) => (
                <div key={index} className="mb-3">
                  <div className="flex justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{exp.title}</h3>
                      <p className="text-slate-500 text-xs">{exp.company}{exp.location ? ` | ${exp.location}` : ""}</p>
                    </div>
                    <span className="text-xs text-slate-400 whitespace-nowrap">{exp.start_date} - {exp.end_date || "Present"}</span>
                  </div>
                  {Array.isArray(exp.bullets) && exp.bullets.filter(Boolean).length > 0 && (
                    <ul className="mt-1 list-disc list-inside text-slate-600 text-xs space-y-0.5">
                      {exp.bullets.filter(Boolean).map((bullet, bulletIndex) => (
                        <li key={bulletIndex}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </Section>
          )}

          {education.length > 0 && (
            <Section title="Education" accentColor={accentColor}>
              {education.map((edu, index) => (
                <div key={index} className="mb-2">
                  <div className="flex justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{edu.degree}</h3>
                      <p className="text-slate-500 text-xs">{edu.school}</p>
                    </div>
                    <span className="text-xs text-slate-400">{edu.year || edu.graduation_date}</span>
                  </div>
                </div>
              ))}
            </Section>
          )}

          {projects.length > 0 && (
            <Section title="Projects" accentColor={accentColor}>
              {projects.map((project, index) => (
                <div key={index} className="mb-2">
                  <h3 className="font-semibold">{project.name}</h3>
                  <p className="text-xs text-slate-600">{project.description}</p>
                </div>
              ))}
            </Section>
          )}

          {certifications.length > 0 && (
            <Section title="Certifications" accentColor={accentColor}>
              <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                {certifications.map((cert, index) => (
                  <li key={index}>{formatCertification(cert)}</li>
                ))}
              </ul>
            </Section>
          )}
        </main>
      </div>
    </div>
  );
}

function Section({ title, accentColor, children, compact = false }) {
  return (
    <section className={compact ? "mt-5" : ""}>
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] mb-2" style={{ color: accentColor }}>
        {title}
      </h2>
      {children}
    </section>
  );
}
