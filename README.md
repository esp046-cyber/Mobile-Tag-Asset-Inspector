
<div align="center">
  <h1>🏭 Mobile Tag & Asset Inspector</h1>
  <p><strong>A mobile-first Progressive Web App (PWA) engineered for Aveva PI System Engineers.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/Vite_PWA-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite PWA" />
  </p>
  
  <p>
    Monitor live PI tag snapshots, data quality, 12-hour sparkline trends, and Asset Framework (AF) structures directly from the plant floor—without opening PI System Explorer, even on degraded Wi-Fi networks.
  </p>
</div>

<br />

## ✨ Core Visual Features

| 📊 Instant Data Visualization | 📱 Industrial Mobile UX | 📴 Field-Ready Architecture |
| :--- | :--- | :--- |
| **Sparkline Trends:** Integrated Recharts render immediate 12-hour SVG sparklines. | **Swipeable UI:** Navigate complex AF Element hierarchies using fluid horizontal swipes. | **Service Workers:** Aggressively caches data to survive dropped plant Wi-Fi. |
| **Quality Status Badges:** Traffic-light visual cues (Green/Yellow/Red) for instantaneous data validation. | **Dark Mode:** High-contrast, low-fatigue graphite and neon palette for control rooms. | **Web Push Ready:** PWA foundation ready for critical node disconnection alerts. |

<br />

## 🚀 Quick Start (Local Demo)

The application ships with a deterministic mock API. It will compile and render realistic data out-of-the-box.

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env

# 3. Start the Vite dev server
npm run dev

```

## 🔌 Connecting to a Live PI Web API

To transition from the standalone demo to your actual operational data:

> **1. Configure Environment:** Open `.env` and set `VITE_USE_MOCK_API=false`.
> **2. Define Endpoints:** Input your `VITE_PI_WEB_API_BASE_URL`, `VITE_PI_DATA_ARCHIVE`, and `VITE_PI_ASSET_SERVER`.
> **3. Implement Fetch:** Open `src/services/piApiService.js`. Replace the mock function bodies with standard `fetch` requests. *(Note: Each function's JSDoc specifies the exact REST endpoint required).*

## 🌍 GitHub Pages Deployment

This repository includes a CI/CD workflow (`.github/workflows/deploy.yml`) to automatically build and publish to GitHub Pages.

1. Navigate to **Settings → Pages**.
2. Set the **Source** dropdown to **GitHub Actions**.
3. **Important:** Ensure your repository name matches the `base` property in `vite.config.js`. If you rename the repo, update this file to prevent 404 missing asset errors.

## 📂 Architecture Overview

```text
.
├── .github/workflows/deploy.yml   # CI/CD pipeline for GitHub Pages
├── public/                        # Static assets, PWA manifest icons, OG preview images
├── src/
│   ├── components/
│   │   ├── SearchBar.jsx          # Tag/AF element lookup
│   │   ├── TagDashboard.jsx       # Real-time snapshot & quality badge cards
│   │   ├── Sparkline.jsx          # Recharts 12h trend rendering
│   │   └── AFCards.jsx            # Horizontally swipeable AF hierarchy layout
│   ├── services/piApiService.js   # API abstraction layer (Mock & Live fetch)
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html                     # Entry point with complete SEO/Social metadata
├── tailwind.config.js             # Industrial UI color palette definition
├── postcss.config.js
├── vite.config.js                 # PWA generation & base path routing
└── .env.example                   # API configuration template

```

```

```
