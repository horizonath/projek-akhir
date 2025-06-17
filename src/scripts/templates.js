import { showFormattedDate } from './utils';

export function generateLoaderTemplate() {
  return `
    <div class="loader"></div>
  `;
}

export function generateLoaderAbsoluteTemplate() {
  return `
    <div class="loader loader-absolute"></div>
  `;
}

export function generateMainNavigationListTemplate() {
  return `
    <li><a id="report-list-button" class="report-list-button" href="#/">Daftar Cerita</a></li>
    <li><a id="bookmark-button" class="bookmark-button" href="#/bookmark">Cerita Tersimpan</a></li>
  `;
}

export function generateUnauthenticatedNavigationListTemplate() {
  return `
    <li id="push-notification-tools" class="push-notification-tools"></li>
    <li><a id="login-button" href="#/login">Login</a></li>
    <li><a id="register-button" href="#/register">Register</a></li>
  `;
}

export function generateAuthenticatedNavigationListTemplate() {
  return `
    <li id="push-notification-tools" class="push-notification-tools"></li>
    <li><a id="new-report-button" class="btn new-report-button" href="#/new">Buat Cerita <i class="fas fa-plus"></i></a></li>
    <li><a id="logout-button" class="logout-button" href="#/logout"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
  `;
}

export function generateReportsListEmptyTemplate() {
  return `
    <div id="reports-list-empty" class="reports-list__empty">
      <h2>Tidak ada cerita yang tersedia</h2>
      <p>Saat ini, tidak ada cerita yang kamu simpan.</p>
    </div>
  `;
}

export function generateReportsListErrorTemplate(message) {
  return `
    <div id="reports-list-error" class="reports-list__error">
      <h2>Terjadi kesalahan pengambilan daftar cerita</h2>
      <p>${message ? message : 'Gunakan jaringan lain atau laporkan error ini.'}</p>
    </div>
  `;
}

export function generateReportDetailErrorTemplate(message) {
  return `
    <div id="reports-detail-error" class="reports-detail__error">
      <h2>Terjadi kesalahan pengambilan detail cerita</h2>
      <p>${message ? message : 'Gunakan jaringan lain atau laporkan error ini.'}</p>
    </div>
  `;
}

export function generateCommentsListEmptyTemplate() {
  return `
    <div id="report-detail-comments-list-empty" class="report-detail__comments-list__empty">
      <h2>Tidak ada komentar yang tersedia</h2>
      <p>Saat ini, tidak ada komentar yang dapat ditampilkan.</p>
    </div>
  `;
}

export function generateCommentsListErrorTemplate(message) {
  return `
    <div id="report-detail-comments-list-error" class="report-detail__comments-list__error">
      <h2>Terjadi kesalahan pengambilan daftar komentar</h2>
      <p>${message ? message : 'Gunakan jaringan lain atau laporkan error ini.'}</p>
    </div>
  `;
}

export function generateReportItemTemplate({
  id,
  name,
  description,
  photoUrl,
  createdAt,
  lat,
  lon,
}) {
  const formattedDate = showFormattedDate(createdAt, 'id-ID');
  const locationInfo = lat && lon ? `Lat: ${lat}, Lon: ${lon}` : "Tidak ada lokasi";

  return `
    <div tabindex="0" class="report-item" data-reportid="${id}">
      <img class="report-item__image" src="${photoUrl}" alt="${description}">
      
      <div class="report-item__body">
        <div class="report-item__main">
          <h2 class="report-item__title">${description}</h2>
          <div class="report-item__more-info">
            <div class="report-item__createdat">
              <i class="fas fa-calendar-alt"></i> ${formattedDate}
            </div>
            <div class="report-item__location">
              <i class="fas fa-map-marker-alt"></i> ${locationInfo}
            </div>
          </div>
        </div>

        <div class="report-item__more-info">
          <div class="report-item__author">
            <i class="fas fa-user"></i> Dilaporkan oleh: ${name}
          </div>
        </div>

        <a class="btn report-item__read-more" href="#/stories/${id}">
          Selengkapnya <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    </div>
  `;
}



export function generateDamageLevelMinorTemplate() {
  return `
    <span class="report-detail__damage-level__minor" data-damage-level="minor">Kerusakan Rendah</span>
  `;
}

