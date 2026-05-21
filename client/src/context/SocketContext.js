import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  // socketRef keeps a stable reference for imperative emit() calls
  const socketRef = useRef(null);
  // socket state triggers re-renders in components that need to attach listeners
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user) return;

    const s = io(process.env.REACT_APP_SOCKET_URL, {
      withCredentials: true,
      // Reconnect automatically with backoff
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    s.on('connect', () => {
      console.log('[Socket] Connected:', s.id);
    });

    s.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
    });

    s.on('connect_error', (err) => {
      console.error('[Socket] Connection error:', err.message);
    });

    socketRef.current = s;
    // Expose the instance so components can use it as an effect dependency
    setSocket(s);

    return () => {
      console.log('[Socket] Cleaning up connection');
      s.disconnect();
      socketRef.current = null;
      setSocket(null);
    };
  }, [user]);

  return (
    // Provide both: ref for imperative emits, socket instance for effect deps
    <SocketContext.Provider value={{ socketRef, socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
