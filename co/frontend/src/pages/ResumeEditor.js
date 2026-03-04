import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getResume, updateResume } from "../services/resumeService";
import ResumeForm from "../components/ResumeForm";
import ResumePreview from "../components/ResumePreview";
import AIPanel from "../components/AIPanel";
import { FiSave, FiDownload, FiArrowLeft, FiEye, FiEdit, FiLoader } from "react-icons/fi";

export default function ResumeEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [view, setView] = useState(window.innerWidth < 768 ? "form" : "split"); // form-only on mobile
  const [template, setTemplate] = useState("professional");

  useEffect(() => {
    getResume(id)
      .then((data) => {
        setResume(data);
        setTemplate(data.template || "professional");
      })
      .catch(() => navigate("/dashboard"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleSave = useCallback(async () => {
    if (!resume) return;
    setSaving(true);
    try {
      await updateResume(id, { ...resume, template });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert("Failed to save resume.");
    } finally {
      setSaving(false);
    }
  }, [id, resume, template]);

  const handleDownloadPDF = async () => {
    const el = document.getElementById("resume-preview");
    if (!el) return alert("Preview not visible. Switch to preview mode first.");

    const html2pdf = (await import("html2pdf.js")).default;
    html2pdf()
      .set({
        margin: 0,
        filename: `${resume?.title || "Resume"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      })
      .from(el)
      .save();
  };

  const handleChange = (updated) => {
    setResume(updated);
    setSaved(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!resume) return null;

  return (
    <div className="min-h-screen bg-slate-50 animate-fade-in">
      {/* Toolbar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40 no-print">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/dashboard")} className="text-slate-500 hover:text-slate-700 transition">
              <FiArrowLeft className="text-lg" />
            </button>
            <input
              type="text"
              className="text-lg font-semibold text-slate-800 border-none focus:ring-0 bg-transparent w-48 sm:w-64"
              value={resume.title || ""}
              onChange={(e) => handleChange({ ...resume, title: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Template selector */}
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 focus:ring-2 focus:ring-primary-400"
            >
              <option value="professional">Professional</option>
              <option value="modern">Modern</option>
              <option value="creative">Creative</option>
            </select>

            {/* View toggles */}
            <div className="flex border border-slate-200 rounded-lg overflow-hidden">
              <ViewBtn active={view === "form"} onClick={() => setView("form")}><FiEdit /></ViewBtn>
              <ViewBtn active={view === "split"} onClick={() => setView("split")} className="hidden md:block">Split</ViewBtn>
              <ViewBtn active={view === "preview"} onClick={() => setView("preview")}><FiEye /></ViewBtn>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
                saved
                  ? "bg-green-100 text-green-700"
                  : "bg-primary-600 text-white hover:bg-primary-700"
              } disabled:opacity-50`}
            >
              {saving ? <FiLoader className="animate-spin" /> : <FiSave />}
              {saved ? "Saved!" : "Save"}
            </button>

            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-1 bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-900 transition"
            >
              <FiDownload /> PDF
            </button>
          </div>
        </div>
      </div>

      {/* Editor content */}
      <div className="max-w-[1600px] mx-auto px-4 py-6">
        <div className={`grid gap-6 ${view === "split" ? "lg:grid-cols-2" : "grid-cols-1"}`}>
          {/* Left – Form + AI */}
          {(view === "split" || view === "form") && (
            <div className="space-y-6 overflow-y-auto" style={{ maxHeight: "calc(100vh - 180px)" }}>
              <AIPanel resume={resume} onUpdate={handleChange} />
              <ResumeForm resume={resume} onChange={handleChange} />
            </div>
          )}

          {/* Right – Preview */}
          {(view === "split" || view === "preview") && (
            <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 180px)" }}>
              <ResumePreview resume={resume} template={template} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ViewBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 text-sm font-medium transition ${
        active ? "bg-primary-600 text-white" : "text-slate-500 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}
