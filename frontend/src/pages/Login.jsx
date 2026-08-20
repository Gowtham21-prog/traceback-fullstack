import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  background: 'rgba(255,255,255,.04)',
  border: '1px solid rgba(26,144,245,.18)',
  borderRadius: 10,
  color: 'var(--text)',
  fontSize: 14,
  boxSizing: 'border-box',
  outline: 'none',
  transition: 'all .25s',
  fontFamily: 'var(--fb)',
};

const labelStyle = {
  color: 'var(--text3)',
  fontFamily: 'var(--fm)',
  fontSize: 9.5,
  fontWeight: 600,
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  display: 'flex',
  alignItems: 'center',
  gap: 5,
  marginBottom: 8,
};

const submitBtnStyle = {
  width: '100%',
  padding: 14,
  background: 'linear-gradient(135deg,#1a90f5,#7c3aed)',
  border: 'none',
  borderRadius: 10,
  color: '#fff',
  fontFamily: 'var(--fh)',
  fontWeight: 700,
  fontSize: 13,
  cursor: 'pointer',
  letterSpacing: '.5px',
  transition: 'all .3s',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  boxShadow: '0 8px 24px rgba(26,144,245,.3)',
};

export default function Login() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const { showToast } = useToast();
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regRole, setRegRole] = useState('reporter');

  const handleLogin = async () => {
    setError('');
    if (!loginEmail || !loginPass) {
      setError('Please enter your email and password.');
      return;
    }
    setSubmitting(true);
    const res = await signIn(loginEmail, loginPass);
    setSubmitting(false);
    if (res.success) {
      showToast('Welcome back!', 'success');
      navigate('/');
    } else {
      setError(res.message || 'Invalid credentials.');
    }
  };

  const handleRegister = async () => {
    setError('');
    if (!regName || !regEmail || !regPass) {
      setError('Please fill in all fields.');
      return;
    }
    if (regPass.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setSubmitting(true);
    const res = await signUp({ name: regName, email: regEmail, password: regPass, role: regRole });
    setSubmitting(false);
    if (res.success) {
      showToast('Account created!', 'success');
      navigate('/');
    } else {
      setError(res.message || 'Registration failed.');
    }
  };

  return (
    <div style={{ maxWidth: 440, margin: '80px auto', padding: '0 20px' }}>
      <div
        style={{
          background: 'rgba(9,15,28,.95)',
          border: '1px solid rgba(26,144,245,.15)',
          borderRadius: 20,
          padding: '44px 40px',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 32px 80px rgba(0,0,0,.6)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div className="login-icon-wrap">
            <Icon name="shield_person" />
          </div>
          <h2 style={{ fontFamily: 'var(--fh)', fontSize: 24, fontWeight: 800, color: 'var(--text)', letterSpacing: '-.5px' }}>
            {mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </h2>
          <p style={{ color: 'var(--text3)', fontFamily: 'var(--fm)', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginTop: 6 }}>
            Access your TraceBack account
          </p>
        </div>

        {error && (
          <div
            style={{
              background: 'rgba(255,63,92,.1)',
              color: 'var(--red)',
              padding: '10px 14px',
              borderRadius: 8,
              fontSize: 13,
              marginBottom: 16,
              border: '1px solid rgba(255,63,92,.2)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Icon name="error_outline" style={{ fontSize: 16 }} />
            <span>{error}</span>
          </div>
        )}

        {mode === 'login' ? (
          <>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>
                <Icon name="alternate_email" style={{ fontSize: 13 }} />
                EMAIL
              </label>
              <input type="email" placeholder="your@email.com" style={inputStyle} value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
            </div>
            <div style={{ marginBottom: 28 }}>
              <label style={labelStyle}>
                <Icon name="lock_outline" style={{ fontSize: 13 }} />
                PASSWORD
              </label>
              <input
                type="password"
                placeholder="••••••••"
                style={inputStyle}
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <button style={submitBtnStyle} onClick={handleLogin} disabled={submitting}>
              <Icon name="login" style={{ fontSize: 18 }} />
              {submitting ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
            <p style={{ textAlign: 'center', marginTop: 18, color: 'var(--text3)', fontSize: 13 }}>
              No account?{' '}
              <span style={{ color: 'var(--blue)', cursor: 'pointer', fontWeight: 600 }} onClick={() => { setMode('register'); setError(''); }}>
                Create one
              </span>
            </p>
          </>
        ) : (
          <>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>
                <Icon name="person_outline" style={{ fontSize: 13 }} />
                FULL NAME
              </label>
              <input type="text" placeholder="Your name" style={inputStyle} value={regName} onChange={(e) => setRegName(e.target.value)} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>
                <Icon name="alternate_email" style={{ fontSize: 13 }} />
                EMAIL
              </label>
              <input type="email" placeholder="your@email.com" style={inputStyle} value={regEmail} onChange={(e) => setRegEmail(e.target.value)} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>
                <Icon name="lock_outline" style={{ fontSize: 13 }} />
                PASSWORD
              </label>
              <input type="password" placeholder="Min 6 characters" style={inputStyle} value={regPass} onChange={(e) => setRegPass(e.target.value)} />
            </div>
            <div style={{ marginBottom: 28 }}>
              <label style={labelStyle}>
                <Icon name="badge" style={{ fontSize: 13 }} />
                ROLE
              </label>
              <select style={{ ...inputStyle, background: 'rgba(6,12,20,.9)' }} value={regRole} onChange={(e) => setRegRole(e.target.value)}>
                <option value="reporter">Reporter (Public)</option>
                <option value="police">Police Officer</option>
              </select>
            </div>
            <button style={submitBtnStyle} onClick={handleRegister} disabled={submitting}>
              <Icon name="how_to_reg" style={{ fontSize: 18 }} />
              {submitting ? 'CREATING...' : 'CREATE ACCOUNT'}
            </button>
            <p style={{ textAlign: 'center', marginTop: 18, color: 'var(--text3)', fontSize: 13 }}>
              Have account?{' '}
              <span style={{ color: 'var(--blue)', cursor: 'pointer', fontWeight: 600 }} onClick={() => { setMode('login'); setError(''); }}>
                Sign in
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
