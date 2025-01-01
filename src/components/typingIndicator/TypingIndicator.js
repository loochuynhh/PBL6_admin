import React from 'react';
import { motion } from 'framer-motion';

const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
        <span className="text-indigo-600 text-xs font-semibold">Bot</span>
      </div>
      <motion.div className="bg-white p-3 rounded-lg shadow flex items-center space-x-2">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-2 h-2 bg-indigo-400 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: index * 0.2,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default TypingIndicator;

