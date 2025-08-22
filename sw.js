/**
 * Service Worker for Mustafa ER Portfolio
 * Mobile-Optimized PWA with Enhanced SEO Features
 * Version: 2.0.0
 */

const CACHE_NAME = 'mustafaer-portfolio-v2.0.0';
const STATIC_CACHE = 'static-v2.0.0';
const DYNAMIC_CACHE = 'dynamic-v2.0.0';
const IMAGE_CACHE = 'images-v2.0.0';

// Assets to cache for offline functionality and mobile performance
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/main.js',
  '/assets/bootstrap.min.css',
  '/assets/bootstrap.bundle.min.js',
  '/assets/manifest.json',
  '/assets/mustafaer_dev.png',
  '/assets/sddlabs-logo-1.ico',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css'
];

// Dynamic assets for caching (project images, etc.)
const DYNAMIC_ASSETS = [
  '/assets/weight-track-brand.png',
  '/assets/tabis-brand.png',
  '/assets/medirise-brand.png',
  '/assets/math-for-kids-brand.png',
  '/assets/bides-login-page2.png',
  '/assets/daser-brand.jpg'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('SW: Installing Service Worker...');

  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('SW: Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Cache dynamic assets for mobile performance
      caches.open(IMAGE_CACHE).then((cache) => {
        console.log('SW: Caching images for mobile...');
        return cache.addAll(DYNAMIC_ASSETS);
      })
    ]).then(() => {
      console.log('SW: Installation complete');
      // Force activation for immediate mobile performance
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('SW: Activating Service Worker...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE && cacheName !== IMAGE_CACHE) {
            console.log('SW: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('SW: Activation complete');
      // Take control immediately for mobile users
      return self.clients.claim();
    })
  );
});

// Fetch event - serve cached content with mobile-optimized strategy
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests that aren't from our CDNs
  if (url.origin !== location.origin &&
      !url.origin.includes('googleapis.com') &&
      !url.origin.includes('jsdelivr.net') &&
      !url.origin.includes('bootstrapcdn.com')) {
    return;
  }

  event.respondWith(
    handleFetchRequest(request)
  );
});

// Mobile-optimized fetch handling strategy
async function handleFetchRequest(request) {
  const url = new URL(request.url);

  try {
    // Strategy 1: Cache First for static assets (mobile performance)
    if (isStaticAsset(request)) {
      return await cacheFirstStrategy(request, STATIC_CACHE);
    }

    // Strategy 2: Stale While Revalidate for images (mobile UX)
    if (isImageRequest(request)) {
      return await staleWhileRevalidateStrategy(request, IMAGE_CACHE);
    }

    // Strategy 3: Network First for HTML/API (SEO and freshness)
    if (isHTMLRequest(request) || isAPIRequest(request)) {
      return await networkFirstStrategy(request, DYNAMIC_CACHE);
    }

    // Default: Network with cache fallback
    return await networkWithCacheFallback(request, DYNAMIC_CACHE);

  } catch (error) {
    console.error('SW: Fetch error:', error);

    // Return offline page for HTML requests
    if (isHTMLRequest(request)) {
      return await getOfflinePage();
    }

    // Return cached version or error for other requests
    return await caches.match(request) || new Response('Offline', { status: 503 });
  }
}

// Cache First Strategy (best for static assets)
async function cacheFirstStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  const networkResponse = await fetch(request);
  if (networkResponse.ok) {
    const cache = await caches.open(cacheName);
    cache.put(request, networkResponse.clone());
  }

  return networkResponse;
}

// Stale While Revalidate Strategy (best for images)
async function staleWhileRevalidateStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request);

  const fetchPromise = fetch(request).then(async (networkResponse) => {
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => cachedResponse);

  return cachedResponse || await fetchPromise;
}

// Network First Strategy (best for HTML and fresh content)
async function networkFirstStrategy(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Network with Cache Fallback
async function networkWithCacheFallback(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return await caches.match(request) || new Response('Offline', { status: 503 });
  }
}

