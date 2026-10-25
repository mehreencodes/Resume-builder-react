import { Mail, Phone, MapPin, Globe, Link2 } from "lucide-react";
import { toHref, displayUrl } from "../utils/links";
import {
  normalizeExperience,
  hasExperienceContent,
  formatDateRange,
  splitBullets,
} from "../utils/experience";

function ContactItems({ data }) {
  return (
    <>
      {data.email && (
        <span>
          <Mail size={13} /> {data.email}
        </span>
      )}
      {data.phone && (
        <span>
          <Phone size={13} /> {data.phone}
        </span>
      )}
      {data.location && (
        <span>
          <MapPin size={13} /> {data.location}
        </span>
      )}
      {data.linkedin && (
        <a href={toHref(data.linkedin)} target="_blank" rel="noreferrer">
          <Link2 size={13} /> {displayUrl(data.linkedin)}
        </a>
      )}
      {data.github && (
        <a href={toHref(data.github)} target="_blank" rel="noreferrer">
          <Link2 size={13} /> {displayUrl(data.github)}
        </a>
      )}
      {data.website && (
        <a href={toHref(data.website)} target="_blank" rel="noreferrer">
          <Globe size={13} /> {displayUrl(data.website)}
        </a>
      )}
    </>
  );
}

function SummarySection({ summary }) {
  if (!summary) return null;
  return (
    <section className="rc-section">
      <h2>Summary</h2>
      <p className="rc-text">{summary}</p>
    </section>
  );
}

function ExperienceSection({ jobs }) {
  if (!jobs.length) return null;
  return (
    <section className="rc-section">
      <h2>Experience</h2>
      {jobs.map((job, i) => {
        const dates = formatDateRange(job);
        const bullets = splitBullets(job.bullets);
        return (
          <div className="rc-job" key={i}>
            {(job.role.trim() || dates) && (
              <div className="rc-job__head">
                <strong>{job.role}</strong>
                {dates && <span className="rc-job__dates">{dates}</span>}
              </div>
            )}
            {job.company.trim() && (
              <div className="rc-job__company">{job.company}</div>
            )}
            {bullets.length > 0 && (
              <ul>
                {bullets.map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </section>
  );
}

function ProjectsSection({ items }) {
  if (!items.length) return null;
  return (
    <section className="rc-section">
      <h2>Projects</h2>
      <ul>
        {items.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
    </section>
  );
}

function EducationSection({ items }) {
  if (!items.length) return null;
  return (
    <section className="rc-section">
      <h2>Education</h2>
      {items.map((e, i) => (
        <div className="rc-edu__item" key={i}>
          {e.degree?.trim() && <strong>{e.degree}</strong>}
          {(e.school?.trim() || e.year?.trim()) && (
            <span>
              {[e.school, e.year].filter((x) => x?.trim()).join("  |  ")}
            </span>
          )}
        </div>
      ))}
    </section>
  );
}

function SkillsSection({ skills }) {
  if (!skills.length) return null;
  return (
    <section className="rc-section">
      <h2>Skills</h2>
      <div className="skills">
        {skills.map((s, i) => (
          <span key={i}>{s}</span>
        ))}
      </div>
    </section>
  );
}

export default function ResumePreview({
  data,
  layout = "classic",
  cardRef,
  bodyRef,
  style,
  pages = 1,
  pageH = 0,
}) {
  const jobs = normalizeExperience(data.experience).filter(hasExperienceContent);
  const projects = (data.projects || []).filter((p) => p.trim());
  const education = (data.education || []).filter(
    (e) => e.degree?.trim() || e.school?.trim() || e.year?.trim()
  );
  const skills = data.skills || [];
  const name = data.name || "Your Name";

  const hasContact =
    data.email ||
    data.phone ||
    data.location ||
    data.linkedin ||
    data.github ||
    data.website;

  const photo = data.image ? (
    <img src={data.image} className="profile-img" alt="Profile" />
  ) : null;

  let body;

  if (layout === "sidebar") {
    body = (
      <div ref={bodyRef} className="rc-body">
        <aside className="rc-side">
          {photo}

          {hasContact && (
            <section className="rc-section">
              <h2>Contact</h2>
              <div className="rc-contact">
                <ContactItems data={data} />
              </div>
            </section>
          )}

          <EducationSection items={education} />
          <SkillsSection skills={skills} />
        </aside>

        <div className="rc-main">
          <div className="rc-id rc-namebox">
            <h1>{name}</h1>
            {data.title && <p className="rc-title">{data.title}</p>}
          </div>

          <SummarySection summary={data.summary} />
          <ExperienceSection jobs={jobs} />
          <ProjectsSection items={projects} />
        </div>
      </div>
    );
  } else {
    body = (
      <div ref={bodyRef} className="rc-body">
        <div className="rc-header">
          {photo}
          <div className="rc-id">
            <h1>{name}</h1>
            {data.title && <p className="rc-title">{data.title}</p>}
            {hasContact && (
              <div className="rc-contact">
                <ContactItems data={data} />
              </div>
            )}
          </div>
        </div>

        <SummarySection summary={data.summary} />
        <ExperienceSection jobs={jobs} />
        <ProjectsSection items={projects} />
        <EducationSection items={education} />
        <SkillsSection skills={skills} />
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      className={`resume-card layout-${layout}`}
      style={style}
    >
      {body}

      {/* PAGE BREAK GUIDES */}
      {Array.from({ length: Math.max(0, pages - 1) }, (_, i) => (
        <div
          key={i}
          className="rc-pagebreak"
          style={{ top: (i + 1) * pageH }}
        >
          <span>Page {i + 2}</span>
        </div>
      ))}
    </div>
  );
}