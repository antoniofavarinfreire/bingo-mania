import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  server: {
    port: 4433 // Certifique-se de que a porta está correta
  },
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      injectRegister: 'auto',
      manifest: {
        name: 'Bingo-Mania',
        short_name: 'App',
        start_url: '.',
        background_color: '#FFFFFF',
        theme_color: '#000000',
        icons: [
          {
            src: '/android-chrome-192x192.png',
            type: 'image/png',
            sizes: '192x192'
          },
          {
            src: '/android-chrome-512x512.png',
            type: 'image/png',
            sizes: '512x512'
          },
          {
            src: '/favicon-16x16.png',
            type: 'image/png',
            sizes: '16x16'
          },
          {
            src: '/favicon-32x32.png',
            type: 'image/png',
            sizes: '32x32'
          }
        ]
      }
    })
  ],
  base: 'bingo-mania',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
