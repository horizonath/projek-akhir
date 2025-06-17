import Map from '../utils/map';

export async function reportMapper(story) {
  return {
    id: story.id,
    name: story.name,
    description: story.description,
    photoUrl: story.photoUrl,
    createdAt: story.createdAt,
    location: story.lat && story.lon ? {
      latitude: story.lat,
      longitude: story.lon,
      placeName: await Map.getPlaceNameByCoordinate(story.lat, story.lon)
    } : null
  };
}
