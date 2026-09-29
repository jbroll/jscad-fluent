import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// The ES and UMD bundles leave jscad-anchors to the importer, which shares one copy with its
// own code. The browser bundle (--mode browser) is for a page loading it from a CDN, where
// jscad-anchors has no build to load, so it bundles jscad-anchors and reads only modeling.
export default defineConfig(({ mode }) => {
  const browser = mode === 'browser';
  return {
    resolve: {
      alias: {
        '@jscad/modeling': '@jbroll/jscad-modeling',
      },
    },
    build: {
      emptyOutDir: !browser,
      commonjsOptions: { include: [/node_modules/, /jscad-anchors/] },
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'jscadFluent',
        fileName: browser ? () => 'jscad-fluent.browser.js' : 'jscad-fluent',
        formats: browser ? ['umd'] : ['es', 'umd'],
      },
      rollupOptions: {
        external: browser
          ? ['@jscad/modeling', '@jbroll/jscad-modeling']
          : ['@jscad/modeling', '@jbroll/jscad-anchors'],
        output: {
          globals: {
            '@jscad/modeling': 'jscadModeling',
            '@jbroll/jscad-modeling': 'jscadModeling',
            '@jbroll/jscad-anchors': 'jscadAnchors',
          },
          exports: 'default',
        },
      },
    },
  };
});
