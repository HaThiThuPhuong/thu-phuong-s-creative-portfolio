import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, Sparkles, Video, 
  Search, Layout, ClipboardList,
  ArrowRight, MessageCircle, Heart, Zap,
  Instagram, Facebook
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { fetchServices } from '../services/api';

const ICON_MAP: Record<string, any> = {
  Camera, Sparkles, Video, Search, Layout, ClipboardList
};

interface Service {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  stat_label: string;
  stat_value: string;
  benefits: string[];
}

const ServiceCard = ({ service, isCenter }: { service: Service; isCenter: boolean }) => {
  const { isModelMode } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const Icon = ICON_MAP[service.icon_name] || Sparkles;

  const SOCIAL_CONTACTS = [
    { icon: Instagram, href: 'https://www.instagram.com/thuphuong_yams?', color: '#E4405F' },
    { icon: Facebook, href: 'https://www.facebook.com/share/17zvLV3sdQ/', color: '#1877F2' },
    { icon: MessageCircle, href: 'https://zalo.me/0325706636', color: '#0068FF' }
  ];

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{ 
        scale: isCenter ? 1.05 : 0.95,
        opacity: isCenter ? 1 : 0.6
      }}
      className={`relative aspect-[3/4] rounded-[40px] flex flex-col overflow-hidden cursor-pointer transition-all duration-500
        ${isModelMode 
          ? 'bg-[#FFF0F5] text-[var(--accent)] border-2 border-dashed border-pink-200' 
          : 'glass border border-white/20'
        }`}
    >
      {/* Background/Image Placeholder */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <Icon size={120} />
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 h-full flex flex-col justify-between">
        <div>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 
            ${isModelMode ? 'bg-[var(--accent)] text-white' : 'bg-[var(--secondary)] text-[var(--accent)]'}`}
          >
            <Icon size={24} />
          </div>
          
          <h3 className={`text-xl md:text-2xl mb-4 ${isModelMode ? 'font-display italic' : 'font-sans font-bold'}`}>
            {service.title || 'Service Title'}
          </h3>
          <p className="text-xs md:text-sm opacity-60 leading-relaxed line-clamp-3">
            {service.description || 'Description coming soon...'}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {isModelMode ? <Heart size={14} /> : <Zap size={14} className="text-[var(--accent)]" />}
            <span className="text-[9px] uppercase font-bold tracking-widest opacity-40">
              {service.stat_label || 'Status'}: {service.stat_value || 'Available'}
            </span>
          </div>
        </div>
      </div>

      {/* Booking Overlay - Slide In */}
      <AnimatePresence>
        {isHovered && isModelMode && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-0 z-20 bg-[var(--accent)]/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-white space-y-6"
          >
            <div className="text-center">
              <p className="text-[10px] uppercase font-bold tracking-[0.3em] mb-2 opacity-80">Ready to work?</p>
              <h4 className="text-2xl font-display italic">Booking Now</h4>
            </div>
            
            <div className="flex gap-4">
              {SOCIAL_CONTACTS.map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors"
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Styled strawberry overlay for model mode */}
      {isModelMode && (
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent pointer-events-none" />
      )}
    </motion.div>
  );
};

export const ServicesSection = () => {
  const { isModelMode } = useTheme();
  const [services, setServices] = useState<Service[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchServices(isModelMode ? 'model' : 'ba').then(data => {
      // Ensure at least 3 items for stable layout
      if (data.length < 3) {
        const placeholders = Array.from({ length: 3 - data.length }).map((_, i) => ({
          id: `placeholder-${i}`,
          title: 'Coming Soon',
          description: 'This expertise is being detailed...',
          icon_name: 'Sparkles',
          stat_label: 'Status',
          stat_value: 'Planning',
          benefits: []
        }));
        setServices([...data, ...placeholders]);
      } else {
        setServices(data);
      }
    }).catch(console.error);
  }, [isModelMode]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % services.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + services.length) % services.length);
  };

  // Get 3 visible indices
  const getVisibleIndices = () => {
    if (services.length === 0) return [];
    return [
      (currentIndex - 1 + services.length) % services.length,
      currentIndex,
      (currentIndex + 1) % services.length
    ];
  };

  const visibleIndices = getVisibleIndices();

  return (
    <section id={isModelMode ? "model-services" : "ba-services"} className="py-32 px-6 overflow-hidden bg-white/5 border-t border-[var(--accent)]/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-20 px-4 md:px-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h2 className={`text-4xl md:text-5xl ${isModelMode ? 'font-display text-[var(--accent)]' : 'font-sans font-bold text-[var(--accent)]'}`}>
              Services & Expertise
            </h2>
            <div className={`h-[1px] bg-[var(--accent)] opacity-20 mt-4 transition-all duration-500 ${isModelMode ? 'w-48' : 'w-24'}`} />
          </motion.div>
          <div className="flex gap-4">
            <button 
              onClick={handlePrev}
              className="w-12 h-12 rounded-full border border-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-all"
            >
              <ArrowRight size={20} className="rotate-180" />
            </button>
            <button 
              onClick={handleNext}
              className="w-12 h-12 rounded-full border border-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-all"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        <div className="relative overflow-visible px-4 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {visibleIndices.map((i, idx) => (
              <motion.div
                key={`${services[i].id}-${idx}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                <ServiceCard 
                  service={services[i]} 
                  isCenter={idx === 1} // Center item of the 3 visible ones
                />
              </motion.div>
            ))}
          </div>
        </div>

        <p className="mt-16 text-[10px] uppercase font-bold tracking-[0.6em] opacity-20 text-center">
          {isModelMode ? 'Swipe or tap arrows to explore' : 'Consulting & Strategy Services'}
        </p>
      </div>
    </section>
  );
};
