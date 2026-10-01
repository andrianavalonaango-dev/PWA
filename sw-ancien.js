

const CACHE_NAME = "todo-pwa-v1";
const DYNAMIC_NAME = "todo-pwa-v2";

const ASSETS = [
  "/",
  "/index.html",
  "/app.js",
  "/style.css",
  "/offline.html"
];



self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(ASSETS);
      })
  );

  console.log("Service Worker installé");
});



self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => 
              name !== CACHE_NAME && name !== DYNAMIC_NAME
            )
            .map(name => caches.delete(name))
        );
      })
  );

  console.log("Service Worker activé");
});



self.addEventListener("fetch", event => {

  event.respondWith(

    caches.match(event.request)
      .then(response => {

     
        if (response) {
          return response;
        }

        
        return fetch(event.request)
          .then(networkResponse => {

            return caches.open(DYNAMIC_NAME)
              .then(cache => {

                cache.put(
                  event.request,
                  networkResponse.clone()
                );

                return networkResponse;
              });

          })
          .catch(() => {

          
            return caches.match("/offline.html");

          });

      })

  );

});