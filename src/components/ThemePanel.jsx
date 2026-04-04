export default function ThemePanel({ setTheme }) {

  const colors = [
    { bg: "#f7f5f2", text: "#2a2a2a" },
    { bg: "#e5f0ff", text: "#1D3557" },
    { bg: "#fff4e1", text: "#5C3C00" }
  ];

  return (
    <div className="themePanel">
      {colors.map((c, i) => (
        <div
          key={i}
          className="colorBox"
          style={{ background: c.bg }}
          onClick={() => setTheme(c)}
        />
      ))}
    </div>
  );
}