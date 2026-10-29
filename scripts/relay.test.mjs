import assert from 'node:assert/strict';
import test from 'node:test';
import { createRelay } from '../relay/worker.js';

const websiteId = '12345678-1234-4234-8234-123456789abc';
const origin = 'https://rachelx000.github.io';
const payload = {
  url: '/GSoC-AI-OSS/#/aim', referrer: '', title: 'GSoC AI-to-OSS',
  language: 'en-US', screen: '1440x900',
};
const agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36';
function request(body = payload, headers = {}, method = 'POST', path = '/collect') {
  return new Request(`https://visits.example.test${path}`, {
    method,
    headers: {
      Origin: origin, 'Content-Type': 'application/json',
      'CF-Connecting-IP': '203.0.113.5', 'User-Agent': agent, ...headers,
    },
    ...(method === 'POST' ? { body: typeof body === 'string' ? body : JSON.stringify(body) } : {}),
  });
}
function environment(overrides = {}) {
  return {
    SITE_URL: `${origin}/GSoC-AI-OSS/`, UMAMI_WEBSITE_ID: websiteId,
    VISIT_LIMITER: { limit: async () => ({ success: true }) }, ...overrides,
  };
}

test('relay adds the private ID and trusted visitor identity, and returns no upstream data', async () => {
  let sent;
  const relay = createRelay(async (url, options) => {
    sent = { url, options, body: JSON.parse(options.body) };
    return new Response(JSON.stringify({ website: websiteId, cache: 'private-token' }), {
      headers: { 'Set-Cookie': 'upstream=private', 'X-Website-Id': websiteId },
    });
  });
  const response = await relay.fetch(request(payload, { 'X-Forwarded-For': '192.0.2.99' }), environment());
  assert.equal(response.status, 204);
  assert.equal(await response.text(), '');
  assert.equal(response.headers.get('Set-Cookie'), null);
  assert.doesNotMatch(JSON.stringify([...response.headers]), /12345678|private-token/);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), origin);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  assert.equal(sent.url, 'https://gateway.umami.is/api/send');
  assert.equal(sent.body.type, 'event');
  assert.equal(sent.body.payload.website, websiteId);
  assert.equal(sent.body.payload.ip, '203.0.113.5');
  assert.equal(sent.body.payload.userAgent, agent);
  assert.equal(sent.options.headers['User-Agent'], agent);
  assert.equal(sent.body.payload.hostname, 'rachelx000.github.io');
  assert.equal(sent.body.payload.url, payload.url);
  assert.equal(sent.options.redirect, 'manual');
});

test('CORS preflight works only for the configured site and permitted method and headers', async () => {
  const relay = createRelay(() => assert.fail('No preflight should reach Umami'));
  const response = await relay.fetch(request(null, {
    'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'content-type',
  }, 'OPTIONS'), environment());
  assert.equal(response.status, 204);
  assert.equal(response.headers.get('Access-Control-Allow-Headers'), 'Content-Type');
  const denied = await relay.fetch(request(payload, { Origin: 'https://example.test' }), environment());
  assert.equal(denied.status, 403);
  assert.equal(denied.headers.get('Access-Control-Allow-Origin'), null);
  assert.equal((await relay.fetch(request(null, { 'Access-Control-Request-Method': 'GET' }, 'OPTIONS'), environment())).status, 405);
  assert.equal((await relay.fetch(request(null, {
    'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'authorization',
  }, 'OPTIONS'), environment())).status, 403);
});

test('invalid requests and browser-supplied identities never reach Umami', async () => {
  const relay = createRelay(() => assert.fail('Invalid data must not be forwarded'));
  for (const body of [
    'broken-json', null, [], { ...payload, website: websiteId }, { ...payload, ip: '192.0.2.99' },
    { ...payload, userAgent: 'fake' }, { ...payload, hostname: 'example.test' },
    { ...payload, url: 'https://example.test/' }, { ...payload, url: '//example.test/' },
    { ...payload, url: '/another-project/' }, { ...payload, url: '/GSoC-AI-OSS/../other/' },
    { ...payload, url: 'http://[' }, { ...payload, language: 123 },
  ]) {
    const response = await relay.fetch(request(body), environment());
    assert.equal(response.status, 400, JSON.stringify(body));
  }
  assert.equal((await relay.fetch(request('x'.repeat(4097)), environment())).status, 413);
  assert.equal((await relay.fetch(request(payload, { 'Content-Type': 'text/plain' }), environment())).status, 415);
  assert.equal((await relay.fetch(request(null, {}, 'GET'), environment())).status, 405);
  assert.equal((await relay.fetch(request(payload, {}, 'POST', '/other'), environment())).status, 404);
});

test('missing configuration or identity and rate limits stop collection without leaking secrets', async () => {
  const relay = createRelay(() => assert.fail('Unavailable collection must not be forwarded'));
  for (const env of [environment({ UMAMI_WEBSITE_ID: '' }), environment({ SITE_URL: '' }), environment({ VISIT_LIMITER: null })]) {
    const response = await relay.fetch(request(), env);
    assert.equal(response.status, 503);
    assert.equal(await response.text(), '');
  }
  assert.equal((await relay.fetch(request(payload, { 'CF-Connecting-IP': '' }), environment())).status, 503);
  assert.equal((await relay.fetch(request(payload, { 'User-Agent': '' }), environment())).status, 503);
  const limited = await relay.fetch(request(), environment({ VISIT_LIMITER: { limit: async ({ key }) => {
    assert.equal(key, '203.0.113.5');
    return { success: false };
  } } }));
  assert.equal(limited.status, 429);
});

test('Cloudflare pseudo-IPv4 uses the preserved original IPv6 address', async () => {
  const relay = createRelay(async (_url, options) => {
    assert.equal(JSON.parse(options.body).payload.ip, '2001:db8::5');
    return new Response(null, { status: 204 });
  });
  assert.equal((await relay.fetch(request(payload, {
    'CF-Connecting-IP': '240.1.2.3', 'CF-Connecting-IPv6': '2001:db8::5',
  }), environment())).status, 204);
});

test('upstream failures return only an empty generic response', async () => {
  for (const send of [
    async () => new Response(null, { status: 302, headers: { Location: 'https://example.invalid/' } }),
    async () => new Response(`Invalid website: ${websiteId}`, { status: 400 }),
    async () => { throw new Error(`Private upstream details: ${websiteId}`); },
  ]) {
    const response = await createRelay(send).fetch(request(), environment());
    assert.equal(response.status, 502);
    assert.equal(await response.text(), '');
  }
});
