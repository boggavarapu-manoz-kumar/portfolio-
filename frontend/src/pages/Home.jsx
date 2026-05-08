import { useState, useEffect } from 'react';
import { Code, Briefcase, FileText } from 'lucide-react';
import { profileService } from '../services/apiServices';
import { getImgUrl } from '../api/axiosInstance';

const Home = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    profileService.get()
      .then(res => {
        setProfile(res.data?.data || res.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-32 animate-pulse text-gray-500 tracking-widest uppercase">Initializing Portfolio...</div>;
  if (!profile) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 space-y-32">
      {/* Welcome Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between gap-12 min-h-[60vh]">
        <div className="flex-1 space-y-6 text-center md:text-left">
          <p className="text-sm font-semibold tracking-[0.2em] text-gray-400">WELCOME</p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white leading-tight">
            {profile.name}
          </h1>
          <h2 className="text-xl sm:text-2xl font-medium text-gray-400">{profile.title}</h2>
          <p className="text-gray-400 max-w-lg mx-auto md:mx-0 leading-relaxed pt-2 text-base sm:text-lg">
            {profile.bio}
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
            {profile.githubLink && (
              <a href={profile.githubLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#1a1a1c] border border-gray-800 hover:border-gray-600 hover:bg-[#222225] transition-all text-sm font-medium">
                <Code size={18} /> GitHub
              </a>
            )}
            {profile.linkedinLink && (
              <a href={profile.linkedinLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#1a1a1c] border border-gray-800 hover:border-gray-600 hover:bg-[#222225] transition-all text-sm font-medium">
                <Briefcase size={18} /> LinkedIn
              </a>
            )}
            {profile.resumeLink && (
              <a href={profile.resumeLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#1a1a1c] border border-gray-800 hover:border-gray-600 hover:bg-[#222225] transition-all text-sm font-medium">
                <FileText size={18} /> Resume
              </a>
            )}
          </div>
        </div>
        <div className="flex-1 w-full max-w-[450px] md:max-w-none flex justify-center md:justify-end">
          <div className="w-full max-w-[400px] aspect-[4/4.5] bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl relative border border-gray-800/50">
            <div className="absolute inset-0 bg-[#1a1a1c] flex items-center justify-center text-gray-600">
               <img 
                 src={getImgUrl(profile.profileImage || "/uploads/images/profile.jpg")} 
                 alt={profile.name} 
                 className="w-full h-full object-cover opacity-90 transition-opacity hover:opacity-100" 
                 onError={(e) => {
                   e.target.style.display='none';
                   e.target.nextSibling.style.display='flex';
                 }} 
               />
               <span className="text-sm font-bold uppercase tracking-widest text-gray-700">Profile Image</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="flex flex-col items-center py-12">
        <div className="text-center space-y-4 mb-16 px-4">
          <p className="text-sm font-semibold tracking-[0.2em] text-gray-400">ABOUT ME</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">My Journey</h2>
          <p className="text-gray-400 max-w-2xl mx-auto pt-4 leading-relaxed text-sm sm:text-base">
            Professional overview and technical focus areas.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 w-full">
          <div className="flex-1 space-y-6 text-gray-400 leading-relaxed whitespace-pre-line text-sm sm:text-base px-2">
            {profile.bio}
          </div>
          
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2 bg-[#1a1a1c] border border-gray-800 rounded-3xl p-8 hover:bg-[#1f1f22] transition-all hover:border-gray-700">
              <p className="text-xs text-gray-500 font-semibold tracking-wider mb-2 uppercase">Core Philosophy</p>
              <h3 className="text-xl font-bold text-white">Engineering Real-World Solutions</h3>
              <p className="text-sm text-gray-500 mt-2">Focused on building practical, secure, and maintainable systems.</p>
            </div>
            <div className="bg-[#1a1a1c] border border-gray-800 rounded-3xl p-8 flex flex-col justify-center hover:bg-[#1f1f22] transition-all hover:border-gray-700">
              <h3 className="text-4xl font-bold text-white mb-2">{profile.yearsOfExperience}<span className="text-blue-500">+</span></h3>
              <p className="text-sm text-gray-400 font-medium">Years of Active Development</p>
            </div>
            <div className="bg-[#1a1a1c] border border-gray-800 rounded-3xl p-8 flex flex-col justify-center hover:bg-[#1f1f22] transition-all hover:border-gray-700">
              <h3 className="text-4xl font-bold text-white mb-2">{profile.completedProjects}<span className="text-green-500">+</span></h3>
              <p className="text-sm text-gray-400 font-medium">Project Milestones Reached</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
