import React, { useState } from 'react';
import api from '../../services/api';

const COLORS = ['#3b5bdb','#7c3aed','#db2777','#059669','#d97706','#0891b2','#ef4444'];

export default function CreateProjectModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ name: '', description: '', color: '#3b5bdb' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/projects', form);
      onCreated(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>New Project</h2>
          <button onClick={onClose} style={s.close}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <div style={s.error}>{error}</div>}
          <div style={s.field}>
            <label className="form-label">Project name</label>
            <input className="input" placeholder="My awesome project" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div style={s.field}>
            <label className="form-label">Description (optional)</label>
            <textarea className="input" rows={3} placeholder="What's this project about?"
              style={{ resize: 'none' }} value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div style={s.field}>
            <label className="form-label">Color</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => setForm({ ...form, color: c })}
                  style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: form.color === c ? '3px solid #fff' : '3px solid transparent', cursor: 'pointer', outline: form.color === c ? '2px solid #3b5bdb' : 'none' }} />
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 1 }}>
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const s = {
  close: { background: 'none', border: 'none', color: '#64748b', fontSize: 18, cursor: 'pointer', padding: 4 },
  error: { background: '#2d1515', color: '#f87171', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16, border: '1px solid #3d1f1f' },
  field: { marginBottom: 18 },
};
