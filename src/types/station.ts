export interface RadioStation {
  changeuuid: string;
  name: string;
  url: string;
  url_resolved: string;
  homepage: string;
  favicon: string;
  tags: string;
  country: string;
  language: string;
  votes: number;
  codec: string;
  bitrate: number;
  clickcount: number;
}

export interface FavoriteStation extends RadioStation {
  addedAt: number;
}