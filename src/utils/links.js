// Adds https:// when missing so links work in preview and PDF
export const toHref = (url) => {
  const v = (url || "").trim();
  if (!v) return "";
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
};

// Shows a clean link text: github.com/name
export const displayUrl = (url) =>
  (url || "")
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/$/, "");