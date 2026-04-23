import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  Github, ExternalLink, Calendar, GraduationCap, Briefcase, 
  Code2, MapPin, Phone, Mail, Sparkles, ArrowRight,
  Database, Layout, Smartphone, Camera, Heart, Globe, X,
  ClipboardList, Palette, Workflow, BookOpen, Layers
} from 'lucide-react';
import CountUp from 'react-countup';
import { HeroBanner } from './HeroBanner';
import { useTheme } from '../context/ThemeContext';
import { ServicesSection } from './ServicesSection';
import { ImageWrapper } from './ImageWrapper';
import { fetchProfile, fetchMilestones, fetchBAProjects, fetchLifeHobbies } from '../services/api';

const ProjectCarousel = ({ projects }: { projects: any[] }) => {
  const [scrollX, setScrollX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!projects || projects.length === 0) {
    return (
      <div className="h-[400px] rounded-[30px] bg-[var(--secondary)]/30 border border-dashed border-[var(--accent)]/30 flex items-center justify-center">
        <p className="text-[var(--accent)]/40 text-xs font-bold uppercase tracking-[0.4em]">Project Showcase In Progress</p>
      </div>
    );
  }

  return (
    <div className="relative group/carousel">
      <div 
        ref={containerRef}
        className="flex gap-8 overflow-x-auto snap-x no-scrollbar pb-10 px-4"
        onScroll={(e) => setScrollX(e.currentTarget.scrollLeft)}
      >
        {projects.map((project, idx) => (
          <motion.div
            key={project.id || idx}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="min-w-[300px] md:min-w-[450px] snap-center aspect-[16/10] rounded-[32px] overflow-hidden relative group/item glass border border-white/30 shadow-xl"
          >
            {/* Multi-image Carousel Placeholder - for now just first image */}
            <div className="w-full h-full bg-[var(--secondary)]/20 flex flex-col items-center justify-center space-y-3">
               <Database size={48} className="text-[var(--accent)] opacity-20" />
               <p className="text-[8px] font-bold uppercase tracking-[0.4em] opacity-30">Image from Database</p>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
              <div className="space-y-3">
                <h4 className="text-2xl font-bold text-white">{project.title}</h4>
                <p className="text-sm text-white/70 font-medium">{project.role} • {project.description}</p>
                
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.tags?.map((tag: string) => (
                    <span key={tag} className="text-[9px] font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full backdrop-blur-md text-white">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4 pt-4">
                  <motion.a 
                    href={project.github_url}
                    target="_blank"
                    whileHover={{ scale: 1.05 }}
                    className="flex-1 bg-white text-black py-2.5 rounded-xl text-center text-xs font-bold uppercase tracking-wider relative overflow-hidden group/btn ripple-parent"
                  >
                    View on GitHub
                    <div className="ripple-effect bg-black/5" />
                  </motion.a>
                  {project.flowchart_url && (
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      className="flex-1 bg-[var(--accent)] text-white py-2.5 rounded-xl text-center text-xs font-bold uppercase tracking-wider ripple-parent"
                    >
                      View Flowchart
                      <div className="ripple-effect bg-white/20" />
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const MemoryString = ({ items }: { items: any[] }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  if (!items || items.length === 0) {
    return <div ref={containerRef} className="hidden" />;
  }

  return (
    <section id="ba-memories" ref={containerRef} className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-20">
        <h2 className="text-4xl font-display text-[var(--accent)] mb-2">Life & Hobbies</h2>
        <p className="text-[10px] tracking-[0.5em] font-bold uppercase text-[var(--accent)]/40">The Memory String</p>
      </div>

      <div className="relative h-[600px] w-full flex items-center justify-center">
        {/* SVG String Path */}
        <svg className="absolute top-1/4 inset-x-0 w-full h-[200px] pointer-events-none" preserveAspectRatio="none">
           <motion.path
             d="M 0 100 Q 250 200 500 100 T 1000 100 T 1500 100"
             fill="none"
             stroke="var(--accent)"
             strokeWidth="1"
             strokeDasharray="5,5"
             className="opacity-30"
           />
        </svg>

        <div className="flex gap-12 md:gap-20 px-12 md:px-32 overflow-x-auto no-scrollbar snap-x relative z-10 w-full justify-center lg:justify-between items-center h-full">
           {items.map((item, i) => (
             <motion.div
               key={item.id}
               drag
               dragConstraints={{ left: -10, right: 10, top: -10, bottom: 10 }}
               animate={{ 
                 rotate: [i % 2 === 0 ? -3 : 3, i % 2 === 0 ? 3 : -3, i % 2 === 0 ? -3 : 3],
                 y: [0, -10, 0]
               }}
               transition={{ 
                 duration: 4 + i, 
                 repeat: Infinity,
                 ease: "easeInOut"
               }}
               className="min-w-[240px] md:min-w-[280px] bg-white p-4 pb-12 shadow-2xl rounded-sm border border-gray-100/50 snap-center transform-gpu cursor-grab active:cursor-grabbing"
             >
                <div className="aspect-square overflow-hidden mb-4 rounded-sm bg-gray-50 flex items-center justify-center">
                   <div className="flex flex-col items-center justify-center opacity-20 transform -rotate-12">
                      <Camera size={40} className="text-[var(--accent)]" />
                      <span className="text-[7px] font-bold uppercase tracking-widest mt-2">Memory Slot</span>
                   </div>
                </div>
                <div className="space-y-2">
                   <h5 className="font-signature text-2xl text-[var(--accent)]">{item.title}</h5>
                   <p className="text-[11px] leading-relaxed italic opacity-70">"{item.thought}"</p>
                   <div className="pt-2 flex justify-between items-center text-[8px] font-bold uppercase tracking-widest opacity-40">
                      <span>{item.date}</span>
                      <span>{item.location}</span>
                   </div>
                </div>
                {/* Pin/Clip Effect */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-8 bg-[var(--accent)]/10 rounded-full border border-[var(--accent)]/20" />
             </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
};

export const BAMode = () => {
  const { isModelMode } = useTheme();
  const [profile, setProfile] = useState<any>(null);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [memories, setMemories] = useState<any[]>([]);

  useEffect(() => {
    fetchProfile().then(setProfile);
    fetchMilestones().then(setMilestones);
    fetchBAProjects().then(setProjects);
    fetchLifeHobbies().then(setMemories);
  }, []);

  const subjects = profile?.subjects ? JSON.parse(profile.subjects) : [];

  return (
    <div className="bg-[#f8fcfb] text-[#1a2b27] font-sans selection:bg-[#A2D2FF] selection:text-white">
      <HeroBanner />

      <div className="max-w-7xl mx-auto px-6 space-y-32 py-32">
        {/* Section A: Bento Header */}
        <section id="professional-overview" className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[800px]">
          {/* Identity Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="md:col-span-8 bg-[#E6F4F1] rounded-[40px] p-10 flex flex-col md:flex-row gap-10 items-center border border-white/50 shadow-sm"
          >
            <div className="w-56 h-72 rounded-[32px] overflow-hidden flex-shrink-0 shadow-2xl border-4 border-white bg-white/40 flex items-center justify-center">
                <div className="flex flex-col items-center justify-center space-y-4 opacity-20">
                   <Smartphone size={64} className="text-[#2d7a70]" />
                   <div className="text-[8px] font-extrabold uppercase tracking-[0.5em] text-center">{profile?.full_name?.split(' ').pop()} PHOTO</div>
                </div>
            </div>
            <div className="flex-1 space-y-6">
               <div>
                  <h1 className="text-5xl font-bold tracking-tight mb-2 text-[#0d4f45]">{profile?.full_name || 'Hà Thị Thu Phương'}</h1>
                  <p className="text-lg text-[#2d7a70] font-medium tracking-wide uppercase">{profile?.job_title_ba || 'Business Analyst / UI-UX Professional'}</p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-sm opacity-60">
                    <MapPin size={18} className="text-[#2d7a70]" /> {profile?.address}
                  </div>
                  <div className="flex items-center gap-3 text-sm opacity-60">
                    <Phone size={18} className="text-[#2d7a70]" /> {profile?.phone}
                  </div>
                  <div className="flex items-center gap-3 text-sm opacity-60">
                    <Mail size={18} className="text-[#2d7a70]" /> {profile?.email}
                  </div>
                  <div className="flex items-center gap-3 text-sm opacity-60">
                    <Calendar size={18} className="text-[#2d7a70]" /> {profile?.birth_date}
                  </div>
               </div>

               <div className="bg-white/40 p-6 rounded-[30px] border border-white/60">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2 opacity-50">Mục tiêu nghề nghiệp</h4>
                  <p className="text-sm leading-relaxed font-medium">
                    {profile?.career_goal || 'Khảo sát yêu cầu, tài liệu hóa chuyên nghiệp, tối ưu hóa quy trình doanh nghiệp bằng giải pháp công nghệ.'}
                  </p>
               </div>
            </div>
          </motion.div>

          {/* Education Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="md:col-span-4 bg-[#A2D2FF]/20 rounded-[40px] p-10 flex flex-col justify-between border border-white/50 shadow-sm"
          >
            <div className="space-y-8">
               <div className="flex items-center gap-4">
                  <div className="p-4 bg-white rounded-2xl text-[#0d4f45] shadow-sm">
                    <GraduationCap size={28} />
                  </div>
                  <h3 className="text-xl font-bold leading-tight">Học vấn & Đào tạo</h3>
               </div>
               
               <div>
                  <h4 className="text-lg font-bold mb-1 text-[#0d4f45]">{profile?.university || 'Đại học CMC'}</h4>
                  <p className="text-xs font-bold opacity-40 uppercase tracking-widest">BSc in Information Systems</p>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white p-6 rounded-3xl text-center shadow-sm">
                    <span className="text-[9px] font-bold uppercase opacity-30 tracking-widest block mb-1">GPA</span>
                    <div className="text-4xl font-bold text-[#2d7a70]">
                       <CountUp end={parseFloat(profile?.gpa || '3.2')} decimals={1} duration={4} />
                       <span className="text-xs opacity-20 ml-1">/4.0</span>
                    </div>
                 </div>
                 <div className="bg-white p-6 rounded-3xl text-center shadow-sm flex items-center justify-center">
                    <span className="text-[10px] font-bold leading-tight">Giỏi & Toàn diện</span>
                 </div>
               </div>

               <div className="space-y-2">
                  <h5 className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 mb-3 ml-1">Chuyên ngành trọng tâm</h5>
                  <div className="flex flex-wrap gap-2">
                    {subjects.map((s: string) => (
                      <span key={s} className="px-3 py-1.5 bg-[#E6F4F1] text-[9px] font-bold rounded-lg border border-white/50">
                        {s}
                      </span>
                    ))}
                  </div>
               </div>
            </div>
          </motion.div>
        </section>

        {/* Section B: Experience Timeline */}
        <section id="experience" className="relative pl-12 border-l-2 border-[#E6F4F1]">
           <div className="absolute top-0 -left-6 w-12 h-12 bg-[#0d4f45] text-white rounded-full flex items-center justify-center shadow-xl">
              <Workflow size={24} />
           </div>
           
           <div className="mb-20 ml-6">
              <h2 className="text-4xl font-display text-[#0d4f45] mb-2">Professional Journey</h2>
              <p className="text-[10px] tracking-[0.5em] font-bold uppercase text-gray-400">Experience Timeline</p>
           </div>

           <div className="space-y-16 ml-10">
              {milestones.map((m, i) => (
                <motion.div 
                  key={m.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="relative group"
                >
                  {/* Indicator Dot */}
                  <div className={`absolute -left-[54px] top-6 w-5 h-5 rounded-full border-4 border-[#f8fcfb] z-10 transition-transform group-hover:scale-125
                    ${m.status === 'active' ? 'bg-[#2d7a70]' : 'bg-gray-300'}`}
                  >
                    {m.status === 'active' && (
                      <div className="absolute inset-0 rounded-full bg-[#2d7a70] animate-ping opacity-75" />
                    )}
                  </div>

                  <div className={`p-10 rounded-[40px] border border-white/50 shadow-sm transition-all relative overflow-hidden
                    ${m.status === 'active' ? 'bg-[#E6F4F1]/30 border-[#A2D2FF]/30' : 'bg-white/40'}`}
                  >
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-8">
                       <div>
                          <div className="flex items-center gap-3 mb-2">
                             <h4 className="text-xl font-bold text-[#0d4f45]">{m.role}</h4>
                             {m.status === 'active' && (
                               <span className="px-3 py-1 bg-[#2d7a70] text-white text-[8px] font-bold uppercase tracking-widest rounded-full flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Active
                               </span>
                             )}
                          </div>
                          <p className="text-sm font-bold opacity-40 uppercase tracking-[0.2em]">{m.period} • {m.type}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-lg font-bold text-[#2d7a70]">{m.company}</p>
                          <p className="text-xs opacity-50 uppercase tracking-widest font-bold">Vị trí đảm nhiệm</p>
                       </div>
                    </div>
                    
                    <div className="space-y-6">
                       <p className="text-sm leading-relaxed opacity-70 border-l-4 border-[#2d7a70]/20 pl-6 italic">
                         {m.description}
                       </p>
                       
                       <div className="flex flex-wrap gap-2">
                         {m.projects.map((p: string) => (
                           <span key={p} className="px-4 py-2 bg-white/60 text-[10px] font-bold rounded-xl border border-white text-[#2d7a70]">
                              # {p}
                           </span>
                         ))}
                       </div>
                    </div>
                  </div>
                </motion.div>
              ))}
           </div>
        </section>

        {/* Section C: Project Showcase */}
        <section id="projects" className="space-y-16">
          <div className="flex justify-between items-center px-4">
             <div>
                <h2 className="text-4xl font-display text-[#0d4f45] mb-2">Project Showcase</h2>
                <p className="text-[10px] tracking-[0.5em] font-bold uppercase text-gray-400">Logic & Creativity</p>
             </div>
             <div className="flex gap-4">
                <div className="p-4 bg-[#A2D2FF]/20 rounded-2xl text-[var(--accent)]"><Layers size={24} /></div>
                <div className="p-4 bg-[#E6F4F1] rounded-2xl text-[#2d7a70]"><Workflow size={24} /></div>
             </div>
          </div>
          
          <ProjectCarousel projects={projects} />
        </section>

        {/* Section D: Expertise */}
        <ServicesSection />

        {/* Section E: Memory String */}
        <MemoryString items={memories} />
      </div>

      {/* Water Ripple Global Helper - implemented as styled-components or in index.css but we'll use inline tailwind logic */}
      <style>{`
        .ripple-parent { position: relative; overflow: hidden; }
        .ripple-effect {
          position: absolute;
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 0.8s linear;
          pointer-events: none;
        }
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        .organic-photo {
           box-shadow: 0 10px 30px -5px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.01);
        }
      `}</style>
    </div>
  );
};
