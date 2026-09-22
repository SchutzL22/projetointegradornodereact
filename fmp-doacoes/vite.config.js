// ============================================================
// vite.config.js — Configuração Vite + Injeção Global SCSS + Vitest
// Aula 05: Testes automatizados com Vitest
// ============================================================
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['legacy-js-api'],
        additionalData: `
          @use "@/styles/variables" as *;
          @use "@/styles/mixins" as *;
        `,
      },
    },
  },

  // ── Vitest — Configuração de Testes ──────────────────────
  test: {
    globals: true,               // describe/it/expect sem import
    environment: 'jsdom',        // simula o DOM do navegador
    setupFiles: './src/__tests__/setup.js',
    css: true,                   // processa CSS/SCSS nos testes
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
});
