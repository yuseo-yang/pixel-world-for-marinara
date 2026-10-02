// Bundles src/app.js (+ three.js) and marinara-extension/src/entry.js into ONE file for Marinara,
// then zips it with the manifest into pixel-world.personal-extension.zip.
import { build } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'marinara-extension/dist');
mkdirSync(dist, { recursive: true });

await build({
  entryPoints: [resolve(root, 'marinara-extension/src/entry.js')],
  outfile: resolve(dist, 'extension.js'),
  bundle: true, minify: true, format: 'iife', target: 'es2020', legalComments: 'none', charset: 'utf8',
  banner: { js: '/* Pixel World for Marinara - bundled (three.js MIT). Source: https://github.com/yuseo-yang/pixel-world-for-marinara */' },
});
copyFileSync(resolve(root, 'marinara-extension/manifest.json'), resolve(dist, 'manifest.json'));

const zip = resolve(root, 'pixel-world.personal-extension.zip');
if (process.platform === 'win32') {
  execFileSync('powershell', ['-NoProfile', '-Command', `Compress-Archive -Path '${resolve(dist, 'manifest.json')}','${resolve(dist, 'extension.js')}' -DestinationPath '${zip}' -Force`], { stdio: 'inherit' });
} else {
  execFileSync('zip', ['-j', '-q', zip, resolve(dist, 'manifest.json'), resolve(dist, 'extension.js')], { stdio: 'inherit' });
}
const kb = (readFileSync(resolve(dist, 'extension.js')).length / 1024).toFixed(0);
console.log(`built extension.js (${kb} KB) -> ${zip}`);
