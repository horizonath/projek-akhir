import {
  generateLoaderAbsoluteTemplate,
  generateReportItemTemplate,
  generateReportsListEmptyTemplate,
  generateReportsListErrorTemplate,
} from '../../templates';
import BookmarkPresenter from './bookmark-presenter';
import Database from '../../data/database';
import Map from '../../utils/map';

export default class BookmarkPage {
  #presenter = null;
  #map = null;

  async render() {
    return `
      <section>
        <div class="reports-list__map__container">
          <div id="map" class="reports-list__map"></div>
          <div id="map-loading-container"></div>
        </div>
      </section>

      <section class="container">
        <h1 class="section-title">Daftar Laporan Kerusakan Tersimpan</h1>

        <div class="reports-list__container">
          <div id="reports-list"></div>
          <div id="reports-list-loading-container"></div>
        </div>
      </section>
    `;
  }
  
  async afterRender() {
    await this.initialMap(); // Wajib: map dulu
    this.#presenter = new BookmarkPresenter({
      view: this,
      model: Database,
    });

    try {
      await this.#presenter.initialGalleryAndMap();
    } catch (error) {
      console.error('Gagal sinkronisasi data bookmark:', error);
      this.populateBookmarkedReportsError('Gagal memuat data bookmark.');
    }
  }

  populateBookmarkedReports(message, listStory) {
    if (!Array.isArray(listStory) || listStory.length === 0) {
      this.populateBookmarkedReportsListEmpty();
      return;
    }

    const html = listStory.reduce((accumulator, story) => {
      const lat = story.location?.latitude ?? null;
      const lon = story.location?.longitude ?? null;
      const placeName = story.location?.placeName ?? '-';

      if (this.#map && lat !== null && lon !== null) {
        const coordinate = [lat, lon];
        const markerOptions = { alt: story.name };
        const popupOptions = { content: story.name };
        this.#map.addMarker(coordinate, markerOptions, popupOptions);
      } else {
        console.warn("Data story tanpa koordinat:", story);
      }

      return accumulator + generateReportItemTemplate({
        id: story.id,
        name: story.name,
        description: story.description,
        photoUrl: story.photoUrl,
        createdAt: story.createdAt,
        lat,
        lon,
        placeName,
      });
    }, '');

    document.getElementById('reports-list').innerHTML = `
      <div class="reports-list">
        ${html}
      </div>
    `;
  }

  async initialMap() {
    if (this.#map) {
      this.#map.remove(); // Hindari duplikat peta
    }

    this.#map = await Map.build('#map', {
      zoom: 10,
      locate: true,
    });
  }

  showMapLoading() {
    document.getElementById('map-loading-container').innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById('map-loading-container').innerHTML = '';
  }

  showReportsListLoading() {
    document.getElementById('reports-list-loading-container').innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideReportsListLoading() {
    document.getElementById('reports-list-loading-container').innerHTML = '';
  }

  populateBookmarkedReportsListEmpty() {
    document.getElementById('reports-list').innerHTML =
      generateReportsListEmptyTemplate();
  }

  populateBookmarkedReportsError(message) {
    document.getElementById('reports-list').innerHTML =
      generateReportsListErrorTemplate(message);
  }
}
