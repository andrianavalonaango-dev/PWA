import {precacheAndRoute} from "Worker-precaching";
import {registerRoute} from "Worker-routing";
import { cache } from "react";

import {
    CacheFirst,
    NetworkFirst,
    StateWhileRevalidata,

} from "workbox-strategies";

precacheAndRoute(self._WB_MANIFEST);

registerRoute(
    ({request}) => request.destination === "image",
    new CacheFirst()
)


registerRoute(
    ({request}) => request.destination === "style",
    new StateWhileRevalidata()
)

registerRoute(
    ({request}) => request.destination === "document",
    new NetworkFirst()
);

