import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';

const EyeIcon = ({ open }) =>
  open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post('/auth/register', formData);
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (name) => ({
    ...styles.input,
    border: focused === name
      ? '1.5px solid #C17F5A'
      : '1.5px solid #e5e7eb',
    boxShadow: focused === name
      ? '0 0 0 3px rgba(193,127,90,0.15)'
      : 'none',
  });

  return (
    <div style={styles.page}>
      <div style={styles.content}>

        {/* Left side */}
        <div style={styles.leftSide}>
          <div style={styles.logoRow}>
            <div style={styles.logoIcon}>🍽</div>
            <span style={styles.logoText}>Truffle</span>
          </div>
          <h1 style={styles.welcomeTitle}>Join<br />Truffle</h1>
          <p style={styles.welcomeDesc}>
            Be part of Hyderabad's food discovery community.<br />
            Share your favourite dishes with the world.
          </p>
          <div style={styles.badgeRow}>
            <div style={styles.badge}>🍜 1000+ Dishes</div>
            <div style={styles.badge}>⭐ Real Reviews</div>
            <div style={styles.badge}>📍 Hyderabad</div>
          </div>
        </div>

        {/* Right side — Form */}
        <div style={styles.formBox}>
          <h2 style={styles.formTitle}>Create Account</h2>
          <p style={styles.formSubtitle}>Start your food journey today</p>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Your name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onFocus={() => setFocused('name')}
                onBlur={() => setFocused('')}
                placeholder="Arjun Sharma"
                style={inputStyle('name')}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused('')}
                placeholder="you@example.com"
                style={inputStyle('email')}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.passwordWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                  placeholder="Min. 8 characters"
                  style={{ ...inputStyle('password'), paddingRight: '3rem' }}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              style={loading
                ? { ...styles.button, opacity: 0.7, cursor: 'not-allowed' }
                : styles.button}
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <p style={styles.loginText}>
            Already have an account?{' '}
            <Link to="/login" style={styles.loginLink}>Sign in →</Link>
          </p>

          <p style={styles.terms}>
            By creating an account you agree to our{' '}
            <Link to="/terms" style={styles.termsLink}>Terms of Service</Link>{' '}|{' '}
            <Link to="/privacy" style={styles.termsLink}>Privacy Policy</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#F5EDE3',
    fontFamily: "'Segoe UI', sans-serif",
    padding: '2rem',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '4rem',
    width: '100%',
    maxWidth: '1000px',
    alignItems: 'center',
  },
  leftSide: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '2rem',
  },
  logoIcon: {
    width: '40px',
    height: '40px',
    background: '#C17F5A',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
  },
  logoText: {
    fontSize: '1.3rem',
    fontWeight: '800',
    color: '#C17F5A',
  },
  welcomeTitle: {
    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
    fontWeight: '800',
    lineHeight: '1.1',
    marginBottom: '1rem',
    marginTop: 0,
    color: '#1a1a1a',
  },
  welcomeDesc: {
    fontSize: '1rem',
    color: '#6b7280',
    lineHeight: '1.7',
    marginBottom: '1.75rem',
    marginTop: 0,
  },
  badgeRow: {
    display: 'flex',
    gap: '0.6rem',
    flexWrap: 'wrap',
  },
  badge: {
    background: 'rgba(193,127,90,0.12)',
    border: '1px solid rgba(193,127,90,0.3)',
    color: '#C17F5A',
    padding: '0.35rem 0.85rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '500',
  },
  formBox: {
    background: '#FFFFFF',
    borderRadius: '20px',
    padding: '2.5rem',
    boxShadow: '0 8px 48px rgba(0,0,0,0.12)',
    border: '1px solid rgba(0,0,0,0.05)',
  },
  formTitle: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '0.25rem',
    marginTop: 0,
  },
  formSubtitle: {
    fontSize: '0.9rem',
    color: '#9ca3af',
    marginBottom: '1.75rem',
    marginTop: 0,
  },
  error: {
    background: 'rgba(239,68,68,0.08)',
    color: '#dc2626',
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    marginBottom: '1rem',
    fontSize: '0.875rem',
    border: '1px solid rgba(239,68,68,0.2)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    padding: '0.85rem 1rem',
    borderRadius: '10px',
    border: '1.5px solid #e5e7eb',
    background: '#fdf8f4',
    fontSize: '0.95rem',
    color: '#111827',
    fontFamily: 'Segoe UI, sans-serif',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'border 0.15s, box-shadow 0.15s',
  },
  passwordWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  eyeBtn: {
    position: 'absolute',
    right: '0.9rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    color: '#9ca3af',
    lineHeight: 1,
  },
  button: {
    background: '#C17F5A',
    color: '#fff',
    padding: '0.9rem',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '600',
    marginTop: '0.25rem',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(193,127,90,0.4)',
    letterSpacing: '0.02em',
    width: '100%',
    transition: 'opacity 0.2s',
  },
  loginText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '0.9rem',
    marginTop: '1.5rem',
    marginBottom: '0.75rem',
  },
  loginLink: {
    color: '#C17F5A',
    fontWeight: '600',
    textDecoration: 'none',
  },
  terms: {
    textAlign: 'center',
    fontSize: '0.75rem',
    color: '#9ca3af',
    lineHeight: '1.6',
    marginTop: 0,
  },
  termsLink: {
    color: '#6b7280',
    textDecoration: 'none',
  },
};

export default Register;
