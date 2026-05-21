import React, { useState } from 'react';

export default function TaskModal({ task, members, onSave, onClose }) {
  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'todo',
    assignedTo: task?.assignedTo?._id || '',
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>{task ? 'Edit Task' : 'New Task'}</h2>
          <button onClick={onClose} style={s.close}>✕</button>
        </div>
        <form onSubmit={e => { e.preventDefault(); onSave(form); }}>
          <div style={s.field}>
            <label className="form-label">Title</label>
            <input className="input" placeholder="Task title" value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div style={s.field}>
            <label className="form-label">Description</label>
            <textarea className="input" rows={3} placeholder="Add details..." style={{ resize: 'none' }}
              value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div style={s.field}>
            <label className="form-label">Status</label>
            <select className="input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option value="todo">Todo</option>
              <option value="inprogress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div style={s.field}>
            <label className="form-label">Assign to</label>
            <select className="input" value={form.assignedTo} onChange={e => setForm({ ...form, assignedTo: e.target.value })}>
              <option value="">Unassigned</option>
              {members?.filter(Boolean).map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>{task ? 'Save Changes' : 'Create Task'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const s = {
  close: { background: 'none', border: 'none', color: '#64748b', fontSize: 18, cursor: 'pointer', padding: 4 },
  field: { marginBottom: 18 },
};
