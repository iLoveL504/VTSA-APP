import dotenvFlow from "dotenv-flow";
console.log('backend url', process.env.VITE_BACKEND_URL)
if (process.env.NODE_ENV !== "production") {
  dotenvFlow.config();
}
import express from 'express';
import { logDate } from './middleware/logEvents.js';
import cors from 'cors';
import corsOptions from './config/corsOptions.js';
import { router as employeeRouter } from './routes/api/employees.js';
import { router as authRouter } from './routes/auth.js';
import { router as projectRouter } from './routes/api/projects.js';
import { router as teamsRouter } from './routes/api/teams.js';
import { router as notificationsRouter } from './routes/api/notifications.js';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const server = http.createServer(app);
console.log("ENV CHECK:", {
  MYSQL_HOST: process.env.MYSQL_HOST,
  DB_PORT: process.env.DB_PORT,
  MYSQL_USER: process.env.MYSQL_USER,
  MYSQL_DATABASE: process.env.MYSQL_DATABASE,
});
// Socket.io configuration
const io = new Server(server, {
  cors: {
    origin: [process.env.CORS_ORIGIN || "http://localhost:5173"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});
export { io };

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(logDate);

// API routes
app.use('/employees', employeeRouter);
app.use('/auth', authRouter);
app.use('/projects', projectRouter);
app.use('/teams', teamsRouter);
app.use('/notifications', notificationsRouter);

// Serve static frontend files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDist = path.resolve(__dirname, '../client/dist');
app.use(express.static(clientDist));

// Catch-all route: only for client-side routing (React/Vite)
app.use((req, res, next) => {
  res.sendFile(path.join(clientDist, 'index.html'), (err) => {
    if (err) next(err);
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error("🔥 Express Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('chat message', (msg) => io.emit('chat message', msg));
  socket.on('join_notifications', (employeeId) => socket.join(`notifications_${employeeId}`));
  socket.on('receive_messages', (msg) => console.log(msg));
  socket.on('disconnect', () => console.log('User disconnected:', socket.id));
});

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
