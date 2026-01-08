import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import compression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    react(),
    compression({
      verbose: true,
      disable: false,
      threshold: 1024,
      algorithm: 'brotli',
      ext: '.br',
    }),
    compression({
      verbose: true,
      disable: false,
      threshold: 1024,
      algorithm: 'gzip',
      ext: '.gz',
    }),
  ],
  build: {
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor: React core + DOM
          if (id.includes('node_modules/react-dom')) return 'vendor-react'
          if (id.includes('node_modules/react')) return 'vendor-react'

          // Vendor: Router
          if (id.includes('node_modules/react-router')) return 'vendor-router'

          // Vendor: Animation
          if (id.includes('node_modules/framer-motion')) return 'vendor-motion'

          // Vendor: Icons (UI Library)
          if (id.includes('node_modules/lucide-react') || id.includes('node_modules/react-icons')) {
            return 'vendor-icons'
          }

          // Vendor: HTTP & Backend
          if (id.includes('node_modules/axios') || id.includes('node_modules/@supabase')) {
            return 'vendor-api'
          }

          // Feature: Auth pages (lazy-loaded)
          if (id.includes('src/pages/main/auth/')) return 'auth-pages'

          // Feature: User dashboard pages (lazy-loaded)
          if (id.includes('src/pages/main/user/')) return 'user-pages'

          // Feature: Admin pages (lazy-loaded)
          // NOTE: Removed explicit 'components' chunk to avoid circular dependency
          // Components shared by admin-pages will be automatically optimized by Rollup
          if (id.includes('src/pages/admin/')) return 'admin-pages'

          // Feature: Portal pages (lazy-loaded)
          if (id.includes('src/pages/main/portal/')) return 'portal-pages'

          // Shared: Services (API calls, auth service)
          // This prevents circular: services do not import components
          if (id.includes('src/Services/') || id.includes('src/services/')) return 'services'

          // Shared: Hooks
          // This prevents circular: hooks do not import components
          if (id.includes('src/hooks/')) return 'hooks'

          // Note: 'components' chunk removed to prevent circular dependency with admin-pages
          // Shared components will be automatically bundled by Rollup into the chunks that use them
          // This is optimal for tree-shaking and code splitting
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: true,
    sourcemap: false,
    cssCodeSplit: true,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'lucide-react'],
  },
})