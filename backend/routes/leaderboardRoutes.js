// routes/leaderboardRoutes.js
import express from 'express';
import { getLeaderboard } from '../controllers/leaderboardController.js';

const router = express.Router();

// Leaderboard route
router.get('/', getLeaderboard);

export default router;
