import React from "react";
import { normalizeResumeData, getInitials, formatSkill, ensureUrl } from "./templateHelpers";

export default function DarkSidebarInitialsTemplate({ resume, accentColor, previewId = "resume-preview" }) {
  const { personalInfo, summary, experience, education, skills } = normalizeResumeData(resume);
  const initials = getInitials(personalInfo.name);
  const profilePhoto = personalInfo.profilePhoto;
  const dark = "#2d2d2d";
  const color = accentColor || "#e2e8f0";

  return (
    <div id={previewId} className="bg-white rounded-lg shadow-lg overflow-hidden text-slate-800" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="grid grid-cols-[32%_68%] min-h-[900px]">
        <aside className="p-6 text-white" style={{ backgroundColor: dark }}>
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt={personalInfo.name || "Profile photo"}
              className="w-20 h-20 rounded-full border-2 border-white/70 object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full border-2 border-white/70 flex items-center justify-center text-2xl font-bold">
              {initials}
            </div>
          )}
          <h1 className="text-xl font-semibold mt-3">{personalInfo.name || "Your Name"}</h1>
          <p className="text-xs text-white/80">{personalInfo.title || "Professional Title"}</p>

          <div className="mt-4 text-xs space-y-1 text-white/85">
            {personalInfo.email && <p>{personalInfo.email}</p>}
            {personalInfo.phone && <p>{personalInfo.phone}</p>}
            {personalInfo.location && <p>{personalInfo.location}</p>}
            {personalInfo.linkedin && <a href={ensureUrl(personalInfo.linkedin)} target="_blank" rel="noreferrer" className="underline block">LinkedIn</a>}
          </div>

          {skills.length > 0 && (
            <section className="mt-5">
              <h2 className="text-[11px] uppercase tracking-[0.16em] font-semibold mb-2" style={{ color }}>Skills</h2>
              <ul className="text-xs text-white/90 space-y-1">
                {skills.map((skill, index) => (
                  <li key={index}>{formatSkill(skill)}</li>
                ))}
              </ul>
            </section>
          )}
        </aside>

        <main className="p-6 space-y-5 text-sm leading-relaxed">
          {summary && <Section title="Summary" color={color}><p className="text-slate-600">{summary}</p></Section>}

          {experience.length > 0 && (
            <Section title="Experience" color={color}>
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
            <Section title="Education" color={color}>
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

function Section({ title, color, children }) {
  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-[0.16em] mb-2" style={{ color }}>{title}</h2>
      {children}
    </section>
  );
}
