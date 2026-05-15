import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, Briefcase, FileText, Code, Plus, Trash2, Edit2 } from 'lucide-react';
import { projectsService, skillsService, profileService, uploadService, blogService } from '../services/apiServices';
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
  const [blogs, setBlogs] = useState([]);

  // Form States
  const [projectForm, setProjectForm] = useState({ title: '', description: '', techStack: '', githubLink: '', liveLink: '', image: '' });
  const [skillForm, setSkillForm] = useState({ name: '', level: 'Beginner', category: 'WEB BASICS', logo: '' });
  const [blogForm, setBlogForm] = useState({ title: '', content: '' });

  const [editingId, setEditingId] = useState(null);
  const [profileForm, setProfileForm] = useState({
    name: '', title: '', bio: '', aboutMe: '',
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
      // In Overview or specific tabs, we might need all data for counts
      if (activeTab === 'overview') {
        const [projRes, skillRes, blogRes, profRes] = await Promise.all([
          projectsService.getAll(),
          skillsService.getAll(),
          blogService.getAll(),
          profileService.get()
        ]);
        setProjects(projRes.data?.data || projRes.data || []);
        setSkills(skillRes.data?.data || skillRes.data || []);
        setBlogs(blogRes.data?.data || blogRes.data || []);
        setProfileForm(profRes.data?.data || profRes.data);
      } else if (activeTab === 'projects') {
        const res = await projectsService.getAll();
        setProjects(res.data?.data || res.data || []);
      } else if (activeTab === 'skills') {
        const res = await skillsService.getAll();
        setSkills(res.data?.data || res.data || []);
      } else if (activeTab === 'blogs') {
        const res = await blogService.getAll();
        setBlogs(res.data?.data || res.data || []);
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
    setProjectForm({ title: p.title, description: p.description, techStack: p.techStack, githubLink: p.githubLink, liveLink: p.liveLink, image: p.image });
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Delete project?")) return;
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
    if (!window.confirm("Delete skill?")) return;
    await skillsService.delete(id);
    fetchData();
  };

  // --- BLOG HANDLERS ---
  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await blogService.update(editingId, blogForm);
      } else {
        await blogService.create(blogForm);
      }
      setBlogForm({ title: '', content: '' });
      setEditingId(null);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const editBlog = (b) => {
    setEditingId(b.id);
    setBlogForm({ title: b.title, content: b.content });
  };

  const deleteBlog = async (id) => {
    if (!window.confirm("Delete blog?")) return;
    await blogService.delete(id);
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
          <button onClick={() => { setActiveTab('blogs'); setEditingId(null); }} className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'blogs' ? 'bg-slate-700 text-white' : 'hover:bg-slate-700/50 text-slate-300'}`}>
            <FileText size={20} /> Manage Blogs
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
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Welcome back!</h1>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-700">
                <p className="text-slate-400 font-medium mb-1">Total Projects</p>
                <h3 className="text-3xl font-bold text-white">{projects.length}</h3>
              </div>
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-700">
                <p className="text-slate-400 font-medium mb-1">Total Skills</p>
                <h3 className="text-3xl font-bold text-white">{skills.length}</h3>
              </div>
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-700">
                <p className="text-slate-400 font-medium mb-1">Status</p>
                <h3 className="text-3xl font-bold text-green-400">Online</h3>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white">{editingId ? 'Edit Project' : 'Add New Project'}</h1>
              {editingId && <button onClick={() => { setEditingId(null); setProjectForm({ title: '', description: '', techStack: '', githubLink: '', liveLink: '', image: '' }) }} className="text-sm bg-slate-700 px-3 py-1 rounded text-white">Cancel Edit</button>}
            </div>
            
            <form onSubmit={handleProjectSubmit} className="bg-slate-900 p-6 rounded-3xl border border-slate-700 space-y-4 mb-8">
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="Project Title" value={projectForm.title} onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-white w-full" />
                <input required placeholder="Tech Stack (comma separated)" value={projectForm.techStack} onChange={e => setProjectForm({ ...projectForm, techStack: e.target.value })} className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-white w-full" />
                <input placeholder="GitHub Link" value={projectForm.githubLink} onChange={e => setProjectForm({ ...projectForm, githubLink: e.target.value })} className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-white w-full" />
                <input placeholder="Live Link (optional)" value={projectForm.liveLink} onChange={e => setProjectForm({ ...projectForm, liveLink: e.target.value })} className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-white w-full" />
                <textarea required placeholder="Description" value={projectForm.description} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-white w-full col-span-2 h-24" />
              </div>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2">
                <Plus size={18} /> {editingId ? 'Update Project' : 'Add Project'}
              </button>
            </form>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {projects.map(p => (
                <div key={p.id} className="bg-slate-900 p-4 rounded-2xl border border-slate-700 flex gap-4 group">
                  <div className="w-24 h-24 bg-slate-800 rounded-xl overflow-hidden shrink-0">
                    <img src={getImgUrl(p.image || "/uploads/images/default_project.jpg")} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white">{p.title}</h3>
                    <p className="text-slate-400 text-xs line-clamp-2 mt-1">{p.description}</p>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => editProject(p)} className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-blue-400"><Edit2 size={14} /></button>
                      <button onClick={() => deleteProject(p.id)} className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-red-400"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'skills' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white">{editingId ? 'Edit Skill' : 'Add New Skill'}</h1>
              {editingId && <button onClick={() => { setEditingId(null); setSkillForm({ name: '', level: 'Beginner', category: 'WEB BASICS', logo: '' }) }} className="text-sm bg-slate-700 px-3 py-1 rounded text-white">Cancel Edit</button>}
            </div>

            <form onSubmit={handleSkillSubmit} className="bg-slate-900 p-6 rounded-3xl border border-slate-700 space-y-4 mb-8">
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="Skill Name" value={skillForm.name} onChange={e => setSkillForm({ ...skillForm, name: e.target.value })} className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-white w-full" />
                <select value={skillForm.category} onChange={e => setSkillForm({ ...skillForm, category: e.target.value })} className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-white w-full">
                  <option value="WEB BASICS">WEB BASICS</option>
                  <option value="FRONTEND DEVELOPMENT">FRONTEND DEVELOPMENT</option>
                  <option value="BACKEND DEVELOPMENT">BACKEND DEVELOPMENT</option>
                  <option value="DATABASES">DATABASES</option>
                  <option value="UI/UX DESIGN">UI/UX DESIGN</option>
                  <option value="PROGRAMMING LANGUAGES">PROGRAMMING LANGUAGES</option>
                  <option value="OTHER SKILLS">OTHER SKILLS</option>
                </select>

                <select value={skillForm.level} onChange={e => setSkillForm({ ...skillForm, level: e.target.value })} className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-white w-full">
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
                    <button onClick={() => editSkill(s)} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-blue-400 border border-slate-700"><Edit2 size={16} /></button>
                    <button onClick={() => deleteSkill(s.id)} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-red-400 border border-slate-700"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {activeTab === 'blogs' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white">{editingId ? 'Edit Blog Post' : 'Post New Blog'}</h1>
              {editingId && <button onClick={() => { setEditingId(null); setBlogForm({ title: '', content: '' }) }} className="text-sm bg-slate-700 px-3 py-1 rounded text-white">Cancel Edit</button>}
            </div>

            <form onSubmit={handleBlogSubmit} className="bg-slate-900 p-6 rounded-3xl border border-slate-700 space-y-4 mb-8">
              <div className="space-y-4">
                <input required placeholder="Blog Title" value={blogForm.title} onChange={e => setBlogForm({ ...blogForm, title: e.target.value })} className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-white w-full" />
                <textarea required placeholder="Write your post here... (LinkedIn style)" value={blogForm.content} onChange={e => setBlogForm({ ...blogForm, content: e.target.value })} className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-white w-full h-64 resize-none" />
              </div>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2">
                <Plus size={18} /> {editingId ? 'Update Post' : 'Publish Post'}
              </button>
            </form>

            <div className="space-y-4">
              {blogs.map(b => (
                <div key={b.id} className="bg-slate-900 p-6 rounded-2xl border border-slate-700 group hover:border-slate-600 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-white text-lg">{b.title}</h3>
                      <p className="text-slate-500 text-xs mt-1">
                        {new Date(b.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => editBlog(b)} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-blue-400 border border-slate-700 transition-colors"><Edit2 size={16} /></button>
                      <button onClick={() => deleteBlog(b.id)} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-red-400 border border-slate-700 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm line-clamp-3 leading-relaxed whitespace-pre-wrap">{b.content}</p>
                </div>
              ))}
              {blogs.length === 0 && (
                <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-dashed border-slate-700 text-slate-500">
                  No blog posts yet. Start sharing your insights!
                </div>
              )}
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
                  <input required value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-white w-full focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Professional Title</label>
                  <input required value={profileForm.title} onChange={e => setProfileForm({ ...profileForm, title: e.target.value })} className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-white w-full focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium text-slate-400">Hero Tagline (Short Bio)</label>
                  <input required value={profileForm.bio} onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })} className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-white w-full focus:ring-2 focus:ring-blue-500 outline-none" placeholder="A short catchphrase for the top of the page..." />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium text-slate-400">Professional Story (About Me)</label>
                  <textarea required value={profileForm.aboutMe} onChange={e => setProfileForm({ ...profileForm, aboutMe: e.target.value })} className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-white w-full h-48 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Tell your full professional story here..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Years of Experience</label>
                  <input type="number" value={profileForm.yearsOfExperience} onChange={e => setProfileForm({ ...profileForm, yearsOfExperience: parseInt(e.target.value) })} className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-white w-full focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Projects Completed</label>
                  <input type="number" value={profileForm.completedProjects} onChange={e => setProfileForm({ ...profileForm, completedProjects: parseInt(e.target.value) })} className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-white w-full focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">GitHub Profile Link</label>
                  <input value={profileForm.githubLink} onChange={e => setProfileForm({ ...profileForm, githubLink: e.target.value })} className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-white w-full focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">LinkedIn Profile Link</label>
                  <input value={profileForm.linkedinLink} onChange={e => setProfileForm({ ...profileForm, linkedinLink: e.target.value })} className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-white w-full focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium text-slate-400">Resume Download URL</label>
                  <input value={profileForm.resumeLink} onChange={e => setProfileForm({ ...profileForm, resumeLink: e.target.value })} className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-white w-full focus:ring-2 focus:ring-blue-500 outline-none" />
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
