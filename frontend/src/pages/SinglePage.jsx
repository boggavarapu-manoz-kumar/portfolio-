import Home from './Home';
import Skills from './Skills';
import Projects from './Projects';
import Blog from './Blog';
import Contact from './Contact';

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
  <div>
    <section id="hero">
      <Home />
    </section>

    <Divider />

    <section id="skills" style={{ scrollMarginTop: 72 }}>
      <Skills />
    </section>

    <Divider />

    <section id="projects" style={{ scrollMarginTop: 72 }}>
      <Projects />
    </section>

    <Divider />

    <section id="blog" style={{ scrollMarginTop: 72 }}>
      <Blog />
    </section>

    <Divider />

    <section id="contact" style={{ scrollMarginTop: 72 }}>
      <Contact />
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
