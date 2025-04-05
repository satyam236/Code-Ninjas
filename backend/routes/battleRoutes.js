import express from 'express';
import { 
  findOpponent, 
  submitBattleAnswer, 
  checkBattleStatus,
  cancelBattleSearch,
  createFriendlyBattle,
  acceptBattleInvitation,
  joinAsBattleSpectator,
  getBattleUpdates,
  getShareableBattleLink
} from '../controllers/battleController.js';

const router = express.Router();

// Random matchmaking
router.post('/find', findOpponent);
router.post('/submit', submitBattleAnswer);
router.post('/status', checkBattleStatus);
router.post('/cancel', cancelBattleSearch);

// Friendly battles
router.post('/create', createFriendlyBattle);
router.post('/accept', acceptBattleInvitation);
router.post('/spectate', joinAsBattleSpectator);
router.post('/updates', getBattleUpdates);

router.post('/share', getShareableBattleLink);

export default router;
