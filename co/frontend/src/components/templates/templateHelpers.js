export function normalizeResumeData(resume) {
  const {
    personal_info = {},
    summary = "",
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    languages = [],
  } = resume || {};

  return {
    personalInfo: personal_info,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    languages,
  };
}

export function ensureUrl(url) {
  if (!url) return "";
  return url.startsWith("http") ? url : `https://${url}`;
}

export function formatSkill(skill) {
  return typeof skill === "string" ? skill : skill?.name || "";
}

export function formatLanguage(lang) {
  return typeof lang === "string" ? lang : `${lang?.name || ""}${lang?.level ? ` (${lang.level})` : ""}`;
}

export function formatCertification(cert) {
  if (typeof cert === "string") return cert;
  return `${cert?.name || ""}${cert?.issuer ? ` - ${cert.issuer}` : ""}`;
}

export function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "YN";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ""}${parts[parts.length - 1][0] || ""}`.toUpperCase();
}
