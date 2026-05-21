import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav style={s.nav}>
      <Link to="/dashboard" style={s.logo}>
        <div style={s.logoIcon}>S</div>
        <span style={s.logoText}>Synapse</span>
      </Link>
      <div style={{ position: 'relative' }}>
        <button onClick={() => setMenuOpen(!menuOpen)} style={s.avatar}>
          {user?.name?.[0]?.toUpperCase()}
        </button>
        {menuOpen && (
          <div style={s.menu}>
            <div style={s.menuHeader}>
              <p style={{ fontWeight: 600, fontSize: 14, color: '#e2e8f0' }}>{user?.name}</p>
              <p style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{user?.email}</p>
            </div>
            <button onClick={handleLogout} style={s.menuItem}>Sign out</button>
          </div>
        )}
      </div>
    </nav>
  );
}

const s = {
  nav: { background: '#161b27', borderBottom: '1px solid #1e2535', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', position: 'sticky', top: 0, zIndex: 40 },
  logo: { display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' },
  logoIcon: { width: 34, height: 34, background: '#3b5bdb', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 17 },
  logoText: { fontSize: 18, fontWeight: 700, color: '#fff' },
  avatar: { width: 36, height: 36, borderRadius: '50%', background: '#1e2535', color: '#94a3b8', fontWeight: 700, fontSize: 14, border: '1px solid #2d3348', cursor: 'pointer' },
  menu: { position: 'absolute', right: 0, top: 44, background: '#161b27', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,.5)', border: '1px solid #1e2535', width: 200, zIndex: 50, overflow: 'hidden' },
  menuHeader: { padding: '14px 16px', borderBottom: '1px solid #1e2535' },
  menuItem: { width: '100%', textAlign: 'left', padding: '11px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#f87171' },
};
