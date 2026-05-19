import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.emoji}>🍽️</div>
        <h1 style={styles.title}>404</h1>
        <h2 style={styles.subtitle}>Page not found</h2>
        <p style={styles.description}>
          Looks like this page doesn't exist — but there's plenty of great food waiting for you!
        </p>
        <button onClick={() => navigate('/')} style={styles.btn}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: 'var(--bg)' },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80vh',
    textAlign: 'center',
    padding: '2rem'
  },
  emoji: { fontSize: '4rem', marginBottom: '1rem' },
  title: {
    fontSize: '5rem',
    fontWeight: '800',
    color: 'var(--primary)',
    lineHeight: 1,
    marginBottom: '0.5rem'
  },
  subtitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '1rem'
  },
  description: {
    color: 'var(--text-secondary)',
    fontSize: '1rem',
    maxWidth: '400px',
    lineHeight: '1.6',
    marginBottom: '2rem'
  },
  btn: {
    background: 'var(--primary)',
    color: 'var(--white)',
    padding: '0.875rem 2rem',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer'
  }
};

export default NotFound;