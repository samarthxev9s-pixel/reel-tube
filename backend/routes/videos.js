const express = require('express');
const router = express.Router();
const {
  getVideos,
  getVideo,
  createVideo,
  likeVideo,
  dislikeVideo,
  getUserVideos,
  deleteVideo,
  getTrending
} = require('../controllers/videoController');
const { protect, optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, getVideos);
router.get('/trending', getTrending);
router.get('/:id', optionalAuth, getVideo);
router.post('/', protect, createVideo);
router.put('/:id/like', protect, likeVideo);
router.put('/:id/dislike', protect, dislikeVideo);
router.get('/user/:userId', getUserVideos);
router.delete('/:id', protect, deleteVideo);

module.exports = router;
