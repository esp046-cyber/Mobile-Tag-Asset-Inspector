```markdown
# 🏭 Mobile Tag & Asset Inspector

[![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Vite%20%7C%20Tailwind-blue?style=for-the-badge)](#)
[![PWA Ready](https://img.shields.io/badge/PWA-Optimized-brightgreen?style=for-the-badge)](#)

A lightweight, mobile-first Progressive Web App (PWA) engineered for Aveva PI System Engineers. Monitor live PI tag snapshots, data quality, 12-hour sparkline trends, and Asset Framework (AF) structures directly from the plant floor—without opening PI System Explorer, even on degraded Wi-Fi networks.

---

## ⚡ Core Tech Stack

*   **React 18 + Vite:** Fast, modern front-end architecture.
*   **Tailwind CSS:** Custom dark, high-contrast industrial HMI theme to reduce eye strain.
*   **Recharts:** Lightweight SVG sparklines for rapid visual trend analysis.
*   **Vite PWA Plugin:** Aggressive offline caching and mobile home-screen installability.
*   **Data Layer:** Pre-configured mock PI Web API service (`src/services/piApiService.js`).

## 🚀 Quick Start (Local Development)

The application defaults to a deterministic mock data layer, allowing it to compile and run instantly without requiring a live PI server connection.

```bash
# 1. Install dependencies
npm install

# 2. Set up environment (optional: mock API is enabled by default)
cp .env.example .env

# 3. Start the Vite dev server
npm run dev

```

## 🔌 Connecting to a Live PI Web API

To transition from the standalone demo to your actual operational data:

1. **Configure Environment:** Open `.env` and set `VITE_USE_MOCK_API=false`.
2. **Define Endpoints:** Input your `VITE_PI_WEB_API_BASE_URL`, `VITE_PI_DATA_ARCHIVE`, and `VITE_PI_ASSET_SERVER` parameters (reference `.env.example`).
3. **Implement Fetch:** Open `src/services/piApiService.js`. Replace the mock function bodies with standard `fetch` requests. *Note: Each function's JSDoc comment specifies the exact PI Web API REST endpoint it is designed to hit.*

## 🌍 Deploying to GitHub Pages

This repository includes a pre-configured GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically builds and deploys the `dist/` directory on every push to `main`.

**One-Time Repository Setup:**

1. Navigate to **Settings → Pages** in your GitHub repository.
2. Set the **Source** dropdown to **GitHub Actions**.
3. **Critical Path Check:** Ensure your repository name matches the `base` property in `vite.config.js` (currently set to `/Mobile-Tag-Asset-Inspector/`). If you rename the repo, update this file and the absolute asset paths in `index.html` to prevent 404 errors.
4. **Pre-Flight SEO Check:** Before going live, update the `YOUR_GITHUB_USERNAME` placeholders inside `index.html` (Canonical URL, Open Graph, Twitter Cards, JSON-LD) to ensure rich social previews render correctly in chat apps and search engines.

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
