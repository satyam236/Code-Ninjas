import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import gameRoutes from './routes/gameRoutes.js';
import authRoutes from './routes/auth.js';
import battleRoutes from './routes/battleRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import cors from 'cors';

const app = express(); 
 

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'; // <-- Correct frontend origin

const corsOptions = {
  origin: CLIENT_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204,
  maxAge: 86400  
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));


const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const NODE_ENV = process.env.NODE_ENV || 'development';

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI. Exiting...');
  process.exit(1);
}

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true, 
  autoIndex: NODE_ENV === 'development', 
}).then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ Database connection error:', err);
    process.exit(1);
  });

app.use('/game', gameRoutes);
app.use('/auth', authRoutes);
app.use('/battle', battleRoutes);
app.use('/leaderboard', leaderboardRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok', 
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});


app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ❌ Error:`, err);
  res.status(500).json({
    status: 'error',
    message: NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${NODE_ENV} mode on port ${PORT}`);
});

const shutdown = (signal) => {
  console.log(`\n🔻 ${signal} received: Closing server...`);
  server.close(async () => {
    console.log('✅ Server closed');
    await mongoose.disconnect();
    console.log('✅ Database disconnected');
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown); 
