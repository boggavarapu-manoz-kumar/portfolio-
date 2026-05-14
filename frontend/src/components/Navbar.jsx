import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Terminal } from 'lucide-react';

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
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: scrolled ? 'rgba(15,15,17,0.95)' : 'rgba(15,15,17,0.7)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      transition: 'background 0.3s ease',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '0 24px',
        height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link to="/" style={{
          fontSize: 20, fontWeight: 900, letterSpacing: '0.4em',
          textDecoration: 'none', textTransform: 'uppercase',
          display: 'flex', alignItems: 'center',
          background: 'linear-gradient(135deg, #fff 0%, #71717a 50%, #09090b 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 2px 4px rgba(99,102,241,0.2))'
        }}>
          BMK
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {NAV_LINKS.map(({ label, id }) => {
            const isActive = isHome && active === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                onClick={isHome ? (e) => scrollTo(e, id) : undefined}
                style={{
                  padding: '7px 14px', borderRadius: 99,
                  fontSize: 12, fontWeight: 700,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  textDecoration: 'none', transition: 'all 0.2s ease',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.45)',
                  background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(255,255,255,0.15)' : 'transparent'}`,
                }}
              >
                {label}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
