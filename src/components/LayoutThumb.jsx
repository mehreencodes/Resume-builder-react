import { getTheme, cssBackground } from "../utils/resumeThemes";
import "./LayoutThumb.css";

export default function LayoutThumb({ layout = "classic", color = "modern" }) {
  const theme = getTheme(color);
  const style = {
    "--lt-bg": cssBackground(theme),
    "--lt-ink": theme.text,
    "--lt-side": theme.chip,
    "--lt-band": theme.line,
  };

  if (layout === "sidebar") {
    return (
      <div className="lt lt--sidebar" style={style} aria-hidden="true">
        <div className="lt__side">
          <span className="lt__avatar" />
          <span className="lt__line" />
          <span className="lt__line lt__line--short" />
          <span className="lt__line" />
          <span className="lt__line lt__line--short" />
        </div>
        <div className="lt__main">
          <span className="lt__line lt__line--title" />
          <span className="lt__line lt__line--sub" />
          <span className="lt__gap" />
          <span className="lt__line lt__line--head" />
          <span className="lt__line" />
          <span className="lt__line lt__line--short" />
          <span className="lt__line lt__line--head" />
          <span className="lt__line" />
          <span className="lt__line" />
        </div>
      </div>
    );
  }

  if (layout === "banner") {
    return (
      <div className="lt lt--banner" style={style} aria-hidden="true">
        <div className="lt__band">
          <span className="lt__avatar" />
          <div className="lt__id">
            <span className="lt__line lt__line--title" />
            <span className="lt__line lt__line--sub" />
          </div>
        </div>
        <div className="lt__body">
          <span className="lt__line lt__line--head" />
          <span className="lt__line" />
          <span className="lt__line lt__line--short" />
          <span className="lt__line lt__line--head" />
          <span className="lt__line" />
          <span className="lt__line" />
          <span className="lt__line lt__line--short" />
        </div>
      </div>
    );
  }

  return (
    <div className={`lt lt--${layout}`} style={style} aria-hidden="true">
      <div className="lt__head">
        <span className="lt__avatar" />
        <div className="lt__id">
          <span className="lt__line lt__line--title" />
          <span className="lt__line lt__line--sub" />
        </div>
      </div>
      <span className="lt__line lt__line--head" />
      <span className="lt__line" />
      <span className="lt__line lt__line--short" />
      <span className="lt__line lt__line--head" />
      <span className="lt__line" />
      <span className="lt__line" />
      <span className="lt__line lt__line--short" />
      {layout === "compact" && (
        <>
          <span className="lt__line lt__line--head" />
          <span className="lt__line" />
          <span className="lt__line" />
          <span className="lt__line lt__line--short" />
          <span className="lt__line" />
        </>
      )}
    </div>
  );
}