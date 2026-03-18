import React from "react";
import { normalizeResumeData, ensureUrl, formatCertification } from "./templateHelpers";

export default function ClassicTraditionalSerifTemplate({ resume, accentColor, previewId = "resume-preview" }) {
  const { personalInfo, summary, experience, education, projects, certifications } = normalizeResumeData(resume);

  return (
    <div id={previewId} className="bg-white rounded-lg shadow-lg p-8 text-slate-800" style={{ fontFamily: "'Merriweather', serif" }}>
      <header className="text-center border-b pb-5 mb-5" style={{ borderColor: `${accentColor}55` }}>
        <h1 className="text-3xl font-bold tracking-tight">{personalInfo.name || "Your Name"}</h1>
        <p className="text-sm mt-1" style={{ color: accentColor }}>{personalInfo.title || "Professional Title"}</p>
        <p className="text-xs text-slate-500 mt-2">
          {[personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).join(" | ")}
        </p>
        <div className="mt-1 text-xs text-slate-500 space-x-3">
          {personalInfo.linkedin && <a href={ensureUrl(personalInfo.linkedin)} target="_blank" rel="noreferrer" className="underline">LinkedIn</a>}
          {personalInfo.website && <a href={ensureUrl(personalInfo.website)} target="_blank" rel="noreferrer" className="underline">Website</a>}
        </div>
      </header>

      <main className="space-y-5 text-sm leading-relaxed">
        {summary && <Section title="Professional Summary" accentColor={accentColor}><p className="text-slate-700">{summary}</p></Section>}

        {experience.length > 0 && (
          <Section title="Experience" accentColor={accentColor}>
            {experience.map((exp, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{exp.title}</h3>
                    <p className="text-xs text-slate-600">{exp.company}</p>
                  </div>
                  <span className="text-xs text-slate-500">{exp.start_date} - {exp.end_date || "Present"}</span>
                </div>
                {Array.isArray(exp.bullets) && exp.bullets.filter(Boolean).length > 0 && (
                  <ul className="list-disc list-inside text-xs text-slate-700 mt-1 space-y-1">
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
              <div key={index} className="mb-2 text-xs">
                <p className="font-semibold">{edu.degree}</p>
                <p>{edu.school}</p>
                <p className="text-slate-500">{edu.year || edu.graduation_date}</p>
              </div>
            ))}
          </Section>
        )}

        {projects.length > 0 && (
          <Section title="Projects" accentColor={accentColor}>
            {projects.map((project, index) => (
              <div key={index} className="mb-2 text-xs">
                <p className="font-semibold">{project.name}</p>
                <p>{project.description}</p>
              </div>
            ))}
          </Section>
        )}

        {certifications.length > 0 && (
          <Section title="Certifications" accentColor={accentColor}>
            <ul className="list-disc list-inside text-xs space-y-1">
              {certifications.map((cert, index) => (
                <li key={index}>{formatCertification(cert)}</li>
              ))}
            </ul>
          </Section>
        )}
      </main>
    </div>
  );
}

function Section({ title, accentColor, children }) {
  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-[0.14em] border-b pb-1 mb-2" style={{ color: accentColor, borderColor: `${accentColor}55` }}>
        {title}
      </h2>
      {children}
    </section>
  );
}
