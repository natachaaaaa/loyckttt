import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  // In the dev container, file change events don't cross the Docker (Colima) mount: poll instead.
  server: { watch: process.env.WATCH_POLLING ? { usePolling: true, interval: 300 } : undefined },
})
