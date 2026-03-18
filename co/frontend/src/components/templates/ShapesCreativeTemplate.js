import React from "react";
import { normalizeResumeData, formatSkill } from "./templateHelpers";

export default function ShapesCreativeTemplate({ resume, accentColor, previewId = "resume-preview" }) {
  const { personalInfo, summary, experience, education, projects, skills } = normalizeResumeData(resume);
  const sectionColor = accentColor || "#0f766e";

  return (
    <div id={previewId} className="relative bg-white rounded-lg shadow-lg overflow-hidden text-slate-800" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="absolute inset-y-0 left-0 w-16 pointer-events-none">
        <div className="absolute top-10 left-3 w-8 h-8 rounded-full" style={{ backgroundColor: "#f97316" }} />
        <div className="absolute top-28 left-1 w-12 h-4" style={{ backgroundColor: "#0f766e" }} />
        <div className="absolute top-40 left-4 w-7 h-7 rounded" style={{ backgroundColor: "#1f2937" }} />
        <div className="absolute bottom-20 left-2 w-10 h-10 rounded-full" style={{ backgroundColor: "#0ea5a4" }} />
      </div>

      <div className="pl-20 pr-7 py-7">
        <header className="mb-5 border-b border-slate-200 pb-4">
          <h1 className="text-3xl font-bold">{personalInfo.name || "Your Name"}</h1>
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
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span key={index} className="text-xs px-2 py-1 rounded" style={{ backgroundColor: `${sectionColor}16`, color: sectionColor }}>
                    {formatSkill(skill)}
                  </span>
                ))}
              </div>
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
      <h2 className="text-xs uppercase tracking-[0.16em] font-semibold mb-2" style={{ color }}>{title}</h2>
      {children}
    </section>
  );
}
