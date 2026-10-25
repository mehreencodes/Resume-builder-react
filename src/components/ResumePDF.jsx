import { Fragment } from "react";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  Link,
  Svg,
  Defs,
  LinearGradient,
  Stop,
  Rect,
  StyleSheet,
} from "@react-pdf/renderer";
import { toHref, displayUrl } from "../utils/links";
import {
  normalizeExperience,
  hasExperienceContent,
  formatDateRange,
  splitBullets,
} from "../utils/experience";

const PAGE_W = 595.28; // A4 in points
const PAGE_H = 841.89;
const SIDEBAR_W = 190;
const SEP = "   |   ";

// f = font scale, g = spacing scale (compact uses smaller values)
const build = (f, g) => {
  const fs = (v) => Math.round(v * f * 100) / 100;
  const sp = (v) => Math.round(v * g * 100) / 100;

  return StyleSheet.create({
    page: {
      paddingTop: sp(40),
      paddingBottom: sp(44),
      paddingLeft: sp(44),
      paddingRight: sp(44),
      fontFamily: "Helvetica",
      fontSize: fs(10),
      lineHeight: 1.45,
    },
    pageSidebar: {
      paddingTop: 40,
      paddingBottom: 44,
      paddingLeft: SIDEBAR_W + 28,
      paddingRight: 40,
    },
    center: { textAlign: "center" },

    /* headers */
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingBottom: sp(14),
    },
    headerRow: { flexDirection: "row", alignItems: "center" },
    headerCentered: { alignItems: "center", paddingBottom: sp(14) },
    bannerHead: {
      marginTop: -sp(40),
      marginLeft: -sp(44),
      marginRight: -sp(44),
      marginBottom: sp(2),
      paddingTop: sp(40),
      paddingBottom: sp(20),
      paddingLeft: sp(44),
      paddingRight: sp(44),
    },
    mainHead: { paddingBottom: 14 },
    photo: {
      width: sp(66),
      height: sp(66),
      borderRadius: sp(33),
      objectFit: "cover",
      marginRight: sp(16),
    },
    photoCentered: {
      width: sp(72),
      height: sp(72),
      borderRadius: sp(36),
      objectFit: "cover",
      marginBottom: sp(10),
    },
    idBlock: { flex: 1 },
    name: { fontFamily: "Helvetica-Bold", fontSize: fs(24), lineHeight: 1.15 },
    title: { fontSize: fs(12), marginTop: sp(3) },
    contact: { fontSize: fs(9.5), marginTop: sp(6) },
    rule: { height: 0.8 },

    /* sections */
    section: { marginTop: sp(18) },
    heading: {
      fontFamily: "Helvetica-Bold",
      fontSize: fs(9),
      letterSpacing: 1.4,
      textTransform: "uppercase",
      marginBottom: sp(5),
    },
    headRule: { height: 0.8, marginBottom: sp(9) },
    row: { flexDirection: "row", marginBottom: sp(5) },
    bullet: { width: 12 },
    rowText: { flex: 1 },
    job: { marginBottom: sp(8) },
    jobHead: { marginBottom: sp(4) },
    jobTitleRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    jobRole: { flex: 1, fontFamily: "Helvetica-Bold", fontSize: fs(10.5) },
    jobDates: { fontSize: fs(9.5), marginLeft: 10 },
    jobCompany: { fontSize: fs(9.5), marginTop: 1 },
    eduItem: { marginBottom: sp(7) },
    eduDegree: { fontFamily: "Helvetica-Bold", fontSize: fs(10.5) },
    eduMeta: { fontSize: fs(9.5), marginTop: 1 },
    chips: { flexDirection: "row", flexWrap: "wrap" },
    chip: {
      paddingVertical: sp(3),
      paddingHorizontal: sp(9),
      borderRadius: 9,
      marginRight: 5,
      marginBottom: sp(5),
    },
    chipText: { fontSize: fs(9) },

    /* sidebar layout (not scaled) */
    sideStrip: {
      position: "absolute",
      top: 0,
      left: 0,
      width: SIDEBAR_W,
      height: PAGE_H,
    },
    sideWrap: {
      position: "absolute",
      top: 0,
      left: 0,
      width: SIDEBAR_W,
      paddingTop: 40,
      paddingBottom: 30,
      paddingLeft: 20,
      paddingRight: 20,
    },
    sidePhoto: {
      width: 84,
      height: 84,
      borderRadius: 42,
      objectFit: "cover",
      marginBottom: 18,
    },
    sideBlock: { marginBottom: 16 },
    sideHeading: {
      fontFamily: "Helvetica-Bold",
      fontSize: 8.5,
      letterSpacing: 1.3,
      textTransform: "uppercase",
      marginBottom: 5,
    },
    sideRule: { height: 0.8, marginBottom: 7 },
    sideText: { fontSize: 8.5, lineHeight: 1.4, marginBottom: 4 },
    sideEdu: { marginBottom: 7 },
    sideEduDegree: { fontFamily: "Helvetica-Bold", fontSize: 9, marginBottom: 1 },
    sideChip: {
      paddingVertical: 2.5,
      paddingHorizontal: 7,
      borderRadius: 8,
      marginRight: 4,
      marginBottom: 4,
    },
    sideChipText: { fontSize: 8 },
  });
};

