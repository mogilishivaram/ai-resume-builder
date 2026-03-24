import React from "react";
import { normalizeResumeData, getInitials, formatSkill } from "./templateHelpers";

export default function InitialsAvatarTemplate({ resume, accentColor, previewId = "resume-preview" }) {
  const { personalInfo, summary, experience, education, projects, skills } = normalizeResumeData(resume);
  const color = accentColor || "#2563eb";
  const initials = getInitials(personalInfo.name);
  const profilePhoto = personalInfo.profilePhoto;

  return (
    <div id={previewId} className="bg-white rounded-lg shadow-lg p-7 text-slate-800" style={{ fontFamily: "'Inter', sans-serif" }}>
      <header className="text-center border-b border-slate-200 pb-5 mb-5">
        {profilePhoto ? (
          <img
            src={profilePhoto}
            alt={personalInfo.name || "Profile photo"}
            className="w-24 h-24 rounded-full mx-auto object-cover border border-slate-200"
          />
        ) : (
          <div className="w-24 h-24 rounded-full mx-auto flex items-center justify-center text-3xl font-bold" style={{ backgroundColor: `${color}1e`, color }}>
            {initials}
          </div>
        )}
        <h1 className="text-2xl font-semibold mt-3">{personalInfo.name || "Your Name"}</h1>
        <p className="text-sm mt-1" style={{ color }}>{personalInfo.title || "Professional Title"}</p>
      </header>

      <main className="space-y-5 text-sm leading-relaxed">
        {summary && <Section title="Summary" color={color}><p className="text-slate-600">{summary}</p></Section>}

        {experience.length > 0 && (
          <Section title="Experience" color={color}>
            {experience.map((exp, index) => (
              <div key={index} className="mb-3">
                <h3 className="font-semibold">{exp.title}</h3>
                <p className="text-xs text-slate-500">{exp.company}</p>
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

        {projects.length > 0 && (
          <Section title="Projects" color={color}>
            {projects.map((project, index) => (
              <div key={index} className="mb-2">
                <h3 className="font-semibold">{project.name}</h3>
                <p className="text-xs text-slate-600">{project.description}</p>
              </div>
            ))}
          </Section>
        )}

        {skills.length > 0 && (
          <Section title="Skills" color={color}>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span key={index} className="text-xs px-2 py-1 rounded" style={{ backgroundColor: `${color}14`, color }}>
                  {formatSkill(skill)}
                </span>
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
