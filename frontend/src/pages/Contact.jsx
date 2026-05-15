import { useState } from 'react';
import { Mail, Camera, Briefcase, Send } from 'lucide-react';
import { contactService } from '../services/apiServices';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      // 1. Save to database for your records in Admin Panel
      await contactService.create(form);
      
      // 2. Build WhatsApp URL
      const text = `*New Portfolio Message*\n\n*Name:* ${form.name}\n*Email:* ${form.email}\n\n*Message:*\n${form.message}`;
      const encodedText = encodeURIComponent(text);
      const whatsappUrl = `https://wa.me/919573127515?text=${encodedText}`;
      
      // 3. Open WhatsApp instantly
      window.open(whatsappUrl, '_blank');
      
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Contact Error:', error);
      setStatus({ type: 'error', message: 'Something went wrong. Please try the WhatsApp button directly!' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center space-y-4 mb-16">
        <p className="text-sm font-semibold tracking-[0.2em] text-gray-400">CONTACT</p>
        <h2 className="text-4xl md:text-5xl font-bold text-white">Get in Touch</h2>
        <p className="text-gray-300 max-w-2xl mx-auto pt-4 leading-relaxed">
          I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Contact Info */}
        <div className="flex-1 space-y-8">
          <div className="bg-[#1a1a1c] border border-gray-800 p-6 rounded-3xl flex items-center gap-6 hover:bg-[#1f1f22] transition-colors">
            <div className="bg-[#2a2a2e] p-4 rounded-2xl text-blue-400">
              <Mail size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Email</p>
              <a href="mailto:manozkumarboggavarapu@gmail.com" className="text-white font-medium hover:text-blue-400 transition-colors">
                manozkumarboggavarapu@gmail.com
              </a>
            </div>
          </div>

          <div className="bg-[#1a1a1c] border border-gray-800 p-6 rounded-3xl flex items-center gap-6 hover:bg-[#1f1f22] transition-colors">
            <div className="bg-[#2a2a2e] p-4 rounded-2xl text-pink-500">
              <Camera size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Instagram</p>
              <a href="https://instagram.com/ft.manoz" target="_blank" rel="noreferrer" className="text-white font-medium hover:text-pink-500 transition-colors">
                ft.manoz
              </a>
            </div>
          </div>

          <div className="bg-[#1a1a1c] border border-gray-800 p-6 rounded-3xl flex items-center gap-6 hover:bg-[#1f1f22] transition-colors">
            <div className="bg-[#2a2a2e] p-4 rounded-2xl text-blue-500">
              <Briefcase size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">LinkedIn</p>
              <a href="https://www.linkedin.com/in/manojboggavarapu/" target="_blank" rel="noreferrer" className="text-white font-medium hover:text-blue-500 transition-colors">
                MANOJ BOGGAVARAPU
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="flex-[1.2] bg-[#1a1a1c] border border-gray-800 rounded-3xl p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-300">Name</label>
              <input 
                required 
                id="name"
                type="text" 
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})}
                className="w-full bg-[#0f0f11] border border-gray-800 rounded-xl p-4 text-white focus:outline-none focus:border-gray-500 transition-colors" 
                placeholder="John Doe" 
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-300">Email</label>
              <input 
                required 
                id="email"
                type="email" 
                value={form.email} 
                onChange={e => setForm({...form, email: e.target.value})}
                className="w-full bg-[#0f0f11] border border-gray-800 rounded-xl p-4 text-white focus:outline-none focus:border-gray-500 transition-colors" 
                placeholder="john@example.com" 
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-gray-300">Message</label>
              <textarea 
                required 
                id="message"
                value={form.message} 
                onChange={e => setForm({...form, message: e.target.value})}
                className="w-full bg-[#0f0f11] border border-gray-800 rounded-xl p-4 text-white focus:outline-none focus:border-gray-500 transition-colors h-32 resize-none" 
                placeholder="Hello, I'd like to talk about..." 
              />
            </div>
            <button 
              type="submit" 
              disabled={status === 'sending'}
              className="w-full bg-white text-black font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {status === 'sending' ? 'Sending...' : (
                <>
                  <Send size={20} /> Send Message
                </>
              )}
            </button>
            {status === 'success' && <p className="text-green-500 text-center mt-4 font-bold">Message sent successfully!</p>}
            {status?.type === 'error' && <p className="text-red-500 text-center mt-4 font-bold">{status.message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
