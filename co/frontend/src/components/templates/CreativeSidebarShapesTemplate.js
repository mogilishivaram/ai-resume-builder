import React from "react";
import { normalizeResumeData, formatSkill, ensureUrl } from "./templateHelpers";

export default function CreativeSidebarShapesTemplate({ resume, accentColor, previewId = "resume-preview" }) {
  const { personalInfo, summary, experience, education, skills, projects } = normalizeResumeData(resume);

  return (
    <div id={previewId} className="bg-white rounded-lg shadow-lg overflow-hidden text-slate-800" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="grid grid-cols-[1.1fr_2fr] min-h-[900px]">
        <aside className="relative p-6 text-white" style={{ backgroundColor: accentColor }}>
          <div className="absolute top-3 right-3 w-20 h-20 rounded-full bg-white/15" />
          <div className="absolute bottom-8 left-2 w-12 h-12 rotate-12 bg-white/20" />
          <div className="relative z-10">
            <h1 className="text-xl font-bold">{personalInfo.name || "Your Name"}</h1>
            <p className="text-sm mt-1 text-white/85">{personalInfo.title || "Professional Title"}</p>

            <div className="mt-5 text-xs space-y-1 text-white/90">
              {personalInfo.email && <p>{personalInfo.email}</p>}
              {personalInfo.phone && <p>{personalInfo.phone}</p>}
              {personalInfo.location && <p>{personalInfo.location}</p>}
              {personalInfo.website && <a href={ensureUrl(personalInfo.website)} target="_blank" rel="noreferrer" className="block underline">Website</a>}
              {personalInfo.linkedin && <a href={ensureUrl(personalInfo.linkedin)} target="_blank" rel="noreferrer" className="block underline">LinkedIn</a>}
            </div>

            {skills.length > 0 && (
              <section className="mt-6">
                <h2 className="text-xs uppercase tracking-[0.16em] font-semibold mb-2">Creative Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span key={index} className="text-[11px] px-2 py-1 rounded-full bg-white/20">{formatSkill(skill)}</span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </aside>

        <main className="p-6 space-y-5 text-sm">
          {summary && <Section title="Profile" accentColor={accentColor}><p className="text-slate-600">{summary}</p></Section>}

          {experience.length > 0 && (
            <Section title="Experience" accentColor={accentColor}>
              {experience.map((exp, index) => (
                <div key={index} className="mb-3 border-l-2 pl-3" style={{ borderColor: `${accentColor}88` }}>
                  <div className="flex justify-between gap-2">
                    <h3 className="font-semibold">{exp.title}</h3>
                    <span className="text-xs text-slate-400">{exp.start_date} - {exp.end_date || "Present"}</span>
                  </div>
                  <p className="text-xs text-slate-500">{exp.company}</p>
                  {Array.isArray(exp.bullets) && exp.bullets.filter(Boolean).length > 0 && (
                    <ul className="list-disc list-inside text-xs text-slate-600 mt-1">
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
                <div key={index} className="mb-3 p-3 rounded-md border" style={{ borderColor: `${accentColor}35` }}>
                  <h3 className="font-semibold">{project.name}</h3>
                  <p className="text-xs text-slate-600">{project.description}</p>
                </div>
              ))}
            </Section>
          )}

          {education.length > 0 && (
            <Section title="Education" accentColor={accentColor}>
              {education.map((edu, index) => (
                <div key={index} className="mb-2 text-xs">
                  <p className="font-semibold">{edu.degree}</p>
                  <p className="text-slate-500">{edu.school}</p>
                </div>
              ))}
            </Section>
          )}
        </main>
      </div>
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
