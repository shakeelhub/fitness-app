import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function IntroOverlay() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden"
        >
          {/* Background image requested in requirements */}
          <div 
            className="absolute inset-0 opacity-40 bg-cover bg-center"
            style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/intro-bg.png)` }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative z-10 text-center"
          >
            <h1 className="text-5xl md:text-7xl font-display font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 tracking-tighter mb-4">
              FORGE YOUR <span className="text-primary neon-text">LIMITS</span>
            </h1>
            <div className="h-[2px] w-0 bg-primary mx-auto animate-[expandWidth_1s_ease-out_ forwards_0.8s]" />
            <p className="mt-6 text-primary/80 font-sans tracking-widest uppercase text-sm md:text-base animate-pulse">
              System Initializing...
            </p>
          </motion.div>
          
          <style>{`
            @keyframes expandWidth {
              to { width: 150px; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
