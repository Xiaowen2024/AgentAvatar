require('esbuild').build({
    entryPoints: ['convex/index.ts'],
    bundle: true,
    platform: 'node',
    outfile: 'out.js',
    external: ['express', 'axios', 'socket.io']
  }).catch(() => process.exit(1));