import { useState, useEffect } from 'react';
import { skillsService } from '../services/apiServices';

const getDevIconUrl = (name) => {
  const iconMap = {
    'html': 'html5',
    'css': 'css3',
    'javascript': 'javascript',
    'js': 'javascript',
    'react': 'react',
    'nextjs': 'nextjs',
    'next.js': 'nextjs',
    'node.js': 'nodejs',
    'nodejs': 'nodejs',
    'mongodb': 'mongodb',
    'mysql': 'mysql',
    'postgresql': 'postgresql',
    'postgres': 'postgresql',
    'java': 'java',
    'springboot': 'spring',
    'spring boot': 'spring',
    'php': 'php',
    'jquery': 'jquery',
    'python': 'python',
    'git': 'git',
    'docker': 'docker',
    'tailwind': 'tailwindcss',
    'typescript': 'typescript',
    'ts': 'typescript',
    'express': 'express',
    'redux': 'redux',
    'firebase': 'firebase',
    'sass': 'sass',
    'figma': 'figma'
  };

  const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const iconName = iconMap[name.toLowerCase().trim()] || cleanName;
  
  return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${iconName}/${iconName}-original.svg`;
};

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    skillsService.getAll()
      .then(res => {
        setSkills(res.data?.data || res.data || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-32 animate-pulse text-gray-500 tracking-widest">LOADING SKILLS...</div>;

  // Group skills by their category
  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || 'OTHER SKILLS';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {});

  // For the exact UI order from screenshot
  const categories = ["WEB BASICS", "BACKEND & DATABASE", "MODERN WEB", "PROGRAMMING LANGUAGES"];

  // Add any other categories that might exist in DB but not in our explicit array
  Object.keys(groupedSkills).forEach(cat => {
    if (!categories.includes(cat)) categories.push(cat);
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center space-y-4 mb-16">
        <p className="text-sm font-semibold tracking-[0.2em] text-gray-400">TECHNICAL EXPERTISE</p>
        <h2 className="text-4xl md:text-5xl font-bold text-white">Skills</h2>
        <p className="text-gray-400 max-w-2xl mx-auto pt-4 leading-relaxed">
          Technologies and tools I use to build modern, scalable applications.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {categories.map(category => {
          const categorySkills = groupedSkills[category];
          if (!categorySkills || categorySkills.length === 0) return null;
          
          return (
            <div key={category} className="bg-[#1a1a1c] border border-gray-800 rounded-3xl p-6 sm:p-10 hover:bg-[#1f1f22] transition-all hover:border-gray-700 flex flex-col h-full shadow-xl shadow-black/20">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-bold text-gray-500 tracking-[0.2em] uppercase">{category}</h3>
                <div className="h-[1px] flex-1 bg-gray-800/50 ml-6"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categorySkills.map(skill => (
                  <div key={skill.id} className="flex items-center gap-4 bg-[#141416] border border-gray-800/50 p-4 rounded-2xl hover:bg-[#1a1a1c] transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-gray-900/80 flex items-center justify-center p-2.5 relative overflow-hidden border border-gray-800 group-hover:border-blue-500/50 transition-colors">
                      <img 
                        src={skill.logo || getDevIconUrl(skill.name)} 
                        alt={skill.name} 
                        className="w-full h-full object-contain relative z-10 transition-transform group-hover:scale-110" 
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="absolute inset-0 items-center justify-center text-sm font-bold text-gray-500 hidden bg-gray-800">
                        {skill.name.substring(0, 1).toUpperCase()}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white font-semibold text-base group-hover:text-blue-400 transition-colors">{skill.name}</span>
                      {skill.level && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mt-0.5">
                          {skill.level}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {skills.length === 0 && (
          <div className="col-span-full text-center py-24 text-gray-500 bg-[#1a1a1c] border border-gray-800 rounded-3xl">
            No technical skills found. Add them in the admin panel.
          </div>
        )}
      </div>
    </div>
  );
};

export default Skills;
