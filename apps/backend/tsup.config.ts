import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.node.ts'],
  format: ['esm'],
  target: 'node18',
  outDir: 'dist',
  splitting: false,
  dts: true,
  clean: true,
});
