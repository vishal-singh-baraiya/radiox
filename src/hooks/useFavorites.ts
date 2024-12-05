import { useState, useCallback, useEffect } from 'react';
import { RadioStation, FavoriteStation } from '../types/station';

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteStation[]>(() => {
    const saved = localStorage.getItem('favoriteStations');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('favoriteStations', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = useCallback((station: RadioStation) => {
    setFavorites(prev => {
      if (prev.some(f => f.changeuuid === station.changeuuid)) return prev;
      return [...prev, { ...station, addedAt: Date.now() }];
    });
  }, []);

  const removeFavorite = useCallback((stationId: string) => {
    setFavorites(prev => prev.filter(f => f.changeuuid !== stationId));
  }, []);

  const isFavorite = useCallback((stationId: string) => {
    return favorites.some(f => f.changeuuid === stationId);
  }, [favorites]);

  return { favorites, addFavorite, removeFavorite, isFavorite };
}