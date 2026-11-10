const express = require('express');
const router = express.Router();
const {
  toggleSubscribe,
  getSubscriptionsFeed,
  addToHistory,
  getHistory,
  toggleWatchLater,
  getWatchLater,
  updateProfile,
  getChannel
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.put('/subscribe/:userId', protect, toggleSubscribe);
router.get('/subscriptions', protect, getSubscriptionsFeed);
router.post('/history/:videoId', protect, addToHistory);
router.get('/history', protect, getHistory);
router.put('/watchlater/:videoId', protect, toggleWatchLater);
router.get('/watchlater', protect, getWatchLater);
router.put('/profile', protect, updateProfile);
router.get('/channel/:userId', getChannel);

module.exports = router;
