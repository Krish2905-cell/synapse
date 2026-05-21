import React, { useState, useEffect, useRef, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

export default function ChatPanel({ projectId }) {
  const { user } = useAuth();
  const { socketRef, socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  const fetchMessages = useCallback(async () => {
    const res = await api.get(`/projects/${projectId}/messages`);
    setMessages(res.data);
    setLoading(false);
  }, [projectId]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  // Depend on `socket` instance to avoid the race condition where
  // socketRef.current was null when the effect first ran.
  useEffect(() => {
    if (!socket) return;
    console.log('[ChatPanel] Attaching socket listeners');

    const onMessage = (msg) => {
      console.log('[ChatPanel] chat:message received', msg._id);
      setMessages(prev => {
        if (prev.some(m => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    };

    socket.on('chat:message', onMessage);
    return () => socket.off('chat:message', onMessage);
  }, [socket]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    socketRef?.current?.emit('chat:send', { projectId, content: input.trim(), userId: user._id });
    setInput('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 160px)' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
        {loading ? (
          <div style={{ color: '#64748b', textAlign: 'center', marginTop: 40 }}>Loading messages...</div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#4a5568', marginTop: 60 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map(msg => {
            const isMe = msg.senderId._id === user._id;
            return (
              <div key={msg._id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', marginBottom: 16 }}>
                {!isMe && (
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#2d3348', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontWeight: 600, fontSize: 13, marginRight: 10, flexShrink: 0 }}>
                    {msg.senderId.name[0]}
                  </div>
                )}
                <div style={{ maxWidth: '65%' }}>
                  {!isMe && <p style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>{msg.senderId.name}</p>}
                  <div style={{ background: isMe ? '#3b5bdb' : '#1e2535', color: isMe ? '#fff' : '#e2e8f0', padding: '10px 14px', borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px', fontSize: 14, lineHeight: 1.5 }}>
                    {msg.content}
                  </div>
                  <p style={{ fontSize: 11, color: '#374151', marginTop: 4, textAlign: isMe ? 'right' : 'left' }}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ borderTop: '1px solid #1e2535', background: '#161b27', padding: '16px 28px' }}>
        <form onSubmit={sendMessage} style={{ display: 'flex', gap: 12 }}>
          <input className="input" placeholder="Type a message..." value={input}
            onChange={e => setInput(e.target.value)} style={{ flex: 1 }} />
          <button className="btn-primary" type="submit" disabled={!input.trim()} style={{ width: 'auto', padding: '10px 20px' }}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
