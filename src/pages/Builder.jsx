
import {  useState } from "react";
import Sidebar from "../components/Sidebar";

export default function Builder() {
  // const [template, setTemplate] = useState("modern");
  const [showColors, setShowColors] = useState(false);
const template = localStorage.getItem("selectedTemplate") || "modern";
  const [data, setData] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
    image: "",
    skills: [],
    experience: [],
    projects: [],
    summary: "",
  });

  const colors = ["#fff", "#f3fce7", "#e5e5fc", "#e7f6fc", "#fcf5e0", "#f3e1ed"];

  // ✅ template load from Home
  // useEffect(() => {
  //   const saved = localStorage.getItem("selectedTemplate");
  //   if (saved) setTemplate(saved);
  // }, []);

  // ✅ change card background
  const setBg = (color) => {
    const card = document.querySelector(".resume-card");
    if (card) card.style.background = color;
  };

  return (
    <div className={`builder ${template}`}>
      <div className="builder-layout">

        {/* SIDEBAR */}
        <Sidebar data={data} setData={setData} />

        {/* PREVIEW */}
        <div className="pdf-wrapper">
        <div className="preview-section">
          <div className={`resume-card ${template}`}  style={{ color: data.textColor }}>

            {data.image && (
              <img src={data.image} className="profile-img" alt="profile" />
            )}

            <h1>{data.name || "Your Name"}</h1>
            <p>{data.title}</p>

            <div className="line"></div>

            <p><b>Email:</b> {data.email}</p>
            <p><b>Phone:</b> {data.phone}</p>

            


            {/* PROJECTS */}
            <h2>Projects</h2>
            <ul>
              {data.projects.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
            {/* PROJECTS */}
            <h2>Experience</h2>
            <ul>
              {data.experience.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>

            {/* SKILLS */}
            <h2>Skills</h2>
            <div className="skills">
              {data.skills.map((s, i) => (
                <span key={i}>{s}</span>
              ))}
            </div>

          </div>

            </div>
        </div>
      </div>
    

      {/* 🎨 THEME BUTTON */}
      <div className="theme-wrapper">

        <button
          className="theme-btn"
          onClick={() => setShowColors(!showColors)}
        >
          🎨 Theme
        </button>

        {showColors && (
          <div className="color-panel">
            {colors.map((c) => (
              <span
                key={c}
                onClick={() => setBg(c)}
                style={{ background: c }}
              ></span>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}