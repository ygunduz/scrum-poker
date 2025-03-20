import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { RoomManager } from './services/RoomManager';
import { setupSocketHandlers } from './controllers/socketHandlers';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize HTTP server
const server = http.createServer(app);

// Initialize Socket.io server
const io = new Server(server, {
  cors: {
    origin: "*", // In production, set to your frontend URL
    methods: ["GET", "POST"]
  }
});

// Initialize Room Manager
const roomManager = new RoomManager();

// Set up Socket.io event handlers
setupSocketHandlers(io, roomManager);

// Basic API routes
app.get('/', (req, res) => {
  res.send('Scrum Poker API is running');
});

app.get('/api/rooms', (req, res) => {
  res.json({
    rooms: roomManager.getRoomsList()
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 