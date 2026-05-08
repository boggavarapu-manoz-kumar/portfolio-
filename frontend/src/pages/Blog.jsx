import { useState, useEffect } from 'react';
import { blogService } from '../services/apiServices';
import { Calendar } from 'lucide-react';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogService.getAll()
      .then(res => setBlogs(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20 animate-pulse">Loading articles...</div>;

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h2 className="text-4xl font-bold mb-10 text-center">Tech Articles</h2>
      <div className="space-y-8">
        {blogs.map(blog => (
          <article key={blog.id} className="bg-slate-800 p-8 rounded-3xl border border-slate-700 hover:border-slate-500 transition-colors cursor-pointer group">
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
              <Calendar size={16} />
              <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
            </div>
            <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors">{blog.title}</h3>
            <p className="text-slate-300 line-clamp-3">{blog.content}</p>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Blog;
