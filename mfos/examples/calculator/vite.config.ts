/*
 * Project: MFOS Calculator
 * Company: EasyProTech LLC (www.easypro.tech)
 * Dev: Brabus
 * Date: 2026-02-09 UTC
 * Status: Created
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
      formats: ['es'],
      fileName: () => 'bundle.js',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
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
});
