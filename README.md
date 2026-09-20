# Mobile Tag & Asset Inspector

A Progressive Web App (PWA) that lets an Aveva PI System Engineer check PI tag
snapshot values, data quality, 12-hour trend sparklines, and Asset Framework
(AF) structures from a phone in the field — without opening PI System
Explorer, and even with poor plant Wi-Fi.

## Stack

- React 18 + Vite
- Tailwind CSS (dark, industrial HMI-inspired theme)
- Recharts (sparklines)
- `vite-plugin-pwa` (offline caching, installable app)
- Mock PI Web API layer (`src/services/piApiService.js`)

## Local development

```bash
npm install
cp .env.example .env   # optional — mock API is on by default
npm run dev
```

## Connecting to a real PI Web API

Everything currently runs against a deterministic mock data layer so the demo
works standalone on GitHub Pages. To point it at a real PI Web API instance:

1. Set `VITE_USE_MOCK_API=false` in `.env`.
2. Fill in `VITE_PI_WEB_API_BASE_URL`, `VITE_PI_DATA_ARCHIVE`, and
   `VITE_PI_ASSET_SERVER` (see `.env.example`).
3. Replace the bodies of the functions in `src/services/piApiService.js` with
   real `fetch` calls — each function's JSDoc comment already lists the exact
   PI Web API endpoint it simulates.

## Deploying to GitHub Pages

This repo ships with `.github/workflows/deploy.yml`, which builds the app and
publishes `dist/` to GitHub Pages automatically on every push to `main`.

One-time setup after pushing this repo to GitHub:

1. Go to **Settings → Pages** and set **Source** to **GitHub Actions**.
2. Confirm the repository name matches the `base` in `vite.config.js`
   (`/Mobile-Tag-Asset-Inspector/`). If you rename the repo, update `base`
   there and the absolute paths in `index.html` to match, or assets will 404.
3. Push to `main` — the "Deploy to GitHub Pages" workflow will build and
   deploy automatically. Check the **Actions** tab for progress.

Your app will be live at:
`https://<your-username>.github.io/Mobile-Tag-Asset-Inspector/`

### Before going live

Update the placeholder `YOUR_GITHUB_USERNAME` URLs in `index.html`
(canonical link, Open Graph, Twitter Card, JSON-LD) to your actual GitHub
Pages URL so social previews and search engines resolve correctly.

## Project structure

```
.
├── .github/workflows/deploy.yml   # CI/CD to GitHub Pages
├── public/                        # PWA icons, favicon, social preview image
├── src/
│   ├── components/
│   │   ├── SearchBar.jsx
│   │   ├── TagDashboard.jsx       # snapshot + quality + sparkline cards
│   │   ├── Sparkline.jsx          # Recharts trend line
│   │   └── AFCards.jsx            # swipeable AF hierarchy cards
│   ├── services/piApiService.js   # mock PI Web API layer
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html                     # SEO / OG / Twitter / JSON-LD metadata
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js                 # vite-plugin-pwa + GitHub Pages base path
└── .env.example
```
