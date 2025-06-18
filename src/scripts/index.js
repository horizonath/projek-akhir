// CSS & Library
import '../styles/styles.css';
import '../styles/responsives.css';
import 'tiny-slider/dist/tiny-slider.css';
import 'leaflet/dist/leaflet.css';

// Komponen
import App from './pages/app';
import { registerServiceWorker } from './utils';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.getElementById('main-content'),
    drawerButton: document.getElementById('drawer-button'),
    drawerNavigation: document.getElementById('navigation-drawer'),
    skipLinkButton: document.getElementById('skip-link'),
  });

  await app.renderPage();
  await registerServiceWorker();

  if (process.env.NODE_ENV === 'production') {
    await app.setupPushNotification?.(); // hanya jika method ini ada
  }

  console.log('Service Worker berhasil didaftarkan.');

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });
});
