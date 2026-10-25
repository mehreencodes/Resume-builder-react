// Colors used by the preview, thumbnails and PDF export.
export const COLOR_OPTIONS = [
  { id: "clean", label: "Clean" },
  { id: "modern", label: "Modern" },
  { id: "dark", label: "Dark" },
  { id: "minimal", label: "Minimal" },
  { id: "creative", label: "Creative" },
  { id: "corporate", label: "Corporate" },
  { id: "tech", label: "Tech" },
  { id: "elegant", label: "Elegant" },
  { id: "bold", label: "Bold" },
  { id: "classic", label: "Silver" },
  { id: "Brand", label: "Brand" },
];

const THEMES = {
  default: { bg: "#ffffff", text: "#111111" },
  clean: { bg: "#ffffff", text: "#111111" },
  modern: { bg: "#111111", text: "#ffd700" },
  dark: { bg: "#0a0a0a", text: "#ffffff" },
  minimal: { bg: "#f5f5f5", text: "#111111" },
  creative: { gradient: ["#800080", "#000000"], text: "#ffffff" },
  corporate: { bg: "#1a1a1a", text: "#eaeaea" },
  tech: { gradient: ["#00c6ff", "#0072ff"], text: "#ffffff" },
  elegant: { gradient: ["#c6a700", "#000000"], text: "#ffffff" },
  bold: { gradient: ["#ff0000", "#000000"], text: "#ffffff" },
  classic: { bg: "#dddddd", text: "#111111" },
  Brand: { gradient: ["#3b1729", "#0a0a0a"], text: "#ffffff" },
};

const parseHex = (hex) => {
  let h = String(hex || "").replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};

// weight = how much of color `a` (0 to 1) is mixed with `b`
export const mixHex = (a, b, weight) => {
  const A = parseHex(a);
  const B = parseHex(b);
  if (!A || !B) return a;
  const out = A.map((v, i) => Math.round(v * weight + B[i] * (1 - weight)));
  return "#" + out.map((v) => v.toString(16).padStart(2, "0")).join("");
};

export function getTheme(template, customBg, textColor) {
  const base = THEMES[template] || THEMES.default;

  let bg = base.bg;
  let gradient = base.gradient || null;
  let text = base.text;

  // a custom background replaces the template background
  if (customBg) {
    bg = customBg;
    gradient = null;
    text = "#111111";
  }
  if (textColor) text = textColor;

  // solid color used as page background (or gradient fallback)
  const baseBg = gradient ? mixHex(gradient[0], gradient[1], 0.5) : bg;

  return {
    gradient,
    text,
    baseBg,
    muted: mixHex(text, baseBg, 0.78),
    line: mixHex(text, baseBg, 0.28),
    chip: mixHex(text, baseBg, 0.14),
  };
}

// CSS background for the preview card, swatches and thumbnails
export const cssBackground = (theme) =>
  theme.gradient
    ? `linear-gradient(135deg, ${theme.gradient[0]}, ${theme.gradient[1]})`
    : theme.baseBg;