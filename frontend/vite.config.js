import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/auth': 'http://localhost:3000',
      '/estates': 'http://localhost:3000',
      '/crops': 'http://localhost:3000',
      '/owners': 'http://localhost:3000',
      '/iot': 'http://localhost:3000',
      '/employees': 'http://localhost:3000',
      '/assignments': 'http://localhost:3000',
      '/attendance': 'http://localhost:3000',
      '/payroll': 'http://localhost:3000',
    },
  },
  appType: 'spa',
});
