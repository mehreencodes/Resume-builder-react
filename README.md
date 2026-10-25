# Resume Builder

A browser-based resume builder. Choose a layout and a color theme, fill in your details, watch the live preview update, and download a text-based A4 PDF.

**Live demo:** https://resume-builder-react-pied.vercel.app/

![Home page](docs/screenshots/home.png)

## Overview

Resume Builder lets anyone create a clean, recruiter-ready resume without an account. Everything runs in the browser: the editor, the live preview and the PDF export. Resume data is stored locally, so nothing leaves your device.

## Features

**Design**
- 5 layouts (Classic, Centered, Banner, Compact, Sidebar) combined with 11 color themes, switchable at any time without losing data
- Custom page background and text color
- Page-break guides in the preview that show where a new page starts

**Content**
- Personal info with location and links (LinkedIn, GitHub, portfolio)
- Structured experience: role, company, start and end dates, and bullet points
- Custom month and year picker, with an "I currently work here" option
- Projects, education and skills sections, plus an optional profile photo

**Export**
- Text-based PDF: the text is real, so it can be selected, searched and read by applicant tracking systems
- Multi-page A4 output, with clickable email and profile links

**Experience**
- Live preview that updates as you type
- Auto-save, so a refresh never loses your work
- Responsive editor with Edit and Preview tabs on mobile
- Demo sign-in (sign in and create account) that runs entirely in the browser

![Builder](docs/screenshots/builder.png)

## Tech stack

| Area | Technology |
| --- | --- |
| Framework | React 19, Vite |
| Routing | React Router |
| PDF generation | @react-pdf/renderer (loaded only when downloading) |
| Icons | lucide-react |
| Styling | Plain CSS |
| Hosting | Vercel |

## Getting started

```bash
git clone https://github.com/mehreencodes/Resume-builder-react.git
cd Resume-builder-react
npm install
npm run dev
```

Then open http://localhost:5173.

Other scripts:

```bash
npm run build     # production build
npm run preview   # preview the production build
npm run lint      # run ESLint
```

## Project structure

```
src/
  components/
    Navbar.jsx          landing page navigation and account menu
    AuthModal.jsx       demo sign-in / create-account modal
    Sidebar.jsx         resume editing form
    MonthPicker.jsx     custom month and year picker
    ResumePreview.jsx   live HTML preview of every layout
    ResumePDF.jsx       PDF version of every layout (react-pdf)
    LayoutThumb.jsx     small layout previews used in the UI
  pages/
    Home.jsx            landing page
    Builder.jsx         editor and preview
  utils/
    layouts.js          layout definitions
    resumeThemes.js     color themes (shared by preview and PDF)
    experience.js       experience helpers (dates, bullets, migration)
    links.js            link formatting helpers
    exportPdf.js        PDF download logic
    auth.js             demo authentication (localStorage)
```

## How it works

- The editor and the live preview share a single data object. The preview is plain HTML and CSS. The PDF is rendered from the same data with `@react-pdf/renderer`, so it contains real text instead of an image of the page.
- Layout and color are independent choices. Colors live in `resumeThemes.js` and are used by the preview, the layout thumbnails and the PDF.
- Resume data is saved in `localStorage`. Older saved formats are migrated automatically when the app loads.

## Known limitations

- **Demo authentication:** sign-in is a front-end demo. Accounts are stored only in the browser's `localStorage` and nothing is sent to a server. Do not use a real password.
- **PDF fonts:** the PDF uses Helvetica, so characters outside the Latin set (for example Urdu or Arabic) are not supported yet.
- **Sidebar layout:** some applicant tracking systems read two-column resumes out of order. Use Classic, Compact or Banner when applying through job portals.
- **Preview accuracy:** the preview and the PDF use different fonts, so page breaks shown in the preview are approximate.

## Roadmap

- Custom PDF fonts with non-Latin script support
- Drag-and-drop section ordering
- Multiple saved resumes, and JSON import and export
- Real authentication and cloud sync

## Author

Built by [Mehreen Khalid](https://github.com/mehreencodes), a React and full-stack developer.