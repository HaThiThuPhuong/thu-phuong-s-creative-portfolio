import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Ruler, Scissors, Shirt, Instagram, Camera, Calendar, Sparkles, Facebook, MessageCircle, ArrowRight, Heart, MapPin } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { HeroBanner } from './HeroBanner';
import { ServicesSection } from './ServicesSection';
import { ImageWrapper } from './ImageWrapper';
import { Modal } from './Modal';
import { GoogleMap } from './GoogleMap';
import { fetchProfile, fetchAssets } from '../services/api';

const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/share/17zvLV3sdQ/',
  instagram: 'https://www.instagram.com/thuphuong_yams?igsh=a3d2Y3Vvb25vbWNh',
  zalo: 'https://zalo.me/0325706636'
};

const StatCard = ({ label, value, icon: Icon, unit = '' }: any) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    const duration = 2000;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div 
      whileInView={{ y: [20, 0], opacity: [0, 1] }}
      className="glass p-6 rounded-3xl flex flex-col items-center justify-center space-y-2 border border-white/20"
    >
      <div className="w-10 h-10 rounded-full bg-[var(--secondary)] flex items-center justify-center text-[var(--accent)] mb-2">
        <Icon size={20} />
      </div>
      <div className="text-4xl font-display font-bold text-[var(--accent)]">
        {count}{unit}
      </div>
      <div className="text-sm opacity-60 uppercase tracking-widest">{label}</div>
    </motion.div>
  );
};

