import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getResumes, createResume, deleteResume } from "../services/resumeService";
import { FiPlus, FiTrash2, FiEdit, FiFileText, FiClock, FiUpload } from "react-icons/fi";
import { TEMPLATE_REGISTRY } from "../components/templates/templateRegistry";
import ImportResumeModal from "../components/ImportResumeModal";

const LEGACY_TEMPLATE_LABELS = {
  professional: "Professional",
  modern: "Modern",
  creative: "Creative",
};

function getTemplateLabel(templateId) {
  if (!templateId) return "Classic Two-Column";
  if (LEGACY_TEMPLATE_LABELS[templateId]) return LEGACY_TEMPLATE_LABELS[templateId];

  const match = TEMPLATE_REGISTRY.find((template) => template.id === templateId);
  if (match) return match.name;

  return templateId
    .split("-")
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : ""))
    .join(" ");
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const data = await getResumes();
      setResumes(data);
    } catch (err) {
      // silently handle load error
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    setCreating(true);
    try {
      const resume = await createResume({
        title: `Resume ${resumes.length + 1}`,
        personal_info: { name: user?.name || "", email: user?.email || "" },
      });
      navigate(`/resume/${resume.id}`);
    } catch (err) {
      alert("Failed to create resume. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3000);
  };

  const mapExtractedToResumePayload = (data) => {
    const personalInfo = data?.personalInfo || {};
    const experience = Array.isArray(data?.experience)
      ? data.experience.map((item) => ({
          title: item?.jobTitle || "",
          company: item?.company || "",
          location: item?.location || "",
          start_date: item?.startDate || "",
          end_date: item?.endDate || "",
          bullets: Array.isArray(item?.bullets) ? item.bullets.filter(Boolean) : [],
        }))
      : [];

    const education = Array.isArray(data?.education)
      ? data.education.map((item) => ({
          degree: item?.degree || "",
          school: item?.institution || "",
          location: item?.location || "",
          year: item?.year || "",
          grade_type: item?.gradeType || "CGPA",
          gpa: item?.gradeValue || "",
        }))
      : [];

    const projects = Array.isArray(data?.projects)
      ? data.projects.map((item) => ({
          name: item?.name || "",
          description: item?.description || "",
          technologies: Array.isArray(item?.techStack) ? item.techStack.filter(Boolean) : [],
        }))
      : [];

    return {
      title: personalInfo?.fullName ? `${personalInfo.fullName} Resume` : `Imported Resume ${resumes.length + 1}`,
      template: "professional",
      personal_info: {
        name: personalInfo?.fullName || user?.name || "",
        email: personalInfo?.email || user?.email || "",
        phone: personalInfo?.phone || "",
        location: personalInfo?.location || "",
        linkedin: personalInfo?.linkedin || "",
        github: personalInfo?.github || "",
        website: personalInfo?.website || "",
        title: personalInfo?.professionalTitle || "",
      },
      summary: data?.summary || "",
      experience,
      education,
      skills: Array.isArray(data?.skills) ? data.skills.filter(Boolean) : [],
      projects,
      certifications: Array.isArray(data?.certifications) ? data.certifications.filter(Boolean) : [],
      languages: Array.isArray(data?.languages) ? data.languages.filter(Boolean) : [],
    };
  };

  const handleImport = async (extractedData) => {
    const payload = mapExtractedToResumePayload(extractedData);
    const resume = await createResume(payload);
    navigate(`/resume/${resume.id}`, {
      state: { importedToast: "Resume imported! Review and edit your details." },
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resume?")) return;
    try {
      await deleteResume(id);
      setResumes(resumes.filter((r) => r.id !== id));
    } catch (err) {
      alert("Failed to delete resume.");
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Welcome back, {user?.name?.split(" ")[0] || "there"} 👋
          </h1>
          <p className="text-slate-500 mt-1">Manage your resumes and create new ones.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setImportOpen(true)}
            className="flex items-center gap-2 border border-slate-300 text-slate-700 bg-white px-4 py-2.5 rounded-xl font-medium hover:border-slate-400 hover:bg-slate-50 transition"
          >
            <FiUpload /> Import Resume
          </button>
          <button
            onClick={handleCreate}
            disabled={creating}
            className="flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary-700 transition disabled:opacity-50"
          >
            <FiPlus /> {creating ? "Creating…" : "Create New Resume"}
          </button>
        </div>
      </div>

      {/* Resumes grid */}
      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading your resumes…</p>
        </div>
      ) : resumes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
          <FiFileText className="text-5xl text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">No resumes yet</h3>
          <p className="text-slate-400 mb-6">Create your first AI-powered resume in minutes.</p>
          <button
            onClick={handleCreate}
            className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-700 transition"
          >
            <FiPlus className="inline mr-1" /> Create First Resume
          </button>
          <button
            type="button"
            onClick={() => setImportOpen(true)}
            className="ml-3 border border-slate-300 text-slate-700 bg-white px-6 py-2.5 rounded-xl font-medium hover:border-slate-400 hover:bg-slate-50 transition"
          >
            <FiUpload className="inline mr-1" /> Import Resume
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-md transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                    <FiFileText className="text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">{resume.title}</h3>
                    <p className="text-xs text-slate-400">{getTemplateLabel(resume.template)} template</p>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-400 flex items-center gap-1 mb-4">
                <FiClock />
                Updated {new Date(resume.updated_at).toLocaleDateString()}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/resume/${resume.id}`)}
                  className="flex-1 flex items-center justify-center gap-1 bg-primary-50 text-primary-600 rounded-lg py-2 text-sm font-medium hover:bg-primary-100 transition"
                >
                  <FiEdit /> Edit
                </button>
                <button
                  onClick={() => handleDelete(resume.id)}
                  className="flex items-center justify-center gap-1 bg-red-50 text-red-500 rounded-lg py-2 px-3 text-sm font-medium hover:bg-red-100 transition"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}

          {/* New resume card */}
          <button
            onClick={handleCreate}
            className="border-2 border-dashed border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-primary-300 hover:text-primary-500 transition min-h-[180px]"
          >
            <FiPlus className="text-3xl" />
            <span className="font-medium">Create New Resume</span>
          </button>
        </div>
      )}
      </div>

      {importOpen && (
        <ImportResumeModal
          isOpen={importOpen}
          onClose={() => setImportOpen(false)}
          onImport={handleImport}
          token={localStorage.getItem("token")}
          showToast={showToast}
        />
      )}

      {toast && (
        <div className="fixed right-4 top-20 z-[60]">
          <div className={`rounded-lg px-4 py-3 shadow-lg border ${toast.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700"}`}>
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
        </div>
      )}
    </>
  );
}
