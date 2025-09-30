import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'], // output both ESM and CJS formats
  dts: true, // generate TypeScript declaration files
  clean: true, // clean the output directory before building
  target: 'es6',
});