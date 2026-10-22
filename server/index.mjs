import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createContactHandler } from './contact.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
try { process.loadEnvFile(resolve(root, '.env')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
const port = Number(process.env.API_PORT || process.env.PORT || 3001);
const buildRoot = resolve(root, 'build');
const contact = createContactHandler({ apiKey: process.env.RESEND_API_KEY, from: process.env.MAIL_FROM, trustProxy: process.env.TRUST_PROXY === 'true' });
const mimeTypes = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8', '.webp': 'image/webp', '.woff2': 'font/woff2' };
const server = createServer(async (req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400); res.end('Endereço inválido.'); return; }
  if (pathname === '/api/contact') { await contact(req, res); return; }
  if (pathname.startsWith('/api/')) { res.writeHead(404); res.end(); return; }
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { Allow: 'GET, HEAD' }); res.end(); return; }
  let file = resolve(buildRoot, `.${pathname}`);
  if (file !== buildRoot && !file.startsWith(buildRoot + sep)) { res.writeHead(403); res.end(); return; }
  try {
    if (pathname === '/') file = resolve(buildRoot, 'index.html');
    let details;
    try { details = await stat(file); } catch (error) {
      if (error.code !== 'ENOENT' || extname(pathname)) throw error;
      file = resolve(buildRoot, 'index.html');
      details = await stat(file);
    }
    if (!details.isFile()) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': mimeTypes[extname(file)] || 'application/octet-stream', 'Content-Length': details.size, 'Cache-Control': file.includes(`${sep}static${sep}`) ? 'public, max-age=31536000, immutable' : 'no-cache' });
    if (req.method === 'HEAD') { res.end(); return; }
    const stream = createReadStream(file);
    stream.on('error', () => res.destroy());
    stream.pipe(res);
  } catch { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('Página não encontrada. Execute npm run build para gerar o site.'); }
});
server.requestTimeout = 20000;
server.headersTimeout = 15000;
server.listen(port, process.env.HOST || '127.0.0.1', () => {
  console.log(`Cuby — servidor em http://localhost:${port}`);
  if (!process.env.RESEND_API_KEY || !process.env.MAIL_FROM) console.log('Envio de e-mail pendente: configure RESEND_API_KEY e MAIL_FROM no .env e reinicie.');
});
