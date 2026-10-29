const COLLECT_URL = 'https://gateway.umami.is/api/send';
const MAX_BODY_BYTES = 4096;
const FIELDS = { url: 2048, referrer: 2048, title: 500, language: 35, screen: 24 };
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function readPayload(request) {
  const reader = request.body?.getReader();
  if (!reader) throw new SyntaxError();
  const decoder = new TextDecoder();
  let size = 0;
  let text = '';
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new RangeError();
    }
    text += decoder.decode(value, { stream: true });
  }
  return JSON.parse(text + decoder.decode());
}

function validPayload(payload, site) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return false;
  if (Object.keys(payload).some((key) => !Object.hasOwn(FIELDS, key))) return false;
  for (const [key, limit] of Object.entries(FIELDS)) {
    if (typeof payload[key] !== 'string' || payload[key].length > limit) return false;
  }
  if (!payload.url.startsWith('/') || payload.url.startsWith('//')) return false;
  const page = new URL(payload.url, site);
  return page.origin === site.origin && (
    page.pathname === site.pathname ||
    page.pathname === site.pathname.replace(/\/$/, '') ||
    page.pathname === `${site.pathname}index.html`
  );
}

export function createRelay(send = fetch) {
  return {
    async fetch(request, env) {
      const origin = request.headers.get('Origin');
      const headers = { 'Cache-Control': 'no-store', Vary: 'Origin' };
      const reply = (status) => new Response(null, { status, headers });
      let site;
      try {
        site = new URL(env.SITE_URL);
        if (site.protocol !== 'https:' || !UUID.test(env.UMAMI_WEBSITE_ID ?? '')) return reply(503);
      } catch {
        return reply(503);
      }

      if (new URL(request.url).pathname !== '/collect') return reply(404);
      if (origin !== site.origin) return reply(403);
      headers['Access-Control-Allow-Origin'] = origin;

      if (request.method === 'OPTIONS') {
        if (request.headers.get('Access-Control-Request-Method') !== 'POST') return reply(405);
        const requested = request.headers.get('Access-Control-Request-Headers') ?? '';
        if (requested.split(',').some((name) => name.trim() && name.trim().toLowerCase() !== 'content-type')) return reply(403);
        headers['Access-Control-Allow-Methods'] = 'POST';
        headers['Access-Control-Allow-Headers'] = 'Content-Type';
        headers['Access-Control-Max-Age'] = '86400';
        return reply(204);
      }

      if (request.method !== 'POST') return reply(405);
      if (request.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase() !== 'application/json') return reply(415);

      // Only Cloudflare's connection header supplies identity, never browser JSON or X-Forwarded-For.
      let ip = request.headers.get('CF-Connecting-IP');
      if (/^(24\d|25[0-5])\./.test(ip ?? '')) ip = request.headers.get('CF-Connecting-IPv6') || ip;
      const userAgent = request.headers.get('User-Agent');
      if (!ip || !userAgent || !env.VISIT_LIMITER) return reply(503);

      try {
        const { success } = await env.VISIT_LIMITER.limit({ key: ip });
        if (!success) return reply(429);
      } catch {
        return reply(503);
      }

      let payload;
      try {
        payload = await readPayload(request);
        if (!validPayload(payload, site)) return reply(400);
      } catch (error) {
        return reply(error instanceof RangeError ? 413 : 400);
      }

      try {
        const response = await send(COLLECT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'User-Agent': userAgent },
          body: JSON.stringify({
            type: 'event',
            payload: {
              ...payload,
              hostname: site.hostname,
              website: env.UMAMI_WEBSITE_ID,
              ip,
              userAgent,
            },
          }),
          redirect: 'manual',
          signal: AbortSignal.timeout(5000),
        });
        // Upstream JSON can contain identity tokens; return no upstream content or headers.
        await response.body?.cancel();
        return reply(response.ok ? 204 : 502);
      } catch {
        return reply(502);
      }
    },
  };
}

export default createRelay();
