import { getAccessToken } from '../../utils/auth';
import { BASE_URL } from '../../../scripts/config';

export default class HomePresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async showReportsListMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error('showReportsListMap: error:', error);
      this.#view.showMapError('Peta tidak tersedia saat offline.');
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async initialGalleryAndMap() {
    this.#view.showLoading();
    try {
      await this.showReportsListMap();

      // Prefetch tile agar tetap muncul offline
      if (navigator.onLine) {
        await this.#preloadTiles(10);
      }

      const response = await this.#model.getAllStory();

      if (!response.ok) {
        console.error('initialGalleryAndMap: response:', response);
        this.#view.populateReportsListError(response.message);
        return;
      }

      this.#view.populateReportsList(response.message, response.listStory);

      // Prefetch detail report ke cache
      const cache = await caches.open('story-detail-cache');
      const token = getAccessToken();

      await Promise.all(response.listStory.map(async (story) => {
        const detailUrl = `${BASE_URL}/stories/${story.id}`;
        try {
          const response = await fetch(detailUrl, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            await cache.put(detailUrl, response.clone());
          } else {
            console.warn(`Prefetch gagal: ${response.status} untuk ${detailUrl}`);
          }
        } catch (err) {
          console.warn(`Prefetch error untuk ${detailUrl}:`, err);
        }
      }));
    } catch (error) {
      console.error('initialGalleryAndMap: error:', error);
      this.#view.populateReportsListError(error.message);
    } finally {
      this.#view.hideLoading();
    }
  }

  async #preloadTiles(z = 10) {
    const tileX = [517, 518, 519];
    const tileY = [323, 324, 325];

    for (const x of tileX) {
      for (const y of tileY) {
        const url = `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
        try {
          const response = await fetch(url, { mode: 'no-cors' });
          if (response.status === 200 || response.type === 'opaque') {
            console.log(`Tile prefetched: ${url}`);
          }
        } catch (e) {
          console.warn(`Gagal preload tile: ${url}`);
        }
      }
    }
  }
}
