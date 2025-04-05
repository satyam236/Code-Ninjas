// controllers/battleController.js
import { v4 as uuidv4 } from 'uuid';
import GameSession from '../models/GameSession.js';
import Battle from '../models/Battle.js';
// import { MathPuzzleGame } from '../utils/gameLogic.js';
import { MathPuzzleGame } from '../controllers/gameController.js';


// Find an opponent for a battle
export const findOpponent = async (req, res) => {
  try {
    const { userId } = req.body;

    // Check if the player is already in a battle
    const session = await GameSession.findOne({ userId });
    if (!session) return res.status(404).json({ error: 'Session not found' });

    if (session.battleStatus.status === 'inBattle') {
      return res.json({ 
        status: 'inBattle',
        battleId: session.battleStatus.battleId,
        message: 'Player is already in a battle'
      });
    }

    // Find an available opponent
    const opponent = await GameSession.findOne({
      userId: { $ne: userId }, // Exclude the current player
      'battleStatus.status': 'waiting'
    });

    if (opponent) {
      // Match found - create a battle
      const game = new MathPuzzleGame(Math.min(session.currentLevel, opponent.currentLevel));
      game.generateNumbersWithSolution();
      
      const battleId = uuidv4();
      
      // Create a new battle record
      const battle = new Battle({
        battleId,
        player1: userId,
        player2: opponent.userId,
        numbers: game.currentNumbers,
        solution: game.solution,
        startTime: Date.now(),
        timeLimit: 30, // 30 seconds for battle
        status: 'active',
        player1Attempts: 0,
        player2Attempts: 0
      });
      
      await battle.save();

      // Update both players' battle status
      session.battleStatus = {
        status: 'inBattle',
        battleId,
        opponentId: opponent.userId
      };

      opponent.battleStatus = {
        status: 'inBattle',
        battleId,
        opponentId: userId
      };

      await session.save();
      await opponent.save();

      return res.json({
        status: 'matched',
        battleId,
        opponentId: opponent.userId,
        numbers: game.currentNumbers,
        timeLimit: 30
      });
    } else {
      // No opponent found, place in waiting queue
      session.battleStatus = {
        status: 'waiting',
        battleId: null,
        opponentId: null
      };
      
      await session.save();
      
      return res.json({
        status: 'waiting',
        message: 'Waiting for an opponent'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to find opponent',
      error: error.message
    });
  }
};

// Submit answer in battle mode
export const submitBattleAnswer = async (req, res) => {
  try {
    const { userId, battleId, expression } = req.body;
    
    // Find the battle
    const battle = await Battle.findOne({ battleId });
    if (!battle) return res.status(404).json({ error: 'Battle not found' });
    
    // Check if battle is still active
    if (battle.status !== 'active') {
      return res.json({
        status: 'battleEnded',
        result: battle.result,
        winner: battle.winner
      });
    }
    
    // Check if time limit exceeded
    const currentTime = Date.now();
    if (currentTime - battle.startTime > battle.timeLimit * 1000) {
      battle.status = 'completed';
      battle.result = 'draw';
      battle.winner = null;
      await battle.save();
      
      // Update both players' status
      await GameSession.updateMany(
        { $or: [{ userId: battle.player1 }, { userId: battle.player2 }] },
        { 'battleStatus.status': 'idle', 'battleStatus.battleId': null }
      );
      
      return res.json({
        status: 'timeExpired',
        result: 'draw'
      });
    }
    
    // Determine which player is submitting
    const isPlayer1 = userId === battle.player1;
    const playerField = isPlayer1 ? 'player1Attempts' : 'player2Attempts';
    
    // Increment attempt counter
    battle[playerField] += 1;
    
    // Check answer
    const game = new MathPuzzleGame(1); // Level doesn't matter here
    game.currentNumbers = battle.numbers;
    game.solution = battle.solution;
    
    if (game.checkAnswer(expression)) {
      // Correct answer - player wins
      battle.status = 'completed';
      battle.result = 'win';
      battle.winner = userId;
      await battle.save();
      
      // Update winner's score and trophies
      const winner = await GameSession.findOne({ userId });
      winner.score += 200; // Bonus points for winning
      winner.trophies += 10; // Bonus trophies
      winner.battleStatus.status = 'idle';
      winner.battleStatus.battleId = null;
      await winner.save();
      
      // Update loser's status
      const loserId = isPlayer1 ? battle.player2 : battle.player1;
      const loser = await GameSession.findOne({ userId: loserId });
      loser.trophies = Math.max(loser.trophies - 5, 0); // Lose trophies (min 0)
      loser.battleStatus.status = 'idle';
      loser.battleStatus.battleId = null;
      await loser.save();
      
      return res.json({
        status: 'win',
        message: 'You won the battle!',
        pointsEarned: 200,
        trophiesEarned: 10
      });
    } else {
      // Wrong answer
      await battle.save();
      
      return res.json({
        status: 'incorrect',
        message: 'Incorrect answer. Try again!',
        attemptsRemaining: 3 - (battle[playerField] % 3)
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to process battle answer',
      error: error.message
    });
  }
};

// Check battle status
export const checkBattleStatus = async (req, res) => {
  try {
    const { userId, battleId } = req.body;
    
    const battle = await Battle.findOne({ battleId });
    if (!battle) return res.status(404).json({ error: 'Battle not found' });
    
    const isPlayer1 = userId === battle.player1;
    const opponentAttempts = isPlayer1 ? battle.player2Attempts : battle.player1Attempts;
    
    return res.json({
      status: battle.status,
      result: battle.result,
      winner: battle.winner,
      opponentAttempts,
      timeRemaining: Math.max(0, battle.timeLimit - ((Date.now() - battle.startTime) / 1000))
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to check battle status',
      error: error.message
    });
  }
};

// Cancel waiting for battle
export const cancelBattleSearch = async (req, res) => {
  try {
    const { userId } = req.body;
    
    const session = await GameSession.findOne({ userId });
    if (!session) return res.status(404).json({ error: 'Session not found' });
    
    if (session.battleStatus.status !== 'waiting') {
      return res.status(400).json({ error: 'Player is not in waiting status' });
    }
    
    session.battleStatus.status = 'idle';
    await session.save();
    
    return res.json({
      status: 'success',
      message: 'Battle search canceled'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to cancel battle search',
      error: error.message
    });
  }
};

// Create a friendly battle
export const createFriendlyBattle = async (req, res) => {
  try {
    const { userId, friendId } = req.body;
    
    // Validate users exist
    const [creator, friend] = await Promise.all([
      GameSession.findOne({ userId }),
      GameSession.findOne({ userId: friendId })
    ]);
    
    if (!creator) return res.status(404).json({ error: 'Your session not found' });
    if (!friend) return res.status(404).json({ error: 'Friend not found' });
    
    // Generate battle ID and puzzle
    const battleId = uuidv4();
    const game = new MathPuzzleGame(Math.min(creator.currentLevel, friend.currentLevel));
    game.generateNumbersWithSolution();
    
    // Create battle record
    const battle = new Battle({
      battleId,
      player1: userId,
      player2: friendId,
      numbers: game.currentNumbers,
      solution: game.solution,
      startTime: Date.now(),
      timeLimit: 60, // Longer time for friendly battles
      status: 'pending',
      isPublic: true, // Allow spectators
      spectators: []
    });
    
    await battle.save();
    
    // Update creator's status
    creator.battleStatus = {
      status: 'waiting',
      battleId,
      opponentId: friendId
    };
    await creator.save();
    
    return res.json({
      status: 'success',
      message: 'Battle invitation sent',
      battleId,
      numbers: game.currentNumbers
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to create friendly battle',
      error: error.message
    });
  }
};

// Accept a battle invitation
export const acceptBattleInvitation = async (req, res) => {
  try {
    const { userId, battleId } = req.body;
    
    const battle = await Battle.findOne({ battleId });
    if (!battle) return res.status(404).json({ error: 'Battle not found' });
    
    if (battle.player2 !== userId) {
      return res.status(403).json({ error: 'Not authorized to join this battle' });
    }
    
    if (battle.status !== 'pending') {
      return res.status(400).json({ error: `Battle is already ${battle.status}` });
    }
    
    // Update battle status
    battle.status = 'active';
    battle.startTime = Date.now(); // Reset timer when both players are ready
    await battle.save();
    
    // Update player status
    const player = await GameSession.findOne({ userId });
    player.battleStatus = {
      status: 'inBattle',
      battleId,
      opponentId: battle.player1
    };
    await player.save();
    
    // Also update opponent status
    await GameSession.updateOne(
      { userId: battle.player1 },
      { 'battleStatus.status': 'inBattle' }
    );
    
    return res.json({
      status: 'success',
      message: 'Battle started!',
      battleId,
      numbers: battle.numbers,
      timeLimit: battle.timeLimit
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to accept battle invitation',
      error: error.message
    });
  }
};

// Add spectator to battle
export const joinAsBattleSpectator = async (req, res) => {
  try {
    const { userId, battleId } = req.body;
    
    const battle = await Battle.findOne({ battleId });
    if (!battle) return res.status(404).json({ error: 'Battle not found' });
    
    if (!battle.isPublic) {
      return res.status(403).json({ error: 'This battle is private' });
    }
    
    if (battle.status !== 'active') {
      return res.status(400).json({ error: `Battle is ${battle.status}` });
    }
    
    // Add spectator if not already in the list
    if (!battle.spectators.includes(userId)) {
      battle.spectators.push(userId);
      await battle.save();
    }
    
    return res.json({
      status: 'success',
      message: 'Joined as spectator',
      battleData: {
        player1: battle.player1,
        player2: battle.player2,
        numbers: battle.numbers,
        player1Attempts: battle.player1Attempts,
        player2Attempts: battle.player2Attempts,
        timeRemaining: Math.max(0, battle.timeLimit - ((Date.now() - battle.startTime) / 1000)),
        status: battle.status
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to join as spectator',
      error: error.message
    });
  }
};

// Get real-time battle updates
export const getBattleUpdates = async (req, res) => {
  try {
    const { battleId } = req.body;
    
    const battle = await Battle.findOne({ battleId });
    if (!battle) return res.status(404).json({ error: 'Battle not found' });
    
    // Get player names for display
    const [player1Data, player2Data] = await Promise.all([
      GameSession.findOne({ userId: battle.player1 }).select('userId'),
      GameSession.findOne({ userId: battle.player2 }).select('userId')
    ]);
    
    return res.json({
      status: 'success',
      battleData: {
        battleId: battle.battleId,
        player1: {
          id: battle.player1,
          name: player1Data?.userId || 'Unknown',
          attempts: battle.player1Attempts
        },
        player2: {
          id: battle.player2,
          name: player2Data?.userId || 'Unknown',
          attempts: battle.player2Attempts
        },
        numbers: battle.numbers,
        timeRemaining: Math.max(0, battle.timeLimit - ((Date.now() - battle.startTime) / 1000)),
        status: battle.status,
        result: battle.result,
        winner: battle.winner,
        spectatorCount: battle.spectators.length
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to get battle updates',
      error: error.message
    });
  }
};

// Get shareable battle link
export const getShareableBattleLink = async (req, res) => {
  try {
    const { battleId } = req.body;
    
    const battle = await Battle.findOne({ battleId });
    if (!battle) return res.status(404).json({ error: 'Battle not found' });
    
    // Generate a shareable link
    const shareableLink = `${process.env.APP_URL || 'http://localhost:3000'}/battle/spectate/${battleId}`;
    
    return res.json({
      status: 'success',
      shareableLink,
      battleId
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate shareable link',
      error: error.message
    });
  }
};
