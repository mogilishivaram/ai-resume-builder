import React from "react";
import { normalizeResumeData, formatSkill, formatLanguage } from "./templateHelpers";

export default function CompactDenseTemplate({ resume, previewId = "resume-preview" }) {
  const { personalInfo, summary, experience, education, skills, projects, languages } = normalizeResumeData(resume);

  return (
    <div id={previewId} className="bg-white rounded-lg shadow-lg p-5 text-slate-800" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", lineHeight: 1.25 }}>
      <header className="mb-3 border-b border-slate-300 pb-2">
        <h1 className="text-base font-bold">{personalInfo.name || "Your Name"}</h1>
        <p className="text-[11px] text-slate-600">
          {[personalInfo.title, personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).join(" | ")}
        </p>
      </header>

      <main className="space-y-3">
        {summary && <Section title="Summary"><p className="text-slate-700">{summary}</p></Section>}

        {experience.length > 0 && (
          <Section title="Experience">
            {experience.map((exp, index) => (
              <div key={index} className="mb-2">
                <p className="font-semibold">{exp.title} - {exp.company}</p>
                <p className="text-slate-500">{exp.start_date} - {exp.end_date || "Present"}</p>
              </div>
            ))}
          </Section>
        )}

        {education.length > 0 && (
          <Section title="Education">
            {education.map((edu, index) => (
              <div key={index} className="mb-1">
                <p className="font-semibold">{edu.degree}</p>
                <p className="text-slate-500">{edu.school}</p>
              </div>
            ))}
          </Section>
        )}

        {projects.length > 0 && (
          <Section title="Projects">
            {projects.map((project, index) => (
              <div key={index} className="mb-1">
                <p className="font-semibold">{project.name}</p>
                <p className="text-slate-600">{project.description}</p>
              </div>
            ))}
          </Section>
        )}

        {skills.length > 0 && (
          <Section title="Skills">
            <p>{skills.map((skill) => formatSkill(skill)).filter(Boolean).join(" | ")}</p>
          </Section>
        )}

        {languages.length > 0 && (
          <Section title="Languages">
            <p>{languages.map((lang) => formatLanguage(lang)).filter(Boolean).join(" | ")}</p>
          </Section>
        )}
      </main>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <h2 className="font-bold uppercase tracking-[0.14em] mb-1 text-slate-900">{title}</h2>
      {children}
    </section>
  );
}
