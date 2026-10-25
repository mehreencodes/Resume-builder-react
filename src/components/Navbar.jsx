import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Menu,
  X,
  User,
  LogOut,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { firstName, getInitials } from "../utils/auth";
import "./Navbar.css";

const LINKS = [
  { id: "features", label: "Features" },
  { id: "templates", label: "Templates" },
  { id: "how", label: "How it works" },
];

export default function Navbar({ user, onSignIn, onSignOut }) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Scrolled state + clear active link near the top
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      if (window.scrollY < 200) setActive("");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: highlight the section currently in view
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Escape closes menus
  useEffect(() => {
    if (!open && !menuOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, menuOpen]);

  // Click outside closes the account menu
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [menuOpen]);

  const goTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setOpen(false);
  };

  const handleSignIn = () => {
    setOpen(false);
    onSignIn?.();
  };

  const handleSignOut = () => {
    setOpen(false);
    setMenuOpen(false);
    onSignOut?.();
  };

  const openBuilder = () => {
    setOpen(false);
    setMenuOpen(false);
    navigate("/builder");
  };

  return (
    <>
      <header className={`nb ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""}`}>
        <div className="nb__inner">
          {/* LOGO */}
          <a href="#top" className="nb-logo" onClick={goTop} aria-label="ResumeBuilder home">
            <span className="nb-logo__mark">
              <FileText size={18} strokeWidth={2.4} />
            </span>
            <span className="nb-logo__text">
              Resume<span>Builder</span>
            </span>
          </a>

          {/* DESKTOP LINKS */}
          <nav className="nb__links" aria-label="Main">
            {LINKS.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className={active === l.id ? "is-active" : ""}
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* DESKTOP ACTIONS */}
          <div className="nb__actions">
            {user ? (
              <div className="nb-account" ref={menuRef}>
                <button
                  className="nb-account__btn"
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                >
                  <span className="nb-avatar">{getInitials(user.name)}</span>
                  <span className="nb-account__name">{firstName(user.name)}</span>
                  <ChevronDown size={15} />
                </button>

                {menuOpen && (
                  <div className="nb-menu" role="menu">
                    <div className="nb-menu__head">
                      <strong>{user.name}</strong>
                      <span>{user.email}</span>
                    </div>
                    <button role="menuitem" onClick={openBuilder}>
                      Open builder <ArrowRight size={15} />
                    </button>
                    <button role="menuitem" onClick={handleSignOut}>
                      Sign out <LogOut size={15} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="nb-btn nb-btn--ghost" onClick={handleSignIn}>
                <User size={16} />
                Sign in
              </button>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button
            className="nb__burger"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="nb-mobile"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* MOBILE PANEL */}
        <div id="nb-mobile" className={`nb__mobile ${open ? "is-open" : ""}`}>
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={active === l.id ? "is-active" : ""}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}

          <div className="nb__mobile-actions">
            {user ? (
              <>
                <div className="nb-mobile-user">
                  <span className="nb-avatar">{getInitials(user.name)}</span>
                  <div>
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                  </div>
                </div>
                <button className="nb-btn nb-btn--ghost" onClick={openBuilder}>
                  Open builder <ArrowRight size={16} />
                </button>
                <button className="nb-btn nb-btn--ghost" onClick={handleSignOut}>
                  <LogOut size={16} /> Sign out
                </button>
              </>
            ) : (
              <button className="nb-btn nb-btn--ghost" onClick={handleSignIn}>
                <User size={16} />
                Sign in
              </button>
            )}
          </div>
        </div>
      </header>

      {/* keeps page content below the fixed navbar */}
      <div className="nb-spacer" />
    </>
  );
}