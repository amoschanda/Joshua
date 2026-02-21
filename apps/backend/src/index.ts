import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import { initializeDatabase, closeDatabase } from './config/database.js';
import { authenticate, AuthRequest } from './middleware/auth.js';
import authRoutes from './routes/auth.js';
import ridesRoutes from './routes/rides.js';
import paymentsRoutes from './routes/payments.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/rides', ridesRoutes);
app.use('/api/v1/payments', paymentsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// WebSocket events
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Driver location update
  socket.on('driver_location', (data) => {
    const { driverId, lat, lng } = data;
    socket.broadcast.emit('driver_location_update', {
      driverId,
      lat,
      lng,
      timestamp: new Date().toISOString(),
    });
  });

  // Ride status update
  socket.on('ride_status', (data) => {
    const { rideId, status } = data;
    io.emit('ride_status_update', {
      rideId,
      status,
      timestamp: new Date().toISOString(),
    });
  });

  // Ride request notification
  socket.on('ride_request', (data) => {
    const { rideId, driverId } = data;
    io.to(`driver_${driverId}`).emit('new_ride_request', {
      rideId,
      timestamp: new Date().toISOString(),
    });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await initializeDatabase();
    console.log('✓ Database initialized');

    httpServer.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ WebSocket server ready`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await closeDatabase();
  process.exit(0);
});

start();