const LookbookItem = ({ item }: any) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [showSocial, setShowSocial] = useState(false);

  return (
    <div 
      className="min-w-[70vw] md:min-w-[320px] lg:min-w-[380px] snap-center aspect-[3/4.5] rounded-[32px] overflow-hidden flex-shrink-0 relative group shadow-xl"
      onMouseEnter={() => setShowOverlay(true)}
      onMouseLeave={() => {
        setShowOverlay(false);
        setShowSocial(false);
      }}
    >
      <motion.img 
        src={item.src} 
        alt={item.concept} 
        animate={{ scale: showOverlay ? 1.05 : 1, filter: showOverlay ? 'blur(4px) brightness(0.6)' : 'none' }}
        className="w-full h-full object-cover transition-transform duration-700" 
        referrerPolicy="no-referrer"
      />

      <AnimatePresence>
        {showOverlay && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex flex-col justify-end p-8 text-white"
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-black/40 backdrop-blur-md rounded-[32px] p-6 border border-white/10 space-y-6"
            >
              {/* Header */}
              <div>
                <h3 className="text-2xl font-display text-[var(--accent)]">{item.concept}</h3>
                <div className="flex gap-4 text-xs opacity-60 mt-1">
                  <span>Photo: {item.credits.photo}</span>
                  <span>MUA: {item.credits.makeup}</span>
                </div>
              </div>

              {/* Availability */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                  <Calendar size={14} /> 
                  Availability
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.availableSlots.map((slot: string) => (
                    <motion.button
                      key={slot}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowSocial(true)}
                      className="px-4 py-1.5 rounded-full bg-[#A2D2FF]/20 text-[#A2D2FF] text-[10px] font-bold border border-[#A2D2FF]/30 flex items-center gap-2"
                    >
                      {slot} <span className="w-1.5 h-1.5 rounded-full bg-[#A2D2FF] animate-pulse" /> Available
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Future Concepts */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                  <Sparkles size={14} /> 
                  Future Concepts
                </div>
                <div className="space-y-2">
                  {item.plannedConcepts.map((concept: any) => (
                    <div key={concept.name} className="flex items-center justify-between group/concept">
                      <div>
                        <div className="text-sm font-medium">{concept.name}</div>
                        <div className="text-[10px] opacity-40">{concept.vibe}</div>
                      </div>
                      <ArrowRight size={14} className="opacity-0 group-hover/concept:opacity-100 transition-opacity text-[var(--accent)]" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Social Modal */}
      <AnimatePresence>
        {showSocial && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute inset-0 z-20 flex items-center justify-center p-6 bg-black/60 backdrop-blur-lg"
          >
            <div className="text-center space-y-6">
              <h4 className="font-display text-xl">Let's collaborate</h4>
              <div className="flex justify-center gap-6">
                {[
                  { icon: Facebook, color: '#1877F2', delay: 0.1, href: SOCIAL_LINKS.facebook },
                  { icon: Instagram, color: '#E4405F', delay: 0.2, href: SOCIAL_LINKS.instagram },
                  { icon: MessageCircle, color: '#0068FF', delay: 0.3, href: SOCIAL_LINKS.zalo }
                ].map((social, i) => (
                  <motion.a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ y: 0 }}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2, delay: social.delay }}
                    whileHover={{ scale: 1.2 }}
                    className="w-14 h-14 rounded-full flex items-center justify-center border border-white/20"
                    style={{ backgroundColor: social.color + '20' }}
                  >
                    <social.icon style={{ color: social.color }} />
                  </motion.a>
                ))}
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowSocial(false); }}
                className="text-xs uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const GalleryItem = ({ item, index }: any) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={() => setIsActive(!isActive)}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      className="relative group overflow-hidden rounded-[40px] cursor-pointer"
    >
      {/* Base Image */}
      <motion.img
        src={item.src}
        alt={item.title}
        animate={{
          filter: isActive ? 'blur(4px) brightness(0.7)' : 'blur(0px) brightness(1)',
        }}
        transition={{ duration: 0.5 }}
        className="w-full h-auto transition-all duration-500"
        referrerPolicy="no-referrer"
      />

      {/* Glassmorphism Overlay */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="w-full bg-[rgba(255,240,245,0.6)] backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-2xl text-center"
            >
              <h3 className="text-[var(--accent)] font-display text-xl mb-1">{item.title}</h3>
              <p className="text-xs uppercase tracking-widest opacity-60 mb-4">{item.date}</p>
              
              <div className="space-y-1 text-sm border-t border-[var(--accent)]/10 pt-4">
                <div className="flex justify-between items-center px-2">
                  <span className="opacity-40 text-[10px] uppercase font-bold">Photo</span>
                  <span className="font-medium text-[var(--accent)]">{item.photographer}</span>
                </div>
                <div className="flex justify-between items-center px-2">
                  <span className="opacity-40 text-[10px] uppercase font-bold">Makeup</span>
                  <span className="font-medium text-[var(--accent)]">{item.makeup}</span>
                </div>
                <div className="flex justify-between items-center px-2">
                  <span className="opacity-40 text-[10px] uppercase font-bold">Location</span>
                  <span className="font-medium text-[var(--accent)]">{item.location}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const KineticItem = ({ children, index, scrollYProgress, xOffset = '10%' }: any) => {
  const speed = 0.1 + (index % 3) * 0.1;
  const y = useTransform(scrollYProgress, [0, 1], [0, -200 * speed * 10]);
  const initialRotate = (index % 2 === 0 ? 5 : -5) * (1 + (index % 3) * 0.5);
  
  return (
    <motion.div
      style={{ y, left: xOffset }}
      className="relative mb-32 z-10 pointer-events-auto w-fit"
    >
      <motion.div
        initial={{ rotate: initialRotate }}
        whileHover={{ rotate: 0, scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

const SectionCurve = ({ children, title, subtitle, id }: any) => {
  const containerRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <section id={id} ref={containerRef} className="relative min-h-[140vh] py-32 overflow-hidden bg-white/5 border-t border-[var(--accent)]/5">
      {/* Background Frame Layer (Visual Frame) */}
      <div className="absolute top-0 left-0 w-64 h-64 opacity-10 pointer-events-none">
        <div className="absolute inset-0 border-l-[40px] border-t-[40px] border-[var(--accent)] rounded-tl-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-30 mb-20">
        <motion.div
          whileInView={{ x: [-20, 0], opacity: [0, 1] }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl font-display mb-4 text-[var(--accent)] drop-shadow-sm">{title}</h2>
          <div className="flex items-center gap-4">
            <p className="text-[10px] uppercase tracking-[0.6em] font-bold text-[var(--accent)] opacity-40">{subtitle}</p>
            <div className="h-[1px] w-24 bg-[var(--accent)] opacity-20"></div>
          </div>
        </motion.div>
      </div>

      {/* S-Curve Background Line (Dashed) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 100 1200" preserveAspectRatio="none">
        <motion.path
          d="M 25 0 Q 75 300 25 600 Q 75 900 25 1200"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="0.5"
          strokeDasharray="8,12"
          animate={{ strokeDashoffset: [0, -200] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </svg>

      {/* Scoped Blossoms - Only within this section */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: (20 + Math.random() * 60) + "%", 
              y: "-10%",
              rotate: 0,
              opacity: 0
            }}
            animate={{ 
              y: "110%",
              rotate: 360,
              opacity: [0, 0.4, 0.4, 0]
            }}
            transition={{ 
              duration: 10 + Math.random() * 10, 
              repeat: Infinity, 
              ease: "linear", 
              delay: i * 1.5 
            }}
            className="absolute text-2xl filter blur-[1px]"
          >
            🌸
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        {React.Children.map(children, (child, i) => (
          <KineticItem 
            index={i} 
            scrollYProgress={scrollYProgress} 
            xOffset={i % 2 === 0 ? '-15%' : '20%'}
          >
            {child}
          </KineticItem>
        ))}
      </div>
    </section>
  );
};

const SocialPopup = ({ onClose }: any) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-xl rounded-[inherit] p-6 text-center"
  >
    <h4 className="text-[var(--accent)] font-display text-lg mb-4">Contact Me</h4>
    <div className="flex gap-4 mb-6">
      {[
        { Icon: Facebook, href: SOCIAL_LINKS.facebook },
        { Icon: Instagram, href: SOCIAL_LINKS.instagram },
        { Icon: MessageCircle, href: SOCIAL_LINKS.zalo }
      ].map((item, i) => (
        <motion.a
          key={i}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
          className="w-10 h-10 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shadow-lg"
        >
          <item.Icon size={18} />
        </motion.a>
      ))}
    </div>
    <button onClick={onClose} className="text-[10px] uppercase font-bold opacity-40 hover:opacity-100">Close</button>
  </motion.div>
);

const CreditOverlay = ({ item, isVisible }: any) => {
  const metadata = React.useMemo(() => {
    if (!item || !item.metadata) return {};
    if (typeof item.metadata === 'object') return item.metadata;
    try {
      return JSON.parse(item.metadata);
    } catch (e) {
      console.error("Failed to parse metadata", e);
      return {};
    }
  }, [item?.metadata]);
  
  const CreditLink = ({ label, roleData, fallbackName }: any) => {
    // Handle both single objects and arrays of credit objects
    const dataArray = Array.isArray(roleData) ? roleData : (roleData ? [roleData] : []);
    
    // If no complex metadata, try parsing fallback string for multiple names
    const displayFallback = fallbackName || 'N/A';
    
    if (dataArray.length === 0 && displayFallback !== 'N/A') {
      const names = displayFallback.split(',').map((s: string) => s.trim()).filter(Boolean);
      if (names.length === 0) return (
        <div className="flex justify-between items-center opacity-80">
          <span className="font-bold uppercase text-[8px] md:text-[10px]">{label}</span>
          <span className="text-[var(--accent)] font-medium">N/A</span>
        </div>
      );

      return (
        <div className="flex justify-between items-start opacity-80 gap-4">
          <span className="font-bold uppercase text-[8px] md:text-[10px] pt-1">{label}</span>
          <div className="flex flex-wrap justify-end gap-x-2 gap-y-0.5 text-right max-w-[70%]">
            {names.map((n: string, i: number) => (
               <React.Fragment key={i}>
                <span className="text-[var(--accent)] font-medium">{n}</span>
                {i < names.length - 1 && <span className="opacity-20">&</span>}
               </React.Fragment>
            ))}
          </div>
        </div>
      );
    }

    if (dataArray.length === 0) {
      return (
        <div className="flex justify-between items-center opacity-80">
          <span className="font-bold uppercase text-[8px] md:text-[10px]">{label}</span>
          <span className="text-[var(--accent)] font-medium">N/A</span>
        </div>
      );
    }

    return (
      <div className="flex justify-between items-start opacity-80 gap-4">
        <span className="font-bold uppercase text-[8px] md:text-[10px] pt-1">{label}</span>
        <div className="flex flex-wrap justify-end gap-x-2 gap-y-0.5 text-right max-w-[70%]">
          {dataArray.map((data: any, i: number) => {
            const name = data.name || 'N/A';
            const link = data.link;
            return (
              <React.Fragment key={i}>
                {link ? (
                  <a 
                    href={link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[var(--accent)] underline hover:opacity-70 transition-colors inline-block"
                  >
                    {name}
                  </a>
                ) : (
                  <span className="text-[var(--accent)] font-medium">{name}</span>
                )}
                {i < dataArray.length - 1 && <span className="opacity-20">&</span>}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isVisible && item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-20 flex items-center justify-center p-2 md:p-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full h-full bg-[rgba(255,240,245,0.96)] backdrop-blur-xl rounded-[24px] p-4 md:p-6 border border-white/50 shadow-2xl flex flex-col justify-center"
          >
            <h3 className="font-display text-lg md:text-2xl text-[var(--accent)] mb-1 leading-tight text-center">{item.title || item.concept || 'Portfolio Item'}</h3>
            <p className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] opacity-50 mb-2 md:mb-4 text-center">{metadata?.date || item.date || "Spring 2025"}</p>
            
            <div className="space-y-1.5 md:space-y-3 text-[10px] md:text-[12px] border-t border-[var(--accent)]/10 pt-3 md:pt-4">
              <CreditLink label="Model" roleData={metadata?.credits?.model || metadata?.model} fallbackName={item.model_name} />
              <CreditLink label="Photo" roleData={metadata?.credits?.photo || metadata?.photo} fallbackName={item.photographer} />
              <CreditLink label="Makeup" roleData={metadata?.credits?.makeup || metadata?.makeup} fallbackName={item.makeup} />
              <div className="flex justify-between items-center opacity-80">
                <span className="font-bold uppercase text-[8px] md:text-[10px]">Location</span>
                <span className="text-[var(--accent)] font-medium text-right max-w-[70%]">{metadata?.location?.name || item.location || 'N/A'}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ImageWithCredit = ({ item, className = "", onClick, isWave = false }: any) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      onClick={onClick || (() => setIsActive(!isActive))}
      className={`relative group cursor-pointer overflow-hidden ${isWave ? 'organic-wave-mirror' : ''} ${className}`}
    >
      {item.url || item.src ? (
        <ImageWrapper 
          src={item.url || item.src} 
          alt={item.title || item.concept}
          className={`transition-all duration-700 ${isActive ? 'blur(10px) brightness(0.8)' : 'blur(0px) brightness(1)'}`}
          aspectRatio="h-full w-full"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center space-y-2 opacity-40">
           <Camera size={32} className="text-[var(--accent)]" />
           <span className="text-[8px] uppercase font-bold tracking-widest text-[var(--accent)]">Coming Soon</span>
        </div>
      )}
      <CreditOverlay item={item} isVisible={isActive} />
    </motion.div>
  );
};

const ParabolicRibbonSection = ({ items, onSelect }: any) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const dashOffset = useTransform(scrollYProgress, [0, 1], [1000, 0]);

  // Use precisely 3 items or placeholders
  const lookbookItems = [...items, {}, {}, {}].slice(0, 3);

  return (
    <section ref={containerRef} className="relative min-h-[150vh] py-32 overflow-hidden bg-white/5 border-t border-[var(--accent)]/5">
       <div className="max-w-7xl mx-auto px-6 relative z-30 mb-20">
        <motion.div
          whileInView={{ x: [-20, 0], opacity: [0, 1] }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl font-display mb-4 text-[var(--accent)] drop-shadow-sm">Summer Lookbook '26</h2>
          <div className="flex items-center gap-4">
            <p className="text-[10px] uppercase tracking-[0.6em] font-bold text-[var(--accent)] opacity-40">The Parabolic Ribbon</p>
            <div className="h-[1px] w-24 bg-[var(--accent)] opacity-20"></div>
          </div>
        </motion.div>
      </div>

      <div className="relative h-[1200px] max-w-4xl mx-auto">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 1200" preserveAspectRatio="none">
          {/* Parabolic Ribbon Line */}
          <motion.path
            d="M 50 150 Q 350 375 200 600 Q 50 825 350 1050"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
            className="parabolic-path"
            style={{ pathLength, strokeDashoffset: dashOffset }}
          />
        </svg>

        {/* Anchor Points */}
        <div className="absolute inset-0 pointer-events-none">
          {lookbookItems.map((item, i) => {
            const positions = [
              { top: '150px', left: '50px', transform: 'translate(-50%, -50%)' },  // Vertex P1
              { top: '600px', left: '200px', transform: 'translate(-50%, -50%)' }, // Intersection
              { top: '1050px', left: '350px', transform: 'translate(-50%, -50%)' }  // Vertex P2
            ];
            const pos = positions[i];

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                style={{ 
                  position: 'absolute', 
                  top: pos.top, 
                  left: pos.left, 
                  transform: pos.transform 
                }}
                className="pointer-events-auto"
              >
                <ImageWithCredit
                  item={item}
                  isWave={true}
                  className="w-48 h-64 md:w-64 md:h-80 shadow-2xl animate-float"
                  onClick={item.url ? () => onSelect(item) : undefined}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const OrigamiCard = ({ concept, index, showContact, onContact }: any) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const metadata = concept.status || {};

  const handleCollaborationClick = (e: React.MouseEvent, key: string, isReady: boolean) => {
    e.stopPropagation();
    if (!isReady) {
      window.open(SOCIAL_LINKS.zalo, '_blank');
    }
  };

  return (
    <div 
      className="relative w-full aspect-[3/4] cursor-pointer"
      style={{ perspective: '1200px' }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="w-full h-full relative"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front Side */}
        <div 
          className="absolute inset-0 bg-white shadow-xl rounded-3xl overflow-hidden border border-white/50"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <ImageWrapper src={concept.img} alt={concept.name} className="w-full h-full" aspectRatio="h-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
            <h4 className="font-display text-2xl">{concept.name}</h4>
            <p className="font-handwriting text-[#FFB6C1]">{concept.vibe}</p>
          </div>
        </div>

        {/* Back Side (Checklist & Collaboration) */}
        <div 
          className="absolute inset-0 bg-[rgba(255,240,245,0.95)] backdrop-blur-2xl shadow-xl rounded-3xl border border-[var(--accent)]/20 p-8 flex flex-col justify-between"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div>
            <h4 className="font-display text-xl text-[var(--accent)] mb-6 border-b border-[var(--accent)]/10 pb-3">Collaboration Hub</h4>
            <div className="space-y-4">
              {[
                { label: 'Model: Hà Phương', key: 'model' },
                { label: 'Photographer', key: 'photo' },
                { label: 'Makeup', key: 'makeup' }
              ].map((item) => {
                const isReady = concept.status[item.key as keyof typeof concept.status];
                return (
                  <div 
                    key={item.key} 
                    className="flex flex-col gap-1 cursor-pointer group/item"
                    onClick={(e) => handleCollaborationClick(e, item.key, isReady)}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] uppercase font-bold tracking-widest ${isReady ? 'text-[var(--accent)]' : 'opacity-40'}`}>
                        {item.label}
                      </span>
                      <motion.span 
                        animate={!isReady ? { color: ['#FF4D6D', '#D1D5DB', '#FF4D6D'], opacity: [1, 0.4, 1] } : {}}
                        transition={!isReady ? { repeat: Infinity, duration: 2 } : {}}
                        className={`text-[9px] font-bold px-2 py-1 rounded-full ${isReady ? 'bg-[var(--accent)]/10 text-[var(--accent)]' : 'bg-gray-100 text-gray-400'}`}
                      >
                        {isReady ? '🌸 Ready' : 'Cần tìm / Liên hệ'}
                      </motion.span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button 
            onClick={(e) => { e.stopPropagation(); window.open(SOCIAL_LINKS.zalo, '_blank'); }}
            className="w-full py-4 bg-[var(--accent)] text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-2xl shadow-lg hover:shadow-[var(--accent)]/40 hover:-translate-y-1 transition-all active:scale-95"
          >
            Đăng ký tham gia ngay
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const OrbitingPetal = ({ slot, index, onContact, showContact }: any) => {
  const radius = 180 + (index % 3) * 60;
  const initialAngle = (index * (360 / 5)) * (Math.PI / 180);
  const [angle, setAngle] = useState(initialAngle);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setAngle(prev => prev + 0.005);
    }, 16);
    return () => clearInterval(interval);
  }, [isHovered]);

  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  return (
    <motion.div
      animate={{ x, y }}
      className={`absolute w-32 h-32 md:w-40 md:h-40 z-10`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        animate={{ 
          scale: isHovered ? 1.4 : 1,
          rotate: isHovered ? 0 : angle * (180 / Math.PI)
        }}
        className="w-full h-full glass rounded-[40%_60%_70%_30%_/_40%_50%_60%_50%] border border-white/40 shadow-xl flex flex-col items-center justify-center p-4 cursor-pointer relative overflow-hidden"
        onClick={() => onContact(`cal-${index}`)}
      >
        <span className="text-2xl mb-1">{index % 2 === 0 ? '🍓' : '🌸'}</span>
        <span className="font-display text-xl text-[var(--accent)]">{slot.date}</span>
        <span className="text-[8px] uppercase tracking-widest opacity-40">Available</span>

        <AnimatePresence>
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-2 text-center"
            >
              <p className="text-[9px] font-bold mb-2 text-gray-500">{slot.status}</p>
              <span className="text-[8px] uppercase font-bold text-[var(--accent)] border-b border-[var(--accent)]/30">Liên hệ ngay</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      {showContact === `cal-${index}` && <SocialPopup onClose={() => onContact(null)} />}
    </motion.div>
  );
};

export const ModelMode = () => {
  const [profile, setProfile] = useState<any>(null);
  const [images, setImages] = useState<any[]>([]);
  const [lookbookData, setLookbookData] = useState<any[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);

  useEffect(() => {
    fetchProfile().then(setProfile).catch(console.error);
    fetchAssets('model_diary').then(setImages).catch(console.error);
    fetchAssets('lookbook').then((data) => {
      // Ensure at least 6 items for layout stability
      const minItems = 6;
      if (data.length < minItems) {
        const placeholders = Array.from({ length: minItems - data.length }).map((_, i) => ({
          isPlaceholder: true,
          title: 'Coming Soon',
          url: '',
          concept: 'In Progress...'
        }));
        setLookbookData([...data, ...placeholders]);
      } else {
        setLookbookData(data);
      }
    }).catch(console.error);
  }, []);

  const bentoGrid = Array.from({ length: 9 }).map((_, i) => images[i] || null);
  const bentoClasses = [
    'col-span-2 row-span-2', // Big one
    'col-span-1 row-span-1', 'col-span-1 row-span-1',
    'col-span-1 row-span-1', 'col-span-1 row-span-1',
    'col-span-1 row-span-1', 'col-span-1 row-span-1',
    'col-span-1 row-span-1', 'col-span-1 row-span-1'
  ];

  const calendarData = [
    { date: '15/05', status: 'Sáng: Trống | Chiều: Có lịch' },
    { date: '18/05', status: 'Full day: Available' },
    { date: '22/05', status: 'Sáng: Có lịch | Chiều: Trống' },
    { date: '25/05', status: 'Available for Booking' },
    { date: '28/05', status: 'Check DM for slots' },
  ];

  const upcomingConcepts: any[] = [];

  return (
    <div className="space-y-32 pb-40">
      <HeroBanner />

      <div className="max-w-7xl mx-auto px-6">
        {/* Profile Stats */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-32">
          <StatCard label="Height" value={profile?.height || "160"} icon={Ruler} unit="cm" />
          <StatCard label="Weight" value={profile?.weight || "48"} icon={Heart} unit="kg" />
          <StatCard label="Bust" value={profile?.bust || "85"} icon={Scissors} unit="cm" />
          <StatCard label="Waist" value={profile?.waist || "64"} icon={Shirt} unit="cm" />
          <StatCard label="Hips" value={profile?.hips || "92"} icon={Camera} unit="cm" />
        </section>

        {/* Location Info */}
        <div className="flex justify-center mb-12">
            <div className="flex items-center gap-2 px-6 py-2 bg-[var(--secondary)] rounded-full text-[var(--accent)] text-xs font-bold uppercase tracking-[0.2em] shadow-sm italic">
                <MapPin size={14} /> {profile?.current_location || 'Hà Nội'}
            </div>
        </div>

        {/* Visual Diary (Perfect Bento 9 Slots) */}
        <section id="visual-diary" className="mb-32">
          <div className="flex justify-between items-end mb-12">
            <div>
               <h2 className="text-4xl font-display mb-2 text-[var(--accent)] tracking-tight">Visual Diary</h2>
               <p className="text-[9px] uppercase font-bold tracking-[0.4em] opacity-30">A curated collection of moments</p>
            </div>
            <div className="h-[1px] flex-1 mx-8 bg-[var(--accent)] opacity-20 hidden md:block"></div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 grid-rows-4 md:grid-rows-3 gap-3 bg-pink-50/10 p-3 rounded-[40px] border border-pink-100/20 shadow-2xl relative overflow-hidden h-[700px] md:h-[1000px]">
             {bentoGrid.map((item, i) => (
                <ImageWithCredit 
                  key={i} 
                  item={item || {}} 
                  className={bentoClasses[i] || 'col-span-1 row-span-1'} 
                  onClick={item ? () => setSelectedAsset(item) : undefined}
                />
             ))}
          </div>
        </section>
      </div>

      {/* Section 1: Summer Lookbook (The Pink Parabolic Ribbon) */}
      <ParabolicRibbonSection 
        id="lookbook"
        items={lookbookData} 
        onSelect={setSelectedAsset} 
      />

      {/* Section 2: Availability (Floating Orbit) */}
      <section id="availability" className="relative min-h-[100vh] py-32 overflow-hidden border-t border-[var(--accent)]/5 flex items-center justify-center">
        <div className="absolute top-32 left-10 z-20">
          <h2 className="text-4xl font-display mb-4 text-[var(--accent)]">Availability</h2>
          <p className="text-[10px] uppercase tracking-[0.6em] font-bold text-[var(--accent)] opacity-40">The Floating Petals Calendar</p>
        </div>

        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: "-10%", opacity: [0, 0.2, 0] }}
              transition={{ duration: 10, repeat: Infinity, delay: i * 2 }}
              className="absolute left-[30%] text-2xl"
            >🌸</motion.div>
          ))}
        </div>

        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="relative z-0 text-[120px] md:text-[180px] drop-shadow-2xl opacity-20 filter blur-[2px]"
        >
          🍓
        </motion.div>

        {calendarData.map((slot, i) => (
          <OrbitingPetal 
            key={i} 
            slot={slot} 
            index={i} 
            onContact={() => window.open(SOCIAL_LINKS.zalo, '_blank')} 
          />
        ))}
      </section>

      {/* Section: Services & Expertise */}
      <ServicesSection />

      {/* Section 3: Upcoming Concepts (Origami Gallery) */}
      <section id="upcoming-concepts" className="relative py-32 bg-white/5 border-t border-[var(--accent)]/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-20 text-right">
          <h2 className="text-4xl font-display mb-4 text-[var(--accent)]">Upcoming Concepts</h2>
          <p className="text-[10px] uppercase tracking-[0.6em] font-bold text-[var(--accent)] opacity-40">The Origami Gallery</p>
        </div>

        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {upcomingConcepts.map((concept, i) => (
            <OrigamiCard 
              key={i} 
              concept={concept} 
              index={i} 
            />
          ))}
        </div>
      </section>

      {/* Album Modal */}
      <Modal isOpen={!!selectedAsset} onClose={() => setSelectedAsset(null)} title={selectedAsset?.title || 'Album Detail'}>
        {selectedAsset && (() => {
          const metadata = typeof selectedAsset.metadata === 'string' ? JSON.parse(selectedAsset.metadata) : selectedAsset.metadata;
          return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                 <ImageWrapper src={selectedAsset.url} aspectRatio="aspect-square" className="rounded-[40px] shadow-2xl" />
                 <div className="grid grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                      <ImageWrapper key={i} src={`${selectedAsset.url}&sig=${i}`} aspectRatio="aspect-square" className="rounded-2xl" />
                    ))}
                 </div>
              </div>
              <div className="flex flex-col gap-8 h-full">
                 <div className="glass p-10 rounded-[50px] border border-white/50 shadow-xl space-y-8">
                    <div>
                      <h4 className="text-4xl font-display text-[var(--accent)] mb-3">{selectedAsset.title}</h4>
                      <p className="text-sm leading-relaxed opacity-60 font-sans">{selectedAsset.description || "Bộ sưu tập mang đậm tinh thần tự do, kết hợp giữa yếu tố cổ điển và thẩm mỹ hiện đại. Từng khung hình là một câu chuyện độc bản về vẻ đẹp và sự tinh tế."}</p>
                    </div>
                    
                    <div className="space-y-4">
                      <h5 className="text-[10px] uppercase font-bold tracking-[0.4em] text-[var(--accent)] opacity-40">Credits & Network</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                         {/* Model Credits */}
                         <div className="bg-white/40 backdrop-blur-md p-5 rounded-3xl border border-white/60">
                            <p className="text-[9px] uppercase font-bold opacity-30 mb-2">Model</p>
                            <div className="space-y-1">
                              {metadata?.credits?.model ? (
                                metadata.credits.model.map((m: any, i: number) => (
                                  <a key={i} href={m.link} target="_blank" rel="noopener noreferrer" className="font-bold text-[var(--accent)] underline hover:opacity-70 transition-opacity block overflow-hidden text-ellipsis">
                                    {m.name}
                                  </a>
                                ))
                              ) : (
                                <p className="font-bold text-[var(--accent)]">{selectedAsset.model_name || "N/A"}</p>
                              )}
                            </div>
                         </div>

                         {/* Photo Credits */}
                         <div className="bg-white/40 backdrop-blur-md p-5 rounded-3xl border border-white/60">
                            <p className="text-[9px] uppercase font-bold opacity-30 mb-2">Photography</p>
                            <div className="space-y-1">
                              {metadata?.credits?.photo ? (
                                metadata.credits.photo.map((p: any, i: number) => (
                                  <a key={i} href={p.link} target="_blank" rel="noopener noreferrer" className="font-bold text-[var(--accent)] underline hover:opacity-70 transition-opacity block overflow-hidden text-ellipsis">
                                    {p.name}
                                  </a>
                                ))
                              ) : (
                                <p className="font-bold text-[var(--accent)]">{selectedAsset.photographer || "N/A"}</p>
                              )}
                            </div>
                         </div>

                         {/* Makeup Credits */}
                         <div className="bg-white/40 backdrop-blur-md p-5 rounded-3xl border border-white/60">
                            <p className="text-[9px] uppercase font-bold opacity-30 mb-2">Makeup</p>
                            <div className="space-y-1">
                              {metadata?.credits?.makeup ? (
                                metadata.credits.makeup.map((m: any, i: number) => (
                                  <a key={i} href={m.link} target="_blank" rel="noopener noreferrer" className="font-bold text-[var(--accent)] underline hover:opacity-70 transition-opacity block overflow-hidden text-ellipsis">
                                    {m.name}
                                  </a>
                                ))
                              ) : (
                                <p className="font-bold text-[var(--accent)]">{selectedAsset.makeup || "N/A"}</p>
                              )}
                            </div>
                         </div>
                      </div>
                    </div>
                 </div>

                 <div className="flex-1 min-h-[350px]">
                    <GoogleMap 
                      lat={metadata?.location?.lat || 21.0583} 
                      lng={metadata?.location?.lng || 105.8133} 
                      name={metadata?.location?.name || selectedAsset.location} 
                    />
                 </div>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
};
