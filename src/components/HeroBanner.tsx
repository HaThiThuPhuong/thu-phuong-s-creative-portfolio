import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import { ScopedParticles } from './ScopedParticles';
import { fetchProfile, fetchAssets } from '../services/api';
import { BrandLogo } from './BrandLogo';

import { ChevronLeft, ChevronRight } from 'lucide-react';

export const HeroBanner = () => {
  const { isModelMode, isParticlesEnabled, toggleParticles } = useTheme();
  const [index, setIndex] = useState(0);
  const [profile, setProfile] = useState<any>(null);
  const [banners, setBanners] = useState<{ model: string[], ba: string[] }>({ model: [], ba: [] });

  useEffect(() => {
    fetchProfile().then(setProfile).catch(console.error);
    
    // Fetch banner images from SQL
    Promise.all([
      fetchAssets('model_banner'),
      fetchAssets('ba_banner')
    ]).then(([modelBanners, baBanners]) => {
      setBanners({
        model: modelBanners.map((b: any) => b.url),
        ba: baBanners.map((b: any) => b.url)
      });
    }).catch(console.error);
  }, []);

  const currentBanners = isModelMode ? banners.model : banners.ba;

  const nextSlide = () => {
    if (currentBanners.length > 0) {
      setIndex((prev) => (prev + 1) % currentBanners.length);
    }
  };
  
  const prevSlide = () => {
    if (currentBanners.length > 0) {
      setIndex((prev) => (prev - 1 + currentBanners.length) % currentBanners.length);
    }
  };

  useEffect(() => {
    // Reset index when switching modes to prevent out of bounds
    setIndex(0);
  }, [isModelMode]);

  useEffect(() => {
    if (currentBanners.length > 1) {
      const timer = setInterval(nextSlide, 6000);
      return () => clearInterval(timer);
    }
  }, [isModelMode, currentBanners]);

  return (
    <section className="relative w-full h-[85vh] md:h-[90vh] overflow-hidden bg-black group/banner">
      {/* Level 1: Background Slider / Static (z-index: 1) */}
      <div className="absolute inset-0 z-10 w-full h-full overflow-hidden">
        <AnimatePresence mode="wait">
          {currentBanners.length > 0 ? (
            <motion.div
              key={`${isModelMode ? 'model' : 'ba'}-${index}`}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <img 
                src={currentBanners[index]} 
                className={`w-full h-full object-cover animate-ken-burns ${!isModelMode ? 'opacity-60 grayscale-[30%]' : ''}`} 
                alt={`${isModelMode ? 'Model' : 'BA'} Slide`}
                referrerPolicy="no-referrer"
              />
              {!isModelMode && <div className="absolute inset-0 bg-gradient-to-br from-[#F0FFF0]/40 to-transparent" />}
            </motion.div>
          ) : (
            <div key="empty-banner" className="absolute inset-0 bg-gradient-to-br from-black to-zinc-900 flex items-center justify-center">
               <p className="text-white/10 text-[10px] uppercase tracking-[0.5em] font-bold">
                 Waiting for {isModelMode ? 'Model' : 'BA'} Banner SQL Data
               </p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Manual Controls */}
      {currentBanners.length > 1 && (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-50 flex justify-between px-6 pointer-events-none opacity-0 group-hover/banner:opacity-100 transition-opacity duration-500">
           <button 
            onClick={prevSlide}
            className="w-12 h-12 rounded-full glass border border-white/20 flex items-center justify-center text-white pointer-events-auto hover:bg-[var(--accent)] hover:border-[var(--accent)] transition-all active:scale-95"
           >
             <ChevronLeft size={24} />
           </button>
           <button 
            onClick={nextSlide}
            className="w-12 h-12 rounded-full glass border border-white/20 flex items-center justify-center text-white pointer-events-auto hover:bg-[var(--accent)] hover:border-[var(--accent)] transition-all active:scale-95"
           >
             <ChevronRight size={24} />
           </button>
        </div>
      )}

      {/* Slide Indicators */}
      {currentBanners.length > 1 && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50 flex gap-3">
          {currentBanners.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1 transition-all duration-500 rounded-full ${i === index ? 'w-8 bg-[var(--accent)]' : 'w-2 bg-white/30 hover:bg-white/50'}`}
            />
          ))}
        </div>
      )}

      {/* Level 2: Cherry Blossom Frame (z-index: 2) */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
        <AnimatePresence>
          {isModelMode && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              {/* Top Left Artistic Branch */}
              <motion.div 
                animate={{ 
                  rotate: [-1, 1.5, -1],
                  y: [0, 10, 0]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -left-10 w-[400px] md:w-[700px] origin-top-left"
              >
                <svg viewBox="0 0 500 500" className="w-full h-full drop-shadow-2xl">
                  {/* Branch Structure */}
                  <path d="M0,0 C50,20 150,10 250,80 C300,120 350,100 450,150" fill="none" stroke="#4A3728" strokeWidth="6" strokeLinecap="round" opacity="0.9" />
                  <path d="M150,45 C180,120 120,200 80,300" fill="none" stroke="#4A3728" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
                  <path d="M280,95 C320,150 400,160 420,250" fill="none" stroke="#4A3728" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
                  
                  {/* Petal Clusters - Extreme density and variety */}
                  {[
                    { x: 250, y: 80, s: 1.2, c1: "#FFC0CB", c2: "#FFB6C1" },
                    { x: 450, y: 150, s: 1.5, c1: "#FFB6C1", c2: "#FFB7C5" },
                    { x: 80, y: 300, s: 1.3, c1: "#FFF0F5", c2: "#FFC0CB" },
                    { x: 420, y: 250, s: 1.1, c1: "#FFE4E1", c2: "#FFB6C1" },
                    { x: 180, y: 140, s: 0.9, c1: "#FFC0CB", c2: "#FFB6C1" },
                    { x: 330, y: 110, s: 1, c1: "#FFF5F7", c2: "#FFC0CB" },
                    { x: 60, y: 30, s: 0.8, c1: "#FFB6C1", c2: "#FFC0CB" },
                    { x: 120, y: 40, s: 0.7, c1: "#FFE4E1", c2: "#FFB6C1" },
                    { x: 360, y: 160, s: 0.8, c1: "#FFB7C5", c2: "#FFC0CB" },
                    { x: 200, y: 250, s: 0.9, c1: "#FFF0F5", c2: "#FFB6C1" },
                    { x: 400, y: 100, s: 0.7, c1: "#FFC0CB", c2: "#FFF5F7" },
                    { x: 50, y: 150, s: 1, c1: "#FFB6C1", c2: "#FFE4E1" },
                    { x: 280, y: 50, s: 0.85, c1: "#FFDEF0", c2: "#FFC0CB" },
                    { x: 380, y: 130, s: 1.1, c1: "#FFB7C5", c2: "#FFB6C1" },
                    { x: 160, y: 240, s: 0.95, c1: "#FFF0F5", c2: "#FFDEF0" },
                    { x: 300, y: 70, s: 1.05, c1: "#FFC0CB", c2: "#FFB7C1" },
                    { x: 430, y: 180, s: 0.9, c1: "#FFE4E1", c2: "#FFB6C1" },
                    { x: 100, y: 50, s: 0.8, c1: "#FFB6C1", c2: "#FFC0CB" },
                    { x: 220, y: 100, s: 1.1, c1: "#FFF5F7", c2: "#FFC0CB" },
                    { x: 480, y: 120, s: 1.2, c1: "#FFB6C1", c2: "#FF99AA" },
                    { x: 140, y: 200, s: 1.0, c1: "#FFDEF0", c2: "#FFB6C1" },
                    { x: 310, y: 140, s: 0.9, c1: "#FFC0CB", c2: "#FFE4E1" },
                    { x: 410, y: 210, s: 1.1, c1: "#FFB7C5", c2: "#FFDEF0" },
                    { x: 70, y: 250, s: 0.75, c1: "#FFF0F5", c2: "#FFC0CB" },
                    { x: 350, y: 50, s: 0.8, c1: "#FFDEF0", c2: "#FFC0CB" },
                    { x: 20, y: 60, s: 0.9, c1: "#FFB6C1", c2: "#FFDEF0" }
                  ].map((p, i) => (
                    <g key={i} transform={`translate(${p.x}, ${p.y}) scale(${p.s}) rotate(${i * 45})`}>
                      <path d="M0,0 C5,-10 15,-10 20,0 C15,10 5,10 0,0" fill={p.c1} opacity="0.9" />
                      <path d="M0,0 C-5,-10 -15,-10 -20,0 C-15,10 -5,10 0,0" fill={p.c2} opacity="0.8" transform="rotate(72)" />
                      <path d="M0,0 C-5,-10 -15,-10 -20,0 C-15,10 -5,10 0,0" fill={p.c1} opacity="0.9" transform="rotate(144)" />
                      <path d="M0,0 C-5,-10 -15,-10 -20,0 C-15,10 -5,10 0,0" fill={p.c2} opacity="0.8" transform="rotate(216)" />
                      <path d="M0,0 C-5,-10 -15,-10 -20,0 C-15,10 -5,10 0,0" fill={p.c1} opacity="0.9" transform="rotate(288)" />
                      <circle r="3" fill="#FFE4E1" />
                    </g>
                  ))}
                  
                  {/* Small scattered petals */}
                  {[
                    { x: 300, y: 200 }, { x: 150, y: 250 }, { x: 400, y: 50 }, { x: 200, y: 350 },
                    { x: 450, y: 50 }, { x: 100, y: 100 }, { x: 350, y: 300 }, { x: 250, y: 150 },
                    { x: 180, y: 320 }, { x: 420, y: 100 }, { x: 50, y: 220 }
                  ].map((p, i) => (
                    <path key={`sp-${i}`} d={`M${p.x},${p.y} C${p.x+5},${p.y-5} ${p.x+10},${p.y-5} ${p.x+15},${p.y} C${p.x+10},${p.y+5} ${p.x+5},${p.y+5} ${p.x},${p.y}`} fill="#FFDBE9" opacity="0.6" transform={`rotate(${i*15}, ${p.x}, ${p.y})`} />
                  ))}
                </svg>
              </motion.div>

              {/* Bottom Right Artistic Branch */}
              <motion.div 
                animate={{ 
                  rotate: [179, 181.5, 179],
                  y: [0, -10, 0]
                }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-10 -right-10 w-[400px] md:w-[700px] origin-center rotate-180"
              >
                <svg viewBox="0 0 500 500" className="w-full h-full drop-shadow-2xl">
                  {/* Branch Structure */}
                  <path d="M0,0 C60,30 180,20 280,100 C330,140 400,120 480,180" fill="none" stroke="#3D2B1F" strokeWidth="7" strokeLinecap="round" opacity="0.9" />
                  <path d="M180,55 C220,150 150,250 100,350" fill="none" stroke="#3D2B1F" strokeWidth="5" strokeLinecap="round" opacity="0.9" />
                  
                  {/* Petal Clusters - Much higher density */}
                  {[
                    { x: 280, y: 100, s: 1.4, c1: "#FFB6C1", c2: "#FFC0CB" },
                    { x: 480, y: 180, s: 1.7, c1: "#FFB7C5", c2: "#FFB6C1" },
                    { x: 100, y: 350, s: 1.5, c1: "#FFF0F5", c2: "#FFC0CB" },
                    { x: 200, y: 160, s: 1, c1: "#FFC0CB", c2: "#FFE4E1" },
                    { x: 380, y: 130, s: 1.1, c1: "#FFB6C1", c2: "#FFF5F7" },
                    { x: 50, y: 40, s: 0.9, c1: "#FFE4E1", c2: "#FFB6C1" },
                    { x: 150, y: 80, s: 1.2, c1: "#FFB7C5", c2: "#FFC0CB" },
                    { x: 420, y: 220, s: 1.3, c1: "#FFB6C1", c2: "#FFB7C5" },
                    { x: 320, y: 180, s: 1.1, c1: "#FFDEF0", c2: "#FFB6C1" },
                    { x: 220, y: 60, s: 0.95, c1: "#FFC0CB", c2: "#FFDEF0" },
                    { x: 440, y: 300, s: 1.4, c1: "#FFB7C5", c2: "#FFC0CB" },
                    { x: 120, y: 120, s: 1.05, c1: "#FFB6C1", c2: "#FFB7C1" },
                    { x: 350, y: 100, s: 1.2, c1: "#FFF5F7", c2: "#FFC0CB" },
                    { x: 250, y: 150, s: 1.0, c1: "#FFDEF0", c2: "#FFB6C1" },
                    { x: 400, y: 250, s: 1.3, c1: "#FFB7C5", c2: "#FFDEF0" },
                    { x: 80, y: 200, s: 0.9, c1: "#FFC0CB", c2: "#FFB7C5" },
                    { x: 460, y: 80, s: 1.1, c1: "#FFB6C1", c2: "#FFDEF0" },
                  ].map((p, i) => (
                    <g key={i} transform={`translate(${p.x}, ${p.y}) scale(${p.s}) rotate(${i * 60})`}>
                      <path d="M0,0 C5,-10 15,-10 20,0 C15,10 5,10 0,0" fill={p.c1} opacity="0.9" />
                      <path d="M0,0 C-5,-10 -15,-10 -20,0 C-15,10 -5,10 0,0" fill={p.c2} opacity="0.8" transform="rotate(72)" />
                      <path d="M0,0 C-5,-10 -15,-10 -20,0 C-15,10 -5,10 0,0" fill={p.c1} opacity="0.9" transform="rotate(144)" />
                      <path d="M0,0 C-5,-10 -15,-10 -20,0 C-15,10 -5,10 0,0" fill={p.c2} opacity="0.8" transform="rotate(216)" />
                      <path d="M0,0 C-5,-10 -15,-10 -20,0 C-15,10 -5,10 0,0" fill={p.c1} opacity="0.9" transform="rotate(288)" />
                      <circle r="3" fill="#FFE4E1" />
                    </g>
                  ))}
                </svg>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Level 3: Text Content (z-index: 3) */}
      <div className="absolute inset-0 z-40 flex flex-col items-center justify-center text-center pointer-events-none px-6">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1, delay: 0.5 }}
           className="space-y-0 flex flex-col items-center overflow-visible"
        >
          <div className="relative overflow-visible flex items-center justify-center -mb-4">
            <BrandLogo size="hero" hideStroke={true} className="text-white drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]" />
            {/* Soft Shadow Underlay */}
            <BrandLogo size="hero" hideStroke={true} className="absolute inset-0 text-black/20 blur-md -z-10 translate-y-3" />
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="text-white/90 font-sans tracking-[0.8em] uppercase text-[10px] md:text-xs drop-shadow-xl font-bold"
          >
            {isModelMode ? (profile?.job_title_model || 'Editorial Muse') : (profile?.job_title_ba || 'Business Analyst Professional')}
          </motion.p>
        </motion.div>
      </div>

      {/* Level 4: Ambient Scoped Particle System (z-index: 4) */}
      <ScopedParticles type="ambient" />

      {/* Level 5: Effect Toggle Switch (z-index: 50) */}
      <div className="absolute top-8 right-8 z-50 flex items-center gap-3">
        <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/40 opacity-0 group-hover/banner:opacity-100 transition-opacity">
          {isParticlesEnabled ? 'Trail On' : 'Trail Off'}
        </span>
        <button 
          onClick={toggleParticles}
          className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 ${isParticlesEnabled ? 'bg-[var(--accent)]' : 'bg-white/20'}`}
        >
          <motion.div 
            animate={{ x: isParticlesEnabled ? 16 : 0 }}
            className="w-4 h-4 bg-white rounded-full shadow-sm"
          />
        </button>
      </div>
    </section>
  );
};