const STYLES = {
  normal: build(1, 1),
  compact: build(0.9, 0.72),
};

function Heading({ s, title, theme, center }) {
  return (
    <>
      <Text style={[s.heading, { color: theme.text }, center ? s.center : {}]}>
        {title}
      </Text>
      <View style={[s.headRule, { backgroundColor: theme.line }]} />
    </>
  );
}

function SideHeading({ s, title, theme }) {
  return (
    <>
      <Text style={[s.sideHeading, { color: theme.text }]}>{title}</Text>
      <View style={[s.sideRule, { backgroundColor: theme.line }]} />
    </>
  );
}

function Bullet({ s, item, theme }) {
  return (
    <View style={s.row} wrap={false}>
      <Text style={[s.bullet, { color: theme.text }]}>{"\u2022"}</Text>
      <Text style={[s.rowText, { color: theme.text }]}>{item}</Text>
    </View>
  );
}

function JobHead({ s, job, theme }) {
  const dates = formatDateRange(job);
  if (!job.role.trim() && !job.company.trim() && !dates) return null;

  return (
    <View style={s.jobHead}>
      {job.role.trim() || dates ? (
        <View style={s.jobTitleRow}>
          <Text style={[s.jobRole, { color: theme.text }]}>{job.role}</Text>
          {dates ? (
            <Text style={[s.jobDates, { color: theme.muted }]}>{dates}</Text>
          ) : null}
        </View>
      ) : null}
      {job.company.trim() ? (
        <Text style={[s.jobCompany, { color: theme.muted }]}>{job.company}</Text>
      ) : null}
    </View>
  );
}

// Heading stays together with the first job's title and first bullet
function ExperienceSection({ s, jobs, theme, center }) {
  return (
    <View style={s.section}>
      {jobs.map((job, i) => {
        const bullets = splitBullets(job.bullets);
        return (
          <View key={i} style={s.job}>
            <View wrap={false}>
              {i === 0 ? (
                <Heading s={s} title="Experience" theme={theme} center={center} />
              ) : null}
              <JobHead s={s} job={job} theme={theme} />
              {bullets[0] ? <Bullet s={s} item={bullets[0]} theme={theme} /> : null}
            </View>
            {bullets.slice(1).map((b, j) => (
              <Bullet key={j} s={s} item={b} theme={theme} />
            ))}
          </View>
        );
      })}
    </View>
  );
}

function EduItem({ s, item, theme }) {
  const meta = [item.school, item.year].filter((x) => x?.trim()).join(SEP);
  return (
    <View style={s.eduItem} wrap={false}>
      {item.degree?.trim() ? (
        <Text style={[s.eduDegree, { color: theme.text }]}>{item.degree}</Text>
      ) : null}
      {meta ? <Text style={[s.eduMeta, { color: theme.muted }]}>{meta}</Text> : null}
    </View>
  );
}

// Heading always stays together with the first item
function ListSection({ s, title, items, theme, renderItem, center }) {
  const [first, ...rest] = items;
  return (
    <View style={s.section}>
      <View wrap={false}>
        <Heading s={s} title={title} theme={theme} center={center} />
        {renderItem(first, 0)}
      </View>
      {rest.map((item, i) => renderItem(item, i + 1))}
    </View>
  );
}

// Short sections: move to the next page as one block
function BlockSection({ s, title, theme, center, children }) {
  return (
    <View style={s.section} wrap={false}>
      <Heading s={s} title={title} theme={theme} center={center} />
      {children}
    </View>
  );
}

function InfoLine({ parts, style }) {
  if (!parts.length) return null;
  return (
    <Text style={style}>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {i > 0 ? SEP : ""}
          {part}
        </Fragment>
      ))}
    </Text>
  );
}

