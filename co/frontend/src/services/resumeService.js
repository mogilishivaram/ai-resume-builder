import api from "./api";

// ---------- Resume CRUD ----------

export const getResumes = () => api.get("/api/resumes").then((r) => r.data);

export const getResume = (id) => api.get(`/api/resumes/${id}`).then((r) => r.data);

export const createResume = (data = {}) =>
  api.post("/api/resumes", data).then((r) => r.data);

export const updateResume = (id, data) =>
  api.put(`/api/resumes/${id}`, data).then((r) => r.data);

export const deleteResume = (id) =>
  api.delete(`/api/resumes/${id}`).then((r) => r.data);

// ---------- AI Generation ----------

export const aiGenerateSummary = (data) =>
  api.post("/api/ai/generate-summary", data).then((r) => r.data);

export const aiGenerateExperience = (data) =>
  api.post("/api/ai/generate-experience", data).then((r) => r.data);

export const aiGenerateSkills = (data) =>
  api.post("/api/ai/generate-skills", data).then((r) => r.data);

export const aiGenerateFullResume = (data) =>
  api.post("/api/ai/generate-full-resume", data).then((r) => r.data);

export const aiImproveText = (data) =>
  api.post("/api/ai/improve-text", data).then((r) => r.data);
