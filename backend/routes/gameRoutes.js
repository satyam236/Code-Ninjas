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

import { getProgress } from '../controllers/gameController.js';

const router = express.Router();

router.post('/start', startGame);
router.post('/level', getLevel);
router.post('/submit', submitAnswer);
// router.post('/pause', pauseGame);
// router.post('/resume', resumeGame);
// router.post('/levels', getAllLevels);
router.post('/profile', getProfile);
router.post('/hint', getHint);
router.post('/quit', quitLevel);


router.get('/progress', getProgress);

export default router;
