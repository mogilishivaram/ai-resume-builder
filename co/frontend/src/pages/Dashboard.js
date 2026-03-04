import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getResumes, createResume, deleteResume } from "../services/resumeService";
import { FiPlus, FiTrash2, FiEdit, FiFileText, FiClock } from "react-icons/fi";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

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
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Welcome back, {user?.name?.split(" ")[0] || "there"} 👋
          </h1>
          <p className="text-slate-500 mt-1">Manage your resumes and create new ones.</p>
        </div>
        <button
          onClick={handleCreate}
          disabled={creating}
          className="mt-4 sm:mt-0 flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary-700 transition disabled:opacity-50"
        >
          <FiPlus /> {creating ? "Creating…" : "New Resume"}
        </button>
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
                    <p className="text-xs text-slate-400 capitalize">{resume.template} template</p>
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
  );
}
