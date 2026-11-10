const express = require('express');
const router = express.Router();
const { getComments, addComment, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

router.get('/:videoId', getComments);
router.post('/:videoId', protect, addComment);
router.delete('/:id', protect, deleteComment);

module.exports = router;
