import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
    
  },
css: {
  modules: {
    scopeBehaviour: 'local',
  },
  
},
optimizeDeps: {
  include: ['react-image-crop'], 
},
})

