import { useState, useEffect } from 'react';
import { Code, ExternalLink } from 'lucide-react';
import { projectsService } from '../services/apiServices';
import { getImgUrl } from '../api/axiosInstance';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectsService.getAll()
      .then(res => {
        setProjects(res.data?.data || res.data || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-32 animate-pulse text-gray-500 tracking-widest">LOADING PROJECTS...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center space-y-4 mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-white">Projects</h2>
        <p className="text-gray-400 max-w-2xl mx-auto pt-4 leading-relaxed">
          A mix of full-stack web apps and mobile experiences, focused on clean UX, performance and real-world use cases.
        </p>
      </div>

      <div 
        style={{
          display: 'flex',
          overflowX: 'auto',
          gap: '32px',
          paddingBottom: '40px',
          paddingLeft: '4px',
          paddingRight: '4px',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.1) transparent'
        }}
        className="custom-scrollbar"
      >
        {projects.map(project => (
          <div 
            key={project.id} 
            style={{ 
              minWidth: 'min(400px, 85vw)', 
              scrollSnapAlign: 'start',
              background: '#1a1a1c',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '32px',
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.3s ease'
            }}
            className="hover:bg-[#1f1f22] hover:border-gray-700 group"
          >
            <div className="space-y-6">
              <div style={{ height: '220px', width: '100%', background: '#09090b', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                <img
                  src={getImgUrl(project.image || "/uploads/images/default_project.jpg")}
                  alt={project.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  className="group-hover:scale-105 transition-transform duration-500"
                  onError={e => { e.target.style.display = 'none'; }}
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">{project.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm line-clamp-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.techStack?.split(',').map(tech => (
                    <span key={tech} className="text-[10px] font-black uppercase tracking-widest bg-white/5 text-gray-500 px-3 py-1 rounded-full border border-white/5">
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-10">
              <a
                href={project.githubLink}
                target="_blank"
                rel="noreferrer"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '12px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}
                className="hover:bg-white/5 transition-all"
              >
                <Code size={16} /> Code
              </a>
              {project.liveLink && (
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noreferrer"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '12px', borderRadius: '14px', background: '#fff', color: '#000', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}
                  className="hover:bg-gray-200 transition-all"
                >
                  <ExternalLink size={16} /> Live
                </a>
              )}
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="w-full text-center py-20 text-gray-500 bg-[#1a1a1c] border border-gray-800 rounded-3xl">
            No projects added yet. Admin can add them from the dashboard.
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.1);
        }
      `}</style>
    </div>
  );
};

export default Projects;
