import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { configDefaults } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: './setupTests.ts',  
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      '@': '/path/to/your/alias', 
    },
  },
});