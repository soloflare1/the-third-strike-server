import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

// ============================================
// ✅ DOTENV CONFIG - একদম শুরুতে
// ============================================
dotenv.config();

// ✅ Check if environment variables are loaded
console.log('🔍 Environment Check:');
console.log('  🔑 OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '✅ Set' : '❌ Missing');
console.log('  🔑 JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
console.log('  🔑 MONGO_URI:', process.env.MONGO_URI ? '✅ Set' : '❌ Missing');

// ============================================
// IMPORT ROUTES
// ============================================
import authRoutes from './routes/authRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import strikeRoutes from './routes/strikeRoutes.js';
import sosRoutes from './routes/sosRoutes.js';
import syllabusRoutes from './routes/syllabusRoutes.js';
import seatRoutes from './routes/seatRoutes.js';
import ledgerRoutes from './routes/ledgerRoutes.js';
import factcheckRoutes from './routes/factcheckRoutes.js';
import { errorHandler } from './middleware/auth.js';

// ============================================
// EXPRESS APP
// ============================================
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make io accessible to routes
app.set('io', io);

// ============================================
// SOCKET.IO
// ============================================
io.on('connection', (socket) => {
  console.log('🔗 Client connected:', socket.id);

  socket.on('sos_alert', (data) => {
    console.log('🚨 SOS Alert:', data);
    io.emit('sos_alert', data);
  });

  socket.on('strike_update', (data) => {
    console.log('⚡ Strike Update:', data);
    io.emit('strike_update', data);
  });

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

// ============================================
// ROUTES
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/strikes', strikeRoutes);
app.use('/api/sos', sosRoutes);
app.use('/api/syllabus', syllabusRoutes);
app.use('/api/seats', seatRoutes);
app.use('/api/ledger', ledgerRoutes);
app.use('/api/factcheck', factcheckRoutes);

// ============================================
// API ROOT ROUTE
// ============================================
app.get('/api', (req, res) => {
  res.json({
    status: 'OK',
    message: 'The Third Strike API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      complaints: '/api/complaints',
      strikes: '/api/strikes',
      sos: '/api/sos',
      syllabus: '/api/syllabus',
      seats: '/api/seats',
      ledger: '/api/ledger',
      factcheck: '/api/factcheck',
      health: '/api/health'
    },
    docs: 'https://github.com/SultanaBristy226/the-third-strike-server'
  });
});

// ============================================
// HEALTH CHECK
// ============================================
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// ROOT ROUTE
// ============================================
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'The Third Strike API Server',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      complaints: '/api/complaints',
      strikes: '/api/strikes',
      sos: '/api/sos',
      syllabus: '/api/syllabus',
      seats: '/api/seats',
      ledger: '/api/ledger',
      factcheck: '/api/factcheck',
      health: '/api/health'
    },
    docs: 'https://github.com/SultanaBristy226/the-third-strike-server'
  });
});

// ============================================
// ERROR HANDLER
// ============================================
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 http://localhost:${PORT}`);
      console.log(`📡 Socket.io ready`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });