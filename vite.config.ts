import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'



export default defineConfig(({ mode }) => {
  let base = "/"

  if (mode === "production") {
    base = "/spaghettify/"
  }
  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    base: base,
  }
});