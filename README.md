 <div align="center">
  <!-- 
    NOTE TO DEVELOPER: 
    Replace this placeholder image link with a link to an animated GIF or a beautiful screenshot of your actual app! 
  -->
  <img src="https://via.placeholder.com/800x400/0f172a/10b981?text=+Mobile+Tag+%26+Asset+Inspector+UI+Screenshot+" alt="App Interface Preview" width="100%" style="border-radius: 12px;" />

  <br />
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
