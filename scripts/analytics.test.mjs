import assert from 'node:assert/strict';
import test from 'node:test';
import { initializeAnalytics } from '../src/analytics.js';

const endpoint = 'https://visits.example.test/collect';
function browser() {
  const listeners = new Map();
  const calls = [];
  return {
    calls,
    listeners,
    location: { protocol: 'https:', pathname: '/GSoC-AI-OSS/', search: '', hash: '' },
    navigator: { language: 'en-US', doNotTrack: '0' },
    document: { referrer: 'https://example.test/', title: 'GSoC AI-to-OSS' },
    screen: { width: 1440, height: 900 },
    fetch: (url, options) => { calls.push({ url, options }); return Promise.resolve(new Response(null, { status: 204 })); },
    addEventListener: (name, callback) => listeners.set(name, callback),
    removeEventListener: (name) => listeners.delete(name),
  };
}

test('initial page and hash navigation send metadata without the website ID or a tracker script', () => {
  const win = browser();
  const stop = initializeAnalytics(win, endpoint);
  const first = win.calls[0];
  assert.equal(first.url, endpoint);
  assert.equal(first.options.credentials, 'omit');
  assert.equal(first.options.keepalive, true);
  assert.deepEqual(JSON.parse(first.options.body), {
    url: '/GSoC-AI-OSS/', referrer: 'https://example.test/', title: 'GSoC AI-to-OSS',
    language: 'en-US', screen: '1440x900',
  });
  assert.doesNotMatch(first.options.body, /website|umami|\bip\b|userAgent/i);
  win.location.hash = '#/aim';
  win.listeners.get('hashchange')();
  assert.equal(JSON.parse(win.calls[1].options.body).url, '/GSoC-AI-OSS/#/aim');
  assert.equal(JSON.parse(win.calls[1].options.body).referrer, '/GSoC-AI-OSS/');
  win.listeners.get('popstate')();
  initializeAnalytics(win, endpoint);
  assert.equal(win.calls.length, 2);
  stop();
  assert.equal(win.listeners.size, 0);
});

test('missing or invalid endpoints, local previews, and privacy signals do not collect', () => {
  for (const target of ['', 'invalid', 'http://visits.example.test/collect', 'https://user:pass@example.test/collect']) {
    const win = browser();
    initializeAnalytics(win, target);
    assert.equal(win.calls.length, 0);
    assert.equal(win.listeners.size, 0);
  }
  for (const change of [
    (win) => { win.location.protocol = 'http:'; },
    (win) => { win.navigator.doNotTrack = '1'; },
    (win) => { win.doNotTrack = '1'; },
    (win) => { win.navigator.globalPrivacyControl = true; },
  ]) {
    const win = browser();
    change(win);
    initializeAnalytics(win, endpoint);
    assert.equal(win.calls.length, 0);
  }
});

test('blocked requests and network failures do not interrupt navigation', async () => {
  for (const fetch of [
    () => { throw new Error('Blocked'); },
    () => Promise.reject(new Error('Offline')),
  ]) {
    const win = browser();
    win.fetch = fetch;
    assert.doesNotThrow(() => initializeAnalytics(win, endpoint));
    win.location.hash = '#/impacts';
    assert.doesNotThrow(() => win.listeners.get('hashchange')());
    await new Promise((resolve) => setImmediate(resolve));
  }
});
