export const LAYOUTS = [
  { id: "classic", label: "Classic", note: "One column, safest for ATS" },
  { id: "centered", label: "Centered", note: "Centered header, executive look" },
  { id: "banner", label: "Banner", note: "Colored header band, one column" },
  { id: "compact", label: "Compact", note: "Tighter spacing, fits more on a page" },
  { id: "sidebar", label: "Sidebar", note: "Two columns, design-focused" },
];

export const DEFAULT_LAYOUT = "classic";

export const isLayout = (value) => LAYOUTS.some((l) => l.id === value);