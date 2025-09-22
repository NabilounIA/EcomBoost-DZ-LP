import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import viteImagemin from 'vite-plugin-imagemin';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const isProduction = mode === 'production';
    
    return {
      plugins: [
        react(),
        
        // PWA Configuration
        VitePWA({
          registerType: 'autoUpdate',
          workbox: {
            globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
          },
          manifest: {
            name: 'EcomBoost DZ',
            short_name: 'EcomBoost',
            description: 'Plateforme e-commerce pour l\'Algérie',
            theme_color: '#ffffff',
            background_color: '#ffffff',
            display: 'standalone',
            icons: [
              {
                src: '/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
              },
              {
                src: '/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
              },
            ],
          },
        }),

        // Image optimization (only in production)
        ...(isProduction ? [
          viteImagemin({
            gifsicle: { optimizationLevel: 7 },
            mozjpeg: { quality: 80 },
            pngquant: { quality: [0.65, 0.8] },
            svgo: {
              plugins: [
                { name: 'removeViewBox', active: false },
                { name: 'removeEmptyAttrs', active: false },
              ],
            },
            webp: { quality: 75 },
            avif: { quality: 65 },
          }),
        ] : []),
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      // Production optimizations
      build: {
        minify: 'terser',
        terserOptions: isProduction ? {
          compress: {
            // Remove console.log in production
            drop_console: true,
            drop_debugger: true,
            // Remove unused code
            dead_code: true,
            // Optimize conditions
            conditionals: true,
            // Remove unused variables
            unused: true,
          },
          mangle: {
            // Mangle variable names for smaller bundle
            toplevel: true,
          },
          format: {
            // Remove comments
            comments: false,
          },
        } : {},
        rollupOptions: {
          output: {
            // Advanced code splitting for better caching
            manualChunks: (id) => {
              // Vendor chunks
              if (id.includes('node_modules')) {
                if (id.includes('react') || id.includes('react-dom')) {
                  return 'react-vendor';
                }
                if (id.includes('react-router')) {
                  return 'router-vendor';
                }
                if (id.includes('framer-motion')) {
                  return 'animation-vendor';
                }
                return 'vendor';
              }
              // Component chunks
              if (id.includes('/components/')) {
                return 'components';
              }
              if (id.includes('/hooks/')) {
                return 'hooks';
              }
              if (id.includes('/services/')) {
                return 'services';
              }
            },
            // Optimize chunk file names
            chunkFileNames: 'assets/js/[name]-[hash].js',
            entryFileNames: 'assets/js/[name]-[hash].js',
            assetFileNames: (assetInfo) => {
              const info = assetInfo.name.split('.');
              const ext = info[info.length - 1];
              if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
                return `assets/images/[name]-[hash][extname]`;
              }
              if (/css/i.test(ext)) {
                return `assets/css/[name]-[hash][extname]`;
              }
              return `assets/[name]-[hash][extname]`;
            },
          },
        },
        // Optimize bundle size
        target: 'es2020',
        cssCodeSplit: true,
        reportCompressedSize: true,
        chunkSizeWarningLimit: 1000,
        // Enable source maps for production debugging (optional)
        sourcemap: isProduction ? false : true,
      },
      // Security headers for production
      server: {
        historyApiFallback: true,
        headers: isProduction ? {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com; frame-src 'none';",
        } : {},
      },
      // Dependency optimization
      optimizeDeps: {
        include: [
          'react', 
          'react-dom', 
          'react-router-dom',
          'framer-motion',
          'lucide-react'
        ],
        exclude: ['@vite/client', '@vite/env'],
      },
      // CSS optimization
      css: {
        devSourcemap: true,
        postcss: {
          plugins: [
            autoprefixer,
            ...(mode === 'production' ? [cssnano] : []),
          ],
        },
      },
      // Performance optimizations
      esbuild: {
        // Remove console.log in production
        drop: isProduction ? ['console', 'debugger'] : [],
        // Optimize for modern browsers
        target: 'es2020',
        // Enable tree shaking
        treeShaking: true,
      },
      // Preview server configuration
      preview: {
        port: 4173,
        strictPort: true,
        headers: {
          'Cache-Control': 'public, max-age=31536000',
        },
      },
    };
  });
