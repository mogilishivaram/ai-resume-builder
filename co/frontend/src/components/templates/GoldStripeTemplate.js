import React from "react";
import { normalizeResumeData, ensureUrl, formatSkill } from "./templateHelpers";

export default function GoldStripeTemplate({ resume, accentColor, previewId = "resume-preview" }) {
  const { personalInfo, summary, experience, education, skills, projects, languages } = normalizeResumeData(resume);
  const gold = "#c9a84c";
  const activeGold = accentColor || gold;

  return (
    <div id={previewId} className="bg-white rounded-lg shadow-lg overflow-hidden text-slate-900" style={{ fontFamily: "'Inter', sans-serif", borderTop: `4px solid ${gold}` }}>
      <header className="px-7 pt-6 pb-4 text-center border-b border-slate-200">
        <h1 className="text-3xl font-bold tracking-[0.08em] uppercase">{(personalInfo.name || "Your Name").toUpperCase()}</h1>
        <p className="text-xs mt-2 text-slate-600">
          {[personalInfo.title, personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).join(" | ")}
        </p>
        {personalInfo.linkedin && (
          <a href={ensureUrl(personalInfo.linkedin)} target="_blank" rel="noreferrer" className="text-xs text-slate-500 underline mt-1 inline-block">
            LinkedIn
          </a>
        )}
      </header>

      <main className="p-7 space-y-5 text-sm leading-relaxed">
        {summary && <Section title="Summary" gold={activeGold}><p className="text-slate-700">{summary}</p></Section>}

        {experience.length > 0 && (
          <Section title="Experience" gold={activeGold}>
            {experience.map((exp, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{exp.title}</h3>
                    <p className="text-xs text-slate-500">{exp.company}</p>
                  </div>
                  <span className="text-xs text-slate-500">{exp.start_date} - {exp.end_date || "Present"}</span>
                </div>
                {Array.isArray(exp.bullets) && exp.bullets.filter(Boolean).length > 0 && (
                  <ul className="list-disc list-inside mt-1 text-xs text-slate-600 space-y-1">
                    {exp.bullets.filter(Boolean).map((bullet, bIndex) => (
                      <li key={bIndex}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </Section>
        )}

        <div className="grid grid-cols-2 gap-6">
          {education.length > 0 && (
            <Section title="Education" gold={activeGold}>
              {education.map((edu, index) => (
                <div key={index} className="mb-2 text-xs">
                  <p className="font-semibold">{edu.degree}</p>
                  <p className="text-slate-500">{edu.school}</p>
                </div>
              ))}
            </Section>
          )}

          {skills.length > 0 && (
            <Section title="Skills" gold={activeGold}>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-slate-700">
                {skills.map((skill, index) => (
                  <span key={index}>{formatSkill(skill)}</span>
                ))}
              </div>
            </Section>
          )}
        </div>

        {projects.length > 0 && (
          <Section title="Projects" gold={activeGold}>
            {projects.map((project, index) => (
              <div key={index} className="mb-2 text-xs">
                <h3 className="font-semibold">{project.name}</h3>
                <p>{project.description}</p>
              </div>
            ))}
          </Section>
        )}

        {languages.length > 0 && (
          <Section title="Languages" gold={activeGold}>
            <p className="text-xs text-slate-700">{languages.map((lang) => (typeof lang === "string" ? lang : lang?.name)).filter(Boolean).join(" | ")}</p>
          </Section>
        )}
      </main>
    </div>
  );
}

function Section({ title, gold, children }) {
  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-[0.16em] mb-2 text-black border-b pb-1" style={{ borderColor: gold }}>
        {title}
      </h2>
      {children}
    </section>
  );
}
