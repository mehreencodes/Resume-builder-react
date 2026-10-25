import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Palette, Pencil, Eye, FilePlus } from "lucide-react";
import Sidebar from "../components/Sidebar";
import ResumePreview from "../components/ResumePreview";
import LayoutThumb from "../components/LayoutThumb";
import { LAYOUTS, DEFAULT_LAYOUT, isLayout } from "../utils/layouts";
import { COLOR_OPTIONS, getTheme, cssBackground } from "../utils/resumeThemes";
import { normalizeExperience } from "../utils/experience";
import "./Builder.css";

const BG_COLORS = ["#ffffff", "#f3fce7", "#e5e5fc", "#e7f6fc", "#fcf5e0", "#f3e1ed"];

const EMPTY_DATA = {
  name: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  website: "",
  image: "",
  skills: [],
  experience: [],
  projects: [],
  education: [],
  summary: "",
  textColor: "",
};

const loadSaved = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export default function Builder() {
  const navigate = useNavigate();

  // "template" = the color theme (same storage key as before)
  const [template, setTemplate] = useState(
    () => localStorage.getItem("selectedTemplate") || "modern"
  );

  const [layout, setLayout] = useState(() => {
    const saved = localStorage.getItem("selectedLayout");
    return isLayout(saved) ? saved : DEFAULT_LAYOUT;
  });

  // Custom background is NOT saved: every visit starts with the theme's own look
  const [customBg, setCustomBg] = useState("");

  // Resume content is auto-saved (text color is not restored)
  const [data, setData] = useState(() => {
    const saved = loadSaved("resumeData", {});
    return {
      ...EMPTY_DATA,
      ...saved,
      experience: normalizeExperience(saved.experience),
      textColor: "",
    };
  });

  const [showDesign, setShowDesign] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [tab, setTab] = useState("edit"); // mobile only

  // Page guides: how many A4 pages the content needs
  const cardRef = useRef(null);
  const bodyRef = useRef(null);
  const [pageInfo, setPageInfo] = useState({ pages: 1, pageH: 0 });

  useEffect(() => {
    const card = cardRef.current;
    const body = bodyRef.current;
    if (!card || !body) return;

    const measure = () => {
      if (!card.clientWidth) return; // hidden (mobile edit tab)
      const pageH = (card.clientWidth * 297) / 210;
      const cs = getComputedStyle(card);
      const pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
      const pages = Math.max(1, Math.ceil((body.offsetHeight + pad - 2) / pageH));

      setPageInfo((prev) =>
        prev.pages === pages && Math.abs(prev.pageH - pageH) < 0.5
          ? prev
          : { pages, pageH }
      );
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(card);
    ro.observe(body);
    return () => ro.disconnect();
  }, [layout]);

  // Auto-save resume data
  useEffect(() => {
    try {
      localStorage.setItem("resumeData", JSON.stringify(data));
    } catch {
      /* storage full - ignore */
    }
  }, [data]);

  // Escape closes popover / modal
  useEffect(() => {
    if (!showDesign && !showConfirm) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setShowDesign(false);
        setShowConfirm(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showDesign, showConfirm]);

  // Changing the color theme -> use that theme's own look
  const changeTemplate = (value) => {
    setTemplate(value);
    localStorage.setItem("selectedTemplate", value);
    setCustomBg("");
    setData((prev) => ({ ...prev, textColor: "" }));
  };

  const changeLayout = (value) => {
    setLayout(value);
    localStorage.setItem("selectedLayout", value);
  };

  // Clear everything and start a fresh resume
  const startNewResume = () => {
    setData({ ...EMPTY_DATA });
    setCustomBg("");
    setResetKey((k) => k + 1); // remounts the form
    setShowConfirm(false);
    setTab("edit");
  };

  // Card style comes from the theme (color, custom background, text color)
  const theme = getTheme(template, customBg, data.textColor);
  const cardStyle = {
    background: cssBackground(theme),
    color: theme.text,
    "--rc-chip": theme.chip,
     "--rc-band": theme.line,
  };
  if (pageInfo.pageH) cardStyle.minHeight = pageInfo.pages * pageInfo.pageH;

  return (
    <div className="rb-builder">
      {/* TOP BAR */}
      <header className="rb-topbar">
        <button className="rb-iconbtn" onClick={() => navigate("/")}>
          <ArrowLeft size={16} />
          <span>Home</span>
        </button>

        <div className="rb-topbar__title">
          <span className="rb-dot" />
          Resume Builder
        </div>

        <div className="rb-topbar__tools">
          <div className="rb-popwrap">
            <button
              className="rb-iconbtn"
              onClick={() => setShowDesign((v) => !v)}
              aria-expanded={showDesign}
            >
              <Palette size={16} />
              <span>Design</span>
            </button>

            {showDesign && (
              <>
                <div className="rb-backdrop" onClick={() => setShowDesign(false)} />
                <div className="rb-popover rb-popover--wide">
                  <p className="rb-pop__label">Layout</p>
                  <div className="rb-layouts">
                    {LAYOUTS.map((l) => (
                      <button
                        key={l.id}
                        className={`rb-layoutbtn ${layout === l.id ? "is-active" : ""}`}
                        onClick={() => changeLayout(l.id)}
                        aria-pressed={layout === l.id}
                      >
                        <span className="rb-layoutbtn__thumb">
                          <LayoutThumb layout={l.id} color={template} />
                        </span>
                        {l.label}
                      </button>
                    ))}
                  </div>

                  <p className="rb-pop__label">Color</p>
                  <div className="rb-swatches">
                    {COLOR_OPTIONS.map((c) => (
                      <button
                        key={c.id}
                        className={`rb-swatch ${template === c.id ? "is-active" : ""}`}
                        style={{ background: cssBackground(getTheme(c.id)) }}
                        onClick={() => changeTemplate(c.id)}
                        title={c.label}
                        aria-label={c.label}
                        aria-pressed={template === c.id}
                      />
                    ))}
                  </div>

                  <p className="rb-pop__label">Custom page background</p>
                  <div className="rb-swatches">
                    <button
                      className={`rb-swatch rb-swatch--default ${!customBg ? "is-active" : ""}`}
                      onClick={() => setCustomBg("")}
                      title="Use the color theme"
                      aria-label="Use the color theme"
                    >
                      A
                    </button>
                    {BG_COLORS.map((c) => (
                      <button
                        key={c}
                        className={`rb-swatch ${customBg === c ? "is-active" : ""}`}
                        style={{ background: c }}
                        onClick={() => setCustomBg(c)}
                        aria-label={`Background ${c}`}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            className="rb-iconbtn rb-iconbtn--danger"
            onClick={() => setShowConfirm(true)}
          >
            <FilePlus size={16} />
            <span>New resume</span>
          </button>
        </div>
      </header>

      {/* MOBILE TABS */}
      <div className="rb-tabs">
        <button
          className={tab === "edit" ? "is-active" : ""}
          onClick={() => setTab("edit")}
        >
          <Pencil size={15} /> Edit
        </button>
        <button
          className={tab === "preview" ? "is-active" : ""}
          onClick={() => setTab("preview")}
        >
          <Eye size={15} /> Preview
        </button>
      </div>

      <div className="rb-body">
        {/* FORM PANEL */}
        <aside className={`rb-panel ${tab === "edit" ? "" : "is-hidden"}`}>
          <Sidebar
            key={resetKey}
            data={data}
            setData={setData}
            template={template}
            customBg={customBg}
            layout={layout}
          />
        </aside>

        {/* PREVIEW */}
        <main className={`rb-stage ${tab === "preview" ? "" : "is-hidden"}`}>
          <div className="pdf-wrapper">
            <div className="preview-section">
              <ResumePreview
                data={data}
                layout={layout}
                cardRef={cardRef}
                bodyRef={bodyRef}
                style={cardStyle}
                pages={pageInfo.pages}
                pageH={pageInfo.pageH}
              />
            </div>
          </div>

          {layout === "sidebar" && (
            <p className="rb-pagehint">
              Sidebar is a design-focused layout. Some applicant tracking systems
              read two-column resumes out of order, so use Classic when applying
              through job portals.
            </p>
          )}

          {pageInfo.pages > 1 && (
            <p className="rb-pagehint">
              Dashed lines show approximate page breaks. The downloaded PDF sets
              the final layout.
            </p>
          )}
        </main>
      </div>

      {/* CONFIRM MODAL */}
      {showConfirm && (
        <div className="rb-confirm-overlay" onClick={() => setShowConfirm(false)}>
          <div
            className="rb-confirm"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Start a new resume?</h3>
            <p>
              This will clear all your details, photo and skills. This can't be undone.
            </p>
            <div className="rb-confirm__actions">
              <button onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="rb-confirm__danger" onClick={startNewResume}>
                Clear everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}