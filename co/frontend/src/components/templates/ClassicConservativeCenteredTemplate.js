import React from "react";
import { normalizeResumeData, ensureUrl, formatLanguage } from "./templateHelpers";

export default function ClassicConservativeCenteredTemplate({ resume, accentColor, previewId = "resume-preview" }) {
  const { personalInfo, summary, experience, education, skills, languages } = normalizeResumeData(resume);

  return (
    <div id={previewId} className="bg-white rounded-lg shadow-lg p-8 text-slate-800" style={{ fontFamily: "'Merriweather', serif" }}>
      <header className="text-center pb-4 mb-5 border-b border-slate-300">
        <h1 className="text-[30px] font-bold">{personalInfo.name || "Your Name"}</h1>
        <p className="text-sm mt-1" style={{ color: accentColor }}>{personalInfo.title || "Professional Title"}</p>
        <p className="text-xs text-slate-600 mt-2">
          {[personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).join(" | ")}
        </p>
        <div className="mt-1 text-xs text-slate-600 space-x-3">
          {personalInfo.linkedin && <a href={ensureUrl(personalInfo.linkedin)} target="_blank" rel="noreferrer" className="underline">LinkedIn</a>}
          {personalInfo.github && <a href={ensureUrl(personalInfo.github)} target="_blank" rel="noreferrer" className="underline">GitHub</a>}
        </div>
      </header>

      <main className="space-y-5 text-sm leading-relaxed">
        {summary && <Section title="Summary" accentColor={accentColor}><p className="text-slate-700">{summary}</p></Section>}

        {experience.length > 0 && (
          <Section title="Experience" accentColor={accentColor}>
            {experience.map((exp, index) => (
              <div key={index} className="mb-3">
                <h3 className="font-semibold">{exp.title}</h3>
                <p className="text-xs text-slate-600">{exp.company}{exp.location ? ` | ${exp.location}` : ""}</p>
                <p className="text-xs text-slate-500">{exp.start_date} - {exp.end_date || "Present"}</p>
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

        <div className="grid grid-cols-2 gap-6">
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

          <div className="space-y-4">
            {skills.length > 0 && (
              <Section title="Core Skills" accentColor={accentColor}>
                <ul className="text-xs space-y-1 text-slate-700">
                  {skills.map((skill, index) => (
                    <li key={index}>{typeof skill === "string" ? skill : skill?.name}</li>
                  ))}
                </ul>
              </Section>
            )}

            {languages.length > 0 && (
              <Section title="Languages" accentColor={accentColor}>
                <ul className="text-xs space-y-1 text-slate-700">
                  {languages.map((lang, index) => (
                    <li key={index}>{formatLanguage(lang)}</li>
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
      <h2 className="text-sm font-semibold uppercase tracking-[0.14em] border-b border-slate-300 pb-1 mb-2" style={{ color: accentColor }}>
        {title}
      </h2>
      {children}
    </section>
  );
}
