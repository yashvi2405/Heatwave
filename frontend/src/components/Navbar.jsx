import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem('hw_token');
  const username   = localStorage.getItem('hw_username');

  const handleLogout = () => {
    localStorage.removeItem('hw_token');
    localStorage.removeItem('hw_username');
    window.location.href = '/login';
  };

  const linkClass = ({ isActive }) =>
    `relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
      isActive
        ? 'text-orange-400 bg-orange-500/10'
        : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`;

  return (
    <nav
      id="main-nav"
      style={{
        background: 'rgba(10,10,15,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
      className="sticky top-0 z-50"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)', boxShadow: '0 0 16px rgba(249,115,22,0.35)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
              </svg>
            </div>
            <span className="font-display font-bold text-white text-lg tracking-tight">
              Heat<span className="text-orange-400">wave</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1" id="nav-links">
            <NavLink to="/"           end className={linkClass}>Home</NavLink>
            <NavLink to="/dashboard"      className={linkClass}>Dashboard</NavLink>
            <NavLink to="/prediction"     className={linkClass}>Prediction</NavLink>
            <NavLink to="/alerts"         className={linkClass}>Alerts</NavLink>

            <div className="w-px h-5 mx-2" style={{ background: 'rgba(255,255,255,0.1)' }} />

            {!isLoggedIn ? (
              <NavLink
                to="/login"
                className="px-4 py-2 text-sm font-semibold rounded-lg text-white transition-all duration-200"
                style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)', boxShadow: '0 2px 12px rgba(249,115,22,0.35)' }}
              >
                Login
              </NavLink>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-400">
                  Hi, <span className="text-orange-400 font-medium">{username}</span>
                </span>
                <button id="logout-btn" onClick={handleLogout} className="btn-secondary text-sm">
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-slate-400 hover:text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className="space-y-1.5">
              <span className={`block w-5 h-0.5 bg-current transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-5 h-0.5 bg-current transition-all ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-1" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {['/', '/dashboard', '/prediction', '/alerts'].map((path, i) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/'}
                className={linkClass}
                onClick={() => setMenuOpen(false)}
              >
                {['Home', 'Dashboard', 'Prediction', 'Alerts'][i]}
              </NavLink>
            ))}
            {!isLoggedIn ? (
              <NavLink to="/login" className="block px-4 py-2 text-sm text-orange-400 font-medium" onClick={() => setMenuOpen(false)}>Login</NavLink>
            ) : (
              <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-slate-400 hover:text-white">Logout ({username})</button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