export default function ResumePDF({ data, theme, layout = "classic" }) {
  const sidebar = layout === "sidebar";
  const centered = layout === "centered";
  const banner = layout === "banner";
  const compact = layout === "compact";
  const s = compact ? STYLES.compact : STYLES.normal;

  const experience = normalizeExperience(data.experience).filter(
    hasExperienceContent
  );
  const projects = (data.projects || []).filter((p) => p.trim());
  const education = (data.education || []).filter(
    (e) => e.degree?.trim() || e.school?.trim() || e.year?.trim()
  );
  const skills = data.skills || [];
  const name = data.name?.trim() || "Your Name";

  // text on the colored banner uses the full text color for contrast
  const metaColor = banner ? theme.text : theme.muted;
  const linkStyle = { color: metaColor, textDecoration: "none" };
  const sideLinkStyle = { color: theme.text, textDecoration: "none" };

  const linkEntries = [
    ["linkedin", data.linkedin],
    ["github", data.github],
    ["website", data.website],
  ].filter(([, value]) => value?.trim());

  // line 1: email, phone, location
  const infoParts = [];
  if (data.email?.trim()) {
    infoParts.push(
      <Link key="email" src={`mailto:${data.email.trim()}`} style={linkStyle}>
        {data.email.trim()}
      </Link>
    );
  }
  if (data.phone?.trim()) infoParts.push(data.phone.trim());
  if (data.location?.trim()) infoParts.push(data.location.trim());

  // line 2: links
  const linkParts = linkEntries.map(([key, value]) => (
    <Link key={key} src={toHref(value)} style={linkStyle}>
      {displayUrl(value)}
    </Link>
  ));

  // sidebar: one contact item per line
  const sideContact = [];
  if (data.email?.trim()) {
    sideContact.push(
      <Link key="email" src={`mailto:${data.email.trim()}`} style={sideLinkStyle}>
        {data.email.trim()}
      </Link>
    );
  }
  if (data.phone?.trim()) sideContact.push(data.phone.trim());
  if (data.location?.trim()) sideContact.push(data.location.trim());
  linkEntries.forEach(([key, value]) => {
    sideContact.push(
      <Link key={key} src={toHref(value)} style={sideLinkStyle}>
        {displayUrl(value)}
      </Link>
    );
  });

  /* ---------- header ---------- */
  let header;
  if (sidebar) {
    header = (
      <>
        <View style={s.mainHead}>
          <Text style={[s.name, { color: theme.text }]}>{name}</Text>
          {data.title ? (
            <Text style={[s.title, { color: theme.muted }]}>{data.title}</Text>
          ) : null}
        </View>
        <View style={[s.rule, { backgroundColor: theme.line }]} />
      </>
    );
  } else if (centered) {
    header = (
      <>
        <View style={s.headerCentered}>
          {data.image ? <Image src={data.image} style={s.photoCentered} /> : null}
          <Text style={[s.name, s.center, { color: theme.text }]}>{name}</Text>
          {data.title ? (
            <Text style={[s.title, s.center, { color: theme.muted }]}>
              {data.title}
            </Text>
          ) : null}
          <InfoLine
            parts={infoParts}
            style={[s.contact, s.center, { color: metaColor, marginTop: 8 }]}
          />
          <InfoLine
            parts={linkParts}
            style={[s.contact, s.center, { color: metaColor }]}
          />
        </View>
        <View style={[s.rule, { backgroundColor: theme.line }]} />
      </>
    );
  } else if (banner) {
    header = (
      <View style={[s.bannerHead, { backgroundColor: theme.line }]}>
        <View style={s.headerRow}>
          {data.image ? <Image src={data.image} style={s.photo} /> : null}
          <View style={s.idBlock}>
            <Text style={[s.name, { color: theme.text }]}>{name}</Text>
            {data.title ? (
              <Text style={[s.title, { color: theme.text }]}>{data.title}</Text>
            ) : null}
            <InfoLine
              parts={infoParts}
              style={[s.contact, { color: metaColor, marginTop: 8 }]}
            />
            <InfoLine
              parts={linkParts}
              style={[s.contact, { color: metaColor }]}
            />
          </View>
        </View>
      </View>
    );
  } else {
    // classic + compact
    header = (
      <>
        <View style={s.header}>
          {data.image ? <Image src={data.image} style={s.photo} /> : null}
          <View style={s.idBlock}>
            <Text style={[s.name, { color: theme.text }]}>{name}</Text>
            {data.title ? (
              <Text style={[s.title, { color: theme.muted }]}>{data.title}</Text>
            ) : null}
            <InfoLine
              parts={infoParts}
              style={[s.contact, { color: metaColor, marginTop: 8 }]}
            />
            <InfoLine
              parts={linkParts}
              style={[s.contact, { color: metaColor }]}
            />
          </View>
        </View>
        <View style={[s.rule, { backgroundColor: theme.line }]} />
      </>
    );
  }

  return (
    <Document title={`${name} - Resume`} author={name} creator="ResumeBuilder">
      <Page
        size="A4"
        style={[
          s.page,
          sidebar ? s.pageSidebar : {},
          { backgroundColor: theme.baseBg, color: theme.text },
        ]}
      >
        {/* gradient background, repeated on every page */}
        {theme.gradient && (
          <Svg
            fixed
            style={{ position: "absolute", top: 0, left: 0 }}
            width={PAGE_W}
            height={PAGE_H}
            viewBox={`0 0 ${PAGE_W} ${PAGE_H}`}
          >
            <Defs>
              <LinearGradient id="pageBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={theme.gradient[0]} />
                <Stop offset="100%" stopColor={theme.gradient[1]} />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width={PAGE_W} height={PAGE_H} fill="url(#pageBg)" />
          </Svg>
        )}

        {/* SIDEBAR: colored strip on every page + content on the first page */}
        {sidebar && (
          <>
            <View fixed style={[s.sideStrip, { backgroundColor: theme.chip }]} />

            <View style={s.sideWrap}>
              {data.image ? <Image src={data.image} style={s.sidePhoto} /> : null}

              {sideContact.length > 0 && (
                <View style={s.sideBlock}>
                  <SideHeading s={s} title="Contact" theme={theme} />
                  {sideContact.map((node, i) => (
                    <Text key={i} style={[s.sideText, { color: theme.text }]}>
                      {node}
                    </Text>
                  ))}
                </View>
              )}

              {education.length > 0 && (
                <View style={s.sideBlock}>
                  <SideHeading s={s} title="Education" theme={theme} />
                  {education.map((e, i) => (
                    <View key={i} style={s.sideEdu}>
                      {e.degree?.trim() ? (
                        <Text style={[s.sideEduDegree, { color: theme.text }]}>
                          {e.degree}
                        </Text>
                      ) : null}
                      {[e.school, e.year]
                        .filter((x) => x?.trim())
                        .map((line, j) => (
                          <Text
                            key={j}
                            style={[
                              s.sideText,
                              { color: theme.muted, marginBottom: 1 },
                            ]}
                          >
                            {line}
                          </Text>
                        ))}
                    </View>
                  ))}
                </View>
              )}

              {skills.length > 0 && (
                <View style={s.sideBlock}>
                  <SideHeading s={s} title="Skills" theme={theme} />
                  <View style={s.chips}>
                    {skills.map((skill, i) => (
                      <View
                        key={`${skill}-${i}`}
                        style={[s.sideChip, { backgroundColor: theme.line }]}
                      >
                        <Text style={[s.sideChipText, { color: theme.text }]}>
                          {skill}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </>
        )}

        {header}

        {/* SUMMARY */}
        {data.summary?.trim() ? (
          <BlockSection s={s} title="Summary" theme={theme} center={centered}>
            <Text style={[{ color: theme.text }, centered ? s.center : {}]}>
              {data.summary}
            </Text>
          </BlockSection>
        ) : null}

        {/* EXPERIENCE */}
        {experience.length > 0 && (
          <ExperienceSection
            s={s}
            jobs={experience}
            theme={theme}
            center={centered}
          />
        )}

        {/* PROJECTS */}
        {projects.length > 0 && (
          <ListSection
            s={s}
            title="Projects"
            items={projects}
            theme={theme}
            center={centered}
            renderItem={(item, i) => (
              <Bullet key={i} s={s} item={item} theme={theme} />
            )}
          />
        )}

        {/* EDUCATION (in the sidebar layout it lives in the left column) */}
        {!sidebar && education.length > 0 && (
          <ListSection
            s={s}
            title="Education"
            items={education}
            theme={theme}
            center={centered}
            renderItem={(item, i) => (
              <EduItem key={i} s={s} item={item} theme={theme} />
            )}
          />
        )}

        {/* SKILLS (in the sidebar layout it lives in the left column) */}
        {!sidebar && skills.length > 0 && (
          <BlockSection s={s} title="Skills" theme={theme} center={centered}>
            <View style={s.chips}>
              {skills.map((skill, i) => (
                <View
                  key={`${skill}-${i}`}
                  style={[s.chip, { backgroundColor: theme.chip }]}
                >
                  <Text style={[s.chipText, { color: theme.text }]}>{skill}</Text>
                </View>
              ))}
            </View>
          </BlockSection>
        )}
      </Page>
    </Document>
  );
}