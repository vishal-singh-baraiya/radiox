import { motion } from 'framer-motion';

export function Wave() {
  return (
    <div className="flex items-center space-x-1">
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-purple-500"
          animate={{
            height: ['15px', '25px', '15px'],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
}