import React from "react";
import { normalizeResumeData, formatSkill } from "./templateHelpers";

export default function ThreeColumnSkillsTemplate({ resume, accentColor, previewId = "resume-preview" }) {
  const { personalInfo, summary, experience, education, projects, skills } = normalizeResumeData(resume);
  const sectionColor = accentColor || "#1e3a8a";

  return (
    <div id={previewId} className="bg-white rounded-lg shadow-lg p-7 text-slate-800" style={{ fontFamily: "'Inter', sans-serif" }}>
      <header className="border-b border-slate-200 pb-4 mb-5">
        <h1 className="text-3xl font-semibold">{personalInfo.name || "Your Name"}</h1>
        <p className="text-sm mt-1" style={{ color: sectionColor }}>{personalInfo.title || "Professional Title"}</p>
      </header>

      <main className="space-y-5 text-sm leading-relaxed">
        {summary && <Section title="Summary" color={sectionColor}><p className="text-slate-600">{summary}</p></Section>}

        {experience.length > 0 && (
          <Section title="Experience" color={sectionColor}>
            {experience.map((exp, index) => (
              <div key={index} className="mb-3">
                <h3 className="font-semibold">{exp.title}</h3>
                <p className="text-xs text-slate-500">{exp.company}</p>
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

        {skills.length > 0 && (
          <Section title="Skills" color={sectionColor}>
            <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-xs text-slate-700">
              {skills.map((skill, index) => (
                <span key={index}>{formatSkill(skill)}</span>
              ))}
            </div>
          </Section>
        )}
      </main>
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
