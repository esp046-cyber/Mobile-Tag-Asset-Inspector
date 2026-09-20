import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  // REQUIRED for GitHub Pages project sites: the repo name must match exactly,
  // including case, or built asset URLs (JS/CSS/icons) will 404 in production.
  base: '/Mobile-Tag-Asset-Inspector/',

  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'apple-touch-icon.png',
        'icons/icon-192.png',
        'icons/icon-512.png'
      ],
      manifest: {
        name: 'Mobile Tag & Asset Inspector',
        short_name: 'Tag Inspector',
        description:
          'Remotely troubleshoot Aveva PI tag data streams and Asset Framework models from the field.',
        theme_color: '#14181C',
        background_color: '#14181C',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/Mobile-Tag-Asset-Inspector/',
        scope: '/Mobile-Tag-Asset-Inspector/',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      // Aggressive offline caching so engineers can review recently-viewed
      // tag configurations and AF structures in plant areas with poor signal.
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        navigateFallback: '/Mobile-Tag-Asset-Inspector/index.html',
        runtimeCaching: [
          {
            // Simulated PI Web API calls: serve stale-while-revalidate so the
            // last-known snapshot/trend is always available offline.
            urlPattern: /\/api\/piwebapi\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'pi-api-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
              },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets'
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      },
      devOptions: {
        enabled: false
      }
    })
  ],

  server: {
    port: 5173
  },

  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
