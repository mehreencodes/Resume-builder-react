import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  LayoutTemplate,
  ShieldCheck,
  Download,
  ArrowRight,
  Check,
} from "lucide-react";
import Navbar from "../components/Navbar";
import AuthModal from "../components/AuthModal";
import LayoutThumb from "../components/LayoutThumb";
import { LAYOUTS } from "../utils/layouts";
import { COLOR_OPTIONS, getTheme, cssBackground } from "../utils/resumeThemes";
import { getSession, signOut, firstName } from "../utils/auth";
import "./Home.css";

const FEATURES = [
  {
    icon: Eye,
    title: "Live preview",
    text: "Type on the left and watch your resume update instantly on the right.",
  },
  {
    icon: LayoutTemplate,
    title: "Layouts & colors",
    text: "Mix 5 layouts with 11 color themes and switch anytime without losing your data.",
  },
  {
    icon: ShieldCheck,
    title: "ATS-friendly",
    text: "Clean structure that applicant tracking systems can read properly.",
  },
  {
    icon: Download,
    title: "Instant PDF",
    text: "Export a print-ready A4 PDF with a single click, no sign-up needed.",
  },
];

const STEPS = [
  { title: "Pick a template", text: "Choose a layout that fits your profile." },
  { title: "Fill in your details", text: "Add experience, education, skills and more." },
  { title: "Download your PDF", text: "Export and start applying right away." },
];

