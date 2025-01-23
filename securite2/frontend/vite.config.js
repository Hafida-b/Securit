import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    server: {
      port: 8080,
      open: true,
      host: true, // allows for external device connection on local network
      proxy: {
         '^/auth/*' : {
            target: 'http://localhost:3000',
            changeOrigin: true,
         },
         '^/api/.*': {
            target: 'http://localhost:3000',
            changeOrigin: true,
         },
         
      }
  },
})