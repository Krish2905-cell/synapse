import React, { useRef, useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import { useSocket } from '../context/SocketContext';

const TOOLS = [
  { id: 'pen', label: '✏️ Pen' },
  { id: 'rect', label: '▭ Rect' },
  { id: 'circle', label: '○ Circle' },
  { id: 'line', label: '/ Line' },
  { id: 'eraser', label: '⌫ Eraser' },
];
const COLORS = ['#e2e8f0','#3b5bdb','#ef4444','#f59e0b','#10b981','#8b5cf6','#ec4899'];

export default function WhiteboardPanel({ projectId }) {
  const canvasRef = useRef(null);
  const { socketRef, socket } = useSocket();
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#e2e8f0');
  const [lineWidth, setLineWidth] = useState(3);
  const [drawing, setDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [elements, setElements] = useState([]);
  const snapshotRef = useRef(null);

  const redraw = useCallback((els) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0f1117';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    els.forEach(el => drawElement(ctx, el));
  }, []);

  useEffect(() => {
    api.get(`/projects/${projectId}/whiteboard`).then(res => {
      setElements(res.data.elements || []);
      redraw(res.data.elements || []);
    });
  }, [projectId, redraw]);

  // Depend on `socket` instance to avoid the race condition.
  useEffect(() => {
    if (!socket) return;
    console.log('[WhiteboardPanel] Attaching socket listeners');

    const onUpdate = ({ elements: els }) => {
      console.log('[WhiteboardPanel] whiteboard:update received, elements:', els.length);
      setElements(els);
      redraw(els);
    };

    socket.on('whiteboard:update', onUpdate);
    return () => socket.off('whiteboard:update', onUpdate);
  }, [socket, redraw]);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onMouseDown = (e) => {
    const pos = getPos(e);
    setDrawing(true);
    setStartPos(pos);
    const ctx = canvasRef.current.getContext('2d');
    snapshotRef.current = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    if (tool === 'pen' || tool === 'eraser') { ctx.beginPath(); ctx.moveTo(pos.x, pos.y); }
  };

  const onMouseMove = (e) => {
    if (!drawing) return;
    const pos = getPos(e);
    const ctx = canvasRef.current.getContext('2d');
    if (tool === 'pen' || tool === 'eraser') {
      ctx.lineWidth = tool === 'eraser' ? 20 : lineWidth;
      ctx.strokeStyle = tool === 'eraser' ? '#0f1117' : color;
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.lineTo(pos.x, pos.y); ctx.stroke();
    } else {
      ctx.putImageData(snapshotRef.current, 0, 0);
      drawShape(ctx, tool, startPos, pos, color, lineWidth);
    }
  };

  const onMouseUp = (e) => {
    if (!drawing) return;
    setDrawing(false);
    const pos = getPos(e);
    const updated = [...elements, { tool, color, lineWidth, startPos, endPos: pos }];
    setElements(updated);
    socketRef?.current?.emit('whiteboard:draw', { projectId, elements: updated });
    socketRef?.current?.emit('whiteboard:save', { projectId, elements: updated });
  };

  const clearBoard = async () => {
    if (!window.confirm('Clear the whiteboard?')) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.fillStyle = '#0f1117';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setElements([]);
    await api.put(`/projects/${projectId}/whiteboard`, { elements: [] });
    socketRef?.current?.emit('whiteboard:draw', { projectId, elements: [] });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 160px)', background: '#0f1117' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px', borderBottom: '1px solid #1e2535', background: '#161b27', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {TOOLS.map(t => (
            <button key={t.id} onClick={() => setTool(t.id)}
              style={{ padding: '6px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, background: tool === t.id ? '#3b5bdb' : '#1e2535', color: tool === t.id ? '#fff' : '#94a3b8', transition: 'all .15s' }}>
              {t.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {COLORS.map(c => (
            <button key={c} onClick={() => setColor(c)}
              style={{ width: 22, height: 22, borderRadius: '50%', background: c, border: color === c ? '2px solid #fff' : '2px solid transparent', cursor: 'pointer', outline: color === c ? '2px solid #3b5bdb' : 'none' }} />
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: '#64748b' }}>Size</span>
          <input type="range" min="1" max="20" value={lineWidth} onChange={e => setLineWidth(Number(e.target.value))} style={{ width: 80 }} />
          <span style={{ fontSize: 12, color: '#64748b', width: 16 }}>{lineWidth}</span>
        </div>
        <button className="btn-danger" onClick={clearBoard} style={{ marginLeft: 'auto', padding: '6px 14px', fontSize: 13 }}>Clear</button>
      </div>

      {/* Canvas */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
        <canvas ref={canvasRef} width={1400} height={800} style={{ background: '#0f1117', cursor: 'crosshair', maxWidth: '100%' }}
          onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={() => setDrawing(false)} />
      </div>
    </div>
  );
}

function drawElement(ctx, el) {
  ctx.strokeStyle = el.color;
  ctx.lineWidth = el.lineWidth;
  ctx.lineCap = 'round';
  drawShape(ctx, el.tool, el.startPos, el.endPos, el.color, el.lineWidth);
}

function drawShape(ctx, tool, start, end, color, lineWidth) {
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  if (tool === 'rect') {
    ctx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
  } else if (tool === 'circle') {
    const rx = Math.abs(end.x - start.x) / 2, ry = Math.abs(end.y - start.y) / 2;
    ctx.ellipse(start.x + (end.x - start.x) / 2, start.y + (end.y - start.y) / 2, rx, ry, 0, 0, 2 * Math.PI);
    ctx.stroke();
  } else if (tool === 'line') {
    ctx.moveTo(start.x, start.y); ctx.lineTo(end.x, end.y); ctx.stroke();
  }
}
