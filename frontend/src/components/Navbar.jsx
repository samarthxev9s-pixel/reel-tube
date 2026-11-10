import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiUpload, FiSettings } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const [query, setQuery] = useState('');
  const [showTheme, setShowTheme] = useState(false);
  const { user, logout } = useAuth();
  const { theme, themeId, setThemeId, themes } = useTheme();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header 
      className="sticky top-0 z-50 border-b px-3 py-2.5 flex items-center justify-between gap-3"
      style={{ backgroundColor: theme.nav, borderColor: theme.border }}
    >
      <Link to="/" className="flex items-center gap-1.5 font-bold text-lg shrink-0">
        <span 
          className="text-white px-1.5 py-0.5 rounded text-xs font-bold"
          style={{ backgroundColor: theme.accent }}
        >▶</span>
        <span>Reel<span style={{ color: theme.accent }}>Tube</span></span>
      </Link>

      <form onSubmit={handleSearch} className="flex-1 max-w-md hidden sm:flex">
        <div className="flex w-full">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="flex-1 rounded-l-full px-4 py-2 outline-none text-sm"
            style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, color: theme.text }}
          />
          <button 
            type="submit" 
            className="rounded-r-full px-4"
            style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderLeft: 'none' }}
          >
            <FiSearch />
          </button>
        </div>
      </form>

      <div className="flex items-center gap-2 relative">
        <button 
          onClick={() => setShowTheme(!showTheme)}
          className="p-2 rounded-full"
          style={{ color: theme.muted }}
          title="Change Theme"
        >
          <FiSettings size={18} />
        </button>

        {showTheme && (
          <div 
            className="absolute right-0 top-10 w-48 rounded-xl shadow-xl z-50 py-2"
            style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}` }}
          >
            <p className="px-3 py-1 text-xs" style={{ color: theme.muted }}>Theme</p>
            {Object.values(themes).map(t => (
              <button
                key={t.id}
                onClick={() => { setThemeId(t.id); setShowTheme(false); }}
                className={`w-full text-left px-3 py-2 text-sm ${themeId === t.id ? 'font-medium' : ''}`}
                style={{ color: themeId === t.id ? theme.accent : theme.text }}
              >
                {t.name}
              </button>
            ))}
          </div>
        )}

        {user ? (
          <>
            <Link to="/upload" className="p-2 rounded-full hidden sm:block" style={{ color: theme.text }}>
              <FiUpload size={18} />
            </Link>
            <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" />
            <button onClick={logout} className="text-xs hidden md:block" style={{ color: theme.muted }}>Logout</button>
          </>
        ) : (
          <Link 
            to="/login" 
            className="text-sm px-3 py-1.5 rounded-full border"
            style={{ borderColor: theme.accent, color: theme.accent }}
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
