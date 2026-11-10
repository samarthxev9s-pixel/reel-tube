const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Soft / simple register for viewers (auto member while watching)
exports.softRegister = async (req, res) => {
  try {
    const { username, email } = req.body;
    if (!username || !email) {
      return res.status(400).json({ success: false, message: 'Username and email required' });
    }
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      const token = generateToken(user._id);
      return res.json({
        success: true,
        token,
        user: { id: user._id, username: user.username, email: user.email, avatar: user.avatar, role: user.role, channelName: user.channelName }
      });
    }
    // Create soft viewer with random password (they can later upgrade)
    const password = Math.random().toString(36).slice(-10) + 'A1';
    user = await User.create({
      username,
      email,
      password,
      role: 'viewer',
      isVerified: false
    });
    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, username: user.username, email: user.email, avatar: user.avatar, role: user.role, channelName: user.channelName },
      message: 'Welcome! You are now a member.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Full creator registration (for upload access)
// Note: Real SMS/WhatsApp OTP needs paid services (Twilio, MessageBird etc.)
// Here we simulate verification for free tier
exports.registerCreator = async (req, res) => {
  try {
    const { username, email, password, fullName, phone, channelName } = req.body;
    if (!username || !email || !password || !fullName) {
      return res.status(400).json({ success: false, message: 'Name, username, email and password required' });
    }
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    const user = await User.create({
      username,
      email,
      password,
      fullName,
      phone: phone || '',
      channelName: channelName || username,
      role: 'creator',
      isVerified: true // In production: set false until OTP verified
    });
    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        role: user.role,
        channelName: user.channelName,
        isVerified: user.isVerified
      },
      note: 'For production: integrate real Mobile OTP + WhatsApp OTP (Twilio / WhatsApp Cloud API). Currently auto-verified for free demo.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.register = async (req, res) => {
  // Keep simple register for compatibility → creates viewer
  try {
    const { username, email, password, channelName } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all fields' });
    }
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(400).json({ success: false, message: 'User already exists' });
    const user = await User.create({
      username, email, password,
      channelName: channelName || username,
      role: 'viewer'
    });
    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, username: user.username, email: user.email, avatar: user.avatar, role: user.role, channelName: user.channelName }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    if (user.isBlocked) {
      return res.status(403).json({ success: false, message: 'Account is blocked by admin' });
    }
    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        role: user.role,
        channelName: user.channelName,
        isVerified: user.isVerified,
        isBlocked: user.isBlocked
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};
