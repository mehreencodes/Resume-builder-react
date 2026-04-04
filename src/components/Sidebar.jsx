import { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function Sidebar({ data, setData }) {

  const [skillInput, setSkillInput] = useState("");
// const [showColors, setShowColors] = useState(false);
 const [textColor, setTextColor] = useState("#000000");

const handleChange = (e) => {
  const { name, value } = e.target;

  // projects & experience ko array me convert karo
  if (name === "projects" || name === "experience") {
    setData({
      ...data,
      [name]: value
        .split("\n") // line break pe split
        .filter((item) => item.trim() !== ""), // empty remove
    });
  } else {
    setData({
      ...data,
      [name]: value,
    });
  }
};
  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setData({ ...data, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;
    setData({
      ...data,
      skills: [...data.skills, skillInput],
    });
    setSkillInput("");
  };

  const removeSkill = (index) => {
    const updated = data.skills.filter((_, i) => i !== index);
    setData({ ...data, skills: updated });
  };


const downloadPDF = () => {
  const input = document.querySelector(".pdf-wrapper");

  html2canvas(input, {
    scale: 2,
    useCORS: true,
    scrollY: 0,
  }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = 250;
    const pdfHeight = 297;

    pdf.addImage(imgData, "PNG", 0, -4.5, pdfWidth, pdfHeight);

    pdf.save("resume.pdf");
  });
};
  return (
    <div className="sidebar">

      <h2>Resume Editor</h2>

      <input name="name" onChange={handleChange} placeholder="Full Name" />
      <input name="title" onChange={handleChange} placeholder="Title" />
      <input name="email" onChange={handleChange} placeholder="Email" />
      <input name="phone" onChange={handleChange} placeholder="Phone" />


    
   

<textarea
  name="projects"
  onChange={handleChange}
  placeholder="Projects (each line = one project)"
/>

<textarea
  name="experience"
  onChange={handleChange}
  placeholder="Experience (each line = one experience)"
/>
      {/* IMAGE */}
      <label>Profile Image</label>
      <input type="file" onChange={handleImage} />
      {/* SKILLS INLINE */}
      <div className="skill-box">

        <input
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          placeholder="Add Skill"
        />

        <button className="pdf-btn-save" onClick={addSkill}>Add</button>

      </div>

      {/* SKILL LIST */}
      <div className="skill-list">
        {data.skills.map((s, i) => (
          <div key={i} className="skill-item">
            {s}
            <span onClick={() => removeSkill(i)}>❌</span>
          </div>
        ))}
      </div>

{/* TEXT COLOR */}
<h3>Text Color</h3>

<input
  type="color"
  value={textColor}
  onChange={(e) => {
    setTextColor(e.target.value);
    setData({ ...data, textColor: e.target.value });
  }}
/>


      {/* PDF BUTTON */}
      <button className="pdf-btn" onClick={downloadPDF}>
        Download PDF
      </button>

    

    </div>
  );
}



{/* <div className="theme-wrapper">

 
  <button
    className="theme-btn"
    onClick={() => setShowColors(!showColors)}
  >
    🎨 Theme
  </button>

  {showColors && (
    <div className="color-panel">

      {["#fff", "#f5f5f5", "#7d7da7", "#636262", "#ffeaa7"].map((c) => (
        <span
          key={c}
          onClick={() =>
            document.querySelector(".resume-card").style.background = c
          }
          style={{ background: c }}
        ></span>
      ))}

    </div>
  )}

</div> */}