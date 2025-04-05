// models/GameSession.js
import mongoose from 'mongoose';

const gameSessionSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  currentLevel: { type: Number, default: 1 },
  unlockedLevels: { type: [Number], default: [1] },
  score: { type: Number, default: 0 },
  trophies: { type: Number, default: 0 },
  levelStates: {
    type: Map,
    of: new mongoose.Schema({
      numbers: [Number],
      solution: String,
      attempts: { type: Number, default: 0 },
      solved: { type: Boolean, default: false },
      quit: { type: Boolean, default: false }, // Track if the level was quit
      bestScore: { type: Number, default: 0 }
    })
  },
  isPaused: { type: Boolean, default: false }
});

export default mongoose.model('GameSession', gameSessionSchema);
