import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser({ username, password });
      localStorage.setItem('hw_token',    res.data.token);
      localStorage.setItem('hw_username', res.data.user.username);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-16"
      style={{
        background: 'radial-gradient(ellipse 60% 50% at 50% 20%, rgba(249,115,22,0.1) 0%, transparent 70%), #0a0a0f',
      }}
      id="login-page"
    >
      <div className="w-full max-w-md fade-in-up">
        {/* Logo mark */}
        <div className="text-center mb-10">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{
              background: 'linear-gradient(135deg, #f97316, #ef4444)',
              boxShadow: '0 0 40px rgba(249,115,22,0.35)',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
            </svg>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-white mb-2">Sign In</h1>
          <p className="text-slate-400 text-sm">Access the Heatwave Monitoring System</p>
        </div>

        {/* Form */}
        <div className="glass p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="dark-input"
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="dark-input"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div
                id="login-error"
                className="text-red-400 text-sm px-3 py-2.5 rounded-lg"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              id="login-btn"
              disabled={loading}
              className="btn-primary w-full text-sm mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo hint */}
          <div
            className="mt-6 text-center text-xs text-slate-500 py-3 px-4 rounded-lg"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            Demo — username: <span className="text-slate-300 font-medium">admin</span> &nbsp;/&nbsp; password: <span className="text-slate-300 font-medium">admin123</span>
          </div>
        </div>
      </div>
    </div>
  );
}
