import express from 'express';
import {
  startGame,
  getLevel,
  submitAnswer,
  pauseGame,
  resumeGame,
  getAllLevels,
  getProfile,
  getHint,
  quitLevel
} from '../controllers/gameController.js';

const router = express.Router();

// Start or resume a game session
router.post('/start', startGame);

// Fetch level data
router.post('/level', getLevel);

// Submit answer for a level
router.post('/submit', submitAnswer);

// Pause the game session
router.post('/pause', pauseGame);

// Resume the paused game session
router.post('/resume', resumeGame);

// Get all unlocked levels and progress
router.post('/levels', getAllLevels);

// New route for profile
router.post('/profile', getProfile);

// New route for hints
router.post('/hint', getHint);

// New route for quit level
router.post('/quit', quitLevel);


export default router;
