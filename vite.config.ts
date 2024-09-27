import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/// <reference types="node" />

// https://vitejs.dev/config/
export default defineConfig({
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://66f4051b77b5e8897097eaef.mockapi.io/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'antd-vendor': ['antd'],
          'react-router-vendor': ['react-router-dom'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Adjust the chunk size warning limit if needed
  },
  define: {
    'process.env': process.env
  }
})
