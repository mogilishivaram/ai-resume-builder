import React from "react";
import { normalizeResumeData, formatSkill } from "./templateHelpers";

export default function BoldIntroTemplate({ resume, accentColor, previewId = "resume-preview" }) {
  const { personalInfo, summary, experience, education, projects, skills } = normalizeResumeData(resume);
  const yellow = "#fbbf24";
  const sectionColor = accentColor || "#1f2937";

  return (
    <div id={previewId} className="bg-white rounded-lg shadow-lg overflow-hidden text-slate-800" style={{ fontFamily: "'Inter', sans-serif" }}>
      <header className="px-7 py-7" style={{ backgroundColor: yellow }}>
        <h1 className="text-3xl font-black">Hi, I'm {personalInfo.name || "Your Name"}.</h1>
        <p className="text-sm mt-2 text-slate-800/90">{personalInfo.title || "Professional Title"}</p>
      </header>

      <main className="p-7 grid grid-cols-[1.5fr_1fr] gap-7 text-sm leading-relaxed">
        <div className="space-y-5">
          {summary && <Section title="Summary" color={sectionColor}><p className="text-slate-600">{summary}</p></Section>}

          {experience.length > 0 && (
            <Section title="Experience" color={sectionColor}>
              {experience.map((exp, index) => (
                <div key={index} className="mb-3">
                  <h3 className="font-semibold">{exp.title}</h3>
                  <p className="text-xs text-slate-500">{exp.company}</p>
                  <p className="text-xs text-slate-400">{exp.start_date} - {exp.end_date || "Present"}</p>
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
        </div>

        <div className="space-y-5">
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
                  <span key={index} className="text-xs px-2 py-1 rounded bg-slate-100">{formatSkill(skill)}</span>
                ))}
              </div>
            </Section>
          )}
        </div>
      </main>
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
