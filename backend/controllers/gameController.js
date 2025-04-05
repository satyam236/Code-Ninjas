// controllers/gameController.js
import { v4 as uuidv4 } from 'uuid';
import GameSession from '../models/GameSession.js';

export class MathPuzzleGame {
  constructor(level) {
    this.level = level;
    this.currentNumbers = [];
    this.solution = '';
    this.allowedOperations = this.getAllowedOperations();
  }

  *permute(arr, n = arr.length) {
    if (n <= 1) yield arr.slice();
    else {
      for (let i = 0; i < n; i++) {
        yield* this.permute(arr, n - 1);
        const j = n % 2 ? 0 : i;
        [arr[n-1], arr[j]] = [arr[j], arr[n-1]];
      }
    }
  }

  getOperationCombinations(length) {
    const cartesian = (...a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));
    return cartesian(...Array(length).fill(this.allowedOperations));
  }

  getAllowedOperations() {
    if (this.level <= 10) return ['+', '-', '*', '/'];
    if (this.level <= 20) return ['+', '-', '*', '/', '()'];
    return ['+', '-', '*', '/', '()', '**'];
  }

  validateNumbers(userExpression) {
    const usedNumbers = (userExpression.match(/[1-9]/g) || [])
      .map(Number)
      .sort((a, b) => a - b);
    const puzzleNumbers = [...this.currentNumbers].sort((a, b) => a - b);
    return JSON.stringify(usedNumbers) === JSON.stringify(puzzleNumbers);
  }

  buildExpression(numbers, operations) {
    let expr = '';
    for (let i = 0; i < 5; i++) {
      expr += numbers[i];
      if (this.level > 5 && operations[i] === '()') {
        expr = `(${expr})${operations[i].replace('()', '')}`;
      } else {
        expr += operations[i];
      }
    }
    expr += numbers[5];
    return expr.replace(/\*\*/g, '^').replace(/[^0-9+\-*/()^]/g, '');
  }

  generateNumbersWithSolution() {
    let found = false;
    while (!found) {
      this.currentNumbers = Array.from({ length: 6 }, () => 
        Math.floor(Math.random() * 9) + 1
      );
      for (const nums of this.permute(this.currentNumbers)) {
        for (const ops of this.getOperationCombinations(5)) {
          const expression = this.buildExpression(nums, ops);
          if (this.validateExpression(expression)) {
            this.solution = expression;
            found = true;
            return;
          }
        }
      }
    }
  }

  validateExpression(expression) {
    try {
      const sanitized = expression.replace(/\^/g, '**');
      return Math.abs(eval(sanitized) - 100) < 0.0001;
    } catch {
      return false;
    }
  }

  checkAnswer(userExpression) {
    return this.validateNumbers(userExpression) && 
           this.validateExpression(userExpression);
  }
}

// Controller Functions
export const startGame = async (req, res) => {
  try {
    const { userId } = req.body;
    let session = await GameSession.findOne({ userId });

    if (!session) {
      session = new GameSession({
        userId,
        currentLevel: 1,
        unlockedLevels: [1],
        score: 0,
        trophies: 0,
        levelStates: new Map(),
        isPaused: false 
      });
      await session.save();
    }

    res.json({
      currentLevel: session.currentLevel,
      unlockedLevels: session.unlockedLevels,
      totalScore: session.score,
      totalTrophies: session.trophies,
      isPaused: session.isPaused
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Game initialization failed',
      error: error.message
    });
  }
};

export const getLevel = async (req, res) => {
  try {
    const { userId, level } = req.body;
    const session = await GameSession.findOne({ userId });

    if (!session) return res.status(404).json({ error: 'Session not found' });

    // Level progression check
    if (level > session.currentLevel) {
      return res.status(403).json({
        status: 'error',
        message: `Complete level ${session.currentLevel} first!`,
        currentLevel: session.currentLevel
      });
    }

    // Generate level data if missing
    if (!session.levelStates.has(level.toString())) {
      const game = new MathPuzzleGame(level);
      game.generateNumbersWithSolution();
      
      session.levelStates.set(level.toString(), {
        numbers: game.currentNumbers,
        solution: game.solution,
        attempts: 0,
        solved: false,
        bestScore: 0
      });
      await session.save();
    }

    const levelData = session.levelStates.get(level.toString());
    res.json({
      numbers: levelData.numbers,
      attempts: levelData.attempts,
      bestScore: levelData.bestScore,
      solved: levelData.solved,
      currentLevel: session.currentLevel
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to load level',
      error: error.message
    });
  }
};

