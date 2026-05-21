const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { requireMember, requireOwner } = require('../middleware/projectAccess');
const {
  getProjects, createProject, getProject, updateProject, deleteProject,
} = require('../controllers/projectController');

router.use(protect);
router.get('/', getProjects);
router.post('/', createProject);
router.get('/:projectId', requireMember, getProject);
router.put('/:projectId', requireOwner, updateProject);
router.delete('/:projectId', requireOwner, deleteProject);

module.exports = router;
