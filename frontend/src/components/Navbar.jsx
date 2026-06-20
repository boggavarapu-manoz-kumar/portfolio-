import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'About',      id: 'hero'       },
  { label: 'Experience', id: 'experience' },
  { label: 'Projects',   id: 'projects'   },
  { label: 'Skills',     id: 'skills'     },
  { label: 'Blog',       id: 'blog'       },
  { label: 'Contact',    id: 'contact'    },
];

const Navbar = () => {
  const [active, setActive] = useState('hero');
  const [hovered, setHovered] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  // For sliding indicator
  const [indicatorStyle, setIndicatorStyle] = useState({ opacity: 0, left: 0, width: 0 });
  const navRefs = useRef({});

  // Robust scroll spy
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      
      if (!isHome) return;

      const scrollPosition = window.scrollY + window.innerHeight / 3;
      let currentActive = 'hero';
      
      for (const link of NAV_LINKS) {
        const el = document.getElementById(link.id);
        if (el && el.offsetTop <= scrollPosition) {
          currentActive = link.id;
        }
      }
      
      // Fallback for very top
      if (window.scrollY < 100) {
        currentActive = 'hero';
      }
      
      setActive(currentActive);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Run once to initialize
    setTimeout(onScroll, 100);
    
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  // Update sliding indicator position based on hover or active
  useEffect(() => {
    const targetId = hovered || active;
    const activeEl = navRefs.current[targetId];
    if (activeEl) {
      setIndicatorStyle({
        opacity: 1,
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
      });
    } else {
      setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
    }
  }, [active, hovered, isHome]);

  const scrollTo = (e, id) => {
    e.preventDefault();
    setIsOpen(false);
    setActive(id);
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: scrolled ? 'rgba(15,15,17,0.95)' : 'rgba(15,15,17,0.7)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        transition: 'all 0.3s ease',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '0 24px',
          height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <Link to="/" style={{
            fontSize: 22, fontWeight: 950, letterSpacing: '0.4em',
            textDecoration: 'none', textTransform: 'uppercase',
            display: 'flex', alignItems: 'center',
            background: 'linear-gradient(135deg, #fff 0%, #71717a 50%, #09090b 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 2px 4px rgba(99,102,241,0.2))'
          }}>
            BMK
          </Link>

          {/* Desktop Navigation */}
          <div 
            className="hidden md:flex" 
            style={{ position: 'relative', alignItems: 'center', gap: 4 }}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Sliding Background Indicator */}
            <div 
              style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                height: '34px',
                marginTop: '-17px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '99px',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: `translateX(${indicatorStyle.left}px)`,
                width: `${indicatorStyle.width}px`,
                opacity: indicatorStyle.opacity,
                pointerEvents: 'none',
                zIndex: 0
              }}
            />

            {NAV_LINKS.map(({ label, id }) => {
              const isActive = isHome && active === id;
              return (
                <a
                  key={id}
                  ref={el => navRefs.current[id] = el}
                  href={`#${id}`}
                  onClick={isHome ? (e) => scrollTo(e, id) : undefined}
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    padding: '8px 18px', borderRadius: 99,
                    fontSize: 11, fontWeight: 800,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    textDecoration: 'none', transition: 'color 0.3s ease',
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                  }}
                  onMouseEnter={(e) => {
                    setHovered(id);
                    if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.9)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                  }}
                >
                  {label}
                </a>
              );
            })}
          </div>

          {/* Mobile Toggle Button (Three Lines) */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '10px',
              color: '#fff',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div 
          style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            background: '#0f0f11',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            padding: isOpen ? '24px' : '0 24px',
            maxHeight: isOpen ? '400px' : '0',
            opacity: isOpen ? 1 : 0,
            overflow: 'hidden',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 99,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          {NAV_LINKS.map(({ label, id }) => {
            const isActive = isHome && active === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                onClick={isHome ? (e) => scrollTo(e, id) : undefined}
                style={{
                  padding: '16px 20px', borderRadius: '16px',
                  fontSize: 14, fontWeight: 700,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  textDecoration: 'none', transition: 'all 0.3s ease',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.85)',
                  background: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(255,255,255,0.1)' : 'transparent'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                {label}
                {isActive && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1' }} />}
              </a>
            );
          })}
        </div>
      </nav>
      
      {/* Click outside to close mobile menu */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'transparent' }}
        />
      )}
    </>
  );
};

export default Navbar;
