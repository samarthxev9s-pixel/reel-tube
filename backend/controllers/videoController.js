const Video = require('../models/Video');
const User = require('../models/User');

exports.getVideos = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 20, type } = req.query;
    let query = { isPublic: true };

    // Shorts / Reels filter
    if (type === 'short') {
      query.isShort = true;
    } else if (type === 'long') {
      query.isShort = false;
    }

    if (search) {
      query.$text = { $search: search };
    }
    if (category && category !== 'All') {
      query.category = category;
    }

    const videos = await Video.find(query)
      .populate('user', 'username channelName avatar')
      .sort(search ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Video.countDocuments(query);

    res.json({
      success: true,
      count: videos.length,
      total,
      videos
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('user', 'username channelName avatar subscribers description');

    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    video.views += 1;
    await video.save();

    // Recommendations: prefer same type (short/long)
    const recommendations = await Video.find({
      _id: { $ne: video._id },
      isPublic: true,
      isShort: video.isShort,
      $or: [
        { category: video.category },
        { user: video.user._id }
      ]
    })
      .populate('user', 'username channelName avatar')
      .limit(12)
      .sort({ views: -1 });

    res.json({ success: true, video, recommendations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createVideo = async (req, res) => {
  try {
    if (!req.user || !['creator','admin','team'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Only verified creators can upload. Please complete full registration.' });
    }
    if (req.user.isBlocked) {
      return res.status(403).json({ success: false, message: 'Your account is blocked' });
    }
    const { title, description, videoUrl, thumbnail, category, tags, duration, isShort } = req.body;

    if (!title || !videoUrl) {
      return res.status(400).json({ success: false, message: 'Title and video URL required' });
    }

    const video = await Video.create({
      title,
      description,
      videoUrl,
      thumbnail: thumbnail || `https://via.placeholder.com/640x360?text=${encodeURIComponent(title)}`,
      category: category || 'General',
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
      duration: duration || '0:00',
      isShort: isShort === true || isShort === 'true',
      user: req.user._id
    });

    const populated = await Video.findById(video._id).populate('user', 'username channelName avatar');
    res.status(201).json({ success: true, video: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });

    const userId = req.user._id.toString();
    const liked = video.likes.some(id => id.toString() === userId);
    const disliked = video.dislikes.some(id => id.toString() === userId);

    if (liked) {
      video.likes = video.likes.filter(id => id.toString() !== userId);
    } else {
      video.likes.push(req.user._id);
      if (disliked) {
        video.dislikes = video.dislikes.filter(id => id.toString() !== userId);
      }
    }

    await video.save();
    res.json({
      success: true,
      likes: video.likes.length,
      dislikes: video.dislikes.length,
      liked: !liked
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });

    const userId = req.user._id.toString();
    const disliked = video.dislikes.some(id => id.toString() === userId);
    const liked = video.likes.some(id => id.toString() === userId);

    if (disliked) {
      video.dislikes = video.dislikes.filter(id => id.toString() !== userId);
    } else {
      video.dislikes.push(req.user._id);
      if (liked) {
        video.likes = video.likes.filter(id => id.toString() !== userId);
      }
    }

    await video.save();
    res.json({
      success: true,
      likes: video.likes.length,
      dislikes: video.dislikes.length,
      disliked: !disliked
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserVideos = async (req, res) => {
  try {
    const videos = await Video.find({ user: req.params.userId, isPublic: true })
      .populate('user', 'username channelName avatar')
      .sort({ createdAt: -1 });
    res.json({ success: true, videos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });
    if (video.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await video.deleteOne();
    res.json({ success: true, message: 'Video deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Trending - videos with high recent views
exports.getTrending = async (req, res) => {
  try {
    const videos = await Video.find({ isPublic: true, isShort: false })
      .populate('user', 'username channelName avatar')
      .sort({ views: -1, createdAt: -1 })
      .limit(30);
    res.json({ success: true, videos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
