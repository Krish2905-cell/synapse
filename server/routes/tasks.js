const router = require('express').Router({ mergeParams: true });
const { protect } = require('../middleware/auth');
const { requireMember } = require('../middleware/projectAccess');
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');

router.use(protect);
router.use(requireMember);
router.get('/', getTasks);
router.post('/', createTask);
router.put('/:taskId', updateTask);
router.delete('/:taskId', deleteTask);

module.exports = router;
