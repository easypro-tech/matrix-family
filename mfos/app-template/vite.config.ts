/*
 * Project: MFOS App Template
 * Company: EasyProTech LLC (www.easypro.tech)
 * Dev: Brabus
 * Date: 2026-02-09 UTC
 * Status: Updated - ES Module format for HushMe Runtime
 * Telegram: https://t.me/EasyProTech
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.tsx'),
      name: 'MFOSApp',
      // ES Module format - required for MFOS Runtime dynamic import()
      formats: ['es'],
      fileName: () => 'bundle.js',
    },
    rollupOptions: {
      // React is provided by HushMe client via shims
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      // No globals or footer needed for ES modules
    },
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'esbuild',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
  },
});
