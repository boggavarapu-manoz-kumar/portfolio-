import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'About',    id: 'hero'     },
  { label: 'Skills',   id: 'skills'   },
  { label: 'Projects', id: 'projects' },
  { label: 'Blog',     id: 'blog'     },
  { label: 'Contact',  id: 'contact'  },
];

const Navbar = () => {
  const [active,   setActive]   = useState('hero');
  const [scrolled, setScrolled] = useState(false);
  const [isOpen,   setIsOpen]   = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isHome) return;
    const observers = NAV_LINKS.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: '-40% 0px -55% 0px' }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach(o => o?.disconnect());
  }, [isHome]);

  const scrollTo = (e, id) => {
    e.preventDefault();
    setIsOpen(false);
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
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: 4 }}>
            {NAV_LINKS.map(({ label, id }) => {
              const isActive = isHome && active === id;
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={isHome ? (e) => scrollTo(e, id) : undefined}
                  style={{
                    padding: '8px 18px', borderRadius: 99,
                    fontSize: 11, fontWeight: 800,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    textDecoration: 'none', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.85)',
                    background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                    border: `1px solid ${isActive ? 'rgba(255,255,255,0.1)' : 'transparent'}`,
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
