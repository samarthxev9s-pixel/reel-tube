require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Video = require('./models/Video');

const sampleVideos = [
  {
    title: 'Welcome to Reel Tube - Project Overview',
    description: 'This is a full-stack YouTube-style clone. Learn how it works!',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://via.placeholder.com/640x360/ff0000/ffffff?text=Reel+Tube+Intro',
    category: 'Education',
    tags: ['intro', 'tutorial'],
    duration: '0:10',
    views: 1520,
    isShort: false
  },
  {
    title: 'Amazing Nature Timelapse',
    description: 'Beautiful nature scenes.',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://via.placeholder.com/640x360/00aa00/ffffff?text=Nature',
    category: 'Entertainment',
    tags: ['nature'],
    duration: '0:10',
    views: 8900,
    isShort: false
  },
  {
    title: 'Quick React Tip #1',
    description: 'Short tip for React beginners',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://via.placeholder.com/360x640/61dafb/000000?text=Short+React',
    category: 'Tech',
    tags: ['react', 'shorts'],
    duration: '0:08',
    views: 3200,
    isShort: true
  },
  {
    title: 'Funny Cat Moment',
    description: 'Quick funny cat clip',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://via.placeholder.com/360x640/ff9900/ffffff?text=Cat+Short',
    category: 'Comedy',
    tags: ['cats', 'funny'],
    duration: '0:07',
    views: 15400,
    isShort: true
  },
  {
    title: 'Gaming Highlight Clip',
    description: 'Epic moment in 15 seconds',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://via.placeholder.com/360x640/9b59b6/ffffff?text=Game+Short',
    category: 'Gaming',
    tags: ['gaming'],
    duration: '0:12',
    views: 7800,
    isShort: true
  },
  {
    title: 'How to Deploy Free Apps',
    description: 'Deploy MERN for free.',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://via.placeholder.com/640x360/0066cc/ffffff?text=Deploy',
    category: 'Education',
    tags: ['deploy'],
    duration: '0:10',
    views: 3100,
    isShort: false
  },
  {
    title: 'Daily Motivation Short',
    description: 'Quick motivation',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://via.placeholder.com/360x640/e74c3c/ffffff?text=Motivation',
    category: 'Entertainment',
    tags: ['motivation'],
    duration: '0:09',
    views: 9100,
    isShort: true
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/reeltube');
    console.log('Connected');

    await User.deleteMany({});
    await Video.deleteMany({});

    const user = await User.create({
      username: 'admin',
      email: 'admin@reeltube.com',
      password: 'password123',
      channelName: 'Reel Tube Official',
      avatar: 'https://ui-avatars.com/api/?name=RT&background=ff0000&color=fff',
      role: 'admin',
      isVerified: true,
      fullName: 'Admin User'
    });

    const user2 = await User.create({
      username: 'creator',
      email: 'creator@reeltube.com',
      password: 'password123',
      channelName: 'Cool Creator',
      avatar: 'https://ui-avatars.com/api/?name=CC&background=00aa00&color=fff'
    });

    for (let i = 0; i < sampleVideos.length; i++) {
      const v = sampleVideos[i];
      await Video.create({
        ...v,
        user: i % 2 === 0 ? user._id : user2._id
      });
    }

    console.log('Seed completed!');
    console.log('Login: admin@reeltube.com / password123');
    console.log('Shorts included for testing');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
