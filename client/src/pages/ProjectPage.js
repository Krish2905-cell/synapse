import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import Navbar from '../components/Navbar';

import KanbanBoard from '../components/KanbanBoard';
import ChatPanel from '../components/ChatPanel';
import NotesPanel from '../components/NotesPanel';
import WhiteboardPanel from '../components/WhiteboardPanel';
import InviteModal from '../components/modals/InviteModal';

const TABS = ['Kanban', 'Chat', 'Notes', 'Whiteboard'];
const TAB_ICONS = { Kanban: '📋', Chat: '💬', Notes: '📝', Whiteboard: '🎨' };

export default function ProjectPage() {
  const { projectId } = useParams();
  const { user } = useAuth();
  const { socketRef, socket } = useSocket();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState('Kanban');
  const [showInvite, setShowInvite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/projects/${projectId}`)
      .then(res => setProject(res.data))
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false));
  }, [projectId, navigate]);

  // Join the project room once the socket is connected.
  // Depends on `socket` (the instance), not just the ref, so it re-runs
  // when the socket connects/reconnects — fixing the race condition.
  useEffect(() => {
    if (!socket || !projectId) return;
    socket.emit('join:project', projectId);
    console.log('[Socket] Emitted join:project', projectId);
    return () => {
      socket.emit('leave:project', projectId);
      console.log('[Socket] Emitted leave:project', projectId);
    };
  }, [socket, projectId]);

  const isOwner = project?.owner._id === user._id;

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0f1117' }}>
      <Navbar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400 }}>
        <div style={s.spinner} />
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0f1117', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Project Header */}
      <div style={s.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: project?.color || '#3b5bdb' }} />
          <span style={{ fontWeight: 600, color: '#e2e8f0', fontSize: 16 }}>{project?.name}</span>
          {project?.description && <span style={{ color: '#64748b', fontSize: 14 }}>— {project.description}</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex' }}>
            {[project?.owner, ...(project?.members || [])].slice(0, 5).map((m, i) => m && (
              <div key={m._id} title={m.name} style={{ ...s.memberAvatar, marginLeft: i > 0 ? -8 : 0 }}>
                {m.name[0].toUpperCase()}
              </div>
            ))}
          </div>
          {isOwner && (
            <button className="btn-secondary" onClick={() => setShowInvite(true)} style={{ fontSize: 13, padding: '7px 14px' }}>
              + Invite
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={s.tabBar}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ ...s.tab, ...(activeTab === tab ? s.tabActive : {}) }}>
            <span>{TAB_ICONS[tab]}</span> {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {activeTab === 'Kanban' && <KanbanBoard projectId={projectId} members={[project?.owner, ...(project?.members || [])]} />}
        {activeTab === 'Chat' && <ChatPanel projectId={projectId} />}
        {activeTab === 'Notes' && <NotesPanel projectId={projectId} />}
        {activeTab === 'Whiteboard' && <WhiteboardPanel projectId={projectId} />}
      </div>

      {showInvite && <InviteModal projectId={projectId} onClose={() => setShowInvite(false)} />}
    </div>
  );
}

const s = {
  header: { background: '#161b27', borderBottom: '1px solid #1e2535', padding: '12px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  tabBar: { background: '#161b27', borderBottom: '1px solid #1e2535', display: 'flex', padding: '0 28px', gap: 4 },
  tab: { padding: '12px 16px', background: 'none', border: 'none', borderBottom: '2px solid transparent', color: '#64748b', fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'color .15s' },
  tabActive: { borderBottomColor: '#3b5bdb', color: '#3b5bdb' },
  memberAvatar: { width: 30, height: 30, borderRadius: '50%', background: '#2d3348', border: '2px solid #161b27', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 12, fontWeight: 600 },
  spinner: { width: 36, height: 36, border: '3px solid #1e2535', borderTopColor: '#3b5bdb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
};
