import React, { useEffect, useMemo, useState } from "react";
import {
  TEMPLATE_REGISTRY,
  CATEGORY_LABELS,
  ACCENT_PRESETS,
  getTemplateById,
  getDefaultAccentForTemplate,
} from "./templates/templateRegistry";

function isLightColor(hex) {
  const raw = (hex || "").replace("#", "");
  if (raw.length !== 6) return false;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.75;
}

export default function TemplatePicker({ selectedTemplate, selectedAccent, onChooseTemplate }) {
  const [isDesktop, setIsDesktop] = useState(() => (typeof window !== "undefined" ? window.innerWidth > 768 : false));

  const thumbnailResume = useMemo(
    () => ({
      personal_info: {
        name: "Jordan Patel",
        title: "Senior Product Designer",
        email: "jordan.patel@email.com",
        phone: "+1 (555) 201-4488",
        location: "Austin, TX",
        linkedin: "linkedin.com/in/jordanpatel",
        website: "jordanpatel.design",
        github: "github.com/jordanpatel",
      },
      summary:
        "Design leader with 8+ years building accessible digital products. Strong collaborator with engineering and product teams, focused on measurable user outcomes.",
      experience: [
        {
          title: "Senior Product Designer",
          company: "Nimbus Labs",
          location: "Austin, TX",
          start_date: "2021",
          end_date: "Present",
          bullets: [
            "Led redesign of onboarding journey, improving activation by 24%.",
            "Built and documented component patterns used across 4 product teams.",
          ],
        },
        {
          title: "Product Designer",
          company: "BrightCart",
          location: "Remote",
          start_date: "2018",
          end_date: "2021",
          bullets: [
            "Delivered checkout UX improvements that reduced cart abandonment by 18%.",
            "Partnered with engineers to ship high-fidelity UI with design QA checklists.",
          ],
        },
      ],
      education: [
        {
          degree: "B.S. in Human-Computer Interaction",
          school: "University of Washington",
          location: "Seattle, WA",
          year: "2018",
          grade_type: "GPA",
          gpa: "3.8",
        },
      ],
      skills: ["Product Design", "Design Systems", "User Research", "Figma"],
      projects: [
        {
          name: "Design System Migration",
          description: "Unified 60+ UI components and reduced design-dev handoff time by 30%.",
          technologies: ["Figma", "Storybook", "React"],
        },
      ],
      certifications: ["Google UX Design Certificate"],
      languages: ["English (Fluent)", "Hindi (Professional)"],
    }),
    []
  );

  const initialTemplate = selectedTemplate || TEMPLATE_REGISTRY[0].id;
  const initialAccent = selectedAccent || getDefaultAccentForTemplate(initialTemplate);

  const [activeCategory, setActiveCategory] = useState(getTemplateById(initialTemplate).category);
  const [draftTemplate, setDraftTemplate] = useState(initialTemplate);
  const [draftAccent, setDraftAccent] = useState(initialAccent);
  const accentIsLight = isLightColor(draftAccent);

  useEffect(() => {
    const syncedTemplate = selectedTemplate || TEMPLATE_REGISTRY[0].id;
    setDraftTemplate(syncedTemplate);
    setDraftAccent(selectedAccent || getDefaultAccentForTemplate(syncedTemplate));
    setActiveCategory(getTemplateById(syncedTemplate).category);
  }, [selectedTemplate, selectedAccent]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredTemplates = useMemo(
    () => TEMPLATE_REGISTRY.filter((template) => template.category === activeCategory),
    [activeCategory]
  );

  const handleTemplateClick = (templateId) => {
    setDraftTemplate(templateId);
  };

  const handleAccentClick = (accent) => {
    setDraftAccent(accent);
  };

  const handleConfirm = () => {
    onChooseTemplate?.({ template: draftTemplate, accentColor: draftAccent });
  };

  return (
    <section className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm no-print">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {CATEGORY_LABELS.map((category) => {
          const active = category === activeCategory;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition ${
                active ? "text-white" : "text-slate-600 bg-slate-100 hover:bg-slate-200"
              }`}
              style={
                active
                  ? {
                      backgroundColor: draftAccent,
                      color: accentIsLight ? "#0f172a" : "#ffffff",
                    }
                  : undefined
              }
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => {
          const isActive = draftTemplate === template.id;
          const CardTemplate = template.Component;
          const cardStyle = isDesktop
            ? {
                height: "320px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }
            : undefined;
          const thumbnailWrapperStyle = isDesktop
            ? {
                height: "260px",
                overflow: "hidden",
                position: "relative",
              }
            : undefined;
          const previewWidth = isDesktop ? "794px" : "820px";
          const resolvedPreviewWidth = template.id === "creative-dark-sidebar-initials" && isDesktop ? "794px" : previewWidth;
          const previewScale = isDesktop ? "scale(0.28)" : "scale(0.18)";
          // Ensure Shapes Creative also always uses the hardcoded gallery sample data.
          const previewResume = thumbnailResume;

          return (
            <button
              key={template.id}
              type="button"
              onClick={() => handleTemplateClick(template.id)}
              className={`text-left rounded-xl border transition overflow-hidden bg-slate-50 ${
                isActive ? "ring-2 ring-offset-1" : "hover:border-slate-300"
              }`}
              style={{
                ...(isActive ? { borderColor: draftAccent, boxShadow: `0 0 0 2px ${draftAccent}33` } : undefined),
                ...(cardStyle || {}),
              }}
            >
              {!isDesktop && (
                <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 bg-white">
                  <p className="text-xs sm:text-sm font-semibold text-slate-700">{template.name}</p>
                  {isActive && <span className="text-[11px] font-medium" style={{ color: draftAccent }}>Selected</span>}
                </div>
              )}

              <div className="h-[190px] md:h-[250px] overflow-hidden p-2 bg-white" style={thumbnailWrapperStyle}>
                <div
                  className="origin-top-left pointer-events-none"
                  style={{
                    width: resolvedPreviewWidth,
                    transform: previewScale,
                    transformOrigin: "top left",
                  }}
                >
                  <CardTemplate
                    resume={template.id === "creative-shapes" ? thumbnailResume : previewResume}
                    accentColor={draftAccent}
                    previewId={`preview-${template.id}`}
                  />
                </div>
              </div>

              {isDesktop && (
                <div className="flex items-center justify-between px-3 border-t border-slate-200 bg-white" style={{ height: "60px", minHeight: "60px" }}>
                  <p className="text-xs sm:text-sm font-semibold text-slate-700">{template.name}</p>
                  {isActive && <span className="text-[11px] font-medium" style={{ color: draftAccent }}>Selected</span>}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 mb-2">Accent Color</p>
        <div className="flex flex-wrap gap-2">
          {ACCENT_PRESETS.map((color) => {
            const active = draftAccent.toLowerCase() === color.value.toLowerCase();
            return (
              <button
                key={color.value}
                type="button"
                onClick={() => handleAccentClick(color.value)}
                className={`w-8 h-8 rounded-full border-2 transition ${active ? "scale-110" : ""}`}
                style={{
                  backgroundColor: color.value,
                  borderColor: active ? "#0f172a" : "#e2e8f0",
                }}
                title={color.name}
                aria-label={color.name}
              />
            );
          })}
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={handleConfirm}
          className="px-4 py-2 rounded-lg text-sm font-semibold"
          style={{
            backgroundColor: draftAccent,
            color: accentIsLight ? "#0f172a" : "#ffffff",
            border: accentIsLight ? "1px solid #cbd5e1" : "none",
          }}
        >
          Choose template
        </button>
      </div>
    </section>
  );
}
