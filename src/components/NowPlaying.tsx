import { motion } from 'framer-motion';
import { RadioStation } from '../types/station';
import { Wave } from './Wave';

interface NowPlayingProps {
  station: RadioStation | null;
}

export function NowPlaying({ station }: NowPlayingProps) {
  if (!station) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-lg border-t border-gray-700 p-4"
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center overflow-hidden">
            {station.favicon ? (
              <img
                src={station.favicon}
                alt={station.name}
                className="w-10 h-10"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40';
                }}
              />
            ) : (
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg" />
            )}
          </div>
          <div>
            <h3 className="font-medium text-white">{station.name}</h3>
            <p className="text-sm text-gray-400">Now Playing</p>
          </div>
        </div>
        <Wave />
      </div>
    </motion.div>
  );
}