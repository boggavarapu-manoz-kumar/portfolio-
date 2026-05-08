import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, Briefcase, FileText, Code, Plus, Trash2, Edit2 } from 'lucide-react';
import { projectsService, skillsService, profileService, uploadService } from '../services/apiServices';
import PhotoEditor from '../components/PhotoEditor';
import { getImgUrl } from '../api/axiosInstance';

const getDevIconUrl = (name) => {
  if (!name) return '';
  const iconMap = {
    'html': 'html5', 'css': 'css3', 'javascript': 'javascript', 'js': 'javascript',
    'react': 'react', 'nextjs': 'nextjs', 'next.js': 'nextjs', 'node.js': 'nodejs', 'nodejs': 'nodejs',
    'mongodb': 'mongodb', 'mysql': 'mysql', 'postgresql': 'postgresql', 'postgres': 'postgresql',
    'java': 'java', 'springboot': 'spring', 'spring boot': 'spring', 'php': 'php',
    'jquery': 'jquery', 'python': 'python', 'git': 'git', 'docker': 'docker',
    'tailwind': 'tailwindcss', 'typescript': 'typescript', 'ts': 'typescript',
    'express': 'express', 'redux': 'redux', 'firebase': 'firebase', 'sass': 'sass', 'figma': 'figma'
  };
  const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const iconName = iconMap[name.toLowerCase().trim()] || cleanName;
  return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${iconName}/${iconName}-original.svg`;
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Data States
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);

  // Form States
  const [projectForm, setProjectForm] = useState({ title: '', description: '', techStack: '', githubLink: '', liveLink: '', image: '' });
  const [skillForm, setSkillForm] = useState({ name: '', level: 'Beginner', category: 'WEB BASICS', logo: '' });
  
  const [editingId, setEditingId] = useState(null);
  const [profileForm, setProfileForm] = useState({ 
    name: '', title: '', bio: '', 
    yearsOfExperience: 0, completedProjects: 0, happyClients: 0, 
    githubLink: '', linkedinLink: '', resumeLink: '', profileImage: '' 
  });

  const [tempImage, setTempImage] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === 'projects') {
        const res = await projectsService.getAll();
        setProjects(res.data?.data || res.data || []);
      } else if (activeTab === 'skills') {
        const res = await skillsService.getAll();
        setSkills(res.data?.data || res.data || []);
      } else if (activeTab === 'profile') {
        const res = await profileService.get();
        setProfileForm(res.data?.data || res.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  // --- PROJECT HANDLERS ---
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await projectsService.update(editingId, projectForm);
      } else {
        await projectsService.create(projectForm);
      }
      setProjectForm({ title: '', description: '', techStack: '', githubLink: '', liveLink: '', image: '' });
      setEditingId(null);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const editProject = (p) => {
    setEditingId(p.id);
    setProjectForm({ title: p.title, description: p.description, techStack: p.techStack, githubLink: p.githubLink, liveLink: p.liveLink, image: p.image || '' });
  };

  const deleteProject = async (id) => {
    if(!window.confirm("Delete project?")) return;
    await projectsService.delete(id);
    fetchData();
  };

  // --- SKILL HANDLERS ---
  const handleSkillSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await skillsService.update(editingId, skillForm);
      } else {
        await skillsService.create(skillForm);
      }
      setSkillForm({ name: '', level: 'Beginner', category: 'WEB BASICS', logo: '' });
      setEditingId(null);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const editSkill = (s) => {
    setEditingId(s.id);
    setSkillForm({ name: s.name, level: s.level || 'Beginner', category: s.category || 'WEB BASICS', logo: s.logo || '' });
  };

  const deleteSkill = async (id) => {
    if(!window.confirm("Delete skill?")) return;
    await skillsService.delete(id);
    fetchData();
  };

  // --- PROFILE HANDLER ---
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await profileService.update(profileForm);
      if (res.data?.success || res.status === 200) alert("Profile updated!");
    } catch (error) {
      console.error(error);
    }
  };

  const handlePhotoSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setTempImage(reader.result);
        setShowEditor(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handlePhotoSave = async (blob) => {
    const formData = new FormData();
    formData.append('file', blob, 'profile.jpg');
    
    try {
      const res = await uploadService.uploadImage(formData);
      
      if (res.success) {
        const updatedProfile = { ...profileForm, profileImage: res.data.url };
        setProfileForm(updatedProfile);
        setShowEditor(false);
        setTempImage(null);
        
        // Auto-save to profile
        await profileService.update(updatedProfile);
        alert("Photo uploaded and profile updated automatically!");
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    }
  };

  return (
    <div className="flex gap-8 min-h-[75vh]">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 rounded-3xl border border-slate-700 p-6 flex flex-col">
        <h2 className="text-xl font-bold mb-8 text-blue-400">Dashboard</h2>
        <nav className="flex-1 space-y-2">
          <button onClick={() => { setActiveTab('overview'); setEditingId(null); }} className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'overview' ? 'bg-slate-700 text-white' : 'hover:bg-slate-700/50 text-slate-300'}`}>
            <LayoutDashboard size={20} /> Overview
          </button>
          <button onClick={() => { setActiveTab('projects'); setEditingId(null); }} className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'projects' ? 'bg-slate-700 text-white' : 'hover:bg-slate-700/50 text-slate-300'}`}>
            <Briefcase size={20} /> Manage Projects
          </button>
          <button onClick={() => { setActiveTab('skills'); setEditingId(null); }} className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'skills' ? 'bg-slate-700 text-white' : 'hover:bg-slate-700/50 text-slate-300'}`}>
            <Code size={20} /> Manage Skills
          </button>
          <button onClick={() => { setActiveTab('profile'); setEditingId(null); }} className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'profile' ? 'bg-slate-700 text-white' : 'hover:bg-slate-700/50 text-slate-300'}`}>
            <LayoutDashboard size={20} /> Manage Profile
          </button>
        </nav>
        <button onClick={handleLogout} className="mt-auto flex items-center gap-3 text-red-400 hover:text-red-300 px-4 py-3 font-medium transition-colors">
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-slate-800 rounded-3xl border border-slate-700 p-8 overflow-y-auto max-h-[85vh]">
        
        {activeTab === 'overview' && (
          <>
            <h1 className="text-3xl font-bold mb-6">Welcome, Admin!</h1>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700">
                <h3 className="text-slate-400 font-medium mb-2">Portfolio Data</h3>
                <p className="text-lg font-bold text-white">Dynamic Mode Active</p>
              </div>
            </div>
          </>
        )}

        {activeTab === 'projects' && (
          <>
            <h1 className="text-2xl font-bold mb-6 flex justify-between items-center">
              Projects 
              {editingId && <button onClick={() => {setEditingId(null); setProjectForm({title:'', description:'', techStack:'', githubLink:'', liveLink:'', image:''})}} className="text-sm bg-slate-700 px-3 py-1 rounded text-white">Cancel Edit</button>}
            </h1>
            
            <form onSubmit={handleProjectSubmit} className="bg-slate-900 p-6 rounded-2xl border border-slate-700 mb-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="Project Title" value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-white w-full" />
                <input placeholder="Image URL (e.g. /img1.jpg)" value={projectForm.image} onChange={e => setProjectForm({...projectForm, image: e.target.value})} className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-white w-full" />
                <input required placeholder="Tech Stack (comma separated)" value={projectForm.techStack} onChange={e => setProjectForm({...projectForm, techStack: e.target.value})} className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-white w-full" />
                <input required placeholder="GitHub Link (Mandatory)" value={projectForm.githubLink} onChange={e => setProjectForm({...projectForm, githubLink: e.target.value})} className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-white w-full" />
                <input placeholder="Live Link" value={projectForm.liveLink} onChange={e => setProjectForm({...projectForm, liveLink: e.target.value})} className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-white w-full col-span-2" />
                <textarea required placeholder="Project Description" value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-white w-full col-span-2 h-24" />
              </div>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2">
                <Plus size={18} /> {editingId ? 'Update Project' : 'Add Project'}
              </button>
            </form>

            <div className="space-y-4">
              {projects.map(p => (
                <div key={p.id} className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg text-white">{p.title}</h3>
                    <p className="text-slate-400 text-sm">{p.techStack}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => editProject(p)} className="p-2 bg-slate-800 hover:bg-slate-700 rounded text-blue-400"><Edit2 size={18}/></button>
                    <button onClick={() => deleteProject(p.id)} className="p-2 bg-slate-800 hover:bg-slate-700 rounded text-red-400"><Trash2 size={18}/></button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'skills' && (
          <>
            <h1 className="text-2xl font-bold mb-6 flex justify-between items-center">
              Skills 
              {editingId && <button onClick={() => {setEditingId(null); setSkillForm({name:'', level:'Beginner', category:'WEB BASICS', logo:''})}} className="text-sm bg-slate-700 px-3 py-1 rounded text-white">Cancel Edit</button>}
            </h1>
            
            <form onSubmit={handleSkillSubmit} className="bg-slate-900 p-6 rounded-2xl border border-slate-700 mb-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="Skill Name (e.g. React)" value={skillForm.name} onChange={e => setSkillForm({...skillForm, name: e.target.value})} className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-white w-full" />
                <div className="flex items-center gap-4 bg-slate-800 p-3 rounded-lg border border-slate-700 w-full">
                  <div className="w-10 h-10 rounded bg-slate-900 flex items-center justify-center p-1 overflow-hidden">
                    <img 
                      src={getDevIconUrl(skillForm.name)} 
                      alt="preview" 
                      className="w-full h-full object-contain" 
                      onError={(e) => e.target.style.opacity = '0.3'}
                      onLoad={(e) => e.target.style.opacity = '1'}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Auto Icon Preview</p>
                    <p className="text-xs text-blue-400">Icon fetched from DevIcon Library</p>
                  </div>
                </div>
                
                <select value={skillForm.category} onChange={e => setSkillForm({...skillForm, category: e.target.value})} className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-white w-full">
                  <option value="WEB BASICS">WEB BASICS</option>
                  <option value="BACKEND & DATABASE">BACKEND & DATABASE</option>
                  <option value="MODERN WEB">MODERN WEB</option>
                  <option value="PROGRAMMING LANGUAGES">PROGRAMMING LANGUAGES</option>
                  <option value="OTHER SKILLS">OTHER SKILLS</option>
                </select>

                <select value={skillForm.level} onChange={e => setSkillForm({...skillForm, level: e.target.value})} className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-white w-full">
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2">
                <Plus size={18} /> {editingId ? 'Update Skill' : 'Add Skill'}
              </button>
            </form>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {skills.map(s => (
                <div key={s.id} className="bg-slate-900 p-5 rounded-2xl border border-slate-700/50 flex justify-between items-center group hover:border-slate-600 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl object-contain bg-white/5 flex items-center justify-center p-2 border border-slate-800">
                      <img 
                        src={s.logo || getDevIconUrl(s.name)} 
                        alt={s.name} 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="hidden items-center justify-center text-xs font-bold text-slate-500">
                        {s.name.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">{s.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 px-2 py-0.5 rounded text-blue-400 border border-blue-900/30">{s.category}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 px-2 py-0.5 rounded text-green-400 border border-green-900/30">{s.level}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => editSkill(s)} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-blue-400 border border-slate-700"><Edit2 size={16}/></button>
                    <button onClick={() => deleteSkill(s.id)} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-red-400 border border-slate-700"><Trash2 size={16}/></button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {activeTab === 'profile' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white">Manage Profile</h1>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500 bg-slate-900">
                  <img 
                    src={getImgUrl(profileForm.profileImage || "/uploads/images/profile.jpg")} 
                    alt="Current" 
                    className="w-full h-full object-cover"
                    onError={(e) => e.target.src = "https://via.placeholder.com/100"} 
                  />
                </div>
                <label className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl text-sm font-bold cursor-pointer transition-all">
                  Change Photo
                  <input type="file" className="hidden" accept="image/*" onChange={handlePhotoSelect} />
                </label>
              </div>
            </div>
            
            <form onSubmit={handleProfileSubmit} className="bg-slate-900 p-8 rounded-3xl border border-slate-700 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Full Name</label>
                  <input required value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-white w-full focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Professional Title</label>
                  <input required value={profileForm.title} onChange={e => setProfileForm({...profileForm, title: e.target.value})} className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-white w-full focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium text-slate-400">Bio / About Me</label>
                  <textarea required value={profileForm.bio} onChange={e => setProfileForm({...profileForm, bio: e.target.value})} className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-white w-full h-32 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Years of Experience</label>
                  <input type="number" value={profileForm.yearsOfExperience} onChange={e => setProfileForm({...profileForm, yearsOfExperience: parseInt(e.target.value)})} className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-white w-full focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Projects Completed</label>
                  <input type="number" value={profileForm.completedProjects} onChange={e => setProfileForm({...profileForm, completedProjects: parseInt(e.target.value)})} className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-white w-full focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">GitHub Profile Link</label>
                  <input value={profileForm.githubLink} onChange={e => setProfileForm({...profileForm, githubLink: e.target.value})} className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-white w-full focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">LinkedIn Profile Link</label>
                  <input value={profileForm.linkedinLink} onChange={e => setProfileForm({...profileForm, linkedinLink: e.target.value})} className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-white w-full focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium text-slate-400">Resume Download URL</label>
                  <input value={profileForm.resumeLink} onChange={e => setProfileForm({...profileForm, resumeLink: e.target.value})} className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-white w-full focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20">
                Save Profile Changes
              </button>
            </form>
          </>
        )}

      </main>

      {showEditor && (
        <PhotoEditor 
          image={tempImage} 
          onSave={handlePhotoSave} 
          onCancel={() => { setShowEditor(false); setTempImage(null); }} 
        />
      )}
    </div>
  );
};

export default AdminDashboard;
