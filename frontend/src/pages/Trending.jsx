import { useState, useEffect } from 'react';
import API from '../api/axios';
import VideoCard from '../components/VideoCard';

const Trending = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/videos/trending')
      .then(res => setVideos(res.data.videos || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Trending</h1>
      {loading ? <p>Loading...</p> : (
        <div className="video-grid">
          {videos.map(v => <VideoCard key={v._id} video={v} />)}
        </div>
      )}
    </div>
  );
};

export default Trending;
