import React from "react";
import {
  normalizeResumeData,
  getInitials,
  ensureUrl,
  formatSkill,
  formatCertification,
} from "./templateHelpers";

export default function CreativeAvatarCardTemplate({ resume, accentColor, previewId = "resume-preview" }) {
  const { personalInfo, summary, experience, education, skills, certifications } = normalizeResumeData(resume);
  const initials = getInitials(personalInfo.name);

  return (
    <div id={previewId} className="bg-white rounded-lg shadow-lg p-7 text-slate-800" style={{ fontFamily: "'Inter', sans-serif" }}>
      <header className="grid grid-cols-[92px_1fr] gap-4 items-center border-b border-slate-200 pb-5 mb-5">
        <div className="w-[92px] h-[92px] rounded-2xl flex items-center justify-center text-2xl font-bold text-white" style={{ backgroundColor: accentColor }}>
          {initials}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{personalInfo.name || "Your Name"}</h1>
          <p className="text-sm mt-1" style={{ color: accentColor }}>{personalInfo.title || "Professional Title"}</p>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.linkedin && <a href={ensureUrl(personalInfo.linkedin)} target="_blank" rel="noreferrer" className="hover:underline">LinkedIn</a>}
          </div>
        </div>
      </header>

      <main className="space-y-5 text-sm">
        {summary && <Section title="About" accentColor={accentColor}><p className="text-slate-600">{summary}</p></Section>}

        {experience.length > 0 && (
          <Section title="Experience" accentColor={accentColor}>
            {experience.map((exp, index) => (
              <article key={index} className="mb-3 p-3 rounded-lg" style={{ backgroundColor: `${accentColor}10` }}>
                <div className="flex justify-between gap-2">
                  <h3 className="font-semibold">{exp.title}</h3>
                  <span className="text-xs text-slate-400">{exp.start_date} - {exp.end_date || "Present"}</span>
                </div>
                <p className="text-xs text-slate-500">{exp.company}</p>
                {Array.isArray(exp.bullets) && exp.bullets.filter(Boolean).length > 0 && (
                  <ul className="list-disc list-inside mt-1 text-xs text-slate-600">
                    {exp.bullets.filter(Boolean).map((bullet, bulletIndex) => (
                      <li key={bulletIndex}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </Section>
        )}

        <div className="grid grid-cols-2 gap-5">
          {education.length > 0 && (
            <Section title="Education" accentColor={accentColor}>
              {education.map((edu, index) => (
                <div key={index} className="mb-2 text-xs">
                  <p className="font-semibold">{edu.degree}</p>
                  <p className="text-slate-500">{edu.school}</p>
                  <p className="text-slate-400">{edu.year || edu.graduation_date}</p>
                </div>
              ))}
            </Section>
          )}

          <div className="space-y-4">
            {skills.length > 0 && (
              <Section title="Skills" accentColor={accentColor}>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span key={index} className="text-xs px-2 py-1 rounded-md" style={{ border: `1px solid ${accentColor}55`, color: accentColor }}>
                      {formatSkill(skill)}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {certifications.length > 0 && (
              <Section title="Certifications" accentColor={accentColor}>
                <ul className="text-xs text-slate-600 list-disc list-inside space-y-1">
                  {certifications.map((cert, index) => (
                    <li key={index}>{formatCertification(cert)}</li>
                  ))}
                </ul>
              </Section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function Section({ title, accentColor, children }) {
  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-[0.15em] mb-2" style={{ color: accentColor }}>
        {title}
      </h2>
      {children}
    </section>
  );
}
