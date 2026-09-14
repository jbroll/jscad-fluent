import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@jscad/modeling': '@jbroll/jscad-modeling',
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'jscadFluent',
      fileName: 'jscad-fluent',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['@jscad/modeling', '@jbroll/jscad-anchors'],
      output: {
        globals: {
          '@jscad/modeling': 'jscadModeling',
          '@jbroll/jscad-anchors': 'jscadAnchors',
        },
        exports: 'default',
      },
    },
  },
});
