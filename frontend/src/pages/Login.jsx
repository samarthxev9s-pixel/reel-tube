import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-yt-gray rounded-2xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Sign in to Reel Tube</h1>
      {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-yt-dark border border-yt-light rounded-lg px-3 py-2 outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-yt-dark border border-yt-light rounded-lg px-3 py-2 outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yt-red hover:bg-red-700 py-2.5 rounded-lg font-medium disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      <p className="text-center text-sm text-gray-400 mt-4">
        Don't have an account? <Link to="/register" className="text-blue-400 hover:underline">Create one</Link>
      </p>
      <p className="text-center text-xs text-gray-500 mt-4">Demo: admin@reeltube.com / password123</p>
    </div>
  );
};

export default Login;
