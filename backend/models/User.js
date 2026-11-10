const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 30 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  fullName: { type: String, default: '' },
  phone: { type: String, default: '' },
  avatar: { type: String, default: 'https://ui-avatars.com/api/?name=User&background=random' },
  channelName: { type: String, default: function() { return this.username; } },
  description: { type: String, default: '' },
  // Roles: viewer (soft), creator (can upload), team, admin
  role: { type: String, enum: ['viewer', 'creator', 'team', 'admin'], default: 'viewer' },
  isVerified: { type: Boolean, default: false }, // for creators after OTP
  isBlocked: { type: Boolean, default: false },
  subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  subscribedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  watchHistory: [{
    video: { type: mongoose.Schema.Types.ObjectId, ref: 'Video' },
    watchedAt: { type: Date, default: Date.now }
  }],
  watchLater: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
  likedVideos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }]
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidate) {
  return await bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
