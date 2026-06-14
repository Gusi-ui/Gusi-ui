import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import AstroPWA from '@vite-pwa/astro';

export default defineConfig({
  site: 'https://alamia.es',
  trailingSlash: 'always',
  compressHTML: true,
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/admin/'),
    }),
    AstroPWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,ico,png,jpg,jpeg,svg,webp,avif,woff2}'],
        navigateFallback: null,
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssMinify: true,
    },
  },
});
