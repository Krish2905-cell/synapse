import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <div style={s.logo}>
          <div style={s.logoIcon}>S</div>
          <span style={s.logoText}>Synapse</span>
        </div>
        <Link to="/login" style={s.navLink}>Features</Link>
      </nav>

      <div style={s.container}>
        <div style={s.formBox}>
          <h1 style={s.title}>Create your account</h1>
          <p style={s.subtitle}>Join ProductivityHub and start organizing your work</p>

          <form onSubmit={handleSubmit} style={{ marginTop: 32 }}>
            {error && <div style={s.error}>{error}</div>}
            
            <div style={s.field}>
              <label className="form-label">Full name</label>
              <input className="input" type="text" placeholder="Enter your full name"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>

            <div style={s.field}>
              <label className="form-label">Email address</label>
              <input className="input" type="email" placeholder="Enter your email"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>

            <div style={s.field}>
              <label className="form-label">Password</label>
              <input className="input" type="password" placeholder="Create a password"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>

            <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p style={s.footer}>
            Already have an account? <Link to="/login" style={s.link}>Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', background: '#0f1117', color: '#e2e8f0' },
  nav: { height: 64, borderBottom: '1px solid #1e2535', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px' },
  logo: { display: 'flex', alignItems: 'center', gap: 10 },
  logoIcon: { width: 36, height: 36, background: '#3b5bdb', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18 },
  logoText: { fontSize: 20, fontWeight: 700, color: '#fff' },
  navLink: { color: '#94a3b8', fontSize: 14, textDecoration: 'none', fontWeight: 500 },
  container: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: 24 },
  formBox: { width: '100%', maxWidth: 420 },
  title: { fontSize: 28, fontWeight: 700, color: '#fff', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#64748b', textAlign: 'center', marginTop: 8 },
  error: { background: '#2d1515', color: '#f87171', padding: '12px 16px', borderRadius: 8, fontSize: 14, marginBottom: 16, border: '1px solid #3d1f1f' },
  field: { marginBottom: 18 },
  footer: { textAlign: 'center', fontSize: 14, color: '#64748b', marginTop: 24 },
  link: { color: '#3b5bdb', fontWeight: 600, textDecoration: 'none' },
};
