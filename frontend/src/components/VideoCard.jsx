import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const formatViews = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num || 0;
};

const VideoCard = ({ video }) => {
  const { theme } = useTheme();
  return (
    <Link to={`/watch/${video._id}`} className="group block">
      <div 
        className="relative aspect-video rounded-xl overflow-hidden mb-2"
        style={{ backgroundColor: theme.card }}
      >
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          loading="lazy"
        />
        <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-[10px] px-1.5 py-0.5 rounded">
          {video.duration || '0:00'}
        </span>
        {video.isShort && (
          <span 
            className="absolute top-1.5 left-1.5 text-[10px] px-1.5 py-0.5 rounded font-medium"
            style={{ backgroundColor: theme.accent }}
          >
            Short
          </span>
        )}
      </div>
      <div className="flex gap-2">
        <img
          src={video.user?.avatar || 'https://ui-avatars.com/api/?name=U'}
          alt=""
          className="w-8 h-8 rounded-full flex-shrink-0"
        />
        <div className="min-w-0">
          <h3 className="font-medium text-sm line-clamp-2 leading-snug" style={{ color: theme.text }}>
            {video.title}
          </h3>
          <p className="text-xs mt-0.5" style={{ color: theme.muted }}>
            {video.user?.channelName || video.user?.username}
          </p>
          <p className="text-xs" style={{ color: theme.muted }}>
            {formatViews(video.views)} views
          </p>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
