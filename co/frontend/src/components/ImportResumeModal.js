import React, { useMemo, useRef, useState } from "react";
import { FiUploadCloud, FiX, FiFileText, FiImage, FiLoader } from "react-icons/fi";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const toBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result.split(",")[1]);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

const getMediaType = (file) => {
  if (file.type === "application/pdf") return "application/pdf";
  if (file.type === "image/png") return "image/png";
  if (file.type === "image/webp") return "image/webp";
  return "image/jpeg";
};

function isSupportedFile(file) {
  if (!file) return false;
  const type = (file.type || "").toLowerCase();
  if (type === "application/pdf") return true;
  return ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(type);
}

function formatSize(bytes = 0) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getFileIcon(file) {
  if (!file) return <FiFileText className="text-slate-500" />;
  if ((file.type || "").toLowerCase() === "application/pdf") {
    return <FiFileText className="text-red-500" />;
  }
  return <FiImage className="text-emerald-500" />;
}

export default function ImportResumeModal({ isOpen, onClose, onImport, token, showToast }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const canExtract = useMemo(() => !!file && !loading, [file, loading]);

  if (!isOpen) return null;

  const resetAndClose = () => {
    setFile(null);
    setLoading(false);
    setError("");
    setDragActive(false);
    onClose?.();
  };

  const validateAndSetFile = (selected) => {
    if (!selected) {
      setError("Please select a file first");
      return;
    }
    if (!isSupportedFile(selected)) {
      setError("Only PDF, JPG, PNG and WEBP files are supported");
      setFile(null);
      return;
    }
    if (selected.size > MAX_FILE_SIZE) {
      setError("File too large. Maximum size is 10MB");
      setFile(null);
      return;
    }
    setError("");
    setFile(selected);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const selected = event.target.files?.[0];
    validateAndSetFile(selected);
    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    const selected = event.dataTransfer?.files?.[0];
    validateAndSetFile(selected);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  };

  const handleExtract = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const base64 = await toBase64(file);
      const mediaType = getMediaType(file);
      const response = await fetch(`${API_URL}/api/resume/extract`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fileData: base64, mediaType }),
      });

      const result = await response.json();
      if (result.success) {
        await onImport?.(result.data);
        resetAndClose();
        showToast?.("Resume imported! Review and edit your details.", "success");
      } else {
        if (response.status === 422 && (result.error || "").toLowerCase().includes("read resume")) {
          setError("Could not read resume. Please try a higher quality image");
        } else if (response.status === 422) {
          setError("AI could not extract data. Try a clearer scan or PDF");
        } else {
          setError(result.error || "Could not extract data. Try a clearer image or PDF.");
        }
      }
    } catch (err) {
      const message = String(err?.message || "").toLowerCase();
      const isNetworkError = err instanceof TypeError || message.includes("network") || message.includes("failed to fetch");
      if (isNetworkError) {
        setError("Connection failed. Check your internet and try again");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 no-print">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/60"
        aria-label="Close import modal"
        onClick={resetAndClose}
      />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-2xl p-6">
        <button
          type="button"
          onClick={resetAndClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          aria-label="Close"
        >
          <FiX className="mx-auto" />
        </button>

        <h2 className="text-xl font-semibold text-slate-800">Import Existing Resume</h2>
        <p className="text-sm text-slate-500 mt-1">Upload a PDF or screenshot - AI will auto-fill your details</p>

        <button
          type="button"
          onClick={handleBrowseClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`mt-5 w-full rounded-xl border-2 border-dashed p-10 text-center transition ${
            dragActive ? "border-primary-500 bg-primary-50" : "border-slate-300 bg-slate-50 hover:border-primary-300"
          }`}
        >
          <div className="mx-auto w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-3">
            <FiUploadCloud className="text-slate-600 text-xl" />
          </div>
          <p className="text-base font-medium text-slate-700">📄 Drop your resume here or click to upload</p>
          <p className="text-xs text-slate-500 mt-2">Supports PDF, JPG, PNG, WEBP - max 10MB</p>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {file && (
          <div className="mt-4 rounded-lg border border-slate-200 p-3 bg-white flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-lg">{getFileIcon(file)}</span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
                <p className="text-xs text-slate-500">{formatSize(file.size)} · {file.type || "Unknown type"}</p>
              </div>
            </div>
            <button
              type="button"
              className="text-xs text-slate-500 hover:text-red-500"
              onClick={() => setFile(null)}
            >
              Remove
            </button>
          </div>
        )}

        <div className="mt-5">
          <button
            type="button"
            onClick={handleExtract}
            disabled={!canExtract}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <FiLoader className="animate-spin" /> : null}
            {loading ? "AI is reading your resume..." : "Extract Data"}
          </button>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}
