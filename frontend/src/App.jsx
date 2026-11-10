import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Watch from './pages/Watch';
import Login from './pages/Login';
import Register from './pages/Register';
import Upload from './pages/Upload';
import Channel from './pages/Channel';
import Search from './pages/Search';
import Shorts from './pages/Shorts';
import Subscriptions from './pages/Subscriptions';
import History from './pages/History';
import WatchLater from './pages/WatchLater';
import Trending from './pages/Trending';
import Admin from './pages/Admin';

function App() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-3 md:p-6 overflow-x-hidden pb-20 md:pb-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shorts" element={<Shorts />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/history" element={<History />} />
            <Route path="/watchlater" element={<WatchLater />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/watch/:id" element={<Watch />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/channel/:userId" element={<Channel />} />
            <Route path="/search" element={<Search />} />
          </Routes>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}

export default App;
