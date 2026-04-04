/*import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Home() {
  const navigate = useNavigate();
  const [showTemplates, setShowTemplates] = useState(false);

  const selectTemplate = (template) => {
    localStorage.setItem("selectedTemplate", template);
    navigate("/builder");
  };

  return (
    <div className="home">
  <div className="bubbles">
  <span className="bubble"></span>
  <span className="bubble"></span>
  <span className="bubble"></span>
  <span className="bubble"></span>
  <span className="bubble"></span>
  <span className="bubble"></span>
</div>

      <div className="orb o1"></div>
      <div className="orb o2"></div>
      <div className="orb o3"></div>

     
      
   
        <div className="center-box animate-text">

  <h1 className="title">
    Build a <span>Powerful Resume</span> in Minutes
  </h1>

  <p>
    Modern ATS-friendly resumes with live preview & instant PDF export
  </p>

  <div className="hero-btns">
    <button onClick={() => navigate("/builder")}>
      Start Building
    </button>

    <button
      className="outline"
      onClick={() => setShowTemplates(true)}
    >
      View Templates
    </button>
  </div>

</div>

     
      {showTemplates && (
        <div className="modal-overlay">

          <div className="modal">

            <h2>Choose Template</h2>

            <div className="grid">

              <div className="card" onClick={() => selectTemplate("modern")}>
                <div className="preview modern"></div>
                <h4>Modern Gold</h4>
              </div>

              <div className="card" onClick={() => selectTemplate("dark")}>
                <div className="preview dark"></div>
                <h4>Dark Pro</h4>
              </div>

              <div className="card" onClick={() => selectTemplate("minimal")}>
                <div className="preview minimal"></div>
                <h4>Minimal</h4>
              </div>

              <div className="card" onClick={() => selectTemplate("creative")}>
                <div className="preview creative"></div>
                <h4>Creative</h4>
              </div>

            </div>

            <button
              className="close-btn"
              onClick={() => setShowTemplates(false)}
            >
              Close
            </button>

          </div>

        </div>
      )}

    </div>
 
  );
}*/
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { User } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [showTemplates, setShowTemplates] = useState(false);
const [showLogin, setShowLogin] = useState(false);
const [loggedIn, setLoggedIn] = useState(false);
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
 const [error, setError] = useState("");

  const templates = [
    "modern",
    "dark",
    "minimal",
    "creative",
    "corporate",
    "tech",
    "elegant",
    "bold",
    "classic",
   "Brand"
  ];

  const selectTemplate = (template) => {
    localStorage.setItem("selectedTemplate", template);
    navigate("/builder");
  };

  return (
    <div className="home">

<div className="logo">
  <span className="logo-dot"></span>
  ResumeBuilder
</div>

{/* LOGIN ICON */}
      <div
        className="login-btn"
        onClick={() => setShowLogin(true)}
      >
        <User size={18} />
      </div>

      {/* LOGIN MODAL */}
      {showLogin && (
        <div
          className="modal-overlay"
          onClick={() => setShowLogin(false)}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Login</h3>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="error">{error}</p>}

            <button
              onClick={() => {
                if (email.trim() === "" || password.trim() === "") {
                  setError("Please fill all fields");
                  return;
                }

                setError("");
                setShowLogin(false);
                setLoggedIn(true);
              }}
            >
              Login
            </button>

          </div>
        </div>
      )}

      {/* SUCCESS CARD */}
      {loggedIn && (
        <div className="success-card">
          <h3>🎉 You are logged in!</h3>
          <p>Welcome back! Your resume builder is ready.</p>

          <button onClick={() => setLoggedIn(false)}>
            Close
          </button>
        </div>
      )}

  
      {/* 🌌 BACKGROUND EFFECTS */}
      <div className="bg-orb o1"></div>
      <div className="bg-orb o2"></div>
      <div className="bg-orb o3"></div>

      {/* floating bubbles */}
      <div className="bubbles">
        <span></span><span></span><span></span>
        <span></span><span></span><span></span>
      </div>

      {/* HERO SECTION */}
      <div className="hero">
        <h1>
          Build a <span>Powerful Resume</span> in Minutes
        </h1>

        <p>
          Modern ATS-friendly resumes • Live preview • Instant PDF export
        </p>

        <div className="hero-btns">
          <button onClick={() => navigate("/builder")}>
            Start Building
          </button>

          <button onClick={() => setShowTemplates(true)}>
            Use Templates
          </button>
        </div>
      </div>

      {/* TEMPLATE MODAL */}
      {showTemplates && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Choose Your Template</h2>

            <div className="grid">
              {templates.map((t) => (
                <div
                  key={t}
                  className="card"
                  onClick={() => selectTemplate(t)}
                >
                  <div className={`preview ${t}`}></div>
                  <h4>{t.toUpperCase()}</h4>
                </div>
              ))}
            </div>

            <button className="close-btn" onClick={() => setShowTemplates(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}