importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js"
);

console.log("Workbox chargé");


const { precacheAndRoute } = workbox.precaching;
const { registerRoute } = workbox.routing;
const { CacheFirst, NetworkFirst } = workbox.strategies;


precacheAndRoute([
  { url: "/", revision: "1" },
  { url: "/index.html", revision: "1" },
  { url: "/app.js", revision: "1" },
  { url: "/style.css", revision: "1" },
  { url: "/offline.html", revision: "1" }
  
]);




registerRoute(
  ({ request }) => request.destination === "script",
  new CacheFirst({
    cacheName: "js-cache"
  })
);



registerRoute(
  ({ request }) => request.destination === "style",
  new CacheFirst({
    cacheName: "css-cache"
  })
);




registerRoute(
  ({ request }) => request.destination === "document",
  new NetworkFirst({
    cacheName: "html-cache"
  })
);




workbox.routing.setCatchHandler(async ({ event }) => {

  if (event.request.destination === "document") {
    return caches.match("/offline.html");
  }

  return Response.error();
});