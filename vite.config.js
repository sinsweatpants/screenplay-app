import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: './',
  base: './',
  publicDir: 'assets',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: true,
    minify: 'terser',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      },
      output: {
        manualChunks: {
          'vendor': ['chart.js', 'jspdf'],
          'core': [
            './js/core/config.js',
            './js/core/integrated-system.js',
            './js/core/app.js'
          ],
          'modules': [
            './js/modules/analytics.js',
            './js/modules/export.js',
            './js/modules/character-manager.js'
          ]
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true,
    cors: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './js'),
      '@core': path.resolve(__dirname, './js/core'),
      '@modules': path.resolve(__dirname, './js/modules'),
      '@libraries': path.resolve(__dirname, './js/libraries'),
      '@css': path.resolve(__dirname, './css')
    }
  }
});