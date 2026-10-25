import { useState, useEffect, useRef } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { signIn, signUp } from "../utils/auth";
import "./AuthModal.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function AuthModal({ onClose, onSuccess }) {
  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const firstRef = useRef(null);

  const isSignup = mode === "signup";

  // Escape closes the modal
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // focus the first field when the form changes
  useEffect(() => {
    firstRef.current?.focus();
  }, [mode]);

  const setField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const switchMode = (next) => {
    setMode(next);
    setError("");
    setShowPw(false);
  };

  const validate = () => {
    if (isSignup && !form.name.trim()) return "Please enter your name.";
    if (!EMAIL_RE.test(form.email.trim())) return "Please enter a valid email address.";
    if (form.password.length < 8) return "Password must be at least 8 characters.";
    return "";
  };

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const message = validate();
    if (message) {
      setError(message);
      return;
    }

    setError("");
    setLoading(true);
    try {
      const user = isSignup ? await signUp(form) : await signIn(form);
      onSuccess(user, mode);
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="am-overlay" onClick={onClose}>
      <div
        className="am"
        role="dialog"
        aria-modal="true"
        aria-labelledby="am-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="am__close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div className="am__tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={!isSignup}
            className={!isSignup ? "is-active" : ""}
            onClick={() => switchMode("signin")}
          >
            Sign in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={isSignup}
            className={isSignup ? "is-active" : ""}
            onClick={() => switchMode("signup")}
          >
            Create account
          </button>
        </div>

        <h3 id="am-title">{isSignup ? "Create your account" : "Welcome back"}</h3>
        <p className="am__sub">
          {isSignup
            ? "Start building resumes that get noticed."
            : "Sign in to continue to your resume builder."}
        </p>

        <form onSubmit={submit} noValidate>
          {isSignup && (
            <div className="am__field">
              <label htmlFor="am-name">Full name</label>
              <input
                id="am-name"
                ref={firstRef}
                type="text"
                value={form.name}
                onChange={setField("name")}
                placeholder="Alex Morgan"
                autoComplete="name"
              />
            </div>
          )}

          <div className="am__field">
            <label htmlFor="am-email">Email</label>
            <input
              id="am-email"
              ref={isSignup ? null : firstRef}
              type="email"
              value={form.email}
              onChange={setField("email")}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div className="am__field">
            <label htmlFor="am-password">Password</label>
            <div className="am__pw">
              <input
                id="am-password"
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={setField("password")}
                placeholder={isSignup ? "At least 8 characters" : "Your password"}
                autoComplete={isSignup ? "new-password" : "current-password"}
              />
              <button
                type="button"
                className="am__eye"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="am__error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="am__submit" disabled={loading}>
            {loading ? (
              <>
                <span className="am__spinner" aria-hidden="true" />
                {isSignup ? "Creating account..." : "Signing in..."}
              </>
            ) : isSignup ? (
              "Create account"
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <p className="am__switch">
          {isSignup ? "Already have an account?" : "New here?"}{" "}
          <button
            type="button"
            onClick={() => switchMode(isSignup ? "signin" : "signup")}
          >
            {isSignup ? "Sign in" : "Create an account"}
          </button>
        </p>

        <p className="am__demo">
          Demo project: accounts are saved only in this browser. Please don't use a
          real password.
        </p>
      </div>
    </div>
  );
}