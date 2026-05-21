const router = require('express').Router({ mergeParams: true });
const { protect } = require('../middleware/auth');
const { requireMember } = require('../middleware/projectAccess');
const { getNotes, createNote, updateNote, deleteNote } = require('../controllers/noteController');

router.use(protect);
router.use(requireMember);
router.get('/', getNotes);
router.post('/', createNote);
router.put('/:noteId', updateNote);
router.delete('/:noteId', deleteNote);

module.exports = router;
