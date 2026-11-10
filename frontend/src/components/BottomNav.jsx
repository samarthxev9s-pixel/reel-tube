import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiPlay, FiPlusCircle, FiUsers, FiUser } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const BottomNav = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const isActive = (path) => location.pathname === path;

  const items = [
    { to: '/', icon: FiHome, label: 'Home' },
    { to: '/shorts', icon: FiPlay, label: 'Shorts' },
    { to: '/upload', icon: FiPlusCircle, label: 'Upload', special: true },
    { to: '/subscriptions', icon: FiUsers, label: 'Subs' },
    { to: '/history', icon: FiUser, label: 'You' },
  ];

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t flex justify-around items-center h-14 pb-safe"
      style={{ backgroundColor: theme.nav, borderColor: theme.border }}
    >
      {items.map(({ to, icon: Icon, label, special }) => (
        <Link
          key={label}
          to={to}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-fast ${
            special ? 'text-[var(--accent)]' : isActive(to) ? 'text-white' : 'text-[var(--muted)]'
          }`}
        >
          <Icon size={special ? 28 : 22} strokeWidth={special ? 2.5 : 2} />
          <span className="text-[10px] mt-0.5">{label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default BottomNav;
