import { Search } from 'lucide-react';
import { useCallback } from 'react';
import { motion } from 'framer-motion';
import debounce from '../utils/debounce';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const debouncedChange = useCallback(
    debounce((value: string) => onChange(value), 150),
    [onChange]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <motion.input
        whileFocus={{ scale: 1.02 }}
        type="text"
        className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
        placeholder="Search stations by name, language, or tags..."
        value={value}
        onChange={(e) => debouncedChange(e.target.value)}
      />
    </motion.div>
  );
}