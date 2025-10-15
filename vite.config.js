import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import pkg from './package.json' assert { type: 'json' }

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: './',
  server: {
    host: '0.0.0.0'
  },
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version)
  }
})
