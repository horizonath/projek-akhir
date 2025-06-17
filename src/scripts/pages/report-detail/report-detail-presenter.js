import { reportMapper } from '../../data/api-mapper';

export default class ReportDetailPresenter {
  #storyId;
  #view;
  #apiModel;
  #dbModel;

  constructor(storyId, { view, apiModel, dbModel }) {
    this.#storyId = storyId;
    this.#view = view;
    this.#apiModel = apiModel;
    this.#dbModel = dbModel;
  }

  async showReportDetailMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error('showReportDetailMap: error:', error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

async showReportDetail() {
  this.#view.showReportDetailLoading();
  try {
    let story;

    // Coba ambil dari API
    const response = await this.#apiModel.getStoryById(this.#storyId);
    if (response.ok && response.story) {
      story = response.story;
    } else {
      throw new Error('API tidak mengembalikan story');
    }

    this.#view.populateReportDetailAndInitialMap(response.message, story);
  } catch (apiError) {
    console.warn('[Fallback] Gagal ambil dari API:', apiError.message);

    try {
      // Coba ambil dari IndexedDB sebagai cadangan
      const localStory = await this.#dbModel.getStoryById(this.#storyId);

      if (!localStory) throw new Error('Story tidak tersedia di penyimpanan lokal');

      this.#view.populateReportDetailAndInitialMap('Data dari penyimpanan lokal', localStory);
    } catch (localError) {
      console.error('showReportDetail: error:', localError);
      this.#view.populateReportDetailError('Story tidak tersedia.');
    }
  } finally {
    this.#view.hideReportDetailLoading();
  }
}


async saveReport() {
  try {
    const response = await this.#apiModel.getStoryById(this.#storyId);

    if (!response || !response.story || !response.story.id) {
      throw new Error('Data laporan tidak valid.');
    }

    // Ubah di sini: mapping report agar mengandung location
    const mappedReport = await reportMapper(response.story);

    await this.#dbModel.putStory(mappedReport);
    this.#view.saveToBookmarkSuccessfully('Success to save to bookmark');
  } catch (error) {
    console.error('saveReport: error:', error);
    this.#view.saveToBookmarkFailed(error.message);
  }
}



 
  async removeReport() {
    try {
      await this.#dbModel.removeReport(this.#storyId);
      this.#view.removeFromBookmarkSuccessfully('Success to remove from bookmark');
    } catch (error) {
      console.error('removeReport: error:', error);
      this.#view.removeFromBookmarkFailed(error.message);
    }
  }
 
  async showSaveButton() {
    if (await this.#isReportSaved()) {
      this.#view.renderRemoveButton();
      return;
    }
    this.#view.renderSaveButton();
  }
  async #isReportSaved() {
    return !!(await this.#dbModel.getStoryById(this.#storyId));
  }
}
