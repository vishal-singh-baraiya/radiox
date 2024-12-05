import { useState, useEffect, useCallback, useRef } from 'react';
import { RadioStation } from '../types/station';

const STATIONS_PER_PAGE = 12;
const API_URL = 'https://at1.api.radio-browser.info/json/stations/bycountry/India';

export function useRadioStations() {
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [filteredStations, setFilteredStations] = useState<RadioStation[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchStations = useCallback(async () => {
    try {
      // Cancel any ongoing requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      setError(null);

      const response = await fetch(API_URL, {
        signal: abortControllerRef.current.signal,
        headers: {
          'User-Agent': 'IndianRadioStations/1.0',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch stations');

      const data: RadioStation[] = await response.json();
      
      // Sort stations by votes and click count to show popular stations first
      const sortedData = data.sort((a, b) => 
        (b.votes + b.clickcount) - (a.votes + a.clickcount)
      );

      setStations(sortedData);
      setFilteredStations(sortedData);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Ignore abort errors
        return;
      }
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    const filtered = stations.filter((station) =>
      [station.name, station.tags, station.language]
        .join(' ')
        .toLowerCase()
        .includes(query.toLowerCase())
    );
    setFilteredStations(filtered);
    setCurrentPage(1);
  }, [stations]);

  const loadMore = useCallback(() => {
    setCurrentPage((prev) => prev + 1);
  }, []);

  const paginatedStations = filteredStations.slice(0, currentPage * STATIONS_PER_PAGE);
  const hasMore = paginatedStations.length < filteredStations.length;

  useEffect(() => {
    fetchStations();

    return () => {
      // Cleanup: abort any ongoing requests when component unmounts
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchStations]);

  return {
    stations: paginatedStations,
    isLoading,
    error,
    hasMore,
    searchQuery,
    handleSearch,
    loadMore,
  };
}