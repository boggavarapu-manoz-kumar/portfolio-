import { useState, useEffect } from 'react';
import { Code, Briefcase, FileText, User, Target, Zap } from 'lucide-react';
import { profileService } from '../services/apiServices';
import { getImgUrl } from '../api/axiosInstance';

const Home = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    profileService.get()
      .then(res => {
        // axios interceptor unwraps → res = { success, data: {...profile} }
        const p = res?.data || res;
        if (p && p.name) setProfile(p);
        else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.05)', borderTop: '3px solid #6366f1', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Loading Profile...</p>
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  );

  if (error || !profile) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: 20 }}>
      <div style={{ background: 'rgba(239,68,68,0.1)', padding: '12px 24px', borderRadius: 16, border: '1px solid rgba(239,68,68,0.2)' }}>
        <p style={{ color: '#f87171', fontSize: 14, margin: 0 }}>Unable to connect to the backend server.</p>
      </div>
      <button onClick={() => window.location.reload()} style={{ padding: '12px 28px', borderRadius: 99, cursor: 'pointer', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 14, fontWeight: 600, transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>Retry Connection</button>
    </div>
  );

  return (
    <div style={{ color: '#fff', background: '#0f0f11' }} className="home-container">
      <style>{`
        .hero-section {
          maxWidth: 1200px;
          margin: 0 auto;
          padding: 80px 120px 100px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 80vh;
        }
        .hero-content {
          flex: 1 1 500px;
          text-align: left;
        }
        .hero-visual {
          flex: 0 1 420px;
          display: flex;
          justify-content: center;
          position: relative;
        }
        @media (max-width: 992px) {
          .hero-section {
            flex-direction: column;
            text-align: center;
            gap: 32px;
          }
          .hero-content {
            order: 2;
            flex: 1 1 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .hero-visual {
            order: 1;
            flex: 1 1 auto;
          }
        }
        .hero-name {
          font-size: clamp(3rem, 7vw, 5.5rem);
          font-weight: 950;
          line-height: 0.85;
          letter-spacing: -0.05em;
          margin: 0 0 28px;
          background: linear-gradient(135deg, #fff 0%, #a1a1aa 50%, #27272a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-align: left;
        }
        .hero-title-container {
          justify-content: flex-start !important;
        }
        .hero-buttons {
          justify-content: flex-start !important;
        }
        .hero-image-container {
          width: 100% !important;
          max-width: 420px !important;
          border: 2px solid rgba(255,255,255,0.08) !important;
          box-shadow: 0 40px 80px -20px rgba(0,0,0,0.5) !important;
          transition: transform 0.5s ease;
        }
        .hero-image-container:hover {
          transform: translateY(-8px) rotate(0.5deg);
        }
        @media (max-width: 1100px) {
          .hero-section {
            gap: 8px;
          }
        }
        @media (max-width: 768px) {
          .hero-section {
            padding: 40px 24px 60px;
            gap: 8px;
            text-align: center;
          }
          .hero-content {
            flex: 1 1 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .hero-name {
            font-size: 3rem;
            text-align: center;
          }
          .hero-title-container {
            justify-content: center !important;
            margin-bottom: 24px !important;
          }
          .hero-title-container span {
            font-size: 15px !important;
            font-weight: 700 !important;
            letter-spacing: 0.05em !important;
            text-transform: uppercase !important;
          }
          .hero-buttons {
            justify-content: center !important;
          }
          .hero-image-container {
            width: min(300px, 85vw) !important;
          }
          .hero-image-overlay {
            display: none !important;
          }
        }
      `}</style>

      {/* ── HERO SECTION ────────────────────────────────────────────── */}
      <section className="hero-section" id="hero">

        {/* Left: Content */}
        <div className="hero-content">
          <h1 className="hero-name">
            {profile.name.split(' ').map((part, i) => (
              <span key={i} style={{ display: 'block' }}>{part}</span>
            ))}
          </h1>

          <div className="hero-title-container" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <div style={{ height: 2, width: 40, background: '#6366f1', borderRadius: 99 }} />
            <span style={{ fontSize: 24, fontWeight: 600, color: 'rgba(255,255,255,0.7)', letterSpacing: '-0.02em' }}>{profile.title}</span>
          </div>

          <p style={{
            fontSize: 20, lineHeight: 1.6, color: 'rgba(255,255,255,0.85)',
            maxWidth: 540, margin: '0 0 48px', fontWeight: 400
          }}>
            {profile.bio}
          </p>

          <div className="hero-buttons" style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {profile.githubLink && (
              <a href={profile.githubLink} target="_blank" rel="noreferrer" aria-label="GitHub Profile" style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '16px 32px',
                borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                color: '#fff', fontSize: 15, fontWeight: 600, textDecoration: 'none', transition: 'all 0.3s'
              }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
                <Code size={18} /> GitHub
              </a>
            )}
            {profile.linkedinLink && (
              <a href={profile.linkedinLink} target="_blank" rel="noreferrer" aria-label="LinkedIn Profile" style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '16px 32px',
                borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                color: '#fff', fontSize: 15, fontWeight: 600, textDecoration: 'none', transition: 'all 0.3s'
              }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
                <Briefcase size={18} /> LinkedIn
              </a>
            )}
            {profile.resumeLink && (
              <a href={profile.resumeLink} target="_blank" rel="noreferrer" style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '16px 36px',
                borderRadius: 16, background: '#fff', color: '#000',
                fontSize: 15, fontWeight: 700, textDecoration: 'none', transition: 'all 0.3s'
              }} onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                <FileText size={18} /> Resume
              </a>
            )}
          </div>
        </div>

        {/* Right: Visual */}
        <div className="hero-visual">

          <div className="hero-image-container" style={{
            position: 'relative', zIndex: 1, width: 'min(400px, 85vw)', aspectRatio: '1/1.2',
            borderRadius: 40, overflow: 'hidden', background: '#18181c', border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 40px 80px -20px rgba(0,0,0,0.6)'
          }}>
            <img
              src={profile.profileImage?.includes('cloudinary.com') 
                ? profile.profileImage.replace(/\/upload\/(v\d+\/)?/, '/upload/f_auto,q_auto,w_800/$1') 
                : getImgUrl(profile.profileImage || '/uploads/images/profile.jpg')}
              alt={profile.name}
              fetchpriority="high"
              width="400"
              height="480"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
              onError={e => { e.target.style.display = 'none'; }}
            />

            {/* Minimal overlay info */}
            <div className="hero-image-overlay" style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, padding: '60px 32px 32px',
              background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)'
            }}>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>{profile.name}</p>
              <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>{profile.title}</p>
            </div>
          </div>

        </div>
      </section>

      {/* ── ABOUT ME SECTION ─────────────────────────────────────────── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 140px' }} id="about">

        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 16,
            background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.1)',
            borderRadius: 99, padding: '6px 16px'
          }}>
            <User size={14} color="#6366f1" />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', color: '#818cf8', textTransform: 'uppercase' }}>Get to know me</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 800, margin: 0, letterSpacing: '-0.03em' }}>About Me</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 450px), 1fr))', gap: 32 }}>

          {/* Bio / Story Card */}
          <div style={{
            background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: 32, padding: '40px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center'
          }}>
            <div style={{ fontSize: 18, lineHeight: 1.8, color: 'rgba(255,255,255,0.85)', whiteSpace: 'pre-line', fontWeight: 400 }}>
              {profile.aboutMe || profile.bio || "Updating my story..."}
            </div>
          </div>

          {/* Details Grid - Stats Card */}
          <div style={{
            background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)',
            borderRadius: 32, padding: 48, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 40
          }}>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, fontWeight: 900, color: '#fff', marginBottom: 4, letterSpacing: '-0.02em' }}>{profile.yearsOfExperience}+</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.2em' }}>Years of Experience</div>
            </div>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.04)', width: '40%', margin: '0 auto' }} />

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, fontWeight: 900, color: '#fff', marginBottom: 4, letterSpacing: '-0.02em' }}>{profile.completedProjects}+</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.2em' }}>Projects Completed</div>
            </div>

          </div>

        </div>

      </section>

    </div>
  );
};

export default Home;
