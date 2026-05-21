require('dotenv').config();

console.log("MONGO URI exists:", !!process.env.MONGO_URI);

if (process.env.MONGO_URI) {
  console.log(
    "MONGO URI starts with:",
    process.env.MONGO_URI.substring(0, 50)
  );
} else {
  console.log("MONGO_URI not found");
}
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const initSockets = require('./sockets');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  },
});

// Connect DB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res) => {
  res.send('Synapse API is running 🚀');
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/invitations', require('./routes/invitations'));
app.use('/api/projects/:projectId/tasks', require('./routes/tasks'));
app.use('/api/projects/:projectId/notes', require('./routes/notes'));
app.use('/api/projects/:projectId/messages', require('./routes/messages'));
app.use('/api/projects/:projectId/whiteboard', require('./routes/whiteboard'));

// Socket.io
initSockets(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Synapse server running on port ${PORT}`);
  console.log('Socket.io initialized ✅');
});