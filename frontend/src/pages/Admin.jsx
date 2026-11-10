import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Admin = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [videos, setVideos] = useState([]);
  const [tab, setTab] = useState('stats');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !['admin','team'].includes(user.role)) return;
    const load = async () => {
      try {
        const [s, u, v] = await Promise.all([
          API.get('/admin/stats'),
          API.get('/admin/users'),
          API.get('/admin/videos')
        ]);
        setStats(s.data.stats);
        setUsers(u.data.users || []);
        setVideos(v.data.videos || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, [user]);

  if (!user || !['admin','team'].includes(user.role)) {
    return (
      <div className="text-center py-20">
        <p className="mb-4">Admin / Team access only</p>
        <Link to="/" className="text-red-500">Go Home</Link>
      </div>
    );
  }

  const toggleBlock = async (id) => {
    await API.put(`/admin/users/${id}/block`);
    setUsers(prev => prev.map(u => u._id === id ? { ...u, isBlocked: !u.isBlocked } : u));
  };

  const deleteVideo = async (id) => {
    if (!confirm('Delete this video?')) return;
    await API.delete(`/admin/videos/${id}`);
    setVideos(prev => prev.filter(v => v._id !== id));
  };

  const setRole = async (id, role) => {
    await API.put(`/admin/users/${id}/role`, { role });
    setUsers(prev => prev.map(u => u._id === id ? { ...u, role } : u));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {['stats','users','videos'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg capitalize ${tab===t ? 'bg-red-600' : 'bg-gray-800'}`}>
            {t}
          </button>
        ))}
      </div>

      {loading ? <p>Loading...</p> : (
        <>
          {tab === 'stats' && stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800 p-4 rounded-xl"><p className="text-3xl font-bold">{stats.users}</p><p className="text-gray-400">Users</p></div>
              <div className="bg-gray-800 p-4 rounded-xl"><p className="text-3xl font-bold">{stats.videos}</p><p className="text-gray-400">Videos</p></div>
              <div className="bg-gray-800 p-4 rounded-xl"><p className="text-3xl font-bold">{stats.shorts}</p><p className="text-gray-400">Shorts</p></div>
              <div className="bg-gray-800 p-4 rounded-xl"><p className="text-3xl font-bold">{stats.blocked}</p><p className="text-gray-400">Blocked</p></div>
            </div>
          )}

          {tab === 'users' && (
            <div className="space-y-3">
              {users.map(u => (
                <div key={u._id} className="bg-gray-800 p-3 rounded-xl flex flex-wrap items-center gap-3 justify-between">
                  <div>
                    <p className="font-medium">{u.channelName || u.username} <span className="text-xs text-gray-400">({u.role})</span></p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <select value={u.role} onChange={e => setRole(u._id, e.target.value)} className="bg-gray-900 text-sm rounded px-2 py-1">
                      <option value="viewer">viewer</option>
                      <option value="creator">creator</option>
                      <option value="team">team</option>
                      <option value="admin">admin</option>
                    </select>
                    <button onClick={() => toggleBlock(u._id)} className={`text-sm px-3 py-1 rounded ${u.isBlocked ? 'bg-green-700' : 'bg-red-700'}`}>
                      {u.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'videos' && (
            <div className="space-y-3">
              {videos.map(v => (
                <div key={v._id} className="bg-gray-800 p-3 rounded-xl flex gap-3 items-center">
                  <img src={v.thumbnail} alt="" className="w-24 h-14 object-cover rounded" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{v.title}</p>
                    <p className="text-xs text-gray-400">{v.user?.username} • {v.views} views {v.isShort ? '• Short' : ''}</p>
                  </div>
                  <button onClick={() => deleteVideo(v._id)} className="text-sm bg-red-700 px-3 py-1 rounded">Delete</button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Admin;
