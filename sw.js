// NEPSE Signal Desk service worker.
// App shell: cache-first, refreshed in the background. Market data: network-first, cached copy when offline.
const SHELL = "nepse-desk-shell-v1";
const DATA = "nepse-desk-data";
const SHELL_FILES = ["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/favicon-32.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(SHELL).then(c => c.addAll(SHELL_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== SHELL && k !== DATA).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Market data: always try the network so the day's update shows up.
  if (url.origin === location.origin && url.pathname.endsWith("/nepse.json")) {
    e.respondWith(
      fetch(req, { cache: "no-cache" }).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(DATA).then(c => c.put("nepse.json", copy)); }
        return res;
      }).catch(() => caches.open(DATA).then(c => c.match("nepse.json")).then(r => r || Response.error()))
    );
    return;
  }

  // Page, icons and Google Fonts: serve from cache, update in the background.
  const sameOrigin = url.origin === location.origin;
  const fonts = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if (!sameOrigin && !fonts) return;
  e.respondWith(
    caches.open(SHELL).then(async c => {
      const hit = await c.match(req, { ignoreSearch: sameOrigin });
      const net = fetch(req).then(res => { if (res.ok || res.type === "opaque") c.put(req, res.clone()); return res; }).catch(() => null);
      if (hit) { e.waitUntil(net); return hit; }
      const res = await net;
      if (res) return res;
      if (req.mode === "navigate") return (await c.match("index.html")) || Response.error();
      return Response.error();
    })
  );
});
