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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map(project => (
          <div key={project.id} className="bg-[#1a1a1c] border border-gray-800 rounded-3xl p-6 sm:p-10 hover:bg-[#1f1f22] transition-all hover:border-gray-700 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="h-48 w-full bg-gray-900 rounded-2xl overflow-hidden mb-6 border border-gray-800/50">
                <img 
                  src={getImgUrl(project.image || "/uploads/images/default_project.jpg")} 
                  alt={project.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  onError={(e) => e.target.src = "https://via.placeholder.com/400x300?text=Project+Image"}
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">{project.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base line-clamp-4">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {project.techStack?.split(',').map(tech => (
                  <span key={tech} className="text-[10px] font-bold uppercase tracking-wider bg-gray-800/50 text-gray-400 px-2 py-1 rounded">
                    {tech.trim()}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-8">
              <a 
                href={project.githubLink} 
                target="_blank" 
                rel="noreferrer" 
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-700 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-all"
              >
                <Code size={16} /> Code
              </a>
              {project.liveLink && (
                <a 
                  href={project.liveLink} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black text-sm font-bold hover:bg-gray-200 transition-all shadow-lg shadow-white/5"
                >
                  <ExternalLink size={16} /> Live
                </a>
              )}
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="col-span-full text-center py-20 text-gray-500 bg-[#1a1a1c] border border-gray-800 rounded-3xl">
            No projects added yet. Admin can add them from the dashboard.
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
