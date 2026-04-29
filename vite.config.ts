import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: repositoryName ? `/${repositoryName}/` : '/',
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
})
