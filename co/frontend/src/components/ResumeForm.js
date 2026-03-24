import React, { useRef, useState } from "react";
import { FiPlus, FiTrash2, FiChevronDown, FiChevronUp, FiZap, FiX } from "react-icons/fi";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import api from "../services/api";

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "YN";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ""}${parts[parts.length - 1][0] || ""}`.toUpperCase();
}

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

const getCroppedImage = (image, crop) => {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = 400;
  canvas.height = 400;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Unable to process selected image.");
  }

  const cropX = crop.unit === "%" ? (crop.x / 100) * image.width : crop.x;
  const cropY = crop.unit === "%" ? (crop.y / 100) * image.height : crop.y;
  const cropWidth = crop.unit === "%" ? (crop.width / 100) * image.width : crop.width;
  const cropHeight = crop.unit === "%" ? (crop.height / 100) * image.height : crop.height;

  ctx.drawImage(
    image,
    cropX * scaleX,
    cropY * scaleY,
    cropWidth * scaleX,
    cropHeight * scaleY,
    0,
    0,
    400,
    400
  );
  return canvas.toDataURL("image/jpeg", 0.85);
};

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Unable to read selected file."));
    reader.readAsDataURL(file);
  });
}

export default function ResumeForm({ resume, onChange }) {
  const [openSection, setOpenSection] = useState("personal");
  const [photoError, setPhotoError] = useState("");
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState("");
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [applyingCrop, setApplyingCrop] = useState(false);
  const fileInputRef = useRef(null);
  const cropImageRef = useRef(null);
  const pinchDistanceRef = useRef(null);

  const toggle = (key) => setOpenSection(openSection === key ? null : key);

  const update = (field, value) => onChange({ ...resume, [field]: value });

  const updatePersonal = (key, value) =>
    update("personal_info", { ...resume.personal_info, [key]: value });

  const updateListItem = (field, index, key, value) => {
    const list = [...(resume[field] || [])];
    list[index] = { ...list[index], [key]: value };
    update(field, list);
  };

  const addListItem = (field, template) => {
    update(field, [...(resume[field] || []), template]);
  };

  const removeListItem = (field, index) => {
    const list = [...(resume[field] || [])];
    list.splice(index, 1);
    update(field, list);
  };

  const handlePickPhoto = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPhotoError("");
    try {
      const imageDataUrl = await fileToDataUrl(file);
      setSelectedImageSrc(imageDataUrl);
      setCropModalOpen(true);
      setCrop(undefined);
      setCompletedCrop(null);
      setZoom(1);
    } catch (error) {
      setPhotoError(error.message || "Unable to process image.");
    } finally {
      event.target.value = "";
    }
  };

  const handleCancelCrop = () => {
    setCropModalOpen(false);
    setSelectedImageSrc("");
    setCrop(undefined);
    setCompletedCrop(null);
    setZoom(1);
    pinchDistanceRef.current = null;
  };

  const handleApplyCrop = async () => {
    if (!cropImageRef.current || !completedCrop) {
      setPhotoError("Please select a crop area first.");
      return;
    }

    setApplyingCrop(true);
    setPhotoError("");
    try {
      const croppedPhoto = getCroppedImage(cropImageRef.current, completedCrop);
      updatePersonal("profilePhoto", croppedPhoto);
      handleCancelCrop();
    } catch (error) {
      setPhotoError(error.message || "Unable to process image.");
    } finally {
      setApplyingCrop(false);
    }
  };

  const handleCropImageLoad = (event) => {
    const { width, height } = event.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));
  };

  const handleZoomChange = (nextZoom) => {
    const clamped = Math.min(3, Math.max(1, nextZoom));
    setZoom(clamped);
  };

  const handleCropWheel = (event) => {
    event.preventDefault();
    const delta = event.deltaY < 0 ? 0.08 : -0.08;
    handleZoomChange(zoom + delta);
  };

  const distanceBetweenTouches = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (event) => {
    if (event.touches.length === 2) {
      pinchDistanceRef.current = distanceBetweenTouches(event.touches);
    }
  };

  const handleTouchMove = (event) => {
    if (event.touches.length !== 2 || !pinchDistanceRef.current) return;
    event.preventDefault();
    const currentDistance = distanceBetweenTouches(event.touches);
    const delta = currentDistance - pinchDistanceRef.current;
    if (Math.abs(delta) > 2) {
      handleZoomChange(zoom + (delta > 0 ? 0.03 : -0.03));
      pinchDistanceRef.current = currentDistance;
    }
  };

  const handleTouchEnd = (event) => {
    if (event.touches.length < 2) {
      pinchDistanceRef.current = null;
    }
  };

  const handleRemovePhoto = () => {
    updatePersonal("profilePhoto", "");
    setPhotoError("");
  };

  const profilePhoto = resume.personal_info?.profilePhoto || "";
  const profileInitials = getInitials(resume.personal_info?.name || "");

  return (
    <div className="space-y-3">
      {/* PERSONAL INFO */}
      <Accordion title="Personal Information" open={openSection === "personal"} onToggle={() => toggle("personal")}>
        <div className="mb-4 flex items-center gap-4">
          <div className="relative w-24 h-24">
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-semibold text-xl">
                {profileInitials}
              </div>
            )}

            <button
              type="button"
              onClick={handlePickPhoto}
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center border-2 border-white shadow-sm hover:bg-primary-700 transition"
              aria-label="Add profile photo"
              title="Add profile photo"
            >
              <FiPlus />
            </button>

            {profilePhoto && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white text-slate-600 border border-slate-200 flex items-center justify-center shadow-sm hover:text-red-500 transition"
                aria-label="Remove profile photo"
                title="Remove profile photo"
              >
                <FiX />
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700">Profile Photo</p>
            <p className="text-xs text-slate-500">Tap/click + to upload. Images are resized to max 400 x 400 px.</p>
            {photoError && <p className="text-xs text-red-500 mt-1">{photoError}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input label="Full Name" value={resume.personal_info?.name || ""} onChange={(v) => updatePersonal("name", v)} />
          <Input label="Professional Title" value={resume.personal_info?.title || ""} onChange={(v) => updatePersonal("title", v)} />
          <Input label="Email" value={resume.personal_info?.email || ""} onChange={(v) => updatePersonal("email", v)} />
          <Input label="Phone" value={resume.personal_info?.phone || ""} onChange={(v) => updatePersonal("phone", v)} />
          <Input label="Location" value={resume.personal_info?.location || ""} onChange={(v) => updatePersonal("location", v)} />
          <Input label="LinkedIn URL" value={resume.personal_info?.linkedin || ""} onChange={(v) => updatePersonal("linkedin", v)} />
          <Input label="Website" value={resume.personal_info?.website || ""} onChange={(v) => updatePersonal("website", v)} />
          <Input label="GitHub" value={resume.personal_info?.github || ""} onChange={(v) => updatePersonal("github", v)} />
        </div>
      </Accordion>

      {/* SUMMARY */}
      <Accordion title="Professional Summary" open={openSection === "summary"} onToggle={() => toggle("summary")}>
        <textarea
          className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary-400 focus:border-transparent resize-y min-h-[100px]"
          placeholder="Write a compelling summary of your professional background..."
          value={resume.summary || ""}
          onChange={(e) => update("summary", e.target.value)}
        />
        <AiGrammarButton
          text={resume.summary || ""}
          onResult={(improved) => update("summary", improved)}
        />
      </Accordion>

      {/* EXPERIENCE */}
      <Accordion title="Work Experience" open={openSection === "experience"} onToggle={() => toggle("experience")}>
        {(resume.experience || []).map((exp, i) => (
          <div key={i} className="border border-slate-100 rounded-lg p-4 mb-3 bg-slate-50 relative animate-fade-in">
            <button
              className="absolute top-2 right-2 text-red-400 hover:text-red-600 transition"
              onClick={() => removeListItem("experience", i)}
            >
              <FiTrash2 />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input label="Job Title" value={exp.title || ""} onChange={(v) => updateListItem("experience", i, "title", v)} />
              <Input label="Company" value={exp.company || ""} onChange={(v) => updateListItem("experience", i, "company", v)} />
              <Input label="Location" value={exp.location || ""} onChange={(v) => updateListItem("experience", i, "location", v)} />
              <Input label="Start Date" value={exp.start_date || ""} onChange={(v) => updateListItem("experience", i, "start_date", v)} />
              <Input label="End Date" value={exp.end_date || ""} onChange={(v) => updateListItem("experience", i, "end_date", v)} placeholder="Present" />
            </div>
            <div className="mt-3">
              <label className="block text-xs font-medium text-slate-500 mb-1">Bullet Points (one per line)</label>
              <textarea
                className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary-400 resize-y min-h-[80px]"
                value={(exp.bullets || []).join("\n")}
                onChange={(e) => updateListItem("experience", i, "bullets", e.target.value.split("\n"))}
              />
            </div>
          </div>
        ))}
        <AddButton label="Add Experience" onClick={() => addListItem("experience", { title: "", company: "", location: "", start_date: "", end_date: "", bullets: [] })} />
      </Accordion>

      {/* EDUCATION */}
      <Accordion title="Education" open={openSection === "education"} onToggle={() => toggle("education")}>
        {(resume.education || []).map((edu, i) => (
          <div key={i} className="border border-slate-100 rounded-lg p-4 mb-3 bg-slate-50 relative animate-fade-in">
            <button className="absolute top-2 right-2 text-red-400 hover:text-red-600" onClick={() => removeListItem("education", i)}><FiTrash2 /></button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input label="Degree" value={edu.degree || ""} onChange={(v) => updateListItem("education", i, "degree", v)} />
              <Input label="School" value={edu.school || ""} onChange={(v) => updateListItem("education", i, "school", v)} />
              <Input label="Location" value={edu.location || ""} onChange={(v) => updateListItem("education", i, "location", v)} />
              <Input label="Year" value={edu.year || ""} onChange={(v) => updateListItem("education", i, "year", v)} />
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Grade Type</label>
                <select
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-white"
                  value={edu.grade_type || "CGPA"}
                  onChange={(e) => updateListItem("education", i, "grade_type", e.target.value)}
                >
                  <option value="CGPA">CGPA</option>
                  <option value="GPA">GPA</option>
                  <option value="Percentage">Percentage</option>
                  <option value="Marks">Marks</option>
                </select>
              </div>
              <Input label={`${edu.grade_type || "CGPA"} Value`} value={edu.gpa || ""} onChange={(v) => updateListItem("education", i, "gpa", v)} />
            </div>
          </div>
        ))}
        <AddButton label="Add Education" onClick={() => addListItem("education", { degree: "", school: "", location: "", year: "", gpa: "", grade_type: "CGPA" })} />
      </Accordion>

      {/* SKILLS */}
      <Accordion title="Skills" open={openSection === "skills"} onToggle={() => toggle("skills")}>
        <TagInput
          tags={resume.skills || []}
          onChange={(tags) => update("skills", tags)}
          placeholder="Type a skill and press Enter or comma to add…"
        />
      </Accordion>

      {/* PROJECTS */}
      <Accordion title="Projects" open={openSection === "projects"} onToggle={() => toggle("projects")}>
        {(resume.projects || []).map((proj, i) => (
          <div key={i} className="border border-slate-100 rounded-lg p-4 mb-3 bg-slate-50 relative animate-fade-in">
            <button className="absolute top-2 right-2 text-red-400 hover:text-red-600" onClick={() => removeListItem("projects", i)}><FiTrash2 /></button>
            <div className="grid grid-cols-1 gap-3">
              <Input label="Project Name" value={proj.name || ""} onChange={(v) => updateListItem("projects", i, "name", v)} />
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                <textarea
                  className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary-400 resize-y min-h-[60px]"
                  value={proj.description || ""}
                  onChange={(e) => updateListItem("projects", i, "description", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Technologies</label>
                <TagInput
                  tags={proj.technologies || []}
                  onChange={(tags) => updateListItem("projects", i, "technologies", tags)}
                  placeholder="Type a technology and press Enter or comma…"
                />
              </div>
            </div>
          </div>
        ))}
        <AddButton label="Add Project" onClick={() => addListItem("projects", { name: "", description: "", technologies: [] })} />
      </Accordion>

      {/* CERTIFICATIONS */}
      <Accordion title="Certifications" open={openSection === "certifications"} onToggle={() => toggle("certifications")}>
        <textarea
          className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary-400 resize-y min-h-[60px]"
          placeholder="Enter certifications, one per line"
          value={(resume.certifications || []).join("\n")}
          onChange={(e) => update("certifications", e.target.value.split("\n").filter(Boolean))}
        />
      </Accordion>

      {/* LANGUAGES */}
      <Accordion title="Languages" open={openSection === "languages"} onToggle={() => toggle("languages")}>
        <textarea
          className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary-400 resize-y min-h-[60px]"
          placeholder="Enter languages, one per line (e.g., English - Native)"
          value={(resume.languages || []).join("\n")}
          onChange={(e) => update("languages", e.target.value.split("\n").filter(Boolean))}
        />
      </Accordion>

      {cropModalOpen && (
        <div className="fixed inset-0 z-[70] bg-slate-950/80 flex items-center justify-center p-0 sm:p-4">
          <div className="w-full h-full bg-slate-900 text-white flex flex-col sm:h-auto sm:max-w-[500px] sm:rounded-2xl sm:border sm:border-white/10 sm:shadow-2xl">
            <style>{`.profile-photo-crop .ReactCrop__crop-selection{border:2px solid #fff;}`}</style>

            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <h3 className="text-base font-semibold">Crop Profile Photo</h3>
              <button
                type="button"
                onClick={handleCancelCrop}
                className="w-8 h-8 rounded-md hover:bg-white/10 transition"
                aria-label="Close crop modal"
              >
                <FiX className="mx-auto" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-hidden">
              <div
                className="profile-photo-crop h-full min-h-[320px] rounded-xl bg-black/40 border border-white/10 flex items-center justify-center overflow-auto touch-none"
                onWheel={handleCropWheel}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {selectedImageSrc && (
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(pixelCrop) => setCompletedCrop(pixelCrop)}
                    aspect={1}
                    circularCrop
                    keepSelection
                  >
                    <img
                      ref={cropImageRef}
                      src={selectedImageSrc}
                      alt="Crop source"
                      onLoad={handleCropImageLoad}
                      style={{
                        width: `${Math.round(zoom * 100)}%`,
                        maxWidth: "none",
                        display: "block",
                      }}
                    />
                  </ReactCrop>
                )}
              </div>

              <div className="mt-3">
                <label className="block text-xs text-white/80 mb-1">Zoom</label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.01}
                  value={zoom}
                  onChange={(e) => handleZoomChange(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <div className="px-4 py-3 border-t border-white/10 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleCancelCrop}
                className="px-4 py-2 rounded-lg border border-white/20 text-white/90 hover:bg-white/10 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyCrop}
                disabled={applyingCrop}
                className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition disabled:opacity-50"
              >
                {applyingCrop ? "Applying..." : "Apply Crop"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---- tiny sub-components ---- */

function Accordion({ title, open, onToggle, children }) {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      <button
        className="w-full flex justify-between items-center px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
        onClick={onToggle}
      >
        {title}
        {open ? <FiChevronUp /> : <FiChevronDown />}
      </button>
      {open && <div className="px-5 pb-4">{children}</div>}
    </div>
  );
}

function Input({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      <input
        type="text"
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-400 focus:border-transparent"
        value={value}
        placeholder={placeholder || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function AiGrammarButton({ text, onResult }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheck = async () => {
    if (!text || !text.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/api/ai/improve-text", {
        text,
        instruction: "Fix all spelling mistakes, grammar errors, and improve clarity. Keep the same meaning and tone. Return only the corrected text.",
      });
      if (res.data?.text) onResult(res.data.text);
    } catch (e) {
      setError("AI check failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2 flex items-center gap-2">
      <button
        type="button"
        onClick={handleCheck}
        disabled={loading || !text?.trim()}
        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FiZap className={loading ? "animate-spin" : ""} />
        {loading ? "Checking…" : "AI Spell & Grammar Check"}
      </button>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

function TagInput({ tags, onChange, placeholder }) {
  const [input, setInput] = React.useState("");

  const addTag = (raw) => {
    const tag = raw.trim();
    if (tag && !tags.includes(tag)) onChange([...tags, tag]);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input && tags.length) {
      onChange(tags.slice(0, -1));
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    if (val.includes(",")) {
      val.split(",").forEach((part) => {
        const t = part.trim();
        if (t && !tags.includes(t)) tags = [...tags, t];
      });
      onChange(tags);
      setInput("");
    } else {
      setInput(val);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 border border-slate-200 rounded-lg p-2 focus-within:ring-2 focus-within:ring-primary-400 bg-white">
      {tags.map((tag, i) => (
        <span key={i} className="inline-flex items-center gap-1 bg-primary-50 text-primary-700 text-xs font-medium px-2.5 py-1 rounded-full">
          {tag}
          <button type="button" onClick={() => onChange(tags.filter((_, j) => j !== i))} className="hover:text-red-500 transition text-xs leading-none">&times;</button>
        </span>
      ))}
      <input
        type="text"
        className="flex-1 min-w-[120px] border-none outline-none text-sm p-1"
        placeholder={tags.length === 0 ? placeholder : ""}
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={() => { if (input.trim()) addTag(input); }}
      />
    </div>
  );
}

function AddButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium transition"
    >
      <FiPlus /> {label}
    </button>
  );
}
