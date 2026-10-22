import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const api = spawn(process.execPath, ['server/index.mjs'], { stdio: 'inherit' });
const web = spawn(process.execPath, [require.resolve('react-scripts/bin/react-scripts.js'), 'start'], { stdio: 'inherit', env: { ...process.env, BROWSER: 'none', PORT: process.env.WEB_PORT || '3000' } });
let stopping = false;
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  api.kill('SIGTERM');
  web.kill('SIGTERM');
  process.exitCode = code;
}
process.on('SIGINT', () => stop());
process.on('SIGTERM', () => stop());
api.on('exit', code => stop(code || 0));
web.on('exit', code => stop(code || 0));
for (const child of [api, web]) child.on('error', () => stop(1));
