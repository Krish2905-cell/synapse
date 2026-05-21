import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import CreateProjectModal from '../components/modals/CreateProjectModal';

const COLORS = ['#3b5bdb','#7c3aed','#db2777','#059669','#d97706','#0891b2'];

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [projRes, invRes] = await Promise.all([api.get('/projects'), api.get('/invitations/mine')]);
      setProjects(projRes.data);
      setInvitations(invRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleRespond = async (id, status) => {
    await api.put(`/invitations/${id}/respond`, { status });
    fetchData();
  };

  const myProjects = projects.filter(p => p.owner._id === user._id);
  const sharedProjects = projects.filter(p => p.owner._id !== user._id);

  return (
    <div style={{ minHeight: '100vh', background: '#0f1117' }}>
      <Navbar />
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '36px 24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>Good morning, {user.name.split(' ')[0]} 👋</h1>
            <p style={{ color: '#64748b', marginTop: 6, fontSize: 14 }}>Here's what's happening across your projects.</p>
          </div>
          <button className="btn-primary" onClick={() => setShowCreate(true)} style={{ width: 'auto', padding: '10px 20px' }}>
            + New Project
          </button>
        </div>

        {/* Invitations */}
        {invitations.length > 0 && (
          <section style={{ marginBottom: 36 }}>
            <p style={s.sectionLabel}>Pending Invitations ({invitations.length})</p>
            <div style={s.grid}>
              {invitations.map(inv => (
                <div key={inv._id} style={{ ...s.card, borderLeft: '3px solid #3b5bdb' }}>
                  <p style={{ fontWeight: 600, color: '#e2e8f0' }}>{inv.projectId?.name}</p>
                  <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Invited by {inv.senderId?.name}</p>
                  <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                    <button className="btn-primary" style={{ width: 'auto', padding: '7px 16px', fontSize: 13 }} onClick={() => handleRespond(inv._id, 'accepted')}>Accept</button>
                    <button className="btn-secondary" style={{ padding: '7px 16px', fontSize: 13 }} onClick={() => handleRespond(inv._id, 'rejected')}>Decline</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {loading ? (
          <div style={s.grid}>
            {[...Array(4)].map((_, i) => <div key={i} style={s.skeleton} />)}
          </div>
        ) : (
          <>
            <section style={{ marginBottom: 36 }}>
              <p style={s.sectionLabel}>My Projects ({myProjects.length})</p>
              {myProjects.length === 0 ? (
                <div style={{ ...s.card, textAlign: 'center', padding: 56, color: '#4a5568' }}>
                  <div style={{ fontSize: 44, marginBottom: 12 }}>📁</div>
                  <p style={{ fontWeight: 500, color: '#64748b' }}>No projects yet</p>
                  <p style={{ fontSize: 13, marginTop: 6 }}>Create your first project to get started</p>
                </div>
              ) : (
                <div style={s.grid}>
                  {myProjects.map(p => <ProjectCard key={p._id} project={p} onClick={() => navigate(`/project/${p._id}`)} />)}
                </div>
              )}
            </section>

            {sharedProjects.length > 0 && (
              <section>
                <p style={s.sectionLabel}>Shared with me ({sharedProjects.length})</p>
                <div style={s.grid}>
                  {sharedProjects.map(p => <ProjectCard key={p._id} project={p} onClick={() => navigate(`/project/${p._id}`)} />)}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {showCreate && (
        <CreateProjectModal onClose={() => setShowCreate(false)} onCreated={p => { setProjects(prev => [...prev, p]); setShowCreate(false); }} />
      )}
    </div>
  );
}

function ProjectCard({ project, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ ...s.card, cursor: 'pointer', transform: hovered ? 'translateY(-3px)' : 'none', boxShadow: hovered ? '0 8px 24px rgba(0,0,0,.4)' : '0 2px 8px rgba(0,0,0,.3)', transition: 'all .15s' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ width: 42, height: 42, borderRadius: 10, background: project.color || '#3b5bdb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 20 }}>
          {project.name[0].toUpperCase()}
        </div>
        <span style={{ fontSize: 12, color: '#64748b', background: '#1a1f2e', padding: '3px 10px', borderRadius: 20, border: '1px solid #2d3348' }}>
          {(project.members?.length || 0) + 1} members
        </span>
      </div>
      <p style={{ fontWeight: 600, fontSize: 15, color: '#e2e8f0' }}>{project.name}</p>
      {project.description && <p style={{ fontSize: 13, color: '#64748b', marginTop: 6, lineHeight: 1.5 }}>{project.description}</p>}
      <p style={{ fontSize: 12, color: '#374151', marginTop: 14 }}>{new Date(project.updatedAt).toLocaleDateString()}</p>
    </div>
  );
}

const s = {
  sectionLabel: { fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 },
  card: { background: '#161b27', borderRadius: 12, border: '1px solid #1e2535', boxShadow: '0 2px 8px rgba(0,0,0,.3)', padding: 20 },
  skeleton: { height: 150, borderRadius: 12, background: '#1a1f2e' },
};
