import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { configDefaults } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
    include: ['src/__tests__/**/*.test.{ts,tsx}'],
    exclude: [...configDefaults.exclude, '**/*.e2e.{ts,tsx}'],
    setupFiles: ['./src/setupTests.ts'], 
  },
});