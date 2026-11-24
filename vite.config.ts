import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins:[react()],
  build:{emptyOutDir:true},
  ssr:{noExternal:['motion','framer-motion']}
})
