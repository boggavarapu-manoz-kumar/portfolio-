import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/918309489241"
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      style={{
        position: 'fixed',
        bottom: '32px',
        right: '32px',
        width: '64px',
        height: '64px',
        background: '#25D366',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        boxShadow: '0 8px 32px rgba(37, 211, 102, 0.4)',
        zIndex: 1000,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        border: 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1) translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(37, 211, 102, 0.6)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1) translateY(0)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(37, 211, 102, 0.4)';
      }}
    >
      <MessageCircle size={32} fill="currentColor" />
      <span style={{
        position: 'absolute',
        right: '80px',
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(10px)',
        padding: '8px 16px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '700',
        color: '#fff',
        whiteSpace: 'nowrap',
        opacity: 0,
        transform: 'translateX(10px)',
        transition: 'all 0.3s ease',
        pointerEvents: 'none',
        border: '1px solid rgba(255,255,255,0.1)'
      }} className="wa-tooltip">
        Chat with me
      </span>
      <style>{`
        a:hover .wa-tooltip {
          opacity: 1;
          transform: translateX(0);
        }
      `}</style>
    </a>
  );
};

export default WhatsAppButton;
