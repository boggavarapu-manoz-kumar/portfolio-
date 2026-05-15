import { useState, useEffect, useRef } from 'react';
import { Code, ExternalLink, ChevronLeft, ChevronRight, Briefcase, Zap } from 'lucide-react';
import { projectsService } from '../services/apiServices';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    projectsService.getAll()
      .then(res => {
        setProjects(res.data?.data || res.data || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, offsetWidth } = scrollRef.current;
      const cardWidth = 360 + 32; // width + gap
      const center = scrollLeft + offsetWidth / 2;
      const index = Math.round((center - offsetWidth / 2) / cardWidth);
      if (index !== activeIndex) setActiveIndex(index);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const isMobile = window.innerWidth <= 768;
      const cardWidth = isMobile ? (window.innerWidth * 0.85 + 24) : (360 + 32); 
      const { scrollLeft } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - cardWidth : scrollLeft + cardWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <div className="w-12 h-12 rounded-full border-t-2 border-indigo-500 animate-spin"></div>
      <p className="text-gray-500 font-bold tracking-[0.3em] uppercase text-xs text-center">Loading Perfection</p>
    </div>
  );

  return (
    <div className="w-full py-32 relative overflow-hidden bg-[#0f0f11] select-none" id="projects">
      
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[800px] h-[600px] bg-indigo-500/5 blur-[160px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 mb-20 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/5 border border-indigo-500/10 mb-8">
          <Briefcase size={12} className="text-indigo-400" />
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.3em]">Portfolio</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white/70 to-white/10">
            PROJECTS
          </span>
        </h2>
        <div className="w-16 h-1.5 bg-indigo-500/20 rounded-full mt-4"></div>
      </div>

      {/* Navigation Controls (Desktop Only) */}
      <div className="hidden md:flex absolute top-1/2 left-0 right-0 -translate-y-1/2 justify-between px-12 pointer-events-none z-20">
        <button 
          onClick={() => scroll('left')}
          aria-label="Previous Project"
          className="p-5 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white hover:bg-indigo-500 transition-all active:scale-90 pointer-events-auto shadow-2xl group"
        >
          <ChevronLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <button 
          onClick={() => scroll('right')}
          aria-label="Next Project"
          className="p-5 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white hover:bg-indigo-500 transition-all active:scale-90 pointer-events-auto shadow-2xl group"
        >
          <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        style={{
          display: 'flex',
          overflowX: 'auto',
          gap: '32px',
          paddingBottom: '60px',
          paddingTop: '40px',
          paddingLeft: 'calc(50% - 180px)', 
          paddingRight: 'calc(50% - 180px)', 
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
        }}
        className="no-scrollbar project-carousel"
      >
        {projects.map((project, index) => {
          const isFocused = index === activeIndex;
          return (
            <div 
              key={project.id} 
              style={{ 
                minWidth: '360px', 
                maxWidth: '360px',
                scrollSnapAlign: 'center',
                background: isFocused ? '#18181b' : '#111113',
                border: `1px solid ${isFocused ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.04)'}`,
                borderRadius: '32px',
                padding: '40px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                transform: isFocused ? 'scale(1.05)' : 'scale(0.9)',
                opacity: isFocused ? 1 : 0.4,
                transition: 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                boxShadow: isFocused ? '0 40px 80px -20px rgba(99,102,241,0.2)' : 'none',
              }}
              className="group project-card"
            >
              <div className="space-y-8">
                {/* Coin Icon */}
                {/* Project Image / Icon */}
                <div className={`w-16 h-16 rounded-full flex items-center justify-center relative transition-all duration-500 ${isFocused ? 'bg-indigo-500 text-white rotate-[360deg]' : 'bg-white/5 text-gray-500'}`}>
                   <div className={`absolute inset-0 rounded-full blur-xl transition-opacity duration-500 ${isFocused ? 'bg-indigo-500/50 opacity-100' : 'opacity-0'}`}></div>
                   {project.image ? (
                     <img 
                       src={project.image} 
                       alt="" 
                       loading="lazy"
                       className="w-full h-full rounded-full object-cover relative z-10" 
                     />
                   ) : (
                     <Code size={28} className="relative z-10" />
                   )}
                </div>

                <div className="space-y-4">
                  <h3 className={`text-3xl font-black tracking-tighter transition-colors duration-500 ${isFocused ? 'text-white' : 'text-gray-500'}`}>
                    {project.title}
                  </h3>
                  <p className={`text-sm leading-relaxed font-medium transition-colors duration-500 ${isFocused ? 'text-gray-300' : 'text-gray-400'} line-clamp-3`}>
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-4">
                    {project.techStack?.split(',').map(tech => (
                      <span key={tech} className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border transition-all duration-500 ${isFocused ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-white/5 border-white/5 text-gray-600'}`}>
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className={`flex gap-4 mt-12 transition-all duration-500 ${isFocused ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`View ${project.title} source code on GitHub`}
                  className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-[11px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  <Code size={16} /> Source
                </a>
                {project.liveLink && (
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Visit ${project.title} live website`}
                    className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl bg-indigo-500 text-white text-[11px] font-black uppercase tracking-widest hover:bg-indigo-400 transition-all shadow-xl shadow-indigo-500/40"
                  >
                    <ExternalLink size={16} /> Preview
                  </a>
                )}
              </div>
            </div>
          );
        })}

        {projects.length === 0 && (
          <div className="w-full text-center py-20 text-gray-500 bg-[#1a1a1c] border border-white/5 rounded-[40px] mx-6 font-bold tracking-widest">
            NO PROJECTS DISCOVERED
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center gap-3 mt-8">
        {projects.map((_, i) => (
          <div 
            key={i} 
            className={`h-1 rounded-full transition-all duration-500 ${i === activeIndex ? 'w-12 bg-indigo-500' : 'w-2 bg-white/10'}`}
          />
        ))}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @media (max-width: 768px) {
          .project-carousel {
            padding-left: 7.5vw !important;
            padding-right: 7.5vw !important;
            gap: 16px !important;
          }
          .project-card {
            min-width: 85vw !important;
            max-width: 85vw !important;
            padding: 32px !important;
          }
          .project-card h3 {
            font-size: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Projects;
