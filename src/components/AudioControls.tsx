import { Volume2, VolumeX } from 'lucide-react';
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface AudioControlsProps {
  audio: HTMLAudioElement | null;
}

export function AudioControls({ audio }: AudioControlsProps) {
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audio) {
      audio.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  }, [audio]);

  const toggleMute = useCallback(() => {
    if (audio) {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      audio.volume = newMuted ? 0 : volume;
    }
  }, [audio, isMuted, volume]);

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={toggleMute}
        className="text-gray-400 hover:text-white transition-colors"
      >
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>
      <motion.input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={isMuted ? 0 : volume}
        onChange={handleVolumeChange}
        className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        whileFocus={{ scale: 1.02 }}
      />
    </div>
  );
}