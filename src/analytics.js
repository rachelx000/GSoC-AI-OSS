const initialized = new WeakSet();

export function initializeAnalytics(win = window, endpoint = import.meta.env?.VITE_VISIT_ENDPOINT) {
  if (!endpoint || initialized.has(win) || win.location.protocol !== 'https:') return;
  if (win.navigator.doNotTrack === '1' || win.doNotTrack === '1' || win.navigator.globalPrivacyControl) return;

  try {
    const target = new URL(endpoint);
    if (target.protocol !== 'https:' || target.username || target.password) return;
  } catch {
    return;
  }

  let previousUrl;
  const track = () => {
    const url = win.location.pathname + win.location.search + win.location.hash;
    if (url === previousUrl) return;
    const payload = {
      url,
      referrer: previousUrl ?? win.document.referrer,
      title: win.document.title,
      language: win.navigator.language,
      screen: `${win.screen.width}x${win.screen.height}`,
    };
    previousUrl = url;

    // Collection failures must not interrupt the dashboard.
    try {
      Promise.resolve(win.fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'omit',
        keepalive: true,
        referrerPolicy: 'no-referrer',
      })).catch(() => {});
    } catch {}
  };

  initialized.add(win);
  win.addEventListener('hashchange', track);
  win.addEventListener('popstate', track);
  track();

  return () => {
    win.removeEventListener('hashchange', track);
    win.removeEventListener('popstate', track);
    initialized.delete(win);
  };
}
