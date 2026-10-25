<<<<<<< HEAD
# 🧾 Resume Builder (React + Vite)

A simple and modern Resume Builder web application built using **React + Vite**.  
This project allows users to create and preview resumes with a clean and responsive UI.

---

## 🚀 Live Demo
👉 https://resume-builder-react-pied.vercel.app/

---

## 📌 Features
- 🧑‍💼 Create resume in real-time
- 🎨 Clean and responsive UI
- ⚡ Fast performance with Vite
- 🧩 Component-based structure
- 💾 Easy to customize and extend

---

## 🛠️ Tech Stack
- React.js ⚛️
- Vite ⚡
- JavaScript (ES6+)
- CSS3
- HTML5

---

## 📂 Project Structure
=======
# Resume Builder

Build a clean, recruiter-ready resume in minutes. Pick a layout and a color, fill in your details, watch the live preview update, and download a text-based A4 PDF.

**Live demo:** https://resume-builder-react-pied.vercel.app/

![Home page](docs/screenshots/home.png)

## Features

- **Live preview** that updates as you type
- **5 layouts x 11 color themes** (Classic, Centered, Banner, Compact, Sidebar), switchable at any time without losing data
- **Text-based PDF export** (real, selectable and searchable text, not a screenshot), generated in the browser with multi-page support
- **Structured sections:** personal info and links, summary, experience (role, company, dates, bullets), projects, education and skills
- **Custom month/year picker** and an "I currently work here" option for experience dates
- **Clickable links** (email, LinkedIn, GitHub, portfolio) inside the PDF
- **Auto-save:** your data stays in your browser, so a refresh never loses your work
- **Page-break guides** in the preview that show where a new page starts
- **Responsive** editor with Edit / Preview tabs on mobile
- **Demo sign-in** (sign in / create account UI) that runs entirely in the browser

![Builder](docs/screenshots/builder.png)

## Tech stack

- React 19 and Vite
- React Router
- @react-pdf/renderer (PDF generation, loaded only when you download)
- lucide-react (icons)
- Plain CSS (no UI framework)

## Getting started

```bash
git clone https://github.com/mehreencodes/Resume-builder-react.git
cd Resume-builder-react
npm install
npm run dev
```

Open http://localhost:5173.

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
    Sidebar.jsx         the resume editing form
    MonthPicker.jsx     custom month and year picker
    ResumePreview.jsx   live HTML preview of every layout
    ResumePDF.jsx       PDF version of every layout (react-pdf)
    LayoutThumb.jsx     small layout previews used in the UI
  pages/
    Home.jsx            landing page
    Builder.jsx         editor + preview
  utils/
    layouts.js          layout definitions
    resumeThemes.js     color themes (shared by preview and PDF)
    experience.js       experience helpers (dates, bullets, migration)
    links.js            link formatting helpers
    exportPdf.js        PDF download logic
    auth.js             demo authentication (localStorage)
```

## How it works

- The editor and the live preview share one data object. The preview is plain HTML/CSS, and the PDF is rendered from the same data with `@react-pdf/renderer`, so the PDF contains real text that can be selected, searched and read by applicant tracking systems.
- Layout and color are independent. Colors live in `resumeThemes.js` and are used by the preview, the layout thumbnails and the PDF.
- Resume data is saved in `localStorage`, and older saved formats are migrated automatically when the app loads.

## Known limitations

- **Demo authentication:** sign-in is a front-end demo. Accounts are stored only in your browser's `localStorage` and nothing is sent to a server. Do not use a real password.
- **PDF fonts:** the PDF uses Helvetica, so characters outside the Latin set (for example Urdu or Arabic) are not supported yet.
- **Sidebar layout:** two-column resumes can be read out of order by some applicant tracking systems. Use Classic, Compact or Banner when applying through job portals.
- The preview and the PDF use different fonts, so page breaks in the preview are approximate.

## Roadmap

- Custom PDF fonts with non-Latin script support
- Drag-and-drop section ordering
- Multiple saved resumes and JSON import/export
- Real authentication and cloud sync

## Author

Built by [Mehreen Khalid](https://github.com/mehreencodes), a React and full-stack developer.
>>>>>>> 832d834 (Update Resume Builder project)
