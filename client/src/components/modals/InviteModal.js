import React, { useState } from 'react';
import api from '../../services/api';

export default function InviteModal({ projectId, onClose }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      await api.post('/invitations', { projectId, receiverEmail: email });
      setSuccess(`Invitation sent to ${email}`);
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send invitation');
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>Invite to Project</h2>
          <button onClick={onClose} style={s.close}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <div style={s.error}>{error}</div>}
          {success && <div style={s.success}>{success}</div>}
          <div style={{ marginBottom: 18 }}>
            <label className="form-label">Email address</label>
            <input className="input" type="email" placeholder="colleague@example.com"
              value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Close</button>
            <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 1 }}>
              {loading ? 'Sending...' : 'Send Invite'}
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
  success: { background: '#0f2d1f', color: '#4ade80', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16, border: '1px solid #1a4d30' },
};
