import fs from 'node:fs'
import vue from '@vitejs/plugin-vue'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { defineConfig } from 'vite'

// `--mode editor` serves over https: Storyblok's visual editor only previews https sites.
// With a locally trusted certificate in certs/ (README: mkcert), browsers accept it without warning;
// otherwise a self-signed one is generated (browser warning to accept once).
const trusted = fs.existsSync('certs/localhost.pem') && {
  cert: fs.readFileSync('certs/localhost.pem'),
  key: fs.readFileSync('certs/localhost-key.pem'),
}

export default defineConfig(({ mode }) => ({
  plugins: [vue(), mode === 'editor' && !trusted && basicSsl()],
  server: {
    https: mode === 'editor' && trusted ? trusted : undefined,
    // In the dev container, file change events don't cross the Docker (Colima) mount: poll instead.
    watch: process.env.WATCH_POLLING ? { usePolling: true, interval: 300 } : undefined,
  },
}))
