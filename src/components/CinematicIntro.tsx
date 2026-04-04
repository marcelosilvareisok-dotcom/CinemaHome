import { motion } from 'motion/react';

export default function CinematicIntro() {
  return (
    <motion.div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      {/* Background ambient glow */}
      <motion.div 
        className="absolute inset-0 bg-red-900/20 blur-[150px]"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1.5 }}
        transition={{ duration: 3, ease: "easeOut" }}
      />

      {/* Main Text */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, filter: 'blur(20px)' }}
        animate={{ scale: 1.1, opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 2.5, ease: [0.2, 0.0, 0.2, 1] }}
        className="relative z-10 flex flex-col items-center"
      >
        <h1 
          className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-800"
          style={{ WebkitTextStroke: '1px rgba(255,0,0,0.3)' }}
        >
          Cinema em Casa 📽️
        </h1>
        
        {/* Intense red glow behind text */}
        <motion.div 
          className="absolute inset-0 bg-red-600 blur-[80px] -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 2, delay: 0.5 }}
        />
      </motion.div>

      {/* Cinematic letterbox bars (top and bottom) that open up */}
      <motion.div 
        className="absolute top-0 left-0 right-0 bg-black z-20"
        initial={{ height: '50vh' }}
        animate={{ height: '0vh' }}
        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
      />
      <motion.div 
        className="absolute bottom-0 left-0 right-0 bg-black z-20"
        initial={{ height: '50vh' }}
        animate={{ height: '0vh' }}
        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
      />
    </motion.div>
  );
}
