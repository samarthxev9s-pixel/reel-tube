import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiThumbsUp, FiThumbsDown, FiBookmark } from 'react-icons/fi';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import VideoCard from '../components/VideoCard';

const Watch = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [vidRes, comRes] = await Promise.all([
          API.get(`/videos/${id}`),
          API.get(`/comments/${id}`)
        ]);
        setVideo(vidRes.data.video);
        setRecommendations(vidRes.data.recommendations || []);
        setComments(comRes.data.comments || []);

        // Record history if logged in
        if (user) {
          API.post(`/users/history/${id}`).catch(() => {});
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, user]);

  const handleLike = async () => {
    if (!user) return alert('Please login to like');
    try {
      const res = await API.put(`/videos/${id}/like`);
      setVideo(prev => ({
        ...prev,
        likes: Array(res.data.likes).fill(null),
        dislikes: Array(res.data.dislikes).fill(null)
      }));
    } catch (err) { console.error(err); }
  };

  const handleDislike = async () => {
    if (!user) return alert('Please login');
    try {
      const res = await API.put(`/videos/${id}/dislike`);
      setVideo(prev => ({
        ...prev,
        likes: Array(res.data.likes).fill(null),
        dislikes: Array(res.data.dislikes).fill(null)
      }));
    } catch (err) { console.error(err); }
  };

  const handleSubscribe = async () => {
    if (!user) return alert('Please login to subscribe');
    try {
      const res = await API.put(`/users/subscribe/${video.user._id}`);
      setSubscribed(res.data.subscribed);
    } catch (err) { console.error(err); }
  };

  const handleWatchLater = async () => {
    if (!user) return alert('Please login');
    try {
      const res = await API.put(`/users/watchlater/${id}`);
      setSaved(res.data.saved);
    } catch (err) { console.error(err); }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to comment');
    if (!commentText.trim()) return;
    try {
      const res = await API.post(`/comments/${id}`, { text: commentText });
      setComments([res.data.comment, ...comments]);
      setCommentText('');
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!video) return <div className="text-center py-20">Video not found</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1">
        <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4">
          <video src={video.videoUrl} controls autoPlay className="w-full h-full" poster={video.thumbnail} />
        </div>

        <h1 className="text-xl font-semibold mb-2">{video.title}</h1>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <Link to={`/channel/${video.user?._id}`}>
              <img src={video.user?.avatar} alt="" className="w-10 h-10 rounded-full" />
            </Link>
            <div>
              <Link to={`/channel/${video.user?._id}`} className="font-medium hover:underline">
                {video.user?.channelName || video.user?.username}
              </Link>
              <p className="text-xs text-gray-400">{video.views?.toLocaleString()} views</p>
            </div>
            {user && user.id !== video.user?._id && (
              <button
                onClick={handleSubscribe}
                className={`ml-3 px-4 py-1.5 rounded-full text-sm font-medium ${
                  subscribed ? 'bg-yt-gray' : 'bg-white text-black'
                }`}
              >
                {subscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={handleLike} className="flex items-center gap-2 bg-yt-gray px-4 py-2 rounded-full hover:bg-yt-light">
              <FiThumbsUp /> {video.likes?.length || 0}
            </button>
            <button onClick={handleDislike} className="flex items-center gap-2 bg-yt-gray px-4 py-2 rounded-full hover:bg-yt-light">
              <FiThumbsDown /> {video.dislikes?.length || 0}
            </button>
            <button onClick={handleWatchLater} className="flex items-center gap-2 bg-yt-gray px-4 py-2 rounded-full hover:bg-yt-light">
              <FiBookmark /> {saved ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>

        <div className="bg-yt-gray rounded-xl p-4 mb-6">
          <p className="text-sm whitespace-pre-wrap">{video.description || 'No description'}</p>
        </div>

        <div>
          <h3 className="font-medium mb-4">{comments.length} Comments</h3>
          {user && (
            <form onSubmit={handleComment} className="flex gap-3 mb-6">
              <img src={user.avatar} alt="" className="w-9 h-9 rounded-full" />
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-transparent border-b border-yt-light outline-none pb-1 focus:border-white"
              />
              <button type="submit" className="text-sm bg-blue-600 px-3 py-1 rounded-full">Comment</button>
            </form>
          )}
          <div className="space-y-4">
            {comments.map(c => (
              <div key={c._id} className="flex gap-3">
                <img src={c.user?.avatar} alt="" className="w-8 h-8 rounded-full" />
                <div>
                  <p className="text-sm font-medium">{c.user?.username} <span className="text-xs text-gray-500 font-normal">{new Date(c.createdAt).toLocaleDateString()}</span></p>
                  <p className="text-sm mt-0.5">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-80 space-y-3">
        <h3 className="font-medium mb-2">Up next</h3>
        {recommendations.map(v => (
          <VideoCard key={v._id} video={v} />
        ))}
      </div>
    </div>
  );
};

export default Watch;
