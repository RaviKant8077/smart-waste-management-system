// PWA utilities for service worker registration and offline support

export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered successfully:', registration);

      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available, notify user
              if (confirm('New content is available. Reload to update?')) {
                window.location.reload();
              }
            }
          });
        }
      });
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

export const unregisterServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.unregister();
      console.log('Service Worker unregistered');
    } catch (error) {
      console.error('Service Worker unregistration failed:', error);
    }
  }
};

export const isOnline = () => {
  return navigator.onLine;
};

export const addOnlineOfflineListeners = (onOnline, onOffline) => {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
};

// Cache offline forms for later submission
export const cacheOfflineForm = async (formData, endpoint) => {
  if (!isOnline()) {
    const cache = await caches.open('offline-forms');
    const request = new Request(endpoint, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    await cache.put(request, new Response(JSON.stringify(formData)));
    return true; // Cached for later
  }
  return false; // Online, submit immediately
};

// Sync cached forms when back online
export const syncOfflineForms = async () => {
  if (isOnline()) {
    const cache = await caches.open('offline-forms');
    const keys = await cache.keys();

    for (const request of keys) {
      try {
        const response = await cache.match(request);
        const formData = await response.json();

        // Attempt to submit
        await fetch(request.url, {
          method: request.method,
          body: JSON.stringify(formData),
          headers: request.headers
        });

        // Remove from cache on success
        await cache.delete(request);
      } catch (error) {
        console.error('Failed to sync offline form:', error);
      }
    }
  }
};
