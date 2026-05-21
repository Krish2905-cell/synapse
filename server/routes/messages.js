const router = require('express').Router({ mergeParams: true });
const { protect } = require('../middleware/auth');
const { requireMember } = require('../middleware/projectAccess');
const { getMessages, createMessage } = require('../controllers/messageController');

router.use(protect);
router.use(requireMember);
router.get('/', getMessages);
router.post('/', createMessage);

module.exports = router;
