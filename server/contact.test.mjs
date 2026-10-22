import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createContactHandler } from './contact.mjs';

const valid = { name: 'Pessoa Teste', email: 'teste@example.com', company: 'Empresa Exemplo', service: 'Arquitetura de software', message: 'Gostaria de integrar os sistemas da empresa.', website: '' };
async function withServer(options, run, prepareRequest) {
  const handler = createContactHandler(options);
  const server = createServer(async (req, res) => {
    if (prepareRequest) await prepareRequest(req);
    await handler(req, res);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}/api/contact`;
  try { await run((body = valid, headers = {}) => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) }), url); }
  finally { await new Promise(resolve => { server.close(resolve); server.closeAllConnections(); }); }
}
const configured = { apiKey: 'test-key', from: 'Cuby <site@example.com>' };

test('envia para o destinatário fixo e permite responder ao visitante', async () => {
  let sent;
  await withServer({ ...configured, fetchImpl: async (url, request) => {
    sent = { url, ...request };
    return Response.json({ id: 'email-test-id' });
  } }, async post => {
    const response = await post({ ...valid, to: 'outro@example.com' });
    assert.equal(response.status, 200);
    const payload = JSON.parse(sent.body);
    assert.equal(sent.url, 'https://api.resend.com/emails');
    assert.deepEqual(payload.to, ['contato@cuby.com.br']);
    assert.equal(payload.reply_to, valid.email);
    assert.equal(payload.from, configured.from);
    assert.match(payload.text, /Pessoa Teste/);
    assert.equal(sent.headers.Authorization, 'Bearer test-key');
    assert.match(sent.headers['Idempotency-Key'], /^cuby-contact\//);
  });
});
test('rejeita e-mail inválido, injeção de cabeçalho, texto excessivo e honeypot', async () => {
  let calls = 0;
  await withServer({ ...configured, fetchImpl: async () => { calls++; } }, async post => {
    for (const input of [{ ...valid, email: 'sem-email' }, { ...valid, name: 'Nome\nBcc: x@example.com' }, { ...valid, message: 'x'.repeat(5001) }, { ...valid, website: 'spam.example' }]) {
      assert.equal((await post(input)).status, 400);
    }
    assert.equal(calls, 0);
  });
});
test('não confirma envio sem configuração ou quando o provedor falha', async () => {
  for (const options of [{}, { ...configured, fetchImpl: async () => Response.json({ message: 'provider-secret-error' }, { status: 401 }) }, { ...configured, fetchImpl: async () => { throw new Error('network'); } }, { ...configured, fetchImpl: async () => Response.json({}) }]) {
    await withServer(options, async post => {
      const response = await post();
      assert.ok([502, 503].includes(response.status));
      assert.doesNotMatch(await response.text(), /secret|test-key|sucesso/);
    });
  }
});
test('limita tentativas e libera após a janela de dez minutos', async () => {
  let clock = 1000;
  await withServer({ ...configured, now: () => clock, fetchImpl: async () => Response.json({ id: 'test' }) }, async post => {
    for (let i = 0; i < 5; i++) assert.equal((await post()).status, 200);
    const blocked = await post();
    assert.equal(blocked.status, 429);
    assert.equal(blocked.headers.get('retry-after'), '600');
    clock += 600001;
    assert.equal((await post()).status, 200);
  });
});
test('bloqueia origem externa, formatos incorretos, JSON inválido e mensagens grandes', async () => {
  await withServer(configured, async (post, url) => {
    assert.equal((await post(valid, { Origin: 'https://outro.example.com' })).status, 403);
    assert.equal((await post(valid, { 'Sec-Fetch-Site': 'cross-site' })).status, 403);
    assert.equal((await fetch(url)).status, 405);
    assert.equal((await post(valid, { 'Content-Type': 'text/plain' })).status, 415);
    assert.equal((await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{invalid' })).status, 400);
    assert.equal((await post({ ...valid, message: 'x'.repeat(25000) })).status, 413);
  });
});
test('retentativas idênticas usam a mesma chave de idempotência', async () => {
  const keys = [];
  await withServer({ ...configured, now: () => 1000, fetchImpl: async (_, request) => { keys.push(request.headers['Idempotency-Key']); return Response.json({ id: 'test' }); } }, async post => {
    await post(); await post();
    assert.equal(keys.length, 2);
    assert.equal(keys[0], keys[1]);
  });
});

test('aceita o JSON já processado e os cabeçalhos do proxy da Vercel', async () => {
  let sent;
  await withServer({ ...configured, trustProxy: true, fetchImpl: async (_, request) => {
    sent = JSON.parse(request.body);
    return Response.json({ id: 'vercel-test-id' });
  } }, async post => {
    const response = await post(valid, { Origin: 'https://cuby.com.br', 'X-Forwarded-Host': 'cuby.com.br', 'X-Forwarded-For': '192.0.2.10' });
    assert.equal(response.status, 200);
    assert.equal(sent.reply_to, valid.email);
    assert.deepEqual(sent.to, ['contato@cuby.com.br']);
    assert.equal((await post({ ...valid, message: 'x'.repeat(25000) })).status, 413);
    assert.equal((await post(null)).status, 400);
  }, async req => {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString('utf8');
    Object.defineProperty(req, 'body', { get: () => JSON.parse(raw) });
  });
});

test('responde com erro controlado quando o parser da Vercel rejeita o JSON', async () => {
  await withServer(configured, async post => {
    const response = await post();
    assert.equal(response.status, 400);
    assert.match((await response.json()).message, /inválida/);
  }, req => {
    Object.defineProperty(req, 'body', { get() { throw new SyntaxError('Invalid JSON'); } });
  });
});
