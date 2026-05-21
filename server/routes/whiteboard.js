const router = require('express').Router({ mergeParams: true });
const { protect } = require('../middleware/auth');
const { requireMember } = require('../middleware/projectAccess');
const { getWhiteboard, saveWhiteboard } = require('../controllers/whiteboardController');

router.use(protect);
router.use(requireMember);
router.get('/', getWhiteboard);
router.put('/', saveWhiteboard);

module.exports = router;
