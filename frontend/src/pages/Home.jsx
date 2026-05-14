import { useState, useEffect } from 'react';
import { Code, Briefcase, FileText, User, Target, Zap } from 'lucide-react';
import { profileService } from '../services/apiServices';
import { getImgUrl } from '../api/axiosInstance';

const Home = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

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
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'80vh', flexDirection:'column', gap:16 }}>
      <div style={{ width:40, height:40, borderRadius:'50%', border:'3px solid rgba(255,255,255,0.05)', borderTop:'3px solid #6366f1', animation:'spin 0.8s linear infinite' }} />
      <p style={{ color:'rgba(255,255,255,0.3)', fontSize:12, letterSpacing:'0.2em', textTransform:'uppercase' }}>Loading Profile...</p>
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  );

  if (error || !profile) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh', flexDirection:'column', gap:20 }}>
      <div style={{ background:'rgba(239,68,68,0.1)', padding:'12px 24px', borderRadius:16, border:'1px solid rgba(239,68,68,0.2)' }}>
        <p style={{ color:'#f87171', fontSize:14, margin:0 }}>Unable to connect to the backend server.</p>
      </div>
      <button onClick={() => window.location.reload()} style={{ padding:'12px 28px', borderRadius:99, cursor:'pointer', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#fff', fontSize:14, fontWeight:600, transition:'all 0.2s' }} onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'} onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'}>Retry Connection</button>
    </div>
  );

  return (
    <div style={{ color: '#fff', background: '#0f0f11' }}>
      
      {/* ── HERO SECTION ────────────────────────────────────────────── */}
      <section style={{ 
        maxWidth: 1200, margin: '0 auto', padding: '100px 24px 120px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 60, flexWrap: 'wrap-reverse', minHeight: '85vh'
      }}>
        
        {/* Left: Content */}
        <div style={{ flex: '1 1 500px' }}>
          <h1 style={{ 
            fontSize: 'clamp(3.5rem, 8vw, 6rem)', fontWeight: 900, 
            lineHeight: 0.9, letterSpacing: '-0.04em', margin: '0 0 28px',
            background: 'linear-gradient(135deg, #fff 0%, #a1a1aa 50%, #27272a 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            {profile.name}
          </h1>

          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:32 }}>
            <div style={{ height:2, width:40, background:'#6366f1', borderRadius:99 }} />
            <span style={{ fontSize:24, fontWeight:600, color:'rgba(255,255,255,0.7)', letterSpacing:'-0.02em' }}>{profile.title}</span>
          </div>

          <p style={{ 
            fontSize:20, lineHeight:1.6, color:'rgba(255,255,255,0.45)', 
            maxWidth:540, margin:'0 0 48px', fontWeight:400
          }}>
            {profile.bio}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {profile.githubLink && (
              <a href={profile.githubLink} target="_blank" rel="noreferrer" style={{ 
                display:'flex', alignItems:'center', gap:10, padding:'16px 32px', 
                borderRadius:16, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)',
                color:'#fff', fontSize:15, fontWeight:600, textDecoration:'none', transition:'all 0.3s'
              }} onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.2)';}} onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.08)';}}>
                <Code size={18} /> GitHub
              </a>
            )}
            {profile.linkedinLink && (
              <a href={profile.linkedinLink} target="_blank" rel="noreferrer" style={{ 
                display:'flex', alignItems:'center', gap:10, padding:'16px 32px', 
                borderRadius:16, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)',
                color:'#fff', fontSize:15, fontWeight:600, textDecoration:'none', transition:'all 0.3s'
              }} onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.2)';}} onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.08)';}}>
                <Briefcase size={18} /> LinkedIn
              </a>
            )}
            {profile.resumeLink && (
              <a href={profile.resumeLink} target="_blank" rel="noreferrer" style={{ 
                display:'flex', alignItems:'center', gap:10, padding:'16px 36px', 
                borderRadius:16, background:'#fff', color:'#000',
                fontSize:15, fontWeight:700, textDecoration:'none', transition:'all 0.3s'
              }} onMouseEnter={e=>e.currentTarget.style.background='#e2e8f0'} onMouseLeave={e=>e.currentTarget.style.background='#fff'}>
                <FileText size={18} /> Resume
              </a>
            )}
          </div>
        </div>

        {/* Right: Visual */}
        <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center', position: 'relative' }}>
          
          <div style={{ 
            position:'relative', zIndex:1, width:'min(400px, 85vw)', aspectRatio:'1/1.2',
            borderRadius:40, overflow:'hidden', background:'#18181c', border:'1px solid rgba(255,255,255,0.08)',
            boxShadow:'0 40px 80px -20px rgba(0,0,0,0.6)'
          }}>
            <img 
              src={getImgUrl(profile.profileImage || '/uploads/images/profile.jpg')} 
              alt={profile.name}
              style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top' }}
              onError={e=>{e.target.style.display='none';}}
            />
            
            {/* Minimal overlay info */}
            <div style={{ 
              position:'absolute', bottom:0, left:0, right:0, padding:'60px 32px 32px',
              background:'linear-gradient(to top, rgba(0,0,0,0.9), transparent)'
            }}>
              <p style={{ margin:0, fontSize:22, fontWeight:800, letterSpacing:'-0.02em' }}>{profile.name}</p>
              <p style={{ margin:0, fontSize:14, color:'rgba(255,255,255,0.5)', fontWeight:600 }}>{profile.title}</p>
            </div>
          </div>

        </div>
      </section>

      {/* ── ABOUT ME SECTION ─────────────────────────────────────────── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 140px' }} id="about">
        
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ 
            display:'inline-flex', alignItems:'center', gap:10, marginBottom:16,
            background:'rgba(99,102,241,0.05)', border:'1px solid rgba(99,102,241,0.1)',
            borderRadius:99, padding:'6px 16px'
          }}>
             <User size={14} color="#6366f1" />
             <span style={{ fontSize:11, fontWeight:700, letterSpacing:'0.2em', color:'#818cf8', textTransform:'uppercase' }}>Get to know me</span>
          </div>
          <h2 style={{ fontSize:'clamp(2.2rem, 5vw, 3.5rem)', fontWeight:800, margin:0, letterSpacing:'-0.03em' }}>About Me</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 450px), 1fr))', gap: 32 }}>
          
          {/* Bio / Story Card */}
          <div style={{ 
            background:'rgba(255,255,255,0.01)', border:'1px solid rgba(255,255,255,0.05)',
            borderRadius:32, padding:'40px 48px', display:'flex', flexDirection:'column', justifyContent:'center'
          }}>
            <div style={{ fontSize:18, lineHeight:1.8, color:'rgba(255,255,255,0.5)', whiteSpace:'pre-line', fontWeight:400 }}>
              {profile.aboutMe || profile.bio || "Updating my story..."}
            </div>
          </div>

          {/* Details Grid - Stats Card */}
          <div style={{ 
            background:'rgba(255,255,255,0.01)', border:'1px solid rgba(255,255,255,0.04)',
            borderRadius:32, padding:48, display:'flex', flexDirection:'column', justifyContent:'center', gap:40
          }}>
            
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:48, fontWeight:900, color:'#fff', marginBottom:4, letterSpacing:'-0.02em' }}>{profile.yearsOfExperience}+</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', fontWeight:800, letterSpacing:'0.2em' }}>Years of Experience</div>
            </div>

            <div style={{ height:1, background:'rgba(255,255,255,0.04)', width:'40%', margin:'0 auto' }} />

            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:48, fontWeight:900, color:'#fff', marginBottom:4, letterSpacing:'-0.02em' }}>{profile.completedProjects}+</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', fontWeight:800, letterSpacing:'0.2em' }}>Projects Completed</div>
            </div>

          </div>

        </div>

      </section>

    </div>
  );
};

export default Home;
