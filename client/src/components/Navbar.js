import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Navbar() {
  const { user, logout, updateAvatar } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  // Preview URL shown immediately after the user picks a file (before upload completes)
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Open the hidden file input when the avatar is clicked
  const handleAvatarClick = () => {
    setUploadError('');
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation before hitting the server
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setUploadError('Only jpg, jpeg, png, webp allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File must be under 5 MB');
      return;
    }

    // Show a local preview immediately — no waiting for Cloudinary
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const res = await api.post('/upload/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      // Update global user state with the Cloudinary URL — no page reload
      updateAvatar(res.data.avatar);
      setPreview(null); // Cloudinary URL now in user.avatar, drop the blob URL
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Upload failed');
      setPreview(null); // Revert preview on failure
    } finally {
      setUploading(false);
      // Reset input so the same file can be re-selected after an error
      e.target.value = '';
    }
  };

  // Determine what to render inside the avatar circle
  const avatarContent = () => {
    const src = preview || user?.avatar;
    if (src) {
      return (
        <img
          src={src}
          alt="avatar"
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
        />
      );
    }
    return user?.name?.[0]?.toUpperCase();
  };

  return (
    <nav style={s.nav}>
      <Link to="/dashboard" style={s.logo}>
        <div style={s.logoIcon}>S</div>
        <span style={s.logoText}>Synapse</span>
      </Link>

      <div style={{ position: 'relative' }}>
        {/* Hidden file input — triggered by clicking the avatar */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {/* Avatar button — click opens menu, the upload icon inside triggers file picker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Upload trigger: the avatar circle itself */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                ...s.avatar,
                padding: 0,
                overflow: 'hidden',
                opacity: uploading ? 0.6 : 1,
              }}
              title="Open menu"
            >
              {avatarContent()}
            </button>

            {/* Small camera badge — click this to upload */}
            <button
              onClick={handleAvatarClick}
              disabled={uploading}
              title={uploading ? 'Uploading...' : 'Change avatar'}
              style={s.cameraBadge}
            >
              {uploading ? '⏳' : '📷'}
            </button>
          </div>
        </div>

        {/* Upload error toast */}
        {uploadError && (
          <div style={s.errorToast}>
            {uploadError}
            <button onClick={() => setUploadError('')} style={s.errorClose}>✕</button>
          </div>
        )}

        {/* Dropdown menu */}
        {menuOpen && (
          <div style={s.menu} onClick={() => setMenuOpen(false)}>
            <div style={s.menuHeader}>
              {/* Avatar preview inside the menu */}
              <div style={s.menuAvatar}>
                {(preview || user?.avatar) ? (
                  <img
                    src={preview || user.avatar}
                    alt="avatar"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                  />
                ) : (
                  <span style={{ fontSize: 18, fontWeight: 700, color: '#94a3b8' }}>
                    {user?.name?.[0]?.toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: 14, color: '#e2e8f0' }}>{user?.name}</p>
                <p style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{user?.email}</p>
              </div>
            </div>

            {/* Change avatar option inside menu */}
            <button
              onClick={(e) => { e.stopPropagation(); handleAvatarClick(); }}
              style={s.menuItemNeutral}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : '📷 Change avatar'}
            </button>

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
  avatar: { width: 36, height: 36, borderRadius: '50%', background: '#1e2535', color: '#94a3b8', fontWeight: 700, fontSize: 14, border: '1px solid #2d3348', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cameraBadge: { position: 'absolute', bottom: -2, right: -2, width: 16, height: 16, borderRadius: '50%', background: '#3b5bdb', border: '1.5px solid #161b27', fontSize: 9, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, lineHeight: 1 },
  menu: { position: 'absolute', right: 0, top: 44, background: '#161b27', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,.5)', border: '1px solid #1e2535', width: 220, zIndex: 50, overflow: 'hidden' },
  menuHeader: { padding: '14px 16px', borderBottom: '1px solid #1e2535', display: 'flex', alignItems: 'center', gap: 12 },
  menuAvatar: { width: 40, height: 40, borderRadius: '50%', background: '#2d3348', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' },
  menuItemNeutral: { width: '100%', textAlign: 'left', padding: '11px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#94a3b8' },
  menuItem: { width: '100%', textAlign: 'left', padding: '11px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#f87171' },
  errorToast: { position: 'absolute', right: 0, top: 44, background: '#2d1515', color: '#f87171', border: '1px solid #3d1f1f', borderRadius: 8, padding: '10px 14px', fontSize: 13, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 10, zIndex: 60 },
  errorClose: { background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: 14, padding: 0, lineHeight: 1 },
};
