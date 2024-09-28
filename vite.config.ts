import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/// <reference types="node" />

// https://vitejs.dev/config/
export default defineConfig({
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'; // Separate vendor chunks
          }
          if (id.includes('src/components')) {
            return 'components'; // Separate components
          }
        },
      },
    },
    chunkSizeWarningLimit: 2000, // Adjust the chunk size limit if necessary
  },
  define: {
    'process.env': process.env
  }
})
