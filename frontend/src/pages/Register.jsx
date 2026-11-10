import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '', channelName: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.username, form.email, form.password, form.channelName);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-yt-gray rounded-2xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Create your account</h1>
      {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {['username', 'email', 'password', 'channelName'].map(field => (
          <div key={field}>
            <label className="block text-sm mb-1 capitalize">{field === 'channelName' ? 'Channel Name' : field}</label>
            <input
              type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
              name={field}
              value={form[field]}
              onChange={handleChange}
              required={field !== 'channelName'}
              className="w-full bg-yt-dark border border-yt-light rounded-lg px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yt-red hover:bg-red-700 py-2.5 rounded-lg font-medium disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Sign up'}
        </button>
      </form>
      <p className="text-center text-sm text-gray-400 mt-4">
        Already have an account? <Link to="/login" className="text-blue-400 hover:underline">Sign in</Link>
      </p>
    </div>
  );
};

export default Register;
