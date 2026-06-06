import { useState } from 'react';
import Modal from '../ui/Modal';
import useCryptoStore from '../../store/useCryptoStore';

export default function PortfolioModal({ isOpen, onClose }) {
  const { coins, addToPortfolio } = useCryptoStore();
  const [form, setForm] = useState({ id: '', quantity: '', purchasePrice: '' });
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!form.id || !form.quantity || !form.purchasePrice) {
      setError('All fields are required'); return;
    }
    addToPortfolio({
      id: form.id,
      quantity: parseFloat(form.quantity),
      purchasePrice: parseFloat(form.purchasePrice),
    });
    setForm({ id: '', quantity: '', purchasePrice: '' });
    setError('');
    onClose();
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 8, color: 'var(--text-primary)',
    fontFamily: 'Syne, sans-serif', fontSize: 14, outline: 'none',
  };

  const labelStyle = { fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, display: 'block', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add to Portfolio">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={labelStyle}>Coin</label>
          <select
            value={form.id}
            onChange={(e) => setForm({ ...form, id: e.target.value })}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            <option value="">Select a coin...</option>
            {coins.map((c) => (
              <option key={c.id} value={c.id}>{c.name} ({c.symbol.toUpperCase()})</option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Quantity</label>
          <input
            type="number" placeholder="0.00" min="0" step="any"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Purchase Price (USD)</label>
          <input
            type="number" placeholder="0.00" min="0" step="any"
            value={form.purchasePrice}
            onChange={(e) => setForm({ ...form, purchasePrice: e.target.value })}
            style={inputStyle}
          />
        </div>
        {error && <p style={{ color: 'var(--accent-red)', fontSize: 13 }}>{error}</p>}
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button className="btn-ghost" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit} style={{ flex: 2 }}>Add to Portfolio</button>
        </div>
      </div>
    </Modal>
  );
}