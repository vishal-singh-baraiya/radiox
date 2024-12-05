import { Radio, Heart, Music2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { StationCard } from './components/StationCard';
import { SearchBar } from './components/SearchBar';
import { NowPlaying } from './components/NowPlaying';
import { useRadioStations } from './hooks/useRadioStations';
import { useFavorites } from './hooks/useFavorites';
import { RadioStation } from './types/station';

function App() {
  const {
    stations,
    isLoading,
    error,
    hasMore,
    searchQuery,
    handleSearch,
    loadMore,
  } = useRadioStations();

  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [showFavorites, setShowFavorites] = useState(false);
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);

  const displayedStations = showFavorites ? favorites : stations;

  const handlePlay = (station: RadioStation) => {
    setCurrentStation(station);
  };

  const handleStop = () => {
    setCurrentStation(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-24">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center mb-8 text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mb-4"
          >
            <Radio className="w-12 h-12 text-purple-500" />
          </motion.div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-2">
            RadioX
          </h1>
          <p className="text-gray-400 max-w-md">
            Listen to your favorite Indian radio stations from anywhere in the world
          </p>
        </motion.div>

        {/* Controls */}
        <div className="max-w-2xl mx-auto mb-8 space-y-4">
          <SearchBar value={searchQuery} onChange={handleSearch} />
          
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFavorites(!showFavorites)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                showFavorites 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {showFavorites ? <Music2 size={20} /> : <Heart size={20} />}
              <span>{showFavorites ? 'Show All Stations' : 'Show Favorites'}</span>
            </motion.button>
          </div>
        </div>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-red-500 text-center mb-8 bg-red-500/10 p-4 rounded-lg"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center h-64"
          >
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-500/20 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-t-purple-500 animate-spin rounded-full absolute top-0"></div>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Stations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {displayedStations.map((station, index) => (
                <StationCard 
                  key={station.changeuuid} 
                  station={station}
                  index={index}
                  isFavorite={isFavorite(station.changeuuid)}
                  onToggleFavorite={() => 
                    isFavorite(station.changeuuid)
                      ? removeFavorite(station.changeuuid)
                      : addFavorite(station)
                  }
                  isCurrentlyPlaying={currentStation?.changeuuid === station.changeuuid}
                  onPlay={handlePlay}
                  onStop={handleStop}
                />
              ))}
            </div>

            {/* Load More */}
            {!showFavorites && hasMore && (
              <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={loadMore}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-lg hover:shadow-purple-500/20"
              >
                Load More Stations
              </motion.button>
              <h1 className="mt-7 text-xl">Made with ❤️ by 𝗧𝗵𝗲𝗩𝗶χ𝗵𝗮𝗹 𓅇</h1>
            </motion.div>
            
              
            )}

            {/* No Results */}
            <AnimatePresence>
              {displayedStations.length === 0 && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-gray-400 p-8"
                >
                  {showFavorites 
                    ? 'No favorite stations yet. Add some stations to your favorites!'
                    : 'No stations found matching your search.'}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* Now Playing Bar */}
      <AnimatePresence>
        {currentStation && <NowPlaying station={currentStation} />}
      </AnimatePresence>

      {/* Toast Notifications */}
      <Toaster />
      
    </div>
    
  );
}

export default App;