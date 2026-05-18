import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useIsFetching } from '@tanstack/react-query';
import Navbar from './components/Navbar';
import SinglePage from './pages/SinglePage';
import ProtectedRoute from './components/ProtectedRoute';
import GoogleAnalytics from './components/GoogleAnalytics';

const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

const LoadingBar = () => {
  const isFetching = useIsFetching();
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      height: '3px',
      background: 'linear-gradient(90deg, #6366f1, #a855f7)',
      width: isFetching ? '100%' : '0%',
      opacity: isFetching ? 1 : 0,
      transition: isFetching ? 'width 2s ease-in-out, opacity 0.3s' : 'width 0.3s, opacity 0.3s',
      zIndex: 9999,
      boxShadow: '0 0 10px rgba(99,102,241,0.5)'
    }} />
  );
};

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#0f0f11]">
    <div className="w-8 h-8 rounded-full border-t-2 border-indigo-500 animate-spin"></div>
  </div>
);

import { useQueries } from '@tanstack/react-query';
import { profileService, skillsService, projectsService, blogService, experienceService } from './services/apiServices';

function App() {
  // Pre-fetch everything to ensure instant loading when sections come into view
  useQueries({
    queries: [
      { queryKey: ['profile'], queryFn: async () => { const res = await profileService.get(); return res?.data || res; } },
      { queryKey: ['skills'], queryFn: async () => { const res = await skillsService.getAll(); return res.data?.data || res.data || []; } },
      { queryKey: ['projects'], queryFn: async () => { const res = await projectsService.getAll(); return res.data?.data || res.data || []; } },
      { queryKey: ['blogs'], queryFn: async () => { const res = await blogService.getAll(); return res?.data || []; } },
      { queryKey: ['experiences'], queryFn: async () => { const res = await experienceService.getAll(); return res.data?.data || res.data || []; } },
    ]
  });

  useEffect(() => {
    // Keep-alive ping to prevent Render sleep while user is on site
    const ping = () => {
      fetch('https://manoj-portfolio-api-lpw5.onrender.com/api/health').catch(() => {});
    };
    ping();
    const interval = setInterval(ping, 10 * 60 * 1000); // 10 mins
    return () => clearInterval(interval);
  }, []);

  return (
    <HelmetProvider>
      <Router>
        <LoadingBar />
        <GoogleAnalytics />
        <div className="min-h-screen bg-[#0f0f11] text-gray-100 flex flex-col font-sans">
          <Navbar />
          <main className="flex-grow">
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<SinglePage />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Suspense>
          </main>
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;

// Production Build: 2026-05-15 (Optimized)