export const submitAnswer = async (req, res) => {
  try {
    const { userId, level: rawLevel, expression } = req.body;
    const level = parseInt(rawLevel, 10);

    const session = await GameSession.findOne({ userId });
    if (!session) return res.status(404).json({ error: 'Session not found' });

    // Progression validation
    if (level !== session.currentLevel) {
      return res.status(403).json({
        status: 'error',
        message: `Focus on level ${session.currentLevel}!`,
        currentLevel: session.currentLevel
      });
    }

    // Generate level if missing (safety check)
    if (!session.levelStates.has(level.toString())) {
      const game = new MathPuzzleGame(level);
      game.generateNumbersWithSolution();
      session.levelStates.set(level.toString(), {
        numbers: game.currentNumbers,
        solution: game.solution,
        attempts: 0,
        solved: false,
        bestScore: 0
      });
    }

    const game = new MathPuzzleGame(level);
    const levelState = session.levelStates.get(level.toString());
    game.currentNumbers = levelState.numbers;

    levelState.attempts += 1;

    if (game.checkAnswer(expression)) {
      const basePoints = 100 + (level * 20);
      const pointsEarned = Math.max(basePoints - ((levelState.attempts - 1) * 10), 10);
      const trophiesAwarded = levelState.attempts === 1 ? 7 : Math.max(5 - (levelState.attempts - 1), 0);

      // Update progression
      const nextLevel = session.currentLevel + 1;
      session.currentLevel = nextLevel;
      session.unlockedLevels = Array.from(
        { length: nextLevel }, 
        (_, i) => i + 1
      );

      // Update scores
      session.score += pointsEarned;
      session.trophies += trophiesAwarded;
      levelState.bestScore = Math.max(levelState.bestScore, pointsEarned);
      levelState.solved = true;

      await session.save();
      
      return res.json({
        status: 'success',
        pointsEarned,
        trophiesAwarded,
        totalScore: session.score,
        totalTrophies: session.trophies,
        currentLevel: session.currentLevel,
        unlockedLevels: session.unlockedLevels
      });
    }

    // If player fails all attempts, show solution and mark as failed
    if (levelState.attempts >= 3) {
      levelState.solved = false; // Mark as not solved
      await session.save();

      return res.json({
        status: 'failed',
        message: `You have failed level ${level}.`,
        solution: levelState.solution,
        currentLevelScoreDetails: {
          currentLevel: session.currentLevel,
          bestScore: levelState.bestScore,
          attemptsMade: levelState.attempts,
          solved: false
        }
      });
    }

    // Deduct trophies for incorrect attempt
    session.trophies = Math.max(session.trophies - 1, 0);
    await session.save();
    
    return res.json({
      status: 'retry',
      totalTrophies: session.trophies,
      attemptsRemaining: Math.max(3 - (levelState.attempts % 3), 0),
      message: 'Try again! -1🏆',
      currentLevelScoreDetails: {
        currentLevel: session.currentLevel,
        bestScore: levelState.bestScore,
        attemptsMade: levelState.attempts,
        solved: false
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Answer processing failed',
      error: error.message
    });
  }
};

export const pauseGame = async (req, res) => {
  try {
    const { userId } = req.body;
    const session = await GameSession.findOne({ userId });

    if (!session) return res.status(404).json({ error: 'Session not found' });
    
    session.isPaused = true;
    await session.save();

    res.json({
      status: 'success',
      message: 'Game paused successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to pause game',
      error: error.message
    });
  }
};

export const resumeGame = async (req, res) => {
  try {
    const { userId } = req.body;
    const session = await GameSession.findOne({ userId });

    if (!session) return res.status(404).json({ error: 'Session not found' });
    
    session.isPaused = false;
    await session.save();

    res.json({
      status: 'success',
      message: 'Game resumed successfully',
      currentLevel: session.currentLevel,
      unlockedLevels: session.unlockedLevels,
      totalScore: session.score,
      totalTrophies: session.trophies
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to resume game',
      error: error.message
    });
  }
};

export const getAllLevels = async (req, res) => {
  try {
    const { userId } = req.body;
    const session = await GameSession.findOne({ userId });

    if (!session) return res.status(404).json({ error: 'Session not found' });

    res.json({
      unlockedLevels: session.unlockedLevels,
      currentLevel: session.currentLevel,
      totalScore: session.score,
      totalTrophies: session.trophies
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch levels',
      error: error.message
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;

    // Find the player's session
    const session = await GameSession.findOne({ userId });
    if (!session) return res.status(404).json({ error: 'Player not found' });

    // Prepare profile data
    const profile = {
      userId,
      currentLevel: session.currentLevel,
      unlockedLevels: session.unlockedLevels,
      score: session.score,
      trophies: session.trophies,
      battleStats: session.battleStats
    };

    res.json({
      status: 'success',
      profile
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
};

export const getHint = async (req, res) => {
  try {
    const { userId, level } = req.body;

    // Find player's session
    const session = await GameSession.findOne({ userId });
    if (!session) return res.status(404).json({ error: 'Session not found' });

    // Validate level progression
    if (level !== session.currentLevel) {
      return res.status(403).json({
        status: 'error',
        message: `You can only request hints for level ${session.currentLevel}.`
      });
    }

    const levelKey = level.toString(); // Convert level to string for Map key
    const levelState = session.levelStates.get(levelKey);

    if (!levelState || !levelState.solution) {
      return res.status(404).json({
        status: 'error',
        message: `Level ${level} data not found`
      });
    }

    // Check if hint has already been used
    if (levelState.hintUsed) {
      return res.status(400).json({
        status: 'error',
        message: 'Hint already used for this level.'
      });
    }

    // Generate a partial hint
    const solutionParts = levelState.solution.match(/(\d+|\+|\-|\*|\/|\(|\))/g); // Split solution into parts
    const randomPart = solutionParts[Math.floor(Math.random() * solutionParts.length)];

    // Deduct points for using hint
    const deduction = Math.min(20, session.score); // Deduct up to 20 points but ensure score doesn't go negative
    session.score -= deduction;

    // Mark hint as used
    levelState.hintUsed = true;

    await session.save();

    return res.json({
      status: 'success',
      hint: `Try including "${randomPart}" in your solution.`,
      pointsDeducted: deduction,
      remainingScorePotential: session.score,
      currentLevelScoreDetails: {
        currentLevel: session.currentLevel,
        bestScore: levelState.bestScore,
        attemptsMade: levelState.attempts
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to provide a hint',
      error: error.message
    });
  }
};

export const quitLevel = async (req, res) => {
  try {
    const { userId, level } = req.body;

    // Find player's session
    const session = await GameSession.findOne({ userId });
    if (!session) return res.status(404).json({ error: 'Session not found' });

    // Validate level progression
    if (level !== session.currentLevel) {
      return res.status(403).json({
        status: 'error',
        message: `You can only quit level ${session.currentLevel}.`
      });
    }

    const levelKey = level.toString(); // Convert level to string for Map key
    const levelState = session.levelStates.get(levelKey);

    if (!levelState || !levelState.solution) {
      return res.status(404).json({
        status: 'error',
        message: `Level ${level} data not found`
      });
    }

    // Mark the level as quit
    levelState.quit = true;

    await session.save();

    return res.json({
      status: 'success',
      message: `You have quit level ${level}.`,
      solution: levelState.solution,
      currentLevelScoreDetails: {
        currentLevel: session.currentLevel,
        bestScore: levelState.bestScore,
        attemptsMade: levelState.attempts,
        solved: levelState.solved,
        quit: levelState.quit
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to quit the level',
      error: error.message
    });
  }
};
