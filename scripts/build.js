import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const sourceIndex = path.join(rootDir, 'index.source.html');
const rootIndex = path.join(rootDir, 'index.html');
const root404 = path.join(rootDir, '404.html');

console.log('[build] Step 1: Restoring index.html from index.source.html for Vite compilation...');
if (!fs.existsSync(sourceIndex)) {
  fs.copyFileSync(rootIndex, sourceIndex);
}
fs.copyFileSync(sourceIndex, rootIndex);

console.log('[build] Step 2: Running Vite production build...');
execSync('npx vite build', { stdio: 'inherit' });

console.log('[build] Step 3: Preparing root deployment files for GitHub Pages...');
const distIndex = path.join(distDir, 'index.html');
const dist404 = path.join(distDir, '404.html');

if (fs.existsSync(distIndex)) {
  fs.copyFileSync(distIndex, rootIndex);
  console.log('✓ Copied dist/index.html -> index.html');
}

if (fs.existsSync(dist404)) {
  fs.copyFileSync(dist404, root404);
  console.log('✓ Copied dist/404.html -> 404.html');
}

// Copy dist/assets to root assets
const distAssets = path.join(distDir, 'assets');
const rootAssets = path.join(rootDir, 'assets');
if (fs.existsSync(distAssets)) {
  if (fs.existsSync(rootAssets)) {
    fs.rmSync(rootAssets, { recursive: true, force: true });
  }
  fs.cpSync(distAssets, rootAssets, { recursive: true });
  console.log('✓ Copied dist/assets -> assets/');
}

// Copy dist/fonts to root fonts
const distFonts = path.join(distDir, 'fonts');
const rootFonts = path.join(rootDir, 'fonts');
if (fs.existsSync(distFonts)) {
  if (fs.existsSync(rootFonts)) {
    fs.rmSync(rootFonts, { recursive: true, force: true });
  }
  fs.cpSync(distFonts, rootFonts, { recursive: true });
  console.log('✓ Copied dist/fonts -> fonts/');
}

// Ensure CNAME exists
const rootCname = path.join(rootDir, 'CNAME');
if (!fs.existsSync(rootCname) || fs.readFileSync(rootCname, 'utf8').trim() === '') {
  fs.writeFileSync(rootCname, 'www.jaymurlidhargroup.co.in\n');
  console.log('✓ Verified root CNAME');
}

console.log('[build] Build and root deployment preparation completed successfully!');
