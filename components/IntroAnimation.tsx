import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2800); // Shorter, cleaner intro

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#F7F5F0] dark:bg-[#1C1917] overflow-hidden"
      exit={{ opacity: 0, transition: { duration: 1.2, ease: "easeInOut" } }}
    >
      {/* Clean The Text Reveal */}
      <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="relative z-20 flex flex-col items-center"
        >
          <h1 className="text-6xl md:text-8xl font-serif font-medium tracking-tight text-[#1C1917] dark:text-[#F7F5F0]">
            WiSearch
          </h1>
          <motion.div 
            className="h-[1px] bg-[#9A3412] dark:bg-[#D6D3D1] mt-6"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "80%", opacity: 0.5 }}
            transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default IntroAnimation;
