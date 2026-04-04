import { useState } from "react";

export default function FloatingTheme({ setTheme }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="floating">

      <button className="fab" onClick={() => setOpen(!open)}>
        🎨
      </button>

      {open && (
        <div className="popup">

          <div onClick={() => setTheme("gold")} className="gold"></div>
          <div onClick={() => setTheme("dark")} className="dark"></div>
          <div onClick={() => setTheme("light")} className="light"></div>

        </div>
      )}

    </div>
  );
}