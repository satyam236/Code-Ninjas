import 'dotenv/config'; // Load environment variables
import express from 'express';
import mongoose from 'mongoose';
import gameRoutes from './routes/gameRoutes.js';
import authRoutes from './routes/auth.js';
import battleRoutes from './routes/battleRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
// import { handleFriendlyBattleSocket } from './utils/socketHandlers.js';
// import { createServer } from 'http';
// import { Server } from 'socket.io';


// Express Setup
const app = express();
// const httpServer = createServer(app);
// const io = new Server(httpServer);

// Handle WebSocket connections
// handleFriendlyBattleSocket(io);

// Environment Variables
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const NODE_ENV = process.env.NODE_ENV || 'development';

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI. Exiting...');
  process.exit(1);
}

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Body Parser (Using built-in Express methods)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Database Connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true, 
  autoIndex: NODE_ENV === 'development', // Enable indexing only in dev mode
}).then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ Database connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/game', gameRoutes);
app.use('/auth', authRoutes);
app.use('/battle', battleRoutes);
app.use('/leaderboard', leaderboardRoutes);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok', 
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ❌ Error:`, err);
  res.status(500).json({
    status: 'error',
    message: NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
  });
});

// Server Initialization
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${NODE_ENV} mode on port ${PORT}`);
});

// httpServer.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// }); 
