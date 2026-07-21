import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true
      }
    },
    rollupOptions: {
      input: resolve(__dirname, 'index.html')
    },
    cssCodeSplit: true,
    cssMinify: true,
    chunkSizeWarningLimit: 1000
  },
  server: {
    port: Number(process.env.PORT) || 3000,
    open: true
  },
  preview: {
    port: 4173
  }
});

