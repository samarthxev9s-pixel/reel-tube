const User = require('../models/User');
const Video = require('../models/Video');

// Subscribe / Unsubscribe
exports.toggleSubscribe = async (req, res) => {
  try {
    const channelId = req.params.userId;
    if (channelId === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot subscribe to yourself' });
    }

    const me = await User.findById(req.user._id);
    const channel = await User.findById(channelId);
    if (!channel) return res.status(404).json({ success: false, message: 'Channel not found' });

    const isSubscribed = me.subscribedTo.some(id => id.toString() === channelId);

    if (isSubscribed) {
      me.subscribedTo = me.subscribedTo.filter(id => id.toString() !== channelId);
      channel.subscribers = channel.subscribers.filter(id => id.toString() !== req.user._id.toString());
    } else {
      me.subscribedTo.push(channelId);
      channel.subscribers.push(req.user._id);
    }

    await me.save();
    await channel.save();

    res.json({
      success: true,
      subscribed: !isSubscribed,
      subscriberCount: channel.subscribers.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get subscribed channels feed (latest videos)
exports.getSubscriptionsFeed = async (req, res) => {
  try {
    const me = await User.findById(req.user._id);
    if (!me.subscribedTo.length) {
      return res.json({ success: true, videos: [] });
    }

    const videos = await Video.find({
      user: { $in: me.subscribedTo },
      isPublic: true,
      isShort: false
    })
      .populate('user', 'username channelName avatar')
      .sort({ createdAt: -1 })
      .limit(40);

    res.json({ success: true, videos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add to watch history
exports.addToHistory = async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const me = await User.findById(req.user._id);

    // Remove if already exists (move to top)
    me.watchHistory = me.watchHistory.filter(h => h.video.toString() !== videoId);
    me.watchHistory.unshift({ video: videoId, watchedAt: new Date() });

    // Keep last 100
    if (me.watchHistory.length > 100) me.watchHistory = me.watchHistory.slice(0, 100);

    await me.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get watch history
exports.getHistory = async (req, res) => {
  try {
    const me = await User.findById(req.user._id)
      .populate({
        path: 'watchHistory.video',
        populate: { path: 'user', select: 'username channelName avatar' }
      });

    const history = me.watchHistory
      .filter(h => h.video)
      .map(h => ({ ...h.video.toObject(), watchedAt: h.watchedAt }));

    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle Watch Later
exports.toggleWatchLater = async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const me = await User.findById(req.user._id);
    const exists = me.watchLater.some(id => id.toString() === videoId);

    if (exists) {
      me.watchLater = me.watchLater.filter(id => id.toString() !== videoId);
    } else {
      me.watchLater.push(videoId);
    }
    await me.save();
    res.json({ success: true, saved: !exists });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Watch Later
exports.getWatchLater = async (req, res) => {
  try {
    const me = await User.findById(req.user._id)
      .populate({
        path: 'watchLater',
        populate: { path: 'user', select: 'username channelName avatar' }
      });
    res.json({ success: true, videos: me.watchLater || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const { channelName, description, avatar } = req.body;
    const me = await User.findById(req.user._id);

    if (channelName) me.channelName = channelName;
    if (description !== undefined) me.description = description;
    if (avatar) me.avatar = avatar;

    await me.save();
    res.json({
      success: true,
      user: {
        id: me._id,
        username: me.username,
        email: me.email,
        avatar: me.avatar,
        channelName: me.channelName,
        description: me.description
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get channel info
exports.getChannel = async (req, res) => {
  try {
    const channel = await User.findById(req.params.userId)
      .select('-password -watchHistory -watchLater -likedVideos');
    if (!channel) return res.status(404).json({ success: false, message: 'Channel not found' });

    const videoCount = await Video.countDocuments({ user: channel._id, isPublic: true });
    res.json({
      success: true,
      channel: {
        ...channel.toObject(),
        videoCount,
        subscriberCount: channel.subscribers?.length || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
