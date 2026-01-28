import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
  },
  resolve: {
    alias: {
      '@jscad/modeling': '@jbroll/jscad-modeling',
    },
  },
});
