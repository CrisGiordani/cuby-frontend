import { createHash } from 'node:crypto';

const emailPattern = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const unavailable = 'Não foi possível enviar agora. Tente novamente ou fale pelo WhatsApp.';
export function validateContact(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
  const fields = { name: 100, email: 254, company: 160, service: 160, message: 5000, website: 200 };
  const result = {};
  for (const [field, max] of Object.entries(fields)) {
    const value = input[field] ?? '';
    if (typeof value !== 'string' || value.length > max) return null;
    result[field] = value.trim();
  }
  if (result.website || result.name.length < 2 || !emailPattern.test(result.email) || result.message.length < 10) return null;
  if (/[\r\n\x00-\x1f\x7f]/.test(result.name + result.email + result.company + result.service)) return null;
  return result;
}

export function createContactHandler({ apiKey, from, fetchImpl = fetch, now = Date.now, trustProxy = false } = {}) {
  const attempts = new Map();
  const windowMs = 10 * 60 * 1000;
  return async function handleContact(req, res) {
    const respond = (status, message) => {
      res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(JSON.stringify({ message }));
    };
    if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return respond(405, 'Método não permitido.'); }
    if (req.headers['sec-fetch-site'] === 'cross-site') return respond(403, 'Origem não permitida.');
    if (req.headers.origin) {
      try {
        const expectedHost = trustProxy ? req.headers['x-forwarded-host'] || req.headers.host : req.headers.host;
        if (new URL(req.headers.origin).host !== expectedHost) return respond(403, 'Origem não permitida.');
      } catch { return respond(403, 'Origem não permitida.'); }
    }
    if (req.headers['content-type']?.split(';')[0].trim() !== 'application/json') return respond(415, 'Formato de mensagem inválido.');
    const time = now();
    for (const [key, attempt] of attempts) if (time - attempt.start >= windowMs) attempts.delete(key);
    // Forwarded headers are used only behind a trusted, configured reverse proxy.
    const ip = trustProxy ? req.headers['x-forwarded-for']?.split(',').at(-1).trim() || req.socket.remoteAddress : req.socket.remoteAddress;
    const attempt = attempts.get(ip) || { start: time, count: 0 };
    if (attempt.count >= 5 || (!attempts.has(ip) && attempts.size >= 10000)) {
      res.setHeader('Retry-After', String(Math.max(1, Math.ceil((attempt.start + windowMs - time) / 1000))));
      return respond(429, 'Muitas tentativas. Aguarde alguns minutos ou fale pelo WhatsApp.');
    }
    attempt.count += 1;
    attempts.set(ip, attempt);
    let input;
    try {
      // Vercel exposes parsed JSON through a getter; the local server uses a stream.
      const parsedBody = req.body;
      if (parsedBody !== undefined) {
        if (Buffer.byteLength(JSON.stringify(parsedBody), 'utf8') > 24 * 1024) return respond(413, 'Mensagem muito longa.');
        input = parsedBody;
      } else {
        let length = 0;
        const chunks = [];
        for await (const chunk of req) {
          length += chunk.length;
          if (length > 24 * 1024) return respond(413, 'Mensagem muito longa.');
          chunks.push(chunk);
        }
        input = JSON.parse(Buffer.concat(chunks).toString('utf8'));
      }
    } catch { return respond(400, 'Mensagem inválida.'); }
    const contact = validateContact(input);
    if (!contact) return respond(400, 'Confira seu nome, e-mail e mensagem (mínimo de 10 caracteres).');
    if (!apiKey || !from) return respond(503, unavailable);
    const { name, email, company, service, message } = contact;
    const text = ['Novo contato pelo website da Cuby Digital', '', `Nome: ${name}`, `E-mail: ${email}`, `Empresa: ${company || 'Não informada'}`, `Interesse: ${service || 'Não informado'}`, '', 'Mensagem:', message].join('\n');
    // Identical retries in the same ten-minute window share a provider idempotency key.
    const requestKey = createHash('sha256').update(`${Math.floor(time / windowMs)}:${text}`).digest('hex');
    try {
      const response = await fetchImpl('https://api.resend.com/emails', {
        method: 'POST', signal: AbortSignal.timeout(12000),
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': `cuby-contact/${requestKey}` },
        body: JSON.stringify({ from, to: ['contato@cuby.com.br'], reply_to: email, subject: `Contato pelo site — ${name}`, text }),
      });
      const result = await response.json();
      if (!response.ok || typeof result.id !== 'string' || !result.id) return respond(502, unavailable);
      return respond(200, 'Mensagem enviada com sucesso.');
    } catch { return respond(502, unavailable); }
  };
}
