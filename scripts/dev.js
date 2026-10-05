import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const sourceIndex = path.join(rootDir, 'index.source.html');
const rootIndex = path.join(rootDir, 'index.html');

if (fs.existsSync(sourceIndex)) {
  fs.copyFileSync(sourceIndex, rootIndex);
  console.log('[dev] Restored development index.html from index.source.html');
}

const vite = spawn('npx', ['vite', ...process.argv.slice(2)], {
  stdio: 'inherit',
  shell: true,
});

vite.on('exit', (code) => {
  process.exit(code ?? 0);
});
