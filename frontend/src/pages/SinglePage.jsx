import { useEffect, useRef, useState } from 'react';
import Home from './Home';
import Experience from './Experience';
import Skills from './Skills';
import Projects from './Projects';
import Blog from './Blog';
import Contact from './Contact';

const Reveal = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(domRef.current);
        }
      });
    }, { threshold: 0.1 });
    
    const current = domRef.current;
    if (current) observer.observe(current);
    return () => { if (current) observer.unobserve(current); };
  }, []);

  return (
    <div
      ref={domRef}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity 1.2s cubic-bezier(0.22, 1, 0.36, 1), transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
        willChange: 'opacity, transform'
      }}
    >
      {children}
    </div>
  );
};

/* ── thin divider between sections ─────────────────────────── */
const Divider = () => (
  <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
    <div style={{
      height: 1,
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)',
      margin: '0 0 80px',
    }} />
  </div>
);

const SinglePage = () => (
  <div style={{ scrollBehavior: 'smooth' }}>
    <section id="hero">
      <Reveal><Home /></Reveal>
    </section>

    <Divider />

    <section id="experience" style={{ scrollMarginTop: 72 }}>
      <Reveal><Experience /></Reveal>
    </section>

    <Divider />

    <section id="skills" style={{ scrollMarginTop: 72 }}>
      <Reveal><Skills /></Reveal>
    </section>

    <Divider />

    <section id="projects" style={{ scrollMarginTop: 72 }}>
      <Reveal><Projects /></Reveal>
    </section>

    <Divider />

    <section id="blog" style={{ scrollMarginTop: 72 }}>
      <Reveal><Blog /></Reveal>
    </section>

    <Divider />

    <section id="contact" style={{ scrollMarginTop: 72 }}>
      <Reveal><Contact /></Reveal>
    </section>

    <footer style={{
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '32px 24px',
      textAlign: 'center',
      color: 'rgba(255,255,255,0.2)',
      fontSize: 13,
    }}>
      © {new Date().getFullYear()} MANOJ BOGGAVARAPU · Built with passion
    </footer>
  </div>
);

export default SinglePage;
