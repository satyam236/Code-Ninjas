// utils/socketHandlers.js
import FriendlyBattle from '../models/FriendlyBattle.js';

export const handleFriendlyBattleSocket = (io) => {
  const battleNamespace = io.of('/friendly-battle');

  battleNamespace.on('connection', (socket) => {
    const { battleId, userId } = socket.handshake.query;
    
    socket.join(battleId);

    // Send initial battle state
    socket.on('getInitialState', async () => {
      const battle = await FriendlyBattle.findOne({ battleId });
      socket.emit('battleState', battle);
    });

    // Handle player submissions
    socket.on('submitExpression', async ({ expression }) => {
      const battle = await FriendlyBattle.findOne({ battleId });
      const game = new MathPuzzleGame(1);
      game.numbers = battle.numbers;
      
      const isCorrect = game.checkAnswer(expression);
      const updateField = battle.creator === userId ? 
        'player1Progress' : 'player2Progress';

      await FriendlyBattle.updateOne(
        { battleId },
        { 
          $set: { 
            [`${updateField}.expression`]: expression,
            [`${updateField}.isCorrect`]: isCorrect,
            [`${updateField}.attempts`]: battle[updateField].attempts + 1
          }
        }
      );

      const updatedBattle = await FriendlyBattle.findOne({ battleId });
      
      if (isCorrect) {
        await FriendlyBattle.updateOne(
          { battleId },
          { status: 'completed', winner: userId }
        );
      }

      battleNamespace.to(battleId).emit('battleUpdate', updatedBattle);
    });

    // Handle spectator join
    socket.on('spectatorJoin', async () => {
      await FriendlyBattle.updateOne(
        { battleId },
        { $addToSet: { spectators: userId } }
      );
    });

    socket.on('disconnect', () => {
      socket.leave(battleId);
    });
  });
};
