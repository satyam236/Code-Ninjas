// models/Battle.js
import mongoose from 'mongoose';

const battleSchema = new mongoose.Schema({
  battleId: { type: String, required: true, unique: true },
  player1: { type: String, required: true },
  player2: { type: String, required: true },
  numbers: { type: [Number], required: true },
  solution: { type: String, required: true },
  startTime: { type: Date, default: Date.now },
  timeLimit: { type: Number, default: 60 }, // in seconds
  status: { 
    type: String, 
    enum: ['pending', 'active', 'completed', 'canceled'],
    default: 'pending'
  },
  result: { 
    type: String, 
    enum: ['win', 'draw', null],
    default: null
  },
  winner: { type: String, default: null },
  player1Attempts: { type: Number, default: 0 },
  player2Attempts: { type: Number, default: 0 },
  isPublic: { type: Boolean, default: true },
  spectators: { type: [String], default: [] }
});

export default mongoose.model('Battle', battleSchema);
