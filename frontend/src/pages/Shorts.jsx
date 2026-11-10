import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiThumbsUp, FiThumbsDown, FiMessageCircle } from 'react-icons/fi';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Shorts = () => {
  const [shorts, setShorts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchShorts = async () => {
      try {
        const res = await API.get('/videos', { params: { type: 'short', limit: 30 } });
        setShorts(res.data.videos || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchShorts();
  }, []);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const scrollTop = containerRef.current.scrollTop;
    const height = containerRef.current.clientHeight;
    const index = Math.round(scrollTop / height);
    if (index !== currentIndex && index >= 0 && index < shorts.length) {
      setCurrentIndex(index);
    }
  };

  const handleLike = async (id) => {
    if (!user) return alert('Please login to like');
    try {
      await API.put(`/videos/${id}/like`);
      // optimistic update
      setShorts(prev => prev.map(s => 
        s._id === id ? { ...s, likes: [...(s.likes || []), 'temp'] } : s
      ));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-[70vh] text-gray-400">Loading Shorts...</div>;
  }

  if (shorts.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-xl mb-2">No Shorts yet</p>
        <p>Upload a Short from the Upload page!</p>
        <Link to="/upload" className="inline-block mt-4 bg-yt-red px-4 py-2 rounded-lg text-white">Upload Short</Link>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      onScroll={handleScroll}
      className="h-[calc(100vh-120px)] overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
      style={{ scrollSnapType: 'y mandatory' }}
    >
      {shorts.map((short, idx) => (
        <div 
          key={short._id}
          className="h-full w-full snap-start relative flex items-center justify-center bg-black"
        >
          {/* Vertical video container */}
          <div className="relative w-full max-w-md h-full mx-auto">
            <video
              src={short.videoUrl}
              className="w-full h-full object-contain"
              loop
              muted={idx !== currentIndex}
              autoPlay={idx === currentIndex}
              playsInline
              poster={short.thumbnail}
            />

            {/* Overlay info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <Link to={`/channel/${short.user?._id}`} className="flex items-center gap-2 mb-2">
                <img src={short.user?.avatar} alt="" className="w-8 h-8 rounded-full border border-white" />
                <span className="font-medium text-sm">@{short.user?.username}</span>
              </Link>
              <p className="text-sm line-clamp-2 mb-1">{short.title}</p>
              <p className="text-xs text-gray-300">{short.views?.toLocaleString()} views</p>
            </div>

            {/* Right side actions (YouTube Shorts style) */}
            <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5">
              <button 
                onClick={() => handleLike(short._id)}
                className="flex flex-col items-center text-white"
              >
                <div className="bg-black/40 p-2 rounded-full">
                  <FiThumbsUp size={22} />
                </div>
                <span className="text-xs mt-1">{short.likes?.length || 0}</span>
              </button>
              <div className="flex flex-col items-center text-white">
                <div className="bg-black/40 p-2 rounded-full">
                  <FiMessageCircle size={22} />
                </div>
                <span className="text-xs mt-1">Comment</span>
              </div>
              <Link 
                to={`/watch/${short._id}`}
                className="bg-black/40 p-2 rounded-full text-white text-xs"
              >
                Full
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Shorts;
