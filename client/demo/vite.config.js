import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/heartbeat-analytics': {
        target: 'file:///home/bielp/heartbeat-analytics/client/script.js',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/heartbeat-analytics/, ''),
      },
    },
  },
})
