import { useState } from "react";
import { Plus, X, Trash2, Upload, User, Download } from "lucide-react";
import { exportResumePdf } from "../utils/exportPdf";
import { EMPTY_JOB, normalizeExperience } from "../utils/experience";
import MonthPicker from "./MonthPicker";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\-\s\d]{7,20}$/;

// Resize image so it stays small (also keeps localStorage safe)
const resizeImage = (file, maxSize = 400) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.9));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

export default function Sidebar({ data, setData, template, customBg, layout }) {
  const [skillInput, setSkillInput] = useState("");
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");

  const experience = normalizeExperience(data.experience);
  const education = data.education || [];

  /* ---------- helpers ---------- */
  const update = (field, value) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const handleField = (e) => update(e.target.name, e.target.value);

  /* simple list fields: projects */
  const addItem = (field) =>
    setData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));

  const updateItem = (field, index, value) =>
    setData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));

  const removeItem = (field, index) =>
    setData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));

  const renderList = (field, addLabel, placeholder) => (
    <>
      {data[field].map((item, i) => (
        <div className="sb-item" key={i}>
          <textarea
            rows={2}
            value={item}
            placeholder={placeholder}
            onChange={(e) => updateItem(field, i, e.target.value)}
          />
          <button
            type="button"
            className="sb-icon-btn"
            onClick={() => removeItem(field, i)}
            aria-label="Remove"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}

      <button type="button" className="sb-add" onClick={() => addItem(field)}>
        <Plus size={16} /> {addLabel}
      </button>
    </>
  );

  /* ---------- experience ---------- */
  const addExperience = () =>
    setData((prev) => ({
      ...prev,
      experience: [...normalizeExperience(prev.experience), { ...EMPTY_JOB }],
    }));

  const updateExperience = (index, patch) =>
    setData((prev) => ({
      ...prev,
      experience: normalizeExperience(prev.experience).map((job, i) =>
        i === index ? { ...job, ...patch } : job
      ),
    }));

  const removeExperience = (index) =>
    setData((prev) => ({
      ...prev,
      experience: normalizeExperience(prev.experience).filter(
        (_, i) => i !== index
      ),
    }));

  /* ---------- education ---------- */
  const addEducation = () =>
    setData((prev) => ({
      ...prev,
      education: [
        ...(prev.education || []),
        { degree: "", school: "", year: "" },
      ],
    }));

  const updateEducation = (index, field, value) =>
    setData((prev) => ({
      ...prev,
      education: (prev.education || []).map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));

  const removeEducation = (index) =>
    setData((prev) => ({
      ...prev,
      education: (prev.education || []).filter((_, i) => i !== index),
    }));

  /* ---------- image ---------- */
  const handleImage = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allows selecting the same file again
    if (!file || !file.type.startsWith("image/")) return;

    try {
      const resized = await resizeImage(file);
      update("image", resized);
    } catch {
      /* ignore unreadable images */
    }
  };

  /* ---------- skills ---------- */
  const addSkill = () => {
    const value = skillInput.trim();
    if (!value) return;

    const exists = data.skills.some(
      (s) => s.toLowerCase() === value.toLowerCase()
    );
    if (!exists) update("skills", [...data.skills, value]);
    setSkillInput("");
  };

  const removeSkill = (index) =>
    update(
      "skills",
      data.skills.filter((_, i) => i !== index)
    );

  /* ---------- pdf ---------- */
  const downloadPDF = async () => {
    setExporting(true);
    setExportError("");
    try {
      await exportResumePdf({ data, template, customBg, layout });
    } catch (err) {
      console.error("PDF export failed:", err);
      setExportError(
        `Could not create the PDF (${err?.message || "unknown error"}). Please try again.`
      );
    } finally {
      setExporting(false);
    }
  };

  const emailInvalid = data.email && !EMAIL_RE.test(data.email);
  const phoneInvalid = data.phone && !PHONE_RE.test(data.phone);

  return (
    <div className="sidebar">
      <h2>Resume Editor</h2>

      {/* PERSONAL INFO */}
      <section className="sb-section">
        <h3>Personal Info</h3>

        <div className="sb-photo">
          {data.image ? (
            <img src={data.image} alt="Profile" className="sb-photo__img" />
          ) : (
            <div className="sb-photo__empty">
              <User size={24} />
            </div>
          )}

          <div className="sb-photo__actions">
            <label className="sb-upload">
              <input type="file" accept="image/*" onChange={handleImage} hidden />
              <Upload size={15} />
              {data.image ? "Change photo" : "Upload photo"}
            </label>

            {data.image && (
              <button
                type="button"
                className="sb-link"
                onClick={() => update("image", "")}
              >
                Remove photo
              </button>
            )}
          </div>
        </div>

        <input
          name="name"
          value={data.name || ""}
          onChange={handleField}
          placeholder="Full name"
          autoComplete="name"
        />
        <input
          name="title"
          value={data.title || ""}
          onChange={handleField}
          placeholder="Job title (e.g. React Developer)"
        />
        <input
          name="email"
          type="email"
          value={data.email || ""}
          onChange={handleField}
          placeholder="Email"
          autoComplete="email"
        />
        {emailInvalid && (
          <p className="sb-hint is-error">Please enter a valid email address.</p>
        )}
        <input
          name="phone"
          type="tel"
          value={data.phone || ""}
          onChange={handleField}
          placeholder="Phone"
          autoComplete="tel"
        />
        {phoneInvalid && (
          <p className="sb-hint is-error">Use digits, spaces, + or - only.</p>
        )}
        <input
          name="location"
          value={data.location || ""}
          onChange={handleField}
          placeholder="Location (e.g. Lahore, Pakistan)"
          autoComplete="address-level2"
        />

        <p className="sb-sublabel">Links (optional)</p>
        <input
          name="linkedin"
          value={data.linkedin || ""}
          onChange={handleField}
          placeholder="LinkedIn (linkedin.com/in/yourname)"
        />
        <input
          name="github"
          value={data.github || ""}
          onChange={handleField}
          placeholder="GitHub (github.com/yourname)"
        />
        <input
          name="website"
          value={data.website || ""}
          onChange={handleField}
          placeholder="Portfolio / website"
        />
      </section>

      {/* SUMMARY */}
      <section className="sb-section">
        <h3>Summary</h3>
        <textarea
          name="summary"
          value={data.summary || ""}
          onChange={handleField}
          placeholder="A short introduction about you (2-3 lines)"
        />
      </section>

      {/* EXPERIENCE */}
      <section className="sb-section">
        <h3>Experience</h3>

        {experience.map((job, i) => (
          <div className="sb-edu" key={i}>
            <div className="sb-edu__head">
              <span>Experience {i + 1}</span>
              <button
                type="button"
                className="sb-icon-btn"
                onClick={() => removeExperience(i)}
                aria-label="Remove experience"
              >
                <Trash2 size={15} />
              </button>
            </div>

            <input
              value={job.role}
              onChange={(e) => updateExperience(i, { role: e.target.value })}
              placeholder="Job title (e.g. Frontend Developer)"
            />
            <input
              value={job.company}
              onChange={(e) => updateExperience(i, { company: e.target.value })}
              placeholder="Company"
            />

               <div className={`sb-dates ${job.current ? "is-single" : ""}`}>
              <div className="sb-field">
                <span className="sb-field__label">Start</span>
                <MonthPicker
                  value={job.start}
                  onChange={(v) => updateExperience(i, { start: v })}
                  placeholder="Start date"
                  align="left"
                />
              </div>

              {!job.current && (
                <div className="sb-field">
                  <span className="sb-field__label">End</span>
                  <MonthPicker
                    value={job.end}
                    onChange={(v) => updateExperience(i, { end: v })}
                    placeholder="End date"
                    align="right"
                  />
                </div>
              )}
            </div>

            <label className="sb-check">
              <input
                type="checkbox"
                checked={job.current}
                onChange={(e) =>
                  updateExperience(i, {
                    current: e.target.checked,
                    end: e.target.checked ? "" : job.end,
                  })
                }
              />
              I currently work here
            </label>

            <textarea
              rows={4}
              value={job.bullets}
              onChange={(e) => updateExperience(i, { bullets: e.target.value })}
              placeholder={
                "One achievement per line, e.g.\nBuilt responsive dashboards used by 500+ customers\nReduced page load time by 35%"
              }
            />
          </div>
        ))}

        <button type="button" className="sb-add" onClick={addExperience}>
          <Plus size={16} /> Add experience
        </button>
      </section>

      {/* PROJECTS */}
      <section className="sb-section">
        <h3>Projects</h3>
        {renderList(
          "projects",
          "Add project",
          "e.g. Resume Builder - React, live PDF export"
        )}
      </section>

      {/* EDUCATION */}
      <section className="sb-section">
        <h3>Education</h3>

        {education.map((edu, i) => (
          <div className="sb-edu" key={i}>
            <div className="sb-edu__head">
              <span>Education {i + 1}</span>
              <button
                type="button"
                className="sb-icon-btn"
                onClick={() => removeEducation(i)}
                aria-label="Remove education"
              >
                <Trash2 size={15} />
              </button>
            </div>

            <input
              value={edu.degree}
              onChange={(e) => updateEducation(i, "degree", e.target.value)}
              placeholder="Degree (e.g. BS Computer Science)"
            />
            <input
              value={edu.school}
              onChange={(e) => updateEducation(i, "school", e.target.value)}
              placeholder="University / institute"
            />
            <input
              value={edu.year}
              onChange={(e) => updateEducation(i, "year", e.target.value)}
              placeholder="Years (e.g. 2020 - 2024)"
            />
          </div>
        ))}

        <button type="button" className="sb-add" onClick={addEducation}>
          <Plus size={16} /> Add education
        </button>
      </section>

      {/* SKILLS */}
      <section className="sb-section">
        <h3>Skills</h3>

        <div className="skill-box">
          <input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkill();
              }
            }}
            placeholder="Type a skill and press Enter"
          />
          <button type="button" onClick={addSkill}>
            <Plus size={16} />
          </button>
        </div>

        {data.skills.length > 0 && (
          <div className="sb-chips">
            {data.skills.map((s, i) => (
              <span key={`${s}-${i}`} className="sb-chip">
                {s}
                <button
                  type="button"
                  onClick={() => removeSkill(i)}
                  aria-label={`Remove ${s}`}
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        )}
      </section>

      {/* APPEARANCE */}
      <section className="sb-section">
        <h3>Appearance</h3>
        <div className="sb-color">
          <input
            type="color"
            value={data.textColor || "#000000"}
            onChange={(e) => update("textColor", e.target.value)}
            aria-label="Text color"
          />
          <span>Text color</span>
          <button
            type="button"
            className="sb-link"
            disabled={!data.textColor}
            onClick={() => update("textColor", "")}
          >
            Use template default
          </button>
        </div>
      </section>

      {/* PDF BUTTON */}
      <button
        type="button"
        className="pdf-btn"
        onClick={downloadPDF}
        disabled={exporting}
      >
        <Download size={17} />
        {exporting ? "Preparing PDF..." : "Download PDF"}
      </button>
      {exportError && <p className="sb-hint is-error">{exportError}</p>}
    </div>
  );
}