import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-[#0f0f11]/80 backdrop-blur-md py-4 sm:py-5 sticky top-0 z-50 border-b border-gray-800/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex justify-between items-center">
        <Link to="/" className="text-lg sm:text-xl font-bold tracking-widest text-white hover:text-blue-400 transition-colors">
          K.B.S.R
        </Link>
        <div className="flex items-center space-x-4 sm:space-x-8 text-[11px] sm:text-sm font-bold uppercase tracking-widest text-gray-400">
          <Link to="/" className="hover:text-white transition-colors">About</Link>
          <Link to="/skills" className="hover:text-white transition-colors">Skills</Link>
          <Link to="/projects" className="hover:text-white transition-colors">Projects</Link>
          <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hidden xs:block px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-gray-800 hover:border-gray-500 hover:text-white transition-all bg-gray-900/50 text-[10px] sm:text-xs">
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
