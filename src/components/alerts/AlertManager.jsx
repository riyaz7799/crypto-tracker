import { useState } from 'react';
import Modal from '../ui/Modal';
import useCryptoStore from '../../store/useCryptoStore';
import { formatPrice } from '../../utils/formatters';

export default function AlertManager({ isOpen, onClose }) {
  const { coins, alerts, addAlert, removeAlert } = useCryptoStore();
  const [form, setForm] = useState({ id: '', targetPrice: '', condition: 'above' });
  const [error, setError] = useState('');

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    background: 'var(--bg-secondary)', border: '1px solid var(--border)',
    borderRadius: 8, color: 'var(--text-primary)',
    fontFamily: 'Syne, sans-serif', fontSize: 14, outline: 'none',
  };
  const labelStyle = { fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, display: 'block', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' };

  const handleAdd = () => {
    if (!form.id || !form.targetPrice) { setError('All fields required'); return; }
    addAlert({ id: form.id, targetPrice: parseFloat(form.targetPrice), condition: form.condition });
    setForm({ id: '', targetPrice: '', condition: 'above' });
    setError('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Price Alerts" width={520}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={labelStyle}>Coin</label>
            <select value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="">Select...</option>
              {coins.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Condition</label>
            <select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="above">Price Above</option>
              <option value="below">Price Below</option>
            </select>
          </div>
        </div>
        <div>
          <label style={labelStyle}>Target Price (USD)</label>
          <input type="number" placeholder="0.00" value={form.targetPrice} onChange={(e) => setForm({ ...form, targetPrice: e.target.value })} style={inputStyle} />
        </div>
        {error && <p style={{ color: 'var(--accent-red)', fontSize: 13 }}>{error}</p>}
        <button className="btn-primary" onClick={handleAdd}>Set Alert</button>

        {/* Existing Alerts */}
        {alerts.length > 0 && (
          <div style={{ marginTop: 8, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Alerts</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {alerts.map((a, i) => {
                const coin = coins.find((c) => c.id === a.id);
                return (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 14px', background: 'var(--bg-secondary)',
                    borderRadius: 8, border: '1px solid var(--border)',
                  }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{coin?.name || a.id}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 8 }}>
                        {a.condition} {formatPrice(a.targetPrice)}
                      </span>
                    </div>
                    <button onClick={() => removeAlert(a.id)} style={{
                      background: 'none', border: 'none', color: 'var(--accent-red)',
                      cursor: 'pointer', fontSize: 18, lineHeight: 1,
                    }}>×</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}