export default class NewPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async showNewFormMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error('showNewFormMap: error:', error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

async postNewReport({ description, photo, lat, lon, placeName }) {
  this.#view.showSubmitLoadingButton();
  try {
    const data = {
      description,
      photo,
      lat,
      lon,
      placeName
    };

    const response = await this.#model.storeNewReport(data);

    if (!response.ok) {
      console.error('postNewReport: response not ok:', response);
      this.#view.storeFailed(response.message || 'Gagal menyimpan laporan');
      return;
    }

    // ✅ Trigger notifikasi custom setelah sukses post
    if (Notification.permission === 'granted') {
      const registration = await navigator.serviceWorker.ready;
      registration.showNotification('Story berhasil dibuat', {
        body: `Deskripsi: ${description}`,
        tag: 'new-story'
      });
    }

    this.#view.storeSuccessfully(response.message, {});
  } catch (error) {
    console.error('postNewReport: error:', error);
    this.#view.storeFailed(error.message);
  } finally {
    this.#view.hideSubmitLoadingButton();
  }
}

}
