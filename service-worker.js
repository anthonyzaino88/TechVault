// Define the cache name and resources to cache
const cacheName = 'TechVault-Catalog-PWA-V5';
const cacheResources = [
  '/TechVault/',
  '/TechVault/index.html',
  '/TechVault/assets/icons/icon.png',
  '/TechVault/assets/icons/favicon.png',
  '/TechVault/assets/icons/icon-v2.png',
  '/TechVault/assets/icons/icon-v3.png',
  '/TechVault/assets/icons/icon-v4.png',
  '/TechVault/assets/icons/icon-v6.png',
  '/TechVault/assets/images/file-pdf-solid.svg',
  '/TechVault/assets/images/home.svg',
  '/TechVault/assets/images/library.svg',
  '/TechVault/assets/images/links-nav.svg',
  '/TechVault/assets/images/links.svg',
  '/TechVault/assets/images/Losone-Select-Ceiling.webp',
  '/TechVault/assets/images/return-back-button.svg',
  '/TechVault/assets/images/right-left-solid.svg',
  '/TechVault/assets/images/right-left-white.svg',
  '/TechVault/assets/images/search-icon.svg',
  '/TechVault/assets/images/solidplay-white.svg',
  '/TechVault/assets/css/styles.css',
  '/TechVault/assets/css/cross-ref-style.css',
  '/TechVault/globleStyles.css',
  '/TechVault/js/main.js',
  '/TechVault/pages/library.html',
  '/TechVault/pages/products.html',
  '/TechVault/pages/productsgrid.html',
  '/TechVault/pages/about.html',
  '/TechVault/pages/analytics.html',
  '/TechVault/pages/favorites.html',
  '/TechVault/data/competitors.json',
  '/TechVault/data/cross-references.json',
  '/TechVault/data/documents.json',
  '/TechVault/data/products.json',
  '/TechVault/components/cross-reference-table.js',
  '/TechVault/components/document-viewer.js',
  '/TechVault/components/navbar.js',
  '/TechVault/components/product-list.js',
  '/TechVault/components/modern-product-catalog.js',
  '/TechVault/components/modern-document-library.js'


];

// Install event: Cache resources when the service worker is installed
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName)
      .then((cache) => {
        return cache.addAll(cacheResources);
      })
  );
});

// Fetch event: Serve cached resources if available, otherwise fetch from the network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
      })
  );
});
