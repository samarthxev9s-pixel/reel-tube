const User = require('../models/User');
const Video = require('../models/Video');
const Comment = require('../models/Comment');

// Middleware helper - only admin/team
exports.requireAdminOrTeam = (req, res, next) => {
  if (!req.user || !['admin', 'team'].includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Admin or Team access required' });
  }
  next();
};

// List all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -watchHistory').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Block / Unblock user
exports.toggleBlock = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ success: false, message: 'Cannot block admin' });
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({ success: true, isBlocked: user.isBlocked });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Change role
exports.setRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['viewer', 'creator', 'team', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.role = role;
    if (role === 'creator' || role === 'admin' || role === 'team') user.isVerified = true;
    await user.save();
    res.json({ success: true, user: { id: user._id, role: user.role, isVerified: user.isVerified } });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ success: false, message: 'Cannot delete admin' });
    await Video.deleteMany({ user: user._id });
    await user.deleteOne();
    res.json({ success: true, message: 'User and their videos deleted' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// List all videos (admin moderation)
exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .populate('user', 'username channelName email role isBlocked')
      .sort({ createdAt: -1 });
    res.json({ success: true, videos });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Force delete any video
exports.adminDeleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });
    await Comment.deleteMany({ video: video._id });
    await video.deleteOne();
    res.json({ success: true, message: 'Video deleted by admin' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Dashboard stats
exports.getStats = async (req, res) => {
  try {
    const [users, videos, shorts, blocked] = await Promise.all([
      User.countDocuments(),
      Video.countDocuments({ isShort: false }),
      Video.countDocuments({ isShort: true }),
      User.countDocuments({ isBlocked: true })
    ]);
    res.json({ success: true, stats: { users, videos, shorts, blocked } });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
