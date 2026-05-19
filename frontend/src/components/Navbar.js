import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>🍽️ Truffle</Link>

      {/* Desktop Links */}
      <div className="navbar-desktop">
        {user ? (
          <>
            <Link to="/add-restaurant" style={styles.addBtn}>+ Add Restaurant</Link>
            <Link to="/profile" style={styles.link}>👤 {user.name}</Link>
            <Link to="/bookmarks" style={styles.link}>🔖 Saved</Link>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Sign In</Link>
            <Link to="/register" style={styles.registerBtn}>Join Free</Link>
          </>
        )}
      </div>

      {/* Mobile Hamburger */}
      <button
        className="navbar-hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          {user ? (
            <>
              <Link to="/add-restaurant" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>+ Add Restaurant</Link>
              <Link to="/profile" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>👤 {user.name}</Link>
              <Link to="/bookmarks" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>🔖 Saved</Link>
              <button onClick={handleLogout} style={styles.mobileLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Sign In</Link>
              <Link to="/register" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Join Free</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 2rem',
    background: 'var(--white)',
    borderBottom: '1px solid var(--border)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 12px rgba(193, 127, 90, 0.06)',
    flexWrap: 'wrap'
  },
  logo: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: 'var(--primary)',
    letterSpacing: '-0.5px'
  },
  link: {
    color: 'var(--text-secondary)',
    fontWeight: '500',
    fontSize: '0.95rem'
  },
  logoutBtn: {
    background: 'transparent',
    color: 'var(--text-secondary)',
    fontWeight: '500',
    fontSize: '0.95rem',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    cursor: 'pointer'
  },
  registerBtn: {
    background: 'var(--primary)',
    color: 'var(--white)',
    fontWeight: '600',
    fontSize: '0.9rem',
    padding: '0.5rem 1.2rem',
    borderRadius: '8px'
  },
  addBtn: {
    background: 'var(--surface)',
    color: 'var(--primary)',
    border: '1.5px solid var(--primary)',
    padding: '0.45rem 1rem',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '0.875rem'
  },
  mobileMenu: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    padding: '1rem 0',
    borderTop: '1px solid var(--border)',
    marginTop: '0.5rem'
  },
  mobileLink: {
    color: 'var(--text-primary)',
    fontWeight: '500',
    fontSize: '1rem',
    padding: '0.5rem 0'
  },
  mobileLogout: {
    background: 'transparent',
    color: '#E53E3E',
    border: 'none',
    fontWeight: '500',
    fontSize: '1rem',
    textAlign: 'left',
    cursor: 'pointer',
    padding: '0.5rem 0'
  }
};

export default Navbar;