import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Upload = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnail: '',
    category: 'General',
    duration: '0:00',
    isShort: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="mb-4">Please login to upload videos</p>
        <button onClick={() => navigate('/login')} className="bg-yt-red px-4 py-2 rounded-lg">Sign in</button>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await API.post('/videos', form);
      if (form.isShort) {
        navigate('/shorts');
      } else {
        navigate(`/watch/${res.data.video._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Upload Video / Short</h1>
      <p className="text-sm text-gray-400 mb-6">
        Paste any public video URL (mp4). Example: https://www.w3schools.com/html/mov_bbb.mp4<br/>
        For Shorts: keep it short & check the Shorts box. Other users will see it in Shorts feed.
      </p>
      {error && <p className="text-red-400 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4 bg-yt-gray p-6 rounded-2xl">
        <div className="flex items-center gap-3 p-3 bg-yt-dark rounded-lg">
          <input
            type="checkbox"
            id="isShort"
            name="isShort"
            checked={form.isShort}
            onChange={handleChange}
            className="w-5 h-5"
          />
          <label htmlFor="isShort" className="font-medium cursor-pointer">
            Upload as Short / Reel (vertical short video for Shorts feed)
          </label>
        </div>

        <div>
          <label className="block text-sm mb-1">Title *</label>
          <input name="title" value={form.title} onChange={handleChange} required
            className="w-full bg-yt-dark border border-yt-light rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3}
            className="w-full bg-yt-dark border border-yt-light rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm mb-1">Video URL (mp4) *</label>
          <input name="videoUrl" value={form.videoUrl} onChange={handleChange} required placeholder="https://..."
            className="w-full bg-yt-dark border border-yt-light rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm mb-1">Thumbnail URL (optional)</label>
          <input name="thumbnail" value={form.thumbnail} onChange={handleChange} placeholder="https://..."
            className="w-full bg-yt-dark border border-yt-light rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Category</label>
            <select name="category" value={form.category} onChange={handleChange}
              className="w-full bg-yt-dark border border-yt-light rounded-lg px-3 py-2 outline-none">
              {['General', 'Music', 'Gaming', 'Education', 'Entertainment', 'Sports', 'News', 'Tech', 'Comedy'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Duration</label>
            <input name="duration" value={form.duration} onChange={handleChange} placeholder="0:15"
              className="w-full bg-yt-dark border border-yt-light rounded-lg px-3 py-2 outline-none" />
          </div>
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-yt-red hover:bg-red-700 py-3 rounded-lg font-medium disabled:opacity-50">
          {loading ? 'Uploading...' : form.isShort ? 'Upload Short' : 'Upload Video'}
        </button>
      </form>
    </div>
  );
};

export default Upload;
