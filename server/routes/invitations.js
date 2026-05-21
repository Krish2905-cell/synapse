const router = require('express').Router();
const { protect } = require('../middleware/auth');
const {
  sendInvitation, getMyInvitations, respondToInvitation,
} = require('../controllers/invitationController');

router.use(protect);
router.post('/', sendInvitation);
router.get('/mine', getMyInvitations);
router.put('/:id/respond', respondToInvitation);

module.exports = router;
