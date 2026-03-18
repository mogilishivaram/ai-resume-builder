import React from "react";
import { normalizeResumeData, formatSkill, ensureUrl } from "./templateHelpers";

export default function PhotoTealTemplate({ resume, accentColor, previewId = "resume-preview" }) {
  const { personalInfo, summary, experience, education, skills, projects } = normalizeResumeData(resume);
  const teal = "#0d9488";
  const sectionColor = accentColor || teal;

  return (
    <div id={previewId} className="bg-white rounded-lg shadow-lg overflow-hidden text-slate-800" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="grid grid-cols-[32%_68%] min-h-[900px]">
        <aside className="p-6 text-white" style={{ backgroundColor: teal }}>
          <div className="w-24 h-24 rounded-xl bg-white/30 border border-white/60 flex items-center justify-center text-xs text-white/90">
            Photo
          </div>
          <h1 className="text-xl font-semibold mt-3">{personalInfo.name || "Your Name"}</h1>
          <p className="text-xs text-white/90">{personalInfo.title || "Professional Title"}</p>

          <div className="mt-4 text-xs space-y-1 text-white/90">
            {personalInfo.email && <p>{personalInfo.email}</p>}
            {personalInfo.phone && <p>{personalInfo.phone}</p>}
            {personalInfo.location && <p>{personalInfo.location}</p>}
            {personalInfo.linkedin && <a href={ensureUrl(personalInfo.linkedin)} target="_blank" rel="noreferrer" className="underline block">LinkedIn</a>}
          </div>

          {skills.length > 0 && (
            <section className="mt-5">
              <h2 className="text-[11px] uppercase tracking-[0.15em] font-semibold mb-2">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span key={index} className="text-[11px] px-2 py-1 rounded bg-white/20">{formatSkill(skill)}</span>
                ))}
              </div>
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
      <h2 className="text-xs font-semibold uppercase tracking-[0.16em] mb-2" style={{ color }}>{title}</h2>
      {children}
    </section>
  );
}
