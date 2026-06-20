import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { blogService } from '../services/apiServices';
import { Calendar, X, ArrowRight, BookOpen, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

const Blog = () => {
  const { data: blogs = [], isLoading: loading } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const res = await blogService.getAll();
      return res?.data || [];
    },
  });
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, offsetWidth } = scrollRef.current;
      const isMobile = window.innerWidth <= 768;
      const cardWidth = isMobile ? (window.innerWidth * 0.85 + 24) : (400 + 32);
      const center = scrollLeft + offsetWidth / 2;
      const index = Math.round((center - offsetWidth / 2) / cardWidth);
      if (index !== activeIndex) setActiveIndex(index);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const isMobile = window.innerWidth <= 768;
      const cardWidth = isMobile ? (window.innerWidth * 0.85 + 24) : (400 + 32); 
      const { scrollLeft } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - cardWidth : scrollLeft + cardWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh', flexDirection:'column', gap:16 }}>
      <div style={{ width:40, height:40, borderRadius:'50%', border:'3px solid rgba(255,255,255,0.05)', borderTop:'3px solid #6366f1', animation:'spin 0.8s linear infinite' }} />
      <p style={{ color:'rgba(255,255,255,0.3)', fontSize:12, letterSpacing:'0.2em', textTransform:'uppercase' }}>Loading Articles...</p>
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ color: '#fff', background: '#0f0f11', padding: '100px 0', position: 'relative', overflow: 'hidden' }} id="blog">
      
      {/* ── HEADER ─────────────────────────────────────────── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 60px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ 
          display: 'inline-flex', alignItems: 'center', gap: 8, px: '12px', py: '6px', 
          background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.1)', 
          borderRadius: 99, padding: '6px 16px', marginBottom: 32
        }}>
           <BookOpen size={14} color="#6366f1" />
           <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.3em', color: '#818cf8', textTransform: 'uppercase' }}>Insights</span>
        </div>
        <h2 style={{
          fontSize: 'clamp(3rem, 7vw, 5.5rem)', 
          fontWeight: 950, 
          margin: '0 0 16px',
          background: 'linear-gradient(to bottom, #ffffff 0%, rgba(255,255,255,0.1) 100%)',
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.05em',
          textTransform: 'uppercase'
        }}>BLOGS</h2>
        <div style={{ width: 60, height: 4, background: 'rgba(99,102,241,0.2)', borderRadius: 99, marginTop: 16 }}></div>
      </div>

      {/* ── NAVIGATION CONTROLS (Desktop Only) ──────────────── */}
      <div className="carousel-nav hidden md:flex" style={{ 
        position: 'absolute', top: '60%', left: 0, right: 0, transform: 'translateY(-50%)',
        justifyContent: 'space-between', padding: '0 60px', pointerEvents: 'none', zIndex: 20
      }}>
        <button 
          onClick={() => scroll('left')} 
          aria-label="Previous Blog Post"
          style={{ p: 20, pointerEvents: 'auto', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '50%', width: 56, height: 56, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={() => scroll('right')} 
          aria-label="Next Blog Post"
          style={{ p: 20, pointerEvents: 'auto', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '50%', width: 56, height: 56, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* ── CAROUSEL ────────────────────────────────────────── */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="blog-carousel"
        style={{
          display: 'flex',
          overflowX: 'auto',
          gap: '32px',
          paddingBottom: '80px',
          paddingTop: '40px',
          paddingLeft: 'calc(50% - 200px)', 
          paddingRight: 'calc(50% - 200px)', 
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        <style>{`
          .blog-carousel::-webkit-scrollbar { display: none; }
          @media (max-width: 768px) {
            .blog-carousel { padding-left: 7.5vw !important; padding-right: 7.5vw !important; gap: 16px !important; }
            .blog-card { min-width: 85vw !important; max-width: 85vw !important; padding: 32px !important; }
          }
        `}</style>

        {[...blogs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((blog, index) => {
          const isFocused = index === activeIndex;
          return (
            <article 
              key={blog.id} 
              onClick={() => setSelectedBlog(blog)}
              className="blog-card"
              style={{
                minWidth: '400px', 
                maxWidth: '400px',
                scrollSnapAlign: 'center',
                background: isFocused ? '#18181b' : '#111113',
                border: `1px solid ${isFocused ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.04)'}`,
                borderRadius: '32px',
                padding: '44px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                transform: isFocused ? 'scale(1.05)' : 'scale(0.9)',
                opacity: isFocused ? 1 : 0.4,
                transition: 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                boxShadow: isFocused ? '0 40px 80px -20px rgba(99,102,241,0.2)' : 'none',
                cursor: 'pointer'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                   <div style={{ 
                     width: 44, height: 44, borderRadius: '50%', 
                     background: isFocused ? '#6366f1' : 'rgba(255,255,255,0.05)',
                     display: 'flex', alignItems: 'center', justifyContent: 'center',
                     fontSize: 14, fontWeight: 800, color: '#fff', transition: 'all 0.4s'
                   }}>M</div>
                   <div>
                      <div style={{ margin: 0, color: isFocused ? '#fff' : 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Manoj Kumar</div>
                      <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'Recent'}</p>
                    </div>
                </div>

                <h3 style={{ 
                  fontSize: 26, fontWeight: 900, color: isFocused ? '#fff' : 'rgba(255,255,255,0.7)', 
                  margin: '0 0 16px', lineHeight: 1.2, letterSpacing: '-0.02em',
                  transition: 'all 0.4s'
                }}>{blog.title}</h3>
                
                <p style={{ 
                  fontSize: 15, lineHeight: 1.7, 
                  color: isFocused ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.6)', 
                  margin: 0, display: '-webkit-box', WebkitLineClamp: 4, 
                  WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  transition: 'all 0.4s'
                }}>
                  {blog.content}
                </p>
              </div>

              <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {blog.externalLink && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); window.open(blog.externalLink, '_blank', 'noopener,noreferrer'); }}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                      color: '#fff', border: 'none',
                      padding: '14px 20px', borderRadius: 16, fontSize: 12, fontWeight: 800, textTransform: 'uppercase',
                      letterSpacing: '0.15em', cursor: 'pointer', transition: 'all 0.4s',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      boxShadow: '0 10px 20px -10px rgba(99,102,241,0.5)'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 25px -10px rgba(99,102,241,0.6)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 20px -10px rgba(99,102,241,0.5)'; }}
                  >
                    Navigate to link <ExternalLink size={16} />
                  </button>
                )}
                <div style={{ 
                  display: 'flex', alignItems: 'center', gap: 8, 
                  color: isFocused ? '#818cf8' : 'rgba(255,255,255,0.4)', 
                  fontSize: 11, fontWeight: 800, textTransform: 'uppercase', 
                  letterSpacing: '0.1em', transition: 'all 0.4s',
                  justifyContent: blog.externalLink ? 'center' : 'flex-start'
                }}>
                  {blog.externalLink ? 'Or Read Insight Internally' : 'Read Insight'} <ArrowRight size={14} />
                </div>
              </div>
            </article>
          );
        })}

        {blogs.length === 0 && (
          <div style={{ minWidth: '100%', textAlign: 'center', py: 40, color: 'rgba(255,255,255,0.2)', fontWeight: 800, letterSpacing: '0.2em' }}>
            NO ARTICLES PUBLISHED
          </div>
        )}
      </div>

      {/* ── PROGRESS INDICATOR ───────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
        {blogs.map((_, i) => (
          <div 
            key={i} 
            style={{ 
              height: 4, borderRadius: 99, transition: 'all 0.5s ease',
              width: i === activeIndex ? 40 : 8,
              background: i === activeIndex ? '#6366f1' : 'rgba(255,255,255,0.1)'
            }}
          />
        ))}
      </div>

      {/* ── MODAL POPUP (Same logic, refined look) ─────────────── */}
      {selectedBlog && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, padding: 20
        }} onClick={() => setSelectedBlog(null)}>
          <div style={{
            background: '#0f0f11', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 40, width: '100%', maxWidth: 800, maxHeight: '90vh',
            overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column',
            boxShadow: '0 50px 100px rgba(0,0,0,0.8)', animation: 'modalIn 0.5s cubic-bezier(0.22, 1, 0.36, 1)'
          }} onClick={e => e.stopPropagation()}>
            <style>{`
              @keyframes modalIn { from { opacity: 0; transform: translateY(40px) scale(0.9); } to { opacity: 1; transform: translateY(0) scale(1); } }
            `}</style>
            
            <button 
              onClick={() => setSelectedBlog(null)}
              style={{ position: 'absolute', top: 32, right: 32, background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', borderRadius: '50%', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, transition: 'all 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            ><X size={24} /></button>

            <div style={{ padding: '80px 60px 40px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40 }}>
                <div style={{ 
                  width: 60, height: 60, borderRadius: '50%', 
                  background: '#6366f1',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, fontWeight: 900, color: '#fff'
                }}>M</div>
                <div>
                  <h4 style={{ margin: 0, color: '#fff', fontSize: 18, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Manoj Kumar</h4>
                  <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: 600 }}>
                    Published {new Date(selectedBlog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>

              <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 950, color: '#fff', marginBottom: 32, lineHeight: 1.1, letterSpacing: '-0.04em' }}>{selectedBlog.title}</h2>
              
              <div style={{ fontSize: 19, lineHeight: 1.8, color: 'rgba(255,255,255,0.7)', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontWeight: 400 }}>
                {selectedBlog.content}
              </div>
            </div>

            <div style={{ padding: '40px 60px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {selectedBlog.externalLink ? (
                <button 
                  onClick={() => window.open(selectedBlog.externalLink, '_blank', 'noopener,noreferrer')} 
                  style={{ 
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: '#fff', border: 'none', 
                    padding: '16px 32px', borderRadius: 99, fontWeight: 900, fontSize: 13, textTransform: 'uppercase', 
                    letterSpacing: '0.15em', cursor: 'pointer', transition: 'all 0.4s',
                    display: 'flex', alignItems: 'center', gap: 10,
                    boxShadow: '0 10px 20px -10px rgba(99,102,241,0.5)'
                  }} 
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 25px -10px rgba(99,102,241,0.6)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 20px -10px rgba(99,102,241,0.5)'; }}
                >
                  Navigate to link <ExternalLink size={18} />
                </button>
              ) : <div />}
              <button onClick={() => setSelectedBlog(null)} style={{ background: '#fff', color: '#000', border: 'none', padding: '16px 40px', borderRadius: 99, fontWeight: 900, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.15em', cursor: 'pointer', transition: 'all 0.4s' }} onMouseEnter={e => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'translateY(0)'; }}>Close Reading</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
