import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children, width = 480 }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 999,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="card fade-in"
        style={{
          width, maxWidth: '95vw',
          maxHeight: '90vh', overflowY: 'auto',
          padding: 28, position: 'relative',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontWeight: 800, fontSize: 18 }}>{title}</h3>
          <button onClick={onClose} style={{
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            borderRadius: 6, width: 30, height: 30,
            cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}