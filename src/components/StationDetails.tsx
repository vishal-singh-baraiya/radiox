import { Globe, Radio, Wifi } from 'lucide-react';
import { motion } from 'framer-motion';
import { RadioStation } from '../types/station';

interface StationDetailsProps {
  station: RadioStation;
}

export function StationDetails({ station }: StationDetailsProps) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="mt-4 pt-4 border-t border-gray-700"
    >
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center space-x-2 text-gray-400">
          <Radio size={16} />
          <span>Bitrate: {station.bitrate}kbps</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-400">
          <Wifi size={16} />
          <span>Codec: {station.codec}</span>
        </div>
        {station.homepage && (
          <a
            href={station.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <Globe size={16} />
            <span>Visit Website</span>
          </a>
        )}
      </div>
    </motion.div>
  );
}