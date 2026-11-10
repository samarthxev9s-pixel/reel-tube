import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import VideoCard from '../components/VideoCard';

const categories = ['All', 'Music', 'Gaming', 'Education', 'Entertainment', 'Sports', 'Tech', 'Comedy'];

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = { type: 'long' };
        if (category !== 'All') params.category = category;
        
        const [longRes, shortRes] = await Promise.all([
          API.get('/videos', { params }),
          API.get('/videos', { params: { type: 'short', limit: 8 } })
        ]);
        setVideos(longRes.data.videos || []);
        setShorts(shortRes.data.videos || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [category]);

  return (
    <div>
      {/* Shorts strip */}
      {shorts.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <span className="bg-yt-red text-white text-xs px-1.5 py-0.5 rounded">▶</span> Shorts
            </h2>
            <Link to="/shorts" className="text-sm text-blue-400 hover:underline">View all</Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {shorts.map(s => (
              <Link key={s._id} to="/shorts" className="flex-shrink-0 w-28">
                <div className="aspect-[9/16] rounded-xl overflow-hidden bg-yt-gray relative">
                  <img src={s.thumbnail} alt={s.title} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/70 text-[10px] line-clamp-2">
                    {s.title}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition ${
              category === cat ? 'bg-white text-black font-medium' : 'bg-yt-gray hover:bg-yt-light'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="video-grid">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-video bg-yt-gray rounded-xl mb-3"></div>
              <div className="h-4 bg-yt-gray rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-yt-gray rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl mb-2">No videos found</p>
          <p>Upload some videos or run the seed script!</p>
        </div>
      ) : (
        <div className="video-grid">
          {videos.map(video => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