export function generateDamageLevelModerateTemplate() {
  return `
    <span class="report-detail__damage-level__moderate" data-damage-level="moderate">Kerusakan Sedang</span>
  `;
}

export function generateDamageLevelSevereTemplate() {
  return `
    <span class="report-detail__damage-level__severe" data-damage-level="severe">Kerusakan Berat</span>
  `;
}

export function generateDamageLevelBadge(damageLevel) {
  if (damageLevel === 'minor') {
    return generateDamageLevelMinorTemplate();
  }

  if (damageLevel === 'moderate') {
    return generateDamageLevelModerateTemplate();
  }

  if (damageLevel === 'severe') {
    return generateDamageLevelSevereTemplate();
  }

  return '';
}

export function generateReportDetailImageTemplate(imageUrl = null, alt = '') {
  if (!imageUrl) {
    return `
      <img class="report-detail__image" src="images/placeholder-image.jpg" alt="Placeholder Image">
    `;
  }

  return `
    <img class="report-detail__image" src="${imageUrl}" alt="${alt}">
  `;
}

export function generateReportCommentItemTemplate({ photoUrlCommenter, nameCommenter, body }) {
  return `
    <article tabindex="0" class="report-detail__comment-item">
      <img
        class="report-detail__comment-item__photo"
        src="${photoUrlCommenter}"
        alt="Commenter name: ${nameCommenter}"
      >
      <div class="report-detail__comment-item__body">
        <div class="report-detail__comment-item__body__more-info">
          <div class="report-detail__comment-item__body__author">${nameCommenter}</div>
        </div>
        <div class="report-detail__comment-item__body__text">${body}</div>
      </div>
    </article>
  `;
}

export function generateReportDetailTemplate({
  name,
  description,
  photoUrl,
  lat,
  lon,
  createdAt,
  placeName,
}) {
  const createdAtFormatted = showFormattedDate(createdAt, 'id-ID');

  return `
    <div class="report-detail__header">
      <h1 id="title" class="report-detail__title">${name}</h1>

      <div class="report-detail__more-info">
        <div class="report-detail__more-info__inline">
          <div id="createdat" class="report-detail__createdat"><i class="fas fa-calendar-alt"></i> ${createdAtFormatted}</div>
          <div id="location-place-name" class="report-detail__location__place-name" data-value="${placeName}"><i class="fas fa-map"></i> ${placeName}</div>
        </div>
        <div class="report-detail__more-info__inline">
          <div id="location-latitude" class="report-detail__location__latitude">
            Lat: ${lat}
          </div>
          <div id="location-longitude" class="report-detail__location__longitude">
            Longitude: ${lon}
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="report-detail__images__container">
        <div id="images" class="report-detail__images">
          <img src="${photoUrl}" alt="${name}" class="report-detail__image" />
        </div>
      </div>
    </div>

    <div class="container">
      <div class="report-detail__body">
        <div class="report-detail__body__description__container">
          <h2 class="report-detail__description__title">Informasi Lengkap</h2>
          <div id="description" class="report-detail__description__body">
            ${description}
          </div>
        </div>

        <div class="report-detail__body__map__container">
          <h2 class="report-detail__map__title">Peta Lokasi</h2>
          <div class="report-detail__map__container">
            <div id="map" class="report-detail__map"></div>
            <div id="map-loading-container"></div>
          </div>
        </div>

        <hr>
        <div class="report-detail__body__actions__container">
          <h2>Aksi</h2>
          <div class="report-detail__actions__buttons">
            <div id="save-actions-container"></div>
          </div>
        </div>
      </div>
    </div>
  `;
}



export function generateSubscribeButtonTemplate() {
  return `
    <button id="subscribe-button" class="btn subscribe-button">
      Notified <i class="fas fa-bell"></i>
    </button>
  `;
}

export function generateUnsubscribeButtonTemplate() {
  return `
    <button id="unsubscribe-button" class="btn unsubscribe-button">
      Not Notified <i class="fas fa-bell-slash"></i>
    </button>
  `;
}

export function generateSaveReportButtonTemplate() {
  return `
    <button id="report-detail-save" class="btn btn-transparent">
      Simpan cerita <i class="far fa-bookmark"></i>
    </button>
  `;
}

export function generateRemoveReportButtonTemplate() {
  return `
    <button id="report-detail-remove" class="btn btn-transparent">
      Buang cerita <i class="fas fa-bookmark"></i>
    </button>
  `;
}
