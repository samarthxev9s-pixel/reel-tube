const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    default: '',
    maxlength: 5000
  },
  videoUrl: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    default: 'https://via.placeholder.com/640x360?text=Reel+Tube'
  },
  duration: {
    type: String,
    default: '0:00'
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  dislikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  category: {
    type: String,
    default: 'General',
    enum: ['General', 'Music', 'Gaming', 'Education', 'Entertainment', 'Sports', 'News', 'Tech', 'Comedy']
  },
  tags: [String],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  // YouTube Shorts / Reels style
  isShort: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

videoSchema.index({ title: 'text', description: 'text', tags: 'text' });
videoSchema.index({ isShort: 1, createdAt: -1 });

module.exports = mongoose.model('Video', videoSchema);
