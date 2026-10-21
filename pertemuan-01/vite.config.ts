/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // cetakInfo() memanggil process.version (lihat src/identitas.ts) - itu
  // API Node.js, tidak ada di browser. Baris ini menggantinya jadi teks
  // literal saat di-build/dev, supaya App.tsx tetap bisa menampilkannya.
  define: {
    'process.version': JSON.stringify(process.version),
  },
  test: {
    environment: 'node',
  },
})
