import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import VideoCard from '../components/VideoCard';

const Search = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await API.get('/videos', { params: { search: q } });
        setVideos(res.data.videos || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (q) fetch();
    else setLoading(false);
  }, [q]);

  return (
    <div>
      <h1 className="text-xl font-medium mb-6">
        {q ? `Search results for "${q}"` : 'Search videos'}
      </h1>
      {loading ? (
        <p>Loading...</p>
      ) : videos.length === 0 ? (
        <p className="text-gray-400">No videos found. Try different keywords.</p>
      ) : (
        <div className="video-grid">
          {videos.map(v => <VideoCard key={v._id} video={v} />)}
        </div>
      )}
    </div>
  );
};

export default Search;
