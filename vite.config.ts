import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: "/start-with-hika/",
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'icon-192-purple-a.png',
        'icon-512-purple-a.png',
        'favicon.svg'
      ],
      manifest: false, // vì bạn đã tự tạo manifest.json trong public/
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ]
})