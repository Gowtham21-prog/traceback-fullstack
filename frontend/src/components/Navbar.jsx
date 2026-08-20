import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from './Icon';
import { useAuth } from '../hooks/useAuth';

const LINKS = [
  { to: '/', label: 'HOME', icon: 'home' },
  { to: '/report', label: 'FILE REPORT', icon: 'assignment_add' },
  { to: '/search', label: 'SEARCH', icon: 'manage_search' },
  { to: '/tracker', label: 'TRACK CASE', icon: 'track_changes' },
  { to: '/bookmarks', label: 'BOOKMARKS', icon: 'bookmarks' },
  { to: '/analytics', label: 'ANALYTICS', icon: 'insights' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, isPolice } = useAuth();

  const go = (to) => {
    navigate(to);
    setMenuOpen(false);
  };

  return (
    <>
      <nav className="nav" id="nav">
        <div className="nav-wrap">
          <div className="logo" onClick={() => go('/')}>
            <div className="logo-mark">
              <div className="logo-ring-pulse"></div>
              <svg viewBox="0 0 38 38" fill="none">
                <polygon
                  points="19,2 34,10.5 34,27.5 19,36 4,27.5 4,10.5"
                  stroke="#1a90f5"
                  strokeWidth="1.5"
                  fill="rgba(26,144,245,0.06)"
                />
                <polygon
                  points="19,8 29,13.5 29,24.5 19,30 9,24.5 9,13.5"
                  stroke="#00d9ff"
                  strokeWidth="1"
                  fill="rgba(0,217,255,0.04)"
                  strokeDasharray="2 1.5"
                />
                <circle cx="19" cy="19" r="4.5" fill="#1a90f5" />
                <circle cx="19" cy="19" r="2" fill="#00d9ff" />
              </svg>
            </div>
            <span className="logo-name">
              TRACE<span>BACK</span>
            </span>
          </div>

          <div className="nav-links">
            {LINKS.map((l) => (
              <button
                key={l.to}
                className={`nl ${pathname === l.to ? 'on' : ''}`}
                onClick={() => go(l.to)}
              >
                <Icon name={l.icon} />
                {l.label}
              </button>
            ))}
            {user ? (
              isPolice && (
                <button className={`nl ${pathname === '/dashboard' ? 'on' : ''}`} onClick={() => go('/dashboard')}>
                  <Icon name="dashboard" />
                  DASHBOARD
                </button>
              )
            ) : (
              <button className={`nl ${pathname === '/login' ? 'on' : ''}`} onClick={() => go('/login')}>
                <Icon name="shield_person" />
                LOGIN
              </button>
            )}
          </div>

          <button className="btn-report" onClick={() => go('/report')}>
            <Icon name="fiber_manual_record" style={{ fontSize: 14, animation: 'pip 1.5s infinite', color: 'var(--red)' }} />
            REPORT MISSING
          </button>

          <button className="burger" id="burger" onClick={() => setMenuOpen((v) => !v)}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      <div className="m-nav" id="mNav" style={{ display: menuOpen ? 'flex' : undefined }}>
        {LINKS.map((l) => (
          <button key={l.to} onClick={() => go(l.to)}>
            <Icon name={l.icon} />
            {l.label}
          </button>
        ))}
        <button onClick={() => go(user && isPolice ? '/dashboard' : '/login')}>
          <Icon name="shield_person" />
          {user && isPolice ? 'DASHBOARD' : 'LOGIN'}
        </button>
      </div>
    </>
  );
}
