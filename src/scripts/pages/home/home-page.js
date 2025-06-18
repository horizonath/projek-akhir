import {
  generateLoaderAbsoluteTemplate,
  generateReportItemTemplate,
  generateReportsListEmptyTemplate,
  generateReportsListErrorTemplate,
} from '../../templates';

import HomePresenter from './home-presenter';
import Map from '../../utils/map';
import * as CityCareAPI from '../../data/api';
import { getAccessToken } from '../../utils/auth';
import { navigateToLogin } from '../../utils/navigator'; // pastikan kamu punya ini


export default class HomePage {
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
        <h1 class="section-title">Daftar Cerita</h1>

        <div class="reports-list__container">
          <div id="reports-list"></div>
          <div id="reports-list-loading-container"></div>
        </div>
      </section>
    `;
  }

async afterRender() {
  const token = getAccessToken();

  if (!token) {
    navigateToLogin();
    return;
  }

  this.#presenter = new HomePresenter({
    view: this,
    model: CityCareAPI,
  });

  await this.#presenter.initialGalleryAndMap();
}

  async initialMap() {
    try {
      this.#map = await Map.build('#map', {
        zoom: 10,
        locate: true,
      });
    } catch (error) {
      throw new Error('Gagal memuat peta');
    }
  }

  populateReportsList(message, listStory) {
    if (listStory.length <= 0) {
      this.populateReportsListEmpty();
      return;
    }

    const html = listStory.reduce((accumulator, story) => {
      if (this.#map && story.lat != null && story.lon != null) {
        const coordinate = [story.lat, story.lon];
        const markerOptions = { alt: story.name };
        const popupOptions = { content: story.name };
        this.#map.addMarker(coordinate, markerOptions, popupOptions);
      } else if (!story.lat || !story.lon) {
        console.warn("Data story tanpa koordinat:", story);
      }

      return accumulator.concat(
        generateReportItemTemplate({
          ...story,
          name: story.name,
        }),
      );
    }, '');

    document.getElementById('reports-list').innerHTML = `
      <div class="reports-list">${html}</div>
    `;
  }

  populateReportsListEmpty() {
    document.getElementById('reports-list').innerHTML = generateReportsListEmptyTemplate();
  }

  populateReportsListError(message) {
    document.getElementById('reports-list').innerHTML = generateReportsListErrorTemplate(message);
  }

  showMapLoading() {
    document.getElementById('map-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById('map-loading-container').innerHTML = '';
  }

  showMapError(message) {
    document.getElementById('map').innerHTML = `
      <div style="padding: 1rem; text-align: center; color: #777;">
        ${message}
      </div>
    `;
  }

  showLoading() {
    document.getElementById('reports-list-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
  }

  hideLoading() {
    document.getElementById('reports-list-loading-container').innerHTML = '';
  }
}
