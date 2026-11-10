import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import VideoCard from '../components/VideoCard';
import { useAuth } from '../context/AuthContext';

const Subscriptions = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    API.get('/users/subscriptions')
      .then(res => setVideos(res.data.videos || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="mb-4">Sign in to see your subscriptions</p>
        <Link to="/login" className="bg-yt-red px-4 py-2 rounded-lg">Sign in</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Subscriptions</h1>
      {loading ? <p>Loading...</p> : videos.length === 0 ? (
        <p className="text-gray-400">No videos from subscribed channels yet. Subscribe to some channels!</p>
      ) : (
        <div className="video-grid">
          {videos.map(v => <VideoCard key={v._id} video={v} />)}
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
