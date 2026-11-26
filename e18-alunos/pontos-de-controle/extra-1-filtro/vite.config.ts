/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Em desenvolvimento, o Vite repassa para a API do curso tudo o que começa com /api.
    // Assim a página e a API ficam na mesma origem, e o navegador não bloqueia (CORS).
    proxy: {
      '/api': 'http://localhost:3333',
    },
  },
  test: {
    // Os testes de tela rodam num navegador simulado, o jsdom
    environment: 'jsdom',
    // Roda antes de cada arquivo de teste
    setupFiles: ['./src/configuracaoTestes.ts'],
  },
})
