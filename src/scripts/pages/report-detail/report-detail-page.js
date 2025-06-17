import {
  generateLoaderAbsoluteTemplate,
  generateReportDetailErrorTemplate,
  generateReportDetailTemplate,
  generateRemoveReportButtonTemplate,
  generateSaveReportButtonTemplate,
} from '../../templates';
import { createCarousel } from '../../utils';
import ReportDetailPresenter from './report-detail-presenter';
import { parseActivePathname } from '../../routes/url-parser';
import Map from '../../utils/map';
import * as CityCareAPI from '../../data/api';
import Database from '../../data/database';
 
export default class ReportDetailPage {
  #presenter = null;
  #form = null;
  #map = null;

  async render() {
    return `
      <section>
        <div class="report-detail__container">
          <div id="report-detail" class="report-detail"></div>
          <div id="report-detail-loading-container"></div>
          <div id="save-actions-container"></div> <!-- Tambahkan ini -->
        </div>
      </section>
      
      <section class="container">
        <div class="report-detail__comments__container">
          <div class="report-detail__comments-list__container">
            <div id="report-detail-comments-list"></div>
            <div id="comments-list-loading-container"></div>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new ReportDetailPresenter(parseActivePathname().id, {
      view: this,
      apiModel: CityCareAPI,
      dbModel: Database,
    });
 
 
    this.#presenter.showReportDetail();
  }

async populateReportDetailAndInitialMap(message, story) { 
  document.getElementById('report-detail').innerHTML = generateReportDetailTemplate({
  id: story.id,
  name: story.name,
  description: story.description,
  photoUrl: story.photoUrl,
  lat: story.lat,
  lon: story.lon,
  createdAt: story.createdAt,
  placeName: story.location?.placeName ?? '-',
});

  
  // Carousel images
  createCarousel(document.getElementById('images'));

// Map
await this.#presenter.showReportDetailMap();

if (this.#map && story.lat != null && story.lon != null) {
  const coordinate = [story.lat, story.lon];
  const markerOptions = { alt: story.name };
  const popupOptions = { content: story.name };

  this.#map.changeCamera(coordinate);
  this.#map.addMarker(coordinate, markerOptions, popupOptions);
}

this.#presenter.showSaveButton();

}


  populateReportDetailError(message) {
    document.getElementById('report-detail').innerHTML = generateReportDetailErrorTemplate(message);
  }

  async initialMap() {
    this.#map = await Map.build('#map', {
      zoom: 15,
    });
  }
  
  
  clearForm() {
    this.#form.reset();
  }

  renderSaveButton() {
    document.getElementById('save-actions-container').innerHTML =
      generateSaveReportButtonTemplate();
  
    document.getElementById('report-detail-save').addEventListener('click', async () => {
      await this.#presenter.saveReport();
      await this.#presenter.showSaveButton();
    });
  }
 
  
  saveToBookmarkSuccessfully(message) {
    console.log(message);
  }
  saveToBookmarkFailed(message) {
    alert(message);
  }

  renderRemoveButton() {
    document.getElementById('save-actions-container').innerHTML =
      generateRemoveReportButtonTemplate();
 
    document.getElementById('report-detail-remove').addEventListener('click', async () => {
      await this.#presenter.removeReport();
      await this.#presenter.showSaveButton();
    });
  }
  removeFromBookmarkSuccessfully(message) {
    console.log(message);
  }
  removeFromBookmarkFailed(message) {
    alert(message);
  }
  showReportDetailLoading() {
    document.getElementById('report-detail-loading-container').innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideReportDetailLoading() {
    document.getElementById('report-detail-loading-container').innerHTML = '';
  }

  showMapLoading() {
    document.getElementById('map-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById('map-loading-container').innerHTML = '';
  }

}
