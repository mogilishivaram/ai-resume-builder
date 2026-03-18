import React from "react";
import {
  DEFAULT_TEMPLATE_ID,
  getTemplateById,
  getDefaultAccentForTemplate,
} from "./templates/templateRegistry";

export default function ResumePreview({ resume, template = DEFAULT_TEMPLATE_ID, accentColor }) {
  const templateConfig = getTemplateById(template || DEFAULT_TEMPLATE_ID);
  const ActiveTemplate = templateConfig.Component;
  const resolvedAccent = accentColor || getDefaultAccentForTemplate(templateConfig.id);

  return <ActiveTemplate resume={resume} accentColor={resolvedAccent} previewId="resume-preview" />;
}
