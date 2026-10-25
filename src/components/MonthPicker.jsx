import { useState, useEffect, useRef } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { formatMonth } from "../utils/experience";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const MIN_YEAR = 1970;

// value format: "YYYY-MM" (same as before, so saved data keeps working)
export default function MonthPicker({
  value,
  onChange,
  placeholder = "Select month",
  align = "left",
}) {
  const today = new Date();
  const thisYear = today.getFullYear();
  const maxYear = thisYear + 5;

  const match = /^(\d{4})-(\d{2})$/.exec(value || "");
  const selYear = match ? Number(match[1]) : null;
  const selMonth = match ? Number(match[2]) : null;

  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(selYear || thisYear);
  const wrapRef = useRef(null);

  // close on outside click or Escape
  useEffect(() => {
    if (!open) return;

    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const toggle = () => {
    if (!open) setYear(selYear || thisYear);
    setOpen((v) => !v);
  };

  const pick = (index) => {
    onChange(`${year}-${String(index + 1).padStart(2, "0")}`);
    setOpen(false);
  };

  const pickThisMonth = () => {
    onChange(`${thisYear}-${String(today.getMonth() + 1).padStart(2, "0")}`);
    setOpen(false);
  };

  const clear = () => {
    onChange("");
    setOpen(false);
  };

  return (
    <div className="mp" ref={wrapRef}>
      <button
        type="button"
        className={`mp-trigger ${value ? "has-value" : ""}`}
        onClick={toggle}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span>{value ? formatMonth(value) : placeholder}</span>
        <Calendar size={15} />
      </button>

      {open && (
        <div
          className={`mp-pop mp-pop--${align}`}
          role="dialog"
          aria-label="Choose month and year"
        >
          <div className="mp-head">
            <button
              type="button"
              className="mp-nav"
              onClick={() => setYear((y) => y - 1)}
              disabled={year <= MIN_YEAR}
              aria-label="Previous year"
            >
              <ChevronLeft size={16} />
            </button>
            <strong>{year}</strong>
            <button
              type="button"
              className="mp-nav"
              onClick={() => setYear((y) => y + 1)}
              disabled={year >= maxYear}
              aria-label="Next year"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="mp-grid">
            {MONTHS.map((m, i) => {
              const selected = selYear === year && selMonth === i + 1;
              const current = thisYear === year && today.getMonth() === i;
              return (
                <button
                  key={m}
                  type="button"
                  className={`mp-month ${selected ? "is-selected" : ""} ${
                    current ? "is-current" : ""
                  }`}
                  onClick={() => pick(i)}
                  aria-pressed={selected}
                >
                  {m}
                </button>
              );
            })}
          </div>

          <div className="mp-foot">
            <button type="button" className="mp-link" onClick={clear}>
              Clear
            </button>
            <button type="button" className="mp-link" onClick={pickThisMonth}>
              This month
            </button>
          </div>
        </div>
      )}
    </div>
  );
}