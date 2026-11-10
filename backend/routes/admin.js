const express = require('express');
const router = express.Router();
const {
  requireAdminOrTeam,
  getAllUsers,
  toggleBlock,
  setRole,
  deleteUser,
  getAllVideos,
  adminDeleteVideo,
  getStats
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');

router.use(protect, requireAdminOrTeam);

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.put('/users/:id/block', toggleBlock);
router.put('/users/:id/role', setRole);
router.delete('/users/:id', deleteUser);
router.get('/videos', getAllVideos);
router.delete('/videos/:id', adminDeleteVideo);

module.exports = router;
