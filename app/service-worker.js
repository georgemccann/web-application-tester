importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js');

// Note: Ignore the error that Glitch raises about workbox being undefined.
workbox.skipWaiting();
workbox.clientsClaim();

workbox.precaching.precacheAndRoute([]);