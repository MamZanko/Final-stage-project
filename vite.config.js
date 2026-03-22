import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    open: true,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'zustand', 'axios'],
  },
  build: {
    // Target modern browsers for smaller output
    target: 'es2020',
    // Use esbuild for fast minification (built-in, no extra dependency)
    minify: 'esbuild',
    // Enable source map for production debugging (hidden from browser)
    sourcemap: 'hidden',
    // CSS code splitting — only load styles needed per route
    cssCodeSplit: true,
    // CSS minification target
    cssTarget: 'es2020',
    // Asset inlining threshold (4KB)
    assetsInlineLimit: 4096,
    // Manual chunk splitting for optimal caching
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React core — rarely changes, highest cache priority
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-router')) {
            return 'vendor-react';
          }
          // Recharts — admin only, keep separate (largest dep)
          if (id.includes('node_modules/recharts') || id.includes('node_modules/d3-') || id.includes('node_modules/victory-')) {
            return 'vendor-charts';
          }
          // Framer Motion — used widely but large
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-motion';
          }
          // Swiper — only used on HomePage
          if (id.includes('node_modules/swiper')) {
            return 'vendor-swiper';
          }
          // State & data fetching
          if (id.includes('node_modules/zustand') || id.includes('node_modules/axios')) {
            return 'vendor-state';
          }
          // DOMPurify — only used in a few pages
          if (id.includes('node_modules/dompurify')) {
            return 'vendor-sanitize';
          }
          // Small UI utilities
          if (id.includes('node_modules/react-hot-toast') || id.includes('node_modules/react-intersection-observer') || id.includes('node_modules/react-countup')) {
            return 'vendor-ui';
          }
        },
      },
    },
    // Increase warning limit since we now have proper chunking
    chunkSizeWarningLimit: 300,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/__tests__/setup.js',
    css: true,
    include: ['src/**/*.{test,spec}.{js,jsx}'],
  },
});
