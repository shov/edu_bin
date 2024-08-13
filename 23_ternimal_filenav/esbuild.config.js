require('esbuild').build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    platform: 'node',
    target: 'node14',
    outdir: 'dist',
    external: ['fs', 'path'],
  }).catch(() => process.exit(1));