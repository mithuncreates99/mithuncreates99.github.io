import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Relative base so the build works from any path (GitHub Pages project
// sites, a sub-folder, or a static host).
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    target: 'es2022',
    assetsInlineLimit: 0,
    rolldownOptions: {
      output: {
        // Vendors in their own long-lived chunks, so a content edit only
        // invalidates the small app chunk.
        codeSplitting: {
          groups: [
            { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
            { name: 'gsap', test: /node_modules[\\/](gsap|@gsap)[\\/]/ },
          ],
        },
      },
    },
  },
})
