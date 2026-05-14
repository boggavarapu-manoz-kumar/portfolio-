import { useState, useEffect } from 'react';
import { blogService } from '../services/apiServices';
import { Calendar, X, ArrowRight } from 'lucide-react';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    blogService.getAll()
      .then(res => setBlogs(res?.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: '100vw', margin: '0 auto', padding: '0 0 80px', overflowX: 'hidden' }}>
      <div style={{ textAlign: 'center', marginBottom: 64, padding: '0 24px' }}>
        <p style={{ 
          fontSize: 13, 
          fontWeight: 600, 
          letterSpacing: '0.4em',
          color: '#888', 
          textTransform: 'uppercase', 
          marginBottom: 16 
        }}>
          STORY & INSIGHTS
        </p>
        <h2 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
          fontWeight: 900, 
          margin: 0,
          background: 'linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.4) 100%)',
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.02em'
        }}>My Blogs</h2>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '60px 0' }}>
          Loading articles...
        </div>
      )}

      {/* Horizontal Carousel */}
      <div style={{ 
        display: 'flex', 
        gap: 24, 
        padding: '20px 40px 40px', 
        overflowX: 'auto',
        scrollSnapType: 'x mandatory',
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none' // IE/Edge
      }} className="hide-scrollbar">
        <style>{`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .blog-card:hover { transform: translateY(-10px) !important; border-color: rgba(255,255,255,0.2) !important; background: #222 !important; }
        `}</style>

        {blogs.map(blog => (
          <article 
            key={blog.id} 
            onClick={() => setSelectedBlog(blog)}
            className="blog-card"
            style={{
              flex: '0 0 400px',
              maxWidth: '85vw',
              background: '#1a1a1c',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 32, 
              padding: '40px', 
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
              scrollSnapAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ 
                width: 44, height: 44, borderRadius: '50%', 
                background: 'linear-gradient(135deg, #333, #111)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 700, color: '#fff', border: '1px solid rgba(255,255,255,0.1)'
              }}>M</div>
              <div>
                <h4 style={{ margin: 0, color: '#fff', fontSize: 14, fontWeight: 700 }}>MANOJ BOGGAVARAPU</h4>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2, display: 'flex', gap: 8 }}>
                  <Calendar size={12} />
                  <span>{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}</span>
                </div>
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: '0 0 12px', lineHeight: 1.3 }}>{blog.title}</h3>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,0.5)', margin: 0, display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {blog.content}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#4dabf7', fontSize: 14, fontWeight: 700 }}>
              Read Post <ArrowRight size={16} />
            </div>
          </article>
        ))}
        
        {blogs.length === 0 && !loading && (
          <div style={{ minWidth: '100%', textAlign: 'center', padding: '100px 0', color: 'rgba(255,255,255,0.2)' }}>
            No blog posts yet.
          </div>
        )}
      </div>

      {/* Blog Modal Popup */}
      {selectedBlog && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, padding: 20
        }} onClick={() => setSelectedBlog(null)}>
          <div style={{
            background: '#1a1a1c', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 32, width: '100%', maxWidth: 800, maxHeight: '90vh',
            overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column',
            boxShadow: '0 30px 60px rgba(0,0,0,0.5)', animation: 'modalIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
          }} onClick={e => e.stopPropagation()}>
            <style>{`
              @keyframes modalIn { from { opacity: 0; transform: translateY(30px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
            `}</style>
            
            <button 
              onClick={() => setSelectedBlog(null)}
              style={{ position: 'absolute', top: 24, right: 24, background: '#333', border: 'none', color: '#fff', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}
            ><X size={20} /></button>

            <div style={{ padding: '60px 60px 40px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
                <div style={{ 
                  width: 56, height: 56, borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #444, #000)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, fontWeight: 700, color: '#fff', border: '2px solid rgba(255,255,255,0.1)'
                }}>M</div>
                <div>
                  <h4 style={{ margin: 0, color: '#fff', fontSize: 18, fontWeight: 700 }}>MANOJ BOGGAVARAPU</h4>
                  <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
                    Published on {new Date(selectedBlog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>

              <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, color: '#fff', marginBottom: 24, lineHeight: 1.2 }}>{selectedBlog.title}</h2>
              
              <div style={{ fontSize: 18, lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {selectedBlog.content}
              </div>
            </div>

            <div style={{ padding: '30px 60px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setSelectedBlog(null)} style={{ background: '#fff', color: '#000', border: 'none', padding: '12px 32px', borderRadius: 16, fontWeight: 700, cursor: 'pointer' }}>Close Reading</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
