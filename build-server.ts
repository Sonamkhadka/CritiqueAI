import { build } from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function buildServer() {
  try {
    await build({
      entryPoints: [path.resolve(__dirname, 'server/index.ts')],
      bundle: true,
      platform: 'node',
      target: 'node18',
      outfile: path.resolve(__dirname, 'dist/index.js'),
      format: 'esm',
      external: [
        'express',
        '@neondatabase/*', 
        'pg*',
        'drizzle-orm/pg-core',
        'drizzle-zod',
        'lightningcss',
        'fsevents',
        '@babel/*'
      ],
      minify: process.env.NODE_ENV === 'production',
      sourcemap: process.env.NODE_ENV !== 'production',
      banner: {
        js: `
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
        `.trim()
      },
    });
    
    console.log('✅ Server build completed successfully');
  } catch (error) {
    console.error('❌ Server build failed:', error);
    process.exit(1);
  }
}

buildServer();