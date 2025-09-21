// [AI]
const CACHE_NAME = "merci-tracker-v1";
const STATIC_CACHE_NAME = "merci-tracker-static-v1";
const API_CACHE_NAME = "merci-tracker-api-v1";

// Files to cache for offline functionality
const STATIC_FILES = [
  "/",
  "/dashboard",
  "/income/new",
  "/manifest.json",
  "/icon-192x192.png",
  "/icon-512x512.png",
];

// API endpoints to cache
const API_ENDPOINTS = [
  // Supabase endpoints will be handled dynamically
];

// Install event - cache static files
self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker");

  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log("[SW] Caching static files");
        return cache.addAll(STATIC_FILES);
      }),
      caches.open(API_CACHE_NAME),
    ]).then(() => {
      console.log("[SW] Installation complete");
      // Force the waiting service worker to become the active service worker
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating service worker");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== STATIC_CACHE_NAME &&
              cacheName !== API_CACHE_NAME &&
              cacheName.startsWith("merci-tracker-")
            ) {
              console.log("[SW] Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("[SW] Activation complete");
        // Immediately claim all clients
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategy
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle navigation requests (HTML pages)
  if (request.mode === "navigate") {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached page and update in background
          fetchAndUpdateCache(request);
          return cachedResponse;
        }

        // If not cached, fetch from network
        return fetch(request)
          .then((response) => {
            // Cache the response for future use
            if (response.status === 200) {
              caches.open(STATIC_CACHE_NAME).then((cache) => {
                cache.put(request, response.clone());
              });
            }
            return response;
          })
          .catch(() => {
            // If offline and no cache, return offline page
            return (
              caches.match("/") ||
              new Response(
                "<html><body><h1>Offline</h1><p>You are offline. Please check your connection.</p></body></html>",
                { headers: { "Content-Type": "text/html" } }
              )
            );
          });
      })
    );
    return;
  }

  // Handle Supabase API requests
  if (url.hostname.includes("supabase")) {
    event.respondWith(handleSupabaseRequest(request));
    return;
  }

  // Handle static assets
  if (
    request.destination === "image" ||
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "manifest"
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request).then((response) => {
          if (response.status === 200) {
            caches.open(STATIC_CACHE_NAME).then((cache) => {
              cache.put(request, response.clone());
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // Default: network first for all other requests
  event.respondWith(fetch(request).catch(() => caches.match(request)));
});

// Handle Supabase API requests with cache-first strategy for GET requests
async function handleSupabaseRequest(request) {
  const isGetRequest = request.method === "GET";

  if (isGetRequest) {
    // For GET requests, try cache first
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      // Return cached data and update in background
      fetchAndUpdateSupabaseCache(request);
      return cachedResponse;
    }
  }

  try {
    // Fetch from network
    const response = await fetch(request);

    if (response.ok && isGetRequest) {
      // Cache successful GET responses
      const cache = await caches.open(API_CACHE_NAME);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    // If offline and it's a GET request, return cached data
    if (isGetRequest) {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
    }

    // Return error response for POST/PUT/DELETE when offline
    return new Response(
      JSON.stringify({
        error: "Offline - Request will be retried when connection is restored",
        offline: true,
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// Background fetch and cache update
async function fetchAndUpdateCache(request) {
  try {
    const response = await fetch(request);
    if (response.status === 200) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, response.clone());
    }
  } catch (error) {
    console.log("[SW] Background update failed:", error);
  }
}

// Background fetch and cache update for Supabase
async function fetchAndUpdateSupabaseCache(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(API_CACHE_NAME);
      cache.put(request, response.clone());
    }
  } catch (error) {
    console.log("[SW] Background Supabase update failed:", error);
  }
}

// Handle background sync for offline actions
self.addEventListener("sync", (event) => {
  console.log("[SW] Background sync triggered:", event.tag);

  if (event.tag === "income-sync") {
    event.waitUntil(syncOfflineIncomeEntries());
  }
});

// Sync offline income entries when back online
async function syncOfflineIncomeEntries() {
  try {
    // This would integrate with your offline storage system
    console.log("[SW] Syncing offline income entries");

    // In a full implementation, you would:
    // 1. Get pending entries from IndexedDB
    // 2. Send them to Supabase
    // 3. Remove them from offline storage on success

    return Promise.resolve();
  } catch (error) {
    console.error("[SW] Sync failed:", error);
    throw error;
  }
}

// Handle push notifications (future feature)
self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: "/icon-192x192.png",
    badge: "/icon-192x192.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: "1",
    },
    actions: [
      {
        action: "explore",
        title: "View Dashboard",
        icon: "/icon-192x192.png",
      },
      {
        action: "close",
        title: "Close",
        icon: "/icon-192x192.png",
      },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/dashboard"));
  }
});
// [/AI]
