export const EMPTY_JOB = {
  role: "",
  company: "",
  start: "",
  end: "",
  current: false,
  bullets: "",
};

// Old data stored experience as plain strings: convert them to the new shape
export const normalizeExperience = (list) =>
  (Array.isArray(list) ? list : []).map((item) =>
    typeof item === "string"
      ? { ...EMPTY_JOB, bullets: item }
      : { ...EMPTY_JOB, ...item }
  );

export const hasExperienceContent = (job) =>
  Boolean(
    job.role?.trim() ||
      job.company?.trim() ||
      job.start ||
      job.end ||
      job.current ||
      job.bullets?.trim()
  );

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// "2023-01" -> "Jan 2023" (free text from older browsers stays as typed)
export const formatMonth = (value) => {
  const v = (value || "").trim();
  const m = /^(\d{4})-(\d{2})$/.exec(v);
  if (!m) return v;
  const month = MONTHS[Number(m[2]) - 1];
  return month ? `${month} ${m[1]}` : v;
};

export const formatDateRange = (job) => {
  const start = formatMonth(job.start);
  const end = job.current ? "Present" : formatMonth(job.end);

  if (start && end) return `${start} - ${end}`;
  if (start) return start;
  if (end && !job.current) return end;
  return "";
};

// One bullet per line; removes a leading "-", "*" or bullet sign
export const splitBullets = (text) =>
  (text || "")
    .split("\n")
    .map((line) => line.trim().replace(/^[-*\u2022]\s*/, ""))
    .filter(Boolean);