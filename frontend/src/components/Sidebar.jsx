import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiCompass, FiPlay, FiUsers, FiClock, FiBookmark, FiTrendingUp } from 'react-icons/fi';

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const links = [
    { to: '/', icon: FiHome, label: 'Home' },
    { to: '/shorts', icon: FiPlay, label: 'Shorts' },
    { to: '/subscriptions', icon: FiUsers, label: 'Subscriptions' },
    { to: '/trending', icon: FiTrendingUp, label: 'Trending' },
    { to: '/history', icon: FiClock, label: 'History' },
    { to: '/watchlater', icon: FiBookmark, label: 'Watch Later' },
    { to: '/search?q=', icon: FiCompass, label: 'Explore' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-56 min-h-[calc(100vh-56px)] bg-yt-dark border-r border-yt-gray p-3 sticky top-14">
      {links.map(({ to, icon: Icon, label }) => (
        <Link
          key={label}
          to={to}
          className={`flex items-center gap-4 px-3 py-2.5 rounded-lg mb-1 transition ${
            isActive(to) ? 'bg-yt-gray font-medium' : 'hover:bg-yt-gray/70'
          }`}
        >
          <Icon size={20} />
          <span>{label}</span>
        </Link>
      ))}
      <hr className="border-yt-gray my-3" />
      <p className="text-xs text-gray-500 px-3">Reel Tube © 2026</p>
      <p className="text-xs text-gray-600 px-3 mt-1">Next-level YouTube clone</p>
    </aside>
  );
};

export default Sidebar;
