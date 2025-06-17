import { openDB } from 'idb';


const DATABASE_NAME = 'cerita-db';
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = 'saved-stories';
 
const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade: (database) => {
    database.createObjectStore(OBJECT_STORE_NAME, {
      keyPath: 'id',
    });
  },
});

const Database = {
  async putStory(story) {
    if (!Object.hasOwn(story, 'id')) {
      throw new Error('`id` is required to save.');
    }

    // Ambil lat/lon/placeName dari story.location
    const flattenedStory = {
      ...story,
      lat: story.location?.latitude ?? null,
      lon: story.location?.longitude ?? null,
      placeName: story.location?.placeName ?? '-',
    };

    return (await dbPromise).put(OBJECT_STORE_NAME, flattenedStory);
  },

  async getStoryById(id) {
    if (!id) {
      throw new Error('`id` is required.');
    }
    return (await dbPromise).get(OBJECT_STORE_NAME, id);
  },

  async getAllStory() {
    return (await dbPromise).getAll(OBJECT_STORE_NAME);
  },

  async removeReport(id) {
    return (await dbPromise).delete(OBJECT_STORE_NAME, id);
  },
};
export default Database;