// controllers/leaderboardController.js
export const getLeaderboard = async (req, res) => {
    try {
      const { sortBy = 'score', limit = 10 } = req.query; // Default sorting by score and limit to top 10
  
      // Validate sorting criteria
      if (!['score', 'trophies'].includes(sortBy)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid sortBy parameter. Use "score" or "trophies".'
        });
      }
  
      // Fetch top players sorted by the specified criteria
      const leaderboard = await GameSession.find({})
        .select('userId score trophies currentLevel')
        .sort({ [sortBy]: -1 }) // Sort descending by score or trophies
        .limit(parseInt(limit)); // Limit the number of results
  
      res.json({
        status: 'success',
        leaderboard
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch leaderboard',
        error: error.message
      });
    }
  };
  