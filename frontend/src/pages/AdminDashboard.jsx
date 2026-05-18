import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LogOut, LayoutDashboard, Briefcase, FileText, Code, Plus, Trash2, Edit2, Mail, MessageCircle } from 'lucide-react';
import { projectsService, skillsService, profileService, uploadService, blogService, contactService, experienceService } from '../services/apiServices';
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
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');

  // Queries
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await projectsService.getAll();
      return res.data?.data || res.data || [];
    }
  });

  const { data: skills = [] } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const res = await skillsService.getAll();
      return res.data?.data || res.data || [];
    }
  });

  const { data: experiences = [] } = useQuery({
    queryKey: ['experiences'],
    queryFn: async () => {
      const res = await experienceService.getAll();
      return res.data?.data || res.data || [];
    }
  });

  const { data: blogs = [] } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const res = await blogService.getAll();
      return res.data?.data || res.data || [];
    }
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const res = await contactService.getAll();
      return res.data?.data || res.data || [];
    }
  });

  const { data: profileData } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await profileService.get();
      return res.data?.data || res.data;
    }
  });

  // Form States (now initialized with query data via useEffect or local sync)
  const [projectForm, setProjectForm] = useState({ title: '', description: '', techStack: '', githubLink: '', liveLink: '', image: '' });
  const [skillForm, setSkillForm] = useState({ name: '', level: 'Beginner', category: 'WEB BASICS', logo: '' });
  const [experienceForm, setExperienceForm] = useState({ title: '', company: '', companyLogo: '', employmentType: 'Full-time', location: '', locationType: 'On-site', startDate: '', endDate: '', description: '', sortOrder: 0 });
  const [blogForm, setBlogForm] = useState({ title: '', content: '' });
  const [editingId, setEditingId] = useState(null);
  const [profileForm, setProfileForm] = useState({
    name: '', title: '', bio: '', aboutMe: '',
    yearsOfExperience: 0, completedProjects: 0, happyClients: 0,
    githubLink: '', linkedinLink: '', resumeLink: '', profileImage: ''
  });

  // Sync profileForm with profileData when it loads
  useState(() => {
    if (profileData && !profileForm.name) {
      setProfileForm(profileData);
    }
  });

  const [tempImage, setTempImage] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  // --- MUTATIONS ---
  const projectMutation = useMutation({
    mutationFn: async (data) => editingId ? projectsService.update(editingId, data) : projectsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setProjectForm({ title: '', description: '', techStack: '', githubLink: '', liveLink: '', image: '' });
      setEditingId(null);
      alert(editingId ? "Project updated!" : "Project added!");
    },
    onError: (error) => alert("Operation failed: " + (error.response?.data?.message || "Error")),
  });

  const skillMutation = useMutation({
    mutationFn: async (data) => editingId ? skillsService.update(editingId, data) : skillsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      setSkillForm({ name: '', level: 'Beginner', category: 'WEB BASICS', logo: '' });
      setEditingId(null);
      alert("Skill saved!");
    },
  });

  const experienceMutation = useMutation({
    mutationFn: async (data) => editingId ? experienceService.update(editingId, data) : experienceService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      setExperienceForm({ title: '', company: '', companyLogo: '', employmentType: 'Full-time', location: '', locationType: 'On-site', startDate: '', endDate: '', description: '', sortOrder: 0 });
      setEditingId(null);
      alert("Experience saved!");
    },
  });

  const blogMutation = useMutation({
    mutationFn: async (data) => editingId ? blogService.update(editingId, data) : blogService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      setBlogForm({ title: '', content: '' });
      setEditingId(null);
      alert("Blog published!");
    },
  });

  const profileMutation = useMutation({
    mutationFn: (data) => profileService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      alert("Profile updated!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ type, id }) => {
      if (type === 'project') return projectsService.delete(id);
      if (type === 'skill') return skillsService.delete(id);
      if (type === 'experience') return experienceService.delete(id);
      if (type === 'blog') return blogService.delete(id);
      if (type === 'message') return contactService.delete(id);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [variables.type === 'message' ? 'messages' : variables.type + 's'] });
    },
  });

  // --- HANDLERS ---
  const handleProjectSubmit = (e) => { e.preventDefault(); projectMutation.mutate(projectForm); };
  const handleSkillSubmit = (e) => { e.preventDefault(); skillMutation.mutate(skillForm); };
  const handleExperienceSubmit = (e) => { e.preventDefault(); experienceMutation.mutate(experienceForm); };
  const handleBlogSubmit = (e) => { e.preventDefault(); blogMutation.mutate(blogForm); };
  const handleProfileSubmit = (e) => { e.preventDefault(); profileMutation.mutate(profileForm); };

  const editProject = (p) => { setEditingId(p.id); setProjectForm(p); };
  const editSkill = (s) => { setEditingId(s.id); setSkillForm(s); };
  const editExperience = (e) => { setEditingId(e.id); setExperienceForm(e); };
  const editBlog = (b) => { setEditingId(b.id); setBlogForm(b); };

  const deleteProject = (id) => { if (window.confirm("Delete project?")) deleteMutation.mutate({ type: 'project', id }); };
  const deleteSkill = (id) => { if (window.confirm("Delete skill?")) deleteMutation.mutate({ type: 'skill', id }); };
  const deleteExperience = (id) => { if (window.confirm("Delete experience?")) deleteMutation.mutate({ type: 'experience', id }); };
  const deleteBlog = (id) => { if (window.confirm("Delete blog?")) deleteMutation.mutate({ type: 'blog', id }); };
  const deleteMessage = (id) => { if (window.confirm("Delete message?")) deleteMutation.mutate({ type: 'message', id }); };

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

  const handleImageUpload = async (e, type) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const res = await uploadService.uploadImage(formData);
        if (res.success) {
          const url = res.data.url || res.url;
          if (type === 'project') setProjectForm(prev => ({ ...prev, image: url }));
          if (type === 'skill') setSkillForm(prev => ({ ...prev, logo: url }));
          if (type === 'experience') setExperienceForm(prev => ({ ...prev, companyLogo: url }));
          alert("Image uploaded successfully!");
        } else {
          alert("Upload failed: " + res.message);
        }
      } catch (err) {
        console.error(err);
        alert("Upload failed.");
      }
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
          <button onClick={() => { setActiveTab('experiences'); setEditingId(null); }} className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'experiences' ? 'bg-slate-700 text-white' : 'hover:bg-slate-700/50 text-slate-300'}`}>
            <Briefcase size={20} /> Manage Experience
          </button>
          <button onClick={() => { setActiveTab('blogs'); setEditingId(null); }} className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'blogs' ? 'bg-slate-700 text-white' : 'hover:bg-slate-700/50 text-slate-300'}`}>
            <FileText size={20} /> Manage Blogs
          </button>
          <button onClick={() => { setActiveTab('profile'); setEditingId(null); }} className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'profile' ? 'bg-slate-700 text-white' : 'hover:bg-slate-700/50 text-slate-300'}`}>
            <LayoutDashboard size={20} /> Manage Profile
          </button>
          <button onClick={() => { setActiveTab('messages'); setEditingId(null); }} className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'messages' ? 'bg-slate-700 text-white' : 'hover:bg-slate-700/50 text-slate-300'}`}>
            <Mail size={20} /> Messages
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
                
                <div className="col-span-2 space-y-1">
                  <label className="block text-xs font-semibold text-slate-400">Project Image</label>
                  <div className="flex gap-4 items-center bg-slate-850 p-3 rounded-xl border border-slate-700">
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'project')} className="text-white text-xs" />
                    {projectForm.image && (
                      <div className="w-10 h-10 rounded border border-slate-700 overflow-hidden shrink-0 bg-white/5">
                        <img src={getImgUrl(projectForm.image)} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <input placeholder="Or paste image URL" value={projectForm.image || ''} onChange={e => setProjectForm({ ...projectForm, image: e.target.value })} className="bg-slate-900 px-3 py-1.5 rounded border border-slate-700 text-white text-xs flex-1" />
                  </div>
                </div>

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

                <div className="col-span-2 space-y-1">
                  <label className="block text-xs font-semibold text-slate-400">Skill Logo</label>
                  <div className="flex gap-4 items-center bg-slate-850 p-3 rounded-xl border border-slate-700">
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'skill')} className="text-white text-xs" />
                    {skillForm.logo && (
                      <div className="w-10 h-10 rounded border border-slate-700 overflow-hidden shrink-0 bg-white/5 flex items-center justify-center p-1">
                        <img src={getImgUrl(skillForm.logo)} className="w-full h-full object-contain" />
                      </div>
                    )}
                    <input placeholder="Or paste logo URL (e.g. devicon, imgur)" value={skillForm.logo || ''} onChange={e => setSkillForm({ ...skillForm, logo: e.target.value })} className="bg-slate-900 px-3 py-1.5 rounded border border-slate-700 text-white text-xs flex-1" />
                  </div>
                </div>
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

        {activeTab === 'experiences' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white">{editingId ? 'Edit Experience' : 'Add New Experience'}</h1>
              {editingId && <button onClick={() => { setEditingId(null); setExperienceForm({ title: '', company: '', companyLogo: '', employmentType: 'Full-time', location: '', locationType: 'On-site', startDate: '', endDate: '', description: '', sortOrder: 0 }) }} className="text-sm bg-slate-700 px-3 py-1 rounded text-white">Cancel Edit</button>}
            </div>

            <form onSubmit={handleExperienceSubmit} className="bg-slate-900 p-6 rounded-3xl border border-slate-700 space-y-4 mb-8">
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="Job Title" value={experienceForm.title} onChange={e => setExperienceForm({ ...experienceForm, title: e.target.value })} className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-white w-full" />
                <input required placeholder="Company" value={experienceForm.company} onChange={e => setExperienceForm({ ...experienceForm, company: e.target.value })} className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-white w-full" />
                
                <div className="col-span-2 space-y-1">
                  <label className="block text-xs font-semibold text-slate-400">Company Website Domain (for Logo API, e.g. google.com)</label>
                  <div className="flex gap-4 items-center bg-slate-850 p-3 rounded-xl border border-slate-700">
                    <input 
                      placeholder="e.g. google.com, sundram.com (leave blank for automatic name-based matching)" 
                      value={experienceForm.companyLogo || ''} 
                      onChange={e => setExperienceForm({ ...experienceForm, companyLogo: e.target.value.toLowerCase().trim() })} 
                      className="bg-slate-900 px-3 py-1.5 rounded border border-slate-700 text-white text-xs flex-1" 
                    />
                    {(() => {
                      const domain = (() => {
                        if (experienceForm.companyLogo) return experienceForm.companyLogo;
                        if (!experienceForm.company) return null;
                        const companyNameClean = experienceForm.company.toLowerCase().trim();
                        const customMappings = {
                          'sundram fasteners limited': 'sundram.com',
                          'sundram fasteners': 'sundram.com',
                          'tvs sundram': 'sundram.com',
                          'tvs sundram fasteners limited': 'sundram.com',
                          'tvs sundram fasteners': 'sundram.com',
                          'google': 'google.com',
                          'microsoft': 'microsoft.com'
                        };
                        return customMappings[companyNameClean] || 
                               companyNameClean
                                 .replace(/\s+(inc|llc|ltd|limited|co|corp|corporation)\b/g, '')
                                 .replace(/[^a-z0-9]/g, '') + '.com';
                      })();

                      if (!domain) return null;

                      const logoDevToken = import.meta.env.VITE_LOGODEV_TOKEN || 'pk_S_LMVztgS-GD0V6FTqaWFQ';
                      const logoUrl = logoDevToken
                        ? `https://img.logo.dev/${domain}?token=${logoDevToken}`
                        : `https://logo.clearbit.com/${domain}`;

                      return (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded border border-slate-700 overflow-hidden shrink-0 bg-white/5 flex items-center justify-center p-1">
                            <img 
                              src={logoUrl} 
                              className="w-full h-full object-contain" 
                              onError={e => {
                                if (e.target.src.includes('logo.dev')) {
                                  e.target.src = `https://logo.clearbit.com/${domain}`;
                                } else if (e.target.src.includes('clearbit.com')) {
                                  e.target.src = `https://icons.duckduckgo.com/ip3/${domain}.ico`;
                                } else if (e.target.src.includes('duckduckgo.com')) {
                                  e.target.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
                                } else {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }
                              }} 
                            />
                            <div style={{ display: 'none' }} className="flex items-center justify-center text-xs font-bold text-slate-500 w-full h-full">
                              {experienceForm.company ? experienceForm.company.charAt(0) : ''}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                <select value={experienceForm.employmentType} onChange={e => setExperienceForm({ ...experienceForm, employmentType: e.target.value })} className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-white w-full">
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Internship">Internship</option>
                </select>

                <select value={experienceForm.locationType} onChange={e => setExperienceForm({ ...experienceForm, locationType: e.target.value })} className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-white w-full">
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Remote">Remote</option>
                </select>

                <input placeholder="Location (e.g. New York, NY)" value={experienceForm.location} onChange={e => setExperienceForm({ ...experienceForm, location: e.target.value })} className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-white w-full" />
                <input required placeholder="Start Date (e.g. Jan 2022)" value={experienceForm.startDate} onChange={e => setExperienceForm({ ...experienceForm, startDate: e.target.value })} className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-white w-full" />
                <input placeholder="End Date (e.g. Present, Dec 2023)" value={experienceForm.endDate} onChange={e => setExperienceForm({ ...experienceForm, endDate: e.target.value })} className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-white w-full" />
                <input type="number" placeholder="Sort Order (0 is first)" value={experienceForm.sortOrder} onChange={e => setExperienceForm({ ...experienceForm, sortOrder: parseInt(e.target.value) || 0 })} className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-white w-full" />
                
                <textarea placeholder="Description (Responsibilities, Achievements)" value={experienceForm.description} onChange={e => setExperienceForm({ ...experienceForm, description: e.target.value })} className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-white w-full col-span-2 h-32" />
              </div>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2">
                <Plus size={18} /> {editingId ? 'Update Experience' : 'Add Experience'}
              </button>
            </form>

            <div className="space-y-4">
              {experiences.map(exp => (
                <div key={exp.id} className="bg-slate-900 p-5 rounded-2xl border border-slate-700/50 flex justify-between items-start group hover:border-slate-600 transition-all">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center p-1 border border-slate-800 shrink-0 overflow-hidden">
                      {(() => {
                        const companyNameClean = exp.company.toLowerCase().trim();
                        const customMappings = {
                          'sundram fasteners limited': 'sundram.com',
                          'sundram fasteners': 'sundram.com',
                          'tvs sundram': 'sundram.com',
                          'tvs sundram fasteners limited': 'sundram.com',
                          'tvs sundram fasteners': 'sundram.com',
                          'google': 'google.com',
                          'microsoft': 'microsoft.com'
                        };
                        const domain = exp.companyLogo || 
                                       customMappings[companyNameClean] || 
                                       companyNameClean
                                         .replace(/\s+(inc|llc|ltd|limited|co|corp|corporation)\b/g, '')
                                         .replace(/[^a-z0-9]/g, '') + '.com';
                        const logoDevToken = import.meta.env.VITE_LOGODEV_TOKEN || 'pk_S_LMVztgS-GD0V6FTqaWFQ';
                        const logoUrl = logoDevToken 
                          ? `https://img.logo.dev/${domain}?token=${logoDevToken}`
                          : `https://logo.clearbit.com/${domain}`;

                        return (
                          <>
                            <img 
                              src={logoUrl} 
                              alt={exp.company} 
                              className="w-full h-full object-contain" 
                              onError={e => { 
                                if (e.target.src.includes('logo.dev')) {
                                  e.target.src = `https://logo.clearbit.com/${domain}`;
                                } else if (e.target.src.includes('clearbit.com')) {
                                  e.target.src = `https://icons.duckduckgo.com/ip3/${domain}.ico`;
                                } else if (e.target.src.includes('duckduckgo.com')) {
                                  e.target.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
                                } else {
                                  e.target.style.display = 'none'; 
                                  e.target.nextSibling.style.display = 'flex'; 
                                }
                              }} 
                            />
                            <div style={{ display: 'none' }} className="flex items-center justify-center text-xs font-bold text-slate-500 w-full h-full">
                              {exp.company.charAt(0)}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{exp.title}</h3>
                      <p className="text-blue-400 font-medium text-sm mb-2">{exp.company} • {exp.employmentType}</p>
                      <p className="text-slate-400 text-xs mb-2">{exp.startDate} - {exp.endDate || 'Present'} | {exp.location} ({exp.locationType})</p>
                      <p className="text-slate-300 text-sm whitespace-pre-line line-clamp-2">{exp.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => editExperience(exp)} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-blue-400 border border-slate-700"><Edit2 size={16} /></button>
                    <button onClick={() => deleteExperience(exp.id)} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-red-400 border border-slate-700"><Trash2 size={16} /></button>
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
                    src={profileForm.profileImage || "https://via.placeholder.com/100"}
                    alt="Current"
                    className="w-full h-full object-cover"
                    onError={(e) => e.target.src = "https://via.placeholder.com/100"}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-slate-400">Profile Image URL (Paste an Imgur or LinkedIn image link)</label>
                  <input value={profileForm.profileImage || ''} onChange={e => setProfileForm({ ...profileForm, profileImage: e.target.value })} className="bg-slate-800 p-2 rounded-xl border border-slate-700 text-white w-full focus:ring-2 focus:ring-blue-500 outline-none mt-1" placeholder="https://..." />
                </div>
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

        {activeTab === 'messages' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white mb-6">Contact Messages</h1>
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12 bg-slate-900 rounded-3xl border border-slate-700">
                  <Mail size={48} className="mx-auto text-slate-600 mb-4 opacity-20" />
                  <p className="text-slate-500">No messages yet. They will appear here when someone contacts you!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className="bg-slate-900 p-6 rounded-3xl border border-slate-700 hover:border-slate-600 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white">{msg.name}</h3>
                        <p className="text-blue-400 text-sm">{msg.email}</p>
                        <p className="text-slate-500 text-xs mt-1">{new Date(msg.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <a 
                          href={`https://wa.me/${msg.email.includes('@') ? '' : msg.email.replace(/[^0-9]/g, '')}?text=Hi ${msg.name}, I received your message from my portfolio...`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 bg-slate-800 hover:bg-green-500/20 text-slate-400 hover:text-green-400 rounded-xl transition-all"
                          title="Reply on WhatsApp"
                        >
                          <MessageCircle size={18} />
                        </a>
                        <button 
                          onClick={() => deleteMessage(msg.id)}
                          className="p-2 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                      <p className="text-slate-300 whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
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
