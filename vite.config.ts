import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'jscadFluent',
      fileName: 'jscad-fluent',
      formats: ['es']
    },
    rollupOptions: {
      external: ['@jscad/modeling']
    }
  }
})
