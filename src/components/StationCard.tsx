import { Play, Pause, Loader2, Heart, Music2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { RadioStation } from '../types/station';

import { StationDetails } from './StationDetails';

interface StationCardProps {
  station: RadioStation;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  isCurrentlyPlaying: boolean;
  onPlay: (station: RadioStation) => void;
  onStop: () => void;
}

export function StationCard({
  station,
  index,
  isFavorite,
  onToggleFavorite,
  isCurrentlyPlaying,
  onPlay,
  onStop,
}: StationCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!isCurrentlyPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isCurrentlyPlaying]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isCurrentlyPlaying) {
        onStop();
      } else {
        setIsLoading(true);
        setError(null);
        
        audioRef.current.load();
        await audioRef.current.play();
        onPlay(station);
        toast.success(`Now playing: ${station.name}`, {
          icon: '🎵',
          position: 'top-right',
        });
      }
    } catch (err) {
      setError('Failed to play station');
      toast.error('Failed to play station', {
        position: 'top-right',
      });
      console.error('Playback error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className={`relative bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-all shadow-lg hover:shadow-xl ${
        isCurrentlyPlaying ? 'ring-2 ring-purple-500' : ''
      }`}
    >
      {isCurrentlyPlaying && (
        <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
          Playing
        </div>
      )}
      
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <motion.div 
          className="flex-shrink-0"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
            {station.favicon ? (
              <img
                src={station.favicon}
                alt={station.name}
                className="w-12 h-12 rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48';
                }}
              />
            ) : (
              <Music2 className="w-8 h-8 text-gray-400" />
            )}
          </div>
        </motion.div>

        {/* Station Info */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center space-x-2">
            <h3 className="text-lg font-semibold text-white truncate">{station.name}</h3>
          </div>
          <p className="text-sm text-gray-400">
            {station.language || 'Unknown'} • {station.tags || 'No tags'}
          </p>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm mt-1"
            >
              {error}
            </motion.p>
          )}
        </div>

        {/* Play and Like Buttons */}
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={togglePlay}
            disabled={isLoading}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : isCurrentlyPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              onToggleFavorite();
              toast.success(
                isFavorite ? 'Removed from favorites' : 'Added to favorites',
                { position: 'top-right' }
              );
            }}
            className={`text-${isFavorite ? 'red' : 'gray'}-400 hover:text-red-400 transition-colors`}
          >
            <Heart className={isFavorite ? 'fill-current' : ''} size={18} />
          </motion.button>
        </div>
      </div>
      
      <motion.button
        onClick={() => setShowDetails(!showDetails)}
        className="mt-4 text-sm text-gray-400 hover:text-white transition-colors"
      >
        {showDetails ? 'Hide Details' : 'Show Details'}
      </motion.button>

      <AnimatePresence>
        {showDetails && <StationDetails station={station} />}
      </AnimatePresence>

      <audio
        ref={audioRef}
        src={station.url_resolved}
        preload="none"
        onError={() => {
          onStop();
          setError('Failed to play station');
        }}
      />
    </motion.div>
  );
}
