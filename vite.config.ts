import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'jscadFluent',
      fileName: 'jscad-fluent',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['@jscad/modeling'],
      output: {
        globals: {
          '@jscad/modeling': 'jscadModeling',
        },
        exports: 'default',
      },
    },
  },
});
