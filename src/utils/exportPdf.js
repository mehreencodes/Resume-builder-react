import { createElement } from "react";
import { getTheme } from "./resumeThemes";

export async function exportResumePdf({ data, template, customBg, layout }) {
  const [{ pdf }, { default: ResumePDF }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("../components/ResumePDF"),
  ]);

  const theme = getTheme(template, customBg, data.textColor);
  const blob = await pdf(
    createElement(ResumePDF, { data, theme, layout })
  ).toBlob();

  // file name from the person's name
  const slug = (data.name || "")
    .trim()
    .replace(/[^\w-]+/g, "_")
    .replace(/^_+|_+$/g, "");
  const fileName = `${slug || "resume"}_resume.pdf`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}