// Helper functions
function isStaticAsset(request) {
  const url = new URL(request.url);
  return url.pathname.endsWith('.css') ||
         url.pathname.endsWith('.js') ||
         url.pathname.endsWith('.woff2') ||
         url.pathname.endsWith('.woff') ||
         url.pathname.includes('fonts.googleapis.com') ||
         url.pathname.includes('bootstrap-icons');
}

function isImageRequest(request) {
  const url = new URL(request.url);
  return url.pathname.endsWith('.png') ||
         url.pathname.endsWith('.jpg') ||
         url.pathname.endsWith('.jpeg') ||
         url.pathname.endsWith('.gif') ||
         url.pathname.endsWith('.webp') ||
         url.pathname.endsWith('.svg') ||
         url.pathname.endsWith('.ico');
}

function isHTMLRequest(request) {
  const url = new URL(request.url);
  return request.headers.get('accept')?.includes('text/html') ||
         url.pathname.endsWith('.html') ||
         url.pathname === '/';
}

function isAPIRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/') ||
         url.pathname.includes('/api/');
}

// Get offline page
async function getOfflinePage() {
  const cache = await caches.open(STATIC_CACHE);
  return await cache.match('/') || new Response(`
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Offline - Mustafa ER Portfolio</title>
        <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #0F172A; color: white; }
            .offline-content { max-width: 500px; margin: 0 auto; }
            .offline-icon { font-size: 64px; margin-bottom: 20px; }
            h1 { color: #667EEA; margin-bottom: 20px; }
            p { line-height: 1.6; margin-bottom: 30px; }
            .retry-btn { background: #667EEA; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; }
        </style>
    </head>
    <body>
        <div class="offline-content">
            <div class="offline-icon">📱</div>
            <h1>You're Offline</h1>
            <p>It looks like you're not connected to the internet. Some cached content is available.</p>
            <button class="retry-btn" onclick="window.location.reload()">Try Again</button>
        </div>
    </body>
    </html>
  `, {
    headers: { 'Content-Type': 'text/html' }
  });
}

// Background Sync for mobile performance
self.addEventListener('sync', (event) => {
  console.log('SW: Background sync triggered:', event.tag);

  if (event.tag === 'portfolio-sync') {
    event.waitUntil(syncPortfolioData());
  }
});

// Sync portfolio data in background
async function syncPortfolioData() {
  try {
    // Prefetch critical resources for mobile
    const criticalResources = [
      '/',
      '/assets/mustafaer_dev.png',
      'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
    ];

    const cache = await caches.open(DYNAMIC_CACHE);

    for (const resource of criticalResources) {
      try {
        const response = await fetch(resource);
        if (response.ok) {
          await cache.put(resource, response);
        }
      } catch (error) {
        console.warn('SW: Failed to sync resource:', resource, error);
      }
    }

    console.log('SW: Portfolio data synced successfully');
  } catch (error) {
    console.error('SW: Failed to sync portfolio data:', error);
  }
}

// Push notification handling for engagement
self.addEventListener('push', (event) => {
  console.log('SW: Push message received');

  const options = {
    body: 'Check out new projects and updates!',
    icon: '/assets/android-icon-192x192.png',
    badge: '/assets/android-icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
      url: '/#projects'
    },
    actions: [
      {
        action: 'explore',
        title: 'View Projects',
        icon: '/assets/shortcut-projects.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/assets/close-icon.png'
      }
    ],
    tag: 'portfolio-update',
    requireInteraction: true
  };

  event.waitUntil(
    self.registration.showNotification('Mustafa ER Portfolio Update', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('SW: Notification click received');

  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/#projects')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open the portfolio
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Performance monitoring for mobile SEO
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }

  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      cacheUrls(event.data.payload)
    );
  }
});

// Cache specific URLs on demand
async function cacheUrls(urls) {
  const cache = await caches.open(DYNAMIC_CACHE);
  return Promise.all(
    urls.map(async (url) => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          return cache.put(url, response);
        }
      } catch (error) {
        console.warn('SW: Failed to cache URL:', url, error);
      }
    })
  );
}

console.log('SW: Service Worker loaded successfully - Mobile SEO Optimized');
