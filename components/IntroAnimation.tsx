import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 100);   // Drop falls
    const timer2 = setTimeout(() => setStage(2), 700);   // Splash explodes
    const timer3 = setTimeout(() => setStage(3), 1400);  // Text reveals
    const timer4 = setTimeout(() => {
      onComplete();
    }, 5000); // End

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  // Splash particles configuration
  const particles = Array.from({ length: 16 }).map((_, i) => {
    const angle = (i / 16) * 360;
    const radius = Math.random() * 120 + 60;
    return {
      x: Math.cos(angle * (Math.PI / 180)) * radius,
      y: Math.sin(angle * (Math.PI / 180)) * radius,
      color: i % 3 === 0 ? '#f97316' : i % 3 === 1 ? '#a855f7' : '#14b8a6', // Orange, Purple, Teal
      scale: Math.random() * 0.6 + 0.4,
      delay: Math.random() * 0.1,
    };
  });

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden"
      exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
    >
      {/* SVG Filter for Gooey Effect */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
          </filter>
        </defs>
      </svg>

      {/* Liquid Animation Layer (Gooey Filter Applied) */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ filter: 'url(#goo)' }}>
        
        {/* Phase 1: The Drop */}
        <AnimatePresence>
          {stage === 1 && (
            <motion.div
              className="absolute w-10 h-10 rounded-full bg-orange-500"
              initial={{ y: -400, scale: 0.8 }}
              animate={{ y: 0, scale: 1.2 }}
              exit={{ scale: 0, opacity: 0, transition: { duration: 0.05 } }}
              transition={{ duration: 0.6, ease: "easeIn" }}
            />
          )}
        </AnimatePresence>

        {/* Phase 2: The Splash */}
        <AnimatePresence>
          {stage === 2 && (
            <div className="absolute inset-0 flex items-center justify-center">
              {particles.map((p, i) => (
                <motion.div
                  key={i}
                  className="absolute w-16 h-16 rounded-full"
                  style={{ backgroundColor: p.color }}
                  initial={{ x: 0, y: 0, scale: 0 }}
                  animate={{ 
                    x: p.x, 
                    y: p.y, 
                    scale: [0, p.scale, 0],
                  }}
                  transition={{ 
                    duration: 1.2, 
                    ease: [0.22, 1, 0.36, 1], // Custom easeOutQuint
                    delay: p.delay
                  }}
                />
              ))}
              {/* Central impact blob */}
              <motion.div 
                className="absolute w-24 h-24 bg-gradient-to-br from-orange-500 to-purple-600 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: [1, 2, 0] }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Phase 3: The Text Reveal (Crisp, No Filter) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {stage >= 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, type: "spring", bounce: 0.3 }}
            className="relative z-20 flex flex-col items-center"
          >
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-purple-500 to-teal-500 drop-shadow-[0_0_30px_rgba(249,115,22,0.4)]">
              WiSearch
            </h1>
            
            {/* Liquid reflection effect on text */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
              animate={{ x: ['-150%', '150%'] }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear", delay: 1 }}
              style={{ mixBlendMode: 'overlay' }}
            />
          </motion.div>
        )}
      </div>

    </motion.div>
  );
};

export default IntroAnimation;
