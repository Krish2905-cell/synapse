import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from '../services/api';
import { useSocket } from '../context/SocketContext';
import TaskModal from './modals/TaskModal';

const COLUMNS = [
  { id: 'todo', label: 'Todo', color: '#64748b', bg: '#1a1f2e' },
  { id: 'inprogress', label: 'In Progress', color: '#3b5bdb', bg: '#1a2040' },
  { id: 'done', label: 'Done', color: '#059669', bg: '#0f2d1f' },
];

export default function KanbanBoard({ projectId, members }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const socketRef = useSocket();

  const fetchTasks = useCallback(async () => {
    const res = await api.get(`/projects/${projectId}/tasks`);
    setTasks(res.data);
    setLoading(false);
  }, [projectId]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  useEffect(() => {
    const socket = socketRef?.current;
    if (!socket) return;
    socket.on('task:created', t => setTasks(prev => [...prev, t]));
    socket.on('task:updated', t => setTasks(prev => prev.map(x => x._id === t._id ? t : x)));
    socket.on('task:deleted', ({ taskId }) => setTasks(prev => prev.filter(x => x._id !== taskId)));
    return () => { socket.off('task:created'); socket.off('task:updated'); socket.off('task:deleted'); };
  }, [socketRef]);

  const handleDragEnd = async ({ draggableId, destination }) => {
    if (!destination) return;
    const newStatus = destination.droppableId;
    setTasks(prev => prev.map(t => t._id === draggableId ? { ...t, status: newStatus } : t));
    await api.put(`/projects/${projectId}/tasks/${draggableId}`, { status: newStatus });
    socketRef?.current?.emit('task:update', { projectId, taskId: draggableId, updates: { status: newStatus } });
  };

  const handleSave = async (form) => {
    if (modal.task) {
      const res = await api.put(`/projects/${projectId}/tasks/${modal.task._id}`, form);
      setTasks(prev => prev.map(t => t._id === res.data._id ? res.data : t));
    } else {
      const res = await api.post(`/projects/${projectId}/tasks`, { ...form, status: modal.status });
      setTasks(prev => [...prev, res.data]);
    }
    setModal(null);
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    await api.delete(`/projects/${projectId}/tasks/${taskId}`);
    setTasks(prev => prev.filter(t => t._id !== taskId));
  };

  if (loading) return (
    <div style={{ display: 'flex', gap: 16, padding: 24 }}>
      {COLUMNS.map(c => <div key={c.id} style={{ width: 280, height: 200, borderRadius: 12, background: '#1a1f2e' }} />)}
    </div>
  );

  return (
    <div style={{ height: '100%', overflow: 'auto', padding: 24 }}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div style={{ display: 'flex', gap: 16, minHeight: '100%' }}>
          {COLUMNS.map(col => {
            const colTasks = tasks.filter(t => t.status === col.id);
            return (
              <div key={col.id} style={{ width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: col.color, display: 'inline-block' }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: col.color }}>{col.label}</span>
                    <span style={{ fontSize: 12, color: '#4a5568', background: '#1a1f2e', padding: '1px 7px', borderRadius: 10 }}>{colTasks.length}</span>
                  </div>
                  <button onClick={() => setModal({ status: col.id })} style={s.addBtn} title="Add task">+</button>
                </div>
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}
                      style={{ flex: 1, borderRadius: 10, padding: 8, minHeight: 120, background: snapshot.isDraggingOver ? col.bg : 'transparent', border: `1px dashed ${snapshot.isDraggingOver ? col.color : '#1e2535'}`, transition: 'all .15s' }}>
                      {colTasks.map((task, index) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided, snapshot) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                              style={{ ...provided.draggableProps.style, background: '#161b27', border: '1px solid #1e2535', borderRadius: 10, padding: 14, marginBottom: 8, cursor: 'grab', boxShadow: snapshot.isDragging ? '0 8px 24px rgba(0,0,0,.5)' : 'none' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <p style={{ fontSize: 14, fontWeight: 500, color: '#e2e8f0', flex: 1 }}>{task.title}</p>
                                <div style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
                                  <button onClick={() => setModal({ task })} style={s.iconBtn}>✏️</button>
                                  <button onClick={() => handleDelete(task._id)} style={s.iconBtn}>🗑️</button>
                                </div>
                              </div>
                              {task.description && <p style={{ fontSize: 12, color: '#64748b', marginTop: 6, lineHeight: 1.5 }}>{task.description}</p>}
                              {task.assignedTo && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
                                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#2d3348', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>
                                    {task.assignedTo.name[0]}
                                  </div>
                                  <span style={{ fontSize: 12, color: '#64748b' }}>{task.assignedTo.name}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
      {modal && <TaskModal task={modal.task} members={members} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  );
}

const s = {
  addBtn: { width: 26, height: 26, borderRadius: 6, background: '#1e2535', border: '1px solid #2d3348', color: '#64748b', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 },
  iconBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, padding: 2, opacity: 0.6 },
};
