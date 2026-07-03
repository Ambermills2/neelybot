// NeelyBot service worker — network-first so the wall always shows fresh content,
// with an offline cache fallback so the hub still loads if Wi-Fi drops.
const CACHE = 'neelybot-7ab46e21';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png', './apple-touch-icon.png', './logo.png'];
// Live data endpoints — always hit the network, never cache (so weather is fresh, and stale
// values never get pinned). They fail cleanly offline; the app keeps its last in-memory reading.
// Google hosts must never be cached — the auth libraries and Calendar API need to run live.
const LIVE_HOSTS = ['api.open-meteo.com', 'geocoding-api.open-meteo.com', 'apis.google.com', 'accounts.google.com', 'www.googleapis.com', 'content.googleapis.com', 'oauth2.googleapis.com', 'firestore.googleapis.com', 'identitytoolkit.googleapis.com', 'securetoken.googleapis.com', 'firebaseinstallations.googleapis.com'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  let url;
  try { url = new URL(e.request.url); } catch (_) { return; }
  // Let live weather/geocoding calls go straight to the network (no SW caching).
  if (LIVE_HOSTS.includes(url.hostname)) return;
  e.respondWith(
    fetch(e.request)
      .then((resp) => {
        const copy = resp.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return resp;
      })
      .catch(() => caches.match(e.request).then((r) => r || caches.match('./index.html')))
  );
});