export default function Home() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => getSession());
  const [showAuth, setShowAuth] = useState(false);
  const [toast, setToast] = useState("");
  const [color, setColor] = useState(
    () => localStorage.getItem("selectedTemplate") || "modern"
  );

  // Auto-hide toast
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  const selectLayout = (layout) => {
    localStorage.setItem("selectedLayout", layout);
    localStorage.setItem("selectedTemplate", color);
    navigate("/builder");
  };

  const scrollToTemplates = () => {
    document
      .getElementById("templates")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleAuthSuccess = (signedInUser, mode) => {
    setUser(signedInUser);
    setShowAuth(false);
    setToast(
      mode === "signup"
        ? `Welcome, ${firstName(signedInUser.name)}!`
        : `Welcome back, ${firstName(signedInUser.name)}!`
    );
  };

  const handleSignOut = () => {
    signOut();
    setUser(null);
    setToast("You've been signed out");
  };

  return (
    <div className="rb-home">
      <Navbar
        user={user}
        onSignIn={() => setShowAuth(true)}
        onSignOut={handleSignOut}
      />

      <main id="top">
        {/* HERO */}
        <section className="hx-hero">
          <div className="hx-grid" aria-hidden="true" />

          <div className="rb-container hx-inner">
            <div className="hx-text">
              <span className="hx-badge">
                <span className="hx-badge__dot" />
                ATS-optimized resume templates
              </span>

              <h1>
                Craft a resume that gets you <em>noticed</em>.
              </h1>

              <p>
                Pick a polished template, add your details and watch it come
                together in a live preview. Download a recruiter-ready PDF in
                minutes, with no account needed.
              </p>

              <div className="hx-actions">
                <button
                  className="rb-btn rb-btn--primary"
                  onClick={() => navigate("/builder")}
                >
                  Create my resume <ArrowRight size={18} />
                </button>
                <button className="rb-btn rb-btn--outline" onClick={scrollToTemplates}>
                  Browse templates
                </button>
              </div>

              <ul className="hx-trust">
                <li><Check size={15} /> Free to use</li>
                <li><Check size={15} /> No sign-up</li>
                <li>
                  <Check size={15} /> {LAYOUTS.length} layouts, {COLOR_OPTIONS.length} colors
                </li>
                <li><Check size={15} /> Instant PDF</li>
              </ul>
            </div>

            {/* VISUAL */}
            <div className="hx-visual" aria-hidden="true">
              <div className="hx-stack">
                {/* back sheet (dark template) */}
                <div className="hx-sheet hx-sheet--back">
                  <span className="hx-bar hx-bar--gold" style={{ width: "46%" }} />
                  <span className="hx-bar" style={{ width: "70%" }} />
                  <span className="hx-bar" style={{ width: "58%" }} />
                  <span className="hx-gap" />
                  <span className="hx-bar hx-bar--gold" style={{ width: "30%" }} />
                  <span className="hx-bar" />
                  <span className="hx-bar" style={{ width: "84%" }} />
                  <span className="hx-bar" style={{ width: "64%" }} />
                </div>

                {/* front sheet (light template) */}
                <div className="hx-sheet hx-sheet--front">
                  <div className="hs-head">
                    <span className="hs-avatar">AM</span>
                    <div>
                      <strong>Alex Morgan</strong>
                      <small>Product Designer</small>
                    </div>
                  </div>
                  <p className="hs-contact">alex.morgan@email.com · +1 555 010 2030</p>

                  <h4>Summary</h4>
                  <p>
                    Detail-oriented designer who turns complex problems into clear,
                    usable products.
                  </p>

                  <h4>Experience</h4>
                  <ul>
                    <li>Led a redesign that simplified onboarding for a SaaS platform</li>
                    <li>Built a shared design system used across three product teams</li>
                  </ul>

                  <h4>Skills</h4>
                  <div className="hs-chips">
                    <span>Figma</span>
                    <span>Prototyping</span>
                    <span>UX Research</span>
                    <span>HTML/CSS</span>
                  </div>
                </div>

                <div className="hx-float hx-float--a">
                  <Eye size={14} /> Live preview
                </div>
                <div className="hx-float hx-float--b">
                  <Download size={14} /> PDF ready
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="rb-section">
          <div className="rb-container">
            <div className="rb-section__head">
              <span className="rb-eyebrow">Features</span>
              <h2>Everything you need, nothing you don't</h2>
              <p>A focused set of tools to get a polished resume done fast.</p>
            </div>

            <div className="rb-features">
              {FEATURES.map(({ icon: Icon, title, text }) => (
                <div className="rb-feature" key={title}>
                  <div className="rb-feature__icon">
                    <Icon size={20} />
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TEMPLATES */}
        <section id="templates" className="rb-section rb-section--alt">
          <div className="rb-container">
            <div className="rb-section__head">
              <span className="rb-eyebrow">Templates</span>
              <h2>Choose your layout</h2>
              <p>Pick a color, then a layout. You can change both later in the builder.</p>
            </div>

            <div className="hx-colors" role="radiogroup" aria-label="Color">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  role="radio"
                  aria-checked={color === c.id}
                  aria-label={c.label}
                  title={c.label}
                  className={`hx-color ${color === c.id ? "is-active" : ""}`}
                  style={{ background: cssBackground(getTheme(c.id)) }}
                  onClick={() => setColor(c.id)}
                />
              ))}
            </div>

            <div className="hx-layouts">
              {LAYOUTS.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  className="hx-layout"
                  onClick={() => selectLayout(l.id)}
                >
                  <div className="hx-layout__thumb">
                    <LayoutThumb layout={l.id} color={color} />
                  </div>
                  <span className="hx-layout__name">{l.label}</span>
                  <span className="hx-layout__note">{l.note}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="rb-section">
          <div className="rb-container">
            <div className="rb-section__head">
              <span className="rb-eyebrow">How it works</span>
              <h2>Three simple steps</h2>
            </div>

            <div className="rb-steps">
              {STEPS.map((s, i) => (
                <div className="rb-step" key={s.title}>
                  <div className="rb-step__num">{i + 1}</div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="rb-section rb-section--tight">
          <div className="rb-container">
            <div className="rb-cta">
              <h2>Ready to build your resume?</h2>
              <p>It takes just a few minutes to get a professional result.</p>
              <button className="rb-btn rb-btn--primary" onClick={() => navigate("/builder")}>
                Start building <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="rb-footer">
        <div className="rb-container rb-footer__inner">
          <span className="rb-logo rb-logo--plain">
            <span className="rb-logo__dot" />
            ResumeBuilder
          </span>
          <span className="rb-footer__copy">
            © {new Date().getFullYear()} ResumeBuilder. Built with React.
          </span>
        </div>
      </footer>

      {/* AUTH MODAL */}
      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={handleAuthSuccess}
        />
      )}

      {/* TOAST */}
      {toast && (
        <div className="rb-toast" role="status">
          <Check size={16} /> {toast}
        </div>
      )}
    </div>
  );
}