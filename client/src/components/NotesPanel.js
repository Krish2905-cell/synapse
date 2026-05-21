import React, { useState, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';

export default function NotesPanel({ projectId }) {
  const [notes, setNotes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const saveTimer = useRef(null);

  const fetchNotes = useCallback(async () => {
    const res = await api.get(`/projects/${projectId}/notes`);
    setNotes(res.data);
    setLoading(false);
  }, [projectId]);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const createNote = async () => {
    const res = await api.post(`/projects/${projectId}/notes`, { title: 'Untitled Note' });
    setNotes(prev => [res.data, ...prev]);
    setSelected(res.data);
  };

  const updateSelected = (field, value) => {
    setSelected(prev => ({ ...prev, [field]: value }));
    setNotes(prev => prev.map(n => n._id === selected._id ? { ...n, [field]: value } : n));
    clearTimeout(saveTimer.current);
    setSaving(true);
    saveTimer.current = setTimeout(async () => {
      await api.put(`/projects/${projectId}/notes/${selected._id}`, { [field]: value });
      setSaving(false);
    }, 800);
  };

  const deleteNote = async (noteId) => {
    if (!window.confirm('Delete this note?')) return;
    await api.delete(`/projects/${projectId}/notes/${noteId}`);
    setNotes(prev => prev.filter(n => n._id !== noteId));
    if (selected?._id === noteId) setSelected(null);
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 160px)' }}>
      {/* Sidebar */}
      <div style={{ width: 240, borderRight: '1px solid #1e2535', background: '#161b27', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #1e2535', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>Notes</span>
          <button onClick={createNote} style={{ background: 'none', border: 'none', color: '#3b5bdb', fontSize: 22, cursor: 'pointer', lineHeight: 1 }}>+</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: 16, color: '#4a5568', fontSize: 13 }}>Loading...</div>
          ) : notes.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', color: '#4a5568' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>📝</div>
              <p style={{ fontSize: 13 }}>No notes yet</p>
            </div>
          ) : notes.map(note => (
            <div key={note._id} onClick={() => setSelected(note)}
              style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #1a1f2e', background: selected?._id === note._id ? '#1e2535' : 'transparent', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: selected?._id === note._id ? '#e2e8f0' : '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {note.title || 'Untitled'}
                </p>
                <p style={{ fontSize: 11, color: '#4a5568', marginTop: 2 }}>{new Date(note.updatedAt).toLocaleDateString()}</p>
              </div>
              <button onClick={e => { e.stopPropagation(); deleteNote(note._id); }}
                style={{ background: 'none', border: 'none', color: '#4a5568', cursor: 'pointer', fontSize: 16, marginLeft: 8 }}>×</button>
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0f1117' }}>
        {selected ? (
          <>
            <div style={{ padding: '20px 32px 12px', borderBottom: '1px solid #1e2535', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <input value={selected.title} onChange={e => updateSelected('title', e.target.value)}
                style={{ background: 'none', border: 'none', outline: 'none', fontSize: 20, fontWeight: 700, color: '#e2e8f0', flex: 1 }} placeholder="Note title" />
              {saving && <span style={{ fontSize: 12, color: '#4a5568' }}>Saving...</span>}
            </div>
            <textarea value={selected.content} onChange={e => updateSelected('content', e.target.value)}
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', padding: '20px 32px', fontSize: 14, color: '#94a3b8', lineHeight: 1.8, resize: 'none' }}
              placeholder="Start writing..." />
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4a5568' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📄</div>
              <p>Select a note or create one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
