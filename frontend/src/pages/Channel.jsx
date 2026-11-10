import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';
import VideoCard from '../components/VideoCard';
import { useAuth } from '../context/AuthContext';

const Channel = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [channel, setChannel] = useState(null);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [vidRes, chRes] = await Promise.all([
          API.get(`/videos/user/${userId}`),
          API.get(`/users/channel/${userId}`)
        ]);
        setVideos(vidRes.data.videos || []);
        setChannel(chRes.data.channel);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [userId]);

  const handleSubscribe = async () => {
    if (!user) return alert('Please login');
    try {
      const res = await API.put(`/users/subscribe/${userId}`);
      setSubscribed(res.data.subscribed);
      if (channel) {
        setChannel({ ...channel, subscriberCount: res.data.subscriberCount });
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div>
      {channel && (
        <div className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-yt-gray rounded-2xl">
          <img src={channel.avatar} alt="" className="w-20 h-20 rounded-full" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{channel.channelName || channel.username}</h1>
            <p className="text-gray-400 text-sm">@{channel.username}</p>
            <p className="text-sm mt-1">
              {channel.subscriberCount || 0} subscribers • {channel.videoCount || videos.length} videos
            </p>
            {channel.description && <p className="text-sm text-gray-300 mt-2">{channel.description}</p>}
          </div>
          {user && user.id !== userId && (
            <button
              onClick={handleSubscribe}
              className={`px-5 py-2 rounded-full font-medium ${
                subscribed ? 'bg-yt-light' : 'bg-white text-black'
              }`}
            >
              {subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          )}
        </div>
      )}
      {loading ? <p>Loading...</p> : (
        <div className="video-grid">
          {videos.map(v => <VideoCard key={v._id} video={v} />)}
        </div>
      )}
    </div>
  );
};

export default Channel;
