const esbuild = require('esbuild')

esbuild.build({
  entryPoints: ['application.js'],
  bundle: true,
  outfile: 'output.js',
  loader: {
    '.js': 'jsx',
    '.jsx': 'jsx'
  }
}).catch(() => process.exit(1)) 