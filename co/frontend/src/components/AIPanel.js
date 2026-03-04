import React, { useState } from "react";
import { FiCpu, FiLoader, FiZap, FiList, FiFileText, FiEdit3 } from "react-icons/fi";
import {
  aiGenerateSummary,
  aiGenerateExperience,
  aiGenerateSkills,
  aiGenerateFullResume,
  aiImproveText,
} from "../services/resumeService";

export default function AIPanel({ resume, onUpdate }) {
  const [loading, setLoading] = useState(null);
  const [aiRole, setAiRole] = useState("");
  const [aiContext, setAiContext] = useState("");

  const handle = async (action) => {
    setLoading(action);
    try {
      switch (action) {
        case "summary": {
          const res = await aiGenerateSummary({
            name: resume.personal_info?.name || "",
            role: aiRole,
            experience_years: "",
            skills: (resume.skills || []).join(", "),
            context: aiContext,
          });
          onUpdate({ ...resume, summary: res.summary });
          break;
        }
        case "experience": {
          const firstExp = resume.experience?.[0] || {};
          const res = await aiGenerateExperience({
            title: firstExp.title || aiRole,
            company: firstExp.company || "",
            industry: "",
            responsibilities: "",
            context: aiContext,
          });
          if (resume.experience?.length > 0) {
            const exp = [...resume.experience];
            exp[0] = { ...exp[0], bullets: res.bullets };
            onUpdate({ ...resume, experience: exp });
          }
          break;
        }
        case "skills": {
          const res = await aiGenerateSkills({
            role: aiRole,
            industry: "",
            current_skills: (resume.skills || []).join(", "),
            level: "mid",
          });
          const allSkills = [
            ...(res.skills?.technical || []),
            ...(res.skills?.soft || []),
            ...(res.skills?.tools || []),
          ];
          if (allSkills.length > 0) {
            onUpdate({ ...resume, skills: allSkills });
          }
          break;
        }
        case "full": {
          const res = await aiGenerateFullResume({
            name: resume.personal_info?.name || "",
            email: resume.personal_info?.email || "",
            role: aiRole,
            experience_years: "",
            education: (resume.education || []).map((e) => `${e.degree} at ${e.school}`).join("; "),
            skills: (resume.skills || []).join(", "),
            work_history: (resume.experience || []).map((e) => `${e.title} at ${e.company}`).join("; "),
            context: aiContext,
          });
          const updated = { ...resume };
          if (res.summary) updated.summary = res.summary;
          if (res.experience) updated.experience = res.experience;
          if (res.skills) updated.skills = res.skills;
          if (res.projects) updated.projects = res.projects;
          onUpdate(updated);
          break;
        }
        case "improve": {
          const res = await aiImproveText({
            text: resume.summary || "",
            section: "summary",
            role: aiRole,
          });
          onUpdate({ ...resume, summary: res.text });
          break;
        }
        default:
          break;
      }
    } catch (err) {
      alert("AI generation failed. Make sure your Gemini API key is configured.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-xl p-5 border border-primary-100">
      <h3 className="text-sm font-bold text-primary-800 flex items-center gap-2 mb-4">
        <FiCpu className="text-lg" /> AI Assistant
      </h3>

      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Target Role / Job Title</label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-400"
            placeholder="e.g., Senior Frontend Developer"
            value={aiRole}
            onChange={(e) => setAiRole(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Additional Context</label>
          <textarea
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-400 resize-y min-h-[60px]"
            placeholder="Any additional details for the AI to consider..."
            value={aiContext}
            onChange={(e) => setAiContext(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <AIButton icon={<FiZap />} label="Generate Summary" loading={loading === "summary"} onClick={() => handle("summary")} />
        <AIButton icon={<FiList />} label="Generate Experience Bullets" loading={loading === "experience"} onClick={() => handle("experience")} />
        <AIButton icon={<FiList />} label="Suggest Skills" loading={loading === "skills"} onClick={() => handle("skills")} />
        <AIButton icon={<FiFileText />} label="Generate Full Resume" loading={loading === "full"} onClick={() => handle("full")} color="primary" />
        <AIButton icon={<FiEdit3 />} label="Improve Summary" loading={loading === "improve"} onClick={() => handle("improve")} />
      </div>
    </div>
  );
}

function AIButton({ icon, label, loading, onClick, color = "slate" }) {
  const base =
    color === "primary"
      ? "bg-primary-600 text-white hover:bg-primary-700"
      : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200";

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`flex items-center gap-2 w-full justify-center py-2 px-4 rounded-lg text-sm font-medium transition ${base} disabled:opacity-50`}
    >
      {loading ? <FiLoader className="animate-spin" /> : icon}
      {label}
    </button>
  );
}
