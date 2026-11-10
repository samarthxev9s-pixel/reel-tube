import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import VideoCard from '../components/VideoCard';
import { useAuth } from '../context/AuthContext';

const History = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    API.get('/users/history')
      .then(res => setHistory(res.data.history || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="mb-4">Sign in to see watch history</p>
        <Link to="/login" className="bg-yt-red px-4 py-2 rounded-lg">Sign in</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Watch History</h1>
      {loading ? <p>Loading...</p> : history.length === 0 ? (
        <p className="text-gray-400">No watch history yet.</p>
      ) : (
        <div className="video-grid">
          {history.map(v => <VideoCard key={v._id + (v.watchedAt || '')} video={v} />)}
        </div>
      )}
    </div>
  );
};

export default History;
