import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import RestaurantCard from '../components/RestaurantCard';
import axios from '../utils/axios';

const CUISINES = ['All', 'Biryani', 'Desserts', 'Chinese', 'Pizza','Burger'];

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 8 };
      if (search) params.search = search;
      if (cuisine && cuisine !== 'All') params.cuisine = cuisine;

      const { data } = await axios.get('/restaurants', { params });
      setRestaurants(data.restaurants);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchRestaurants, 300);
    return () => clearTimeout(timer);
  }, [search, cuisine, page]);

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Discover the best<br /><span style={styles.highlight}>food around you</span></h1>
        <p style={styles.heroSubtitle}>Real reviews from real food lovers in Hyderabad</p>
        <input
          type="text"
          placeholder="🔍 Search restaurants "
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          style={styles.searchBar}
        />
      </div>

      <div style={styles.container}>
        <div style={styles.filters}>
          {CUISINES.map(c => (
            <button
              key={c}
              onClick={() => { setCuisine(c); setPage(1); }}
              style={cuisine === c || (c === 'All' && !cuisine)
                ? { ...styles.chip, ...styles.chipActive }
                : styles.chip}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={styles.loading}>
            <div style={styles.spinner}></div>
            <p>Finding the best food...</p>
          </div>
        ) : restaurants.length === 0 ? (
          <div style={styles.empty}>
            <p style={{ fontSize: '3rem' }}>🍽️</p>
            <p>No restaurants found</p>
          </div>
        ) : (
          <>
            <div style={styles.grid}>
              {restaurants.map(r => (
                <RestaurantCard key={r._id} restaurant={r} />
              ))}
            </div>

            {totalPages > 1 && (
              <div style={styles.pagination}>
                <button
                  onClick={() => setPage(p => p - 1)}
                  disabled={page === 1}
                  style={page === 1 ? { ...styles.pageBtn, opacity: 0.4 } : styles.pageBtn}
                >
                  ← Prev
                </button>
                <span style={styles.pageInfo}>Page {page} of {totalPages}</span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page === totalPages}
                  style={page === totalPages ? { ...styles.pageBtn, opacity: 0.4 } : styles.pageBtn}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: 'var(--bg)'
  },
  hero: {
    background: 'linear-gradient(135deg, #FDF6F0 0%, #F5EDE3 100%)',
    padding: '3rem 2rem',
    textAlign: 'center',
    borderBottom: '1px solid var(--border)'
  },
  heroTitle: {
    fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
    fontWeight: '800',
    color: 'var(--text-primary)',
    lineHeight: '1.2',
    marginBottom: '0.75rem'
  },
  highlight: {
    color: 'var(--primary)'
  },
  heroSubtitle: {
    color: 'var(--text-secondary)',
    fontSize: '1rem',
    marginBottom: '1.5rem'
  },
  searchBar: {
    width: '100%',
    maxWidth: '500px',
    padding: '0.875rem 1.25rem',
    borderRadius: '50px',
    border: '1.5px solid var(--border)',
    background: 'var(--white)',
    fontSize: '1rem',
    color: 'var(--text-primary)',
    boxShadow: '0 4px 16px rgba(193, 127, 90, 0.1)'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  },
  filters: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
    marginBottom: '2rem'
  },
  chip: {
    padding: '0.5rem 1.2rem',
    borderRadius: '50px',
    border: '1.5px solid var(--border)',
    background: 'var(--white)',
    color: 'var(--text-secondary)',
    fontWeight: '500',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  chipActive: {
    background: 'var(--primary)',
    border: '1.5px solid var(--primary)',
    color: 'var(--white)'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem'
  },
  loading: {
    textAlign: 'center',
    padding: '4rem',
    color: 'var(--text-secondary)'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid var(--border)',
    borderTop: '3px solid var(--primary)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    margin: '0 auto 1rem'
  },
  empty: {
    textAlign: 'center',
    padding: '4rem',
    color: 'var(--text-secondary)'
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '2rem'
  },
  pageBtn: {
    padding: '0.6rem 1.2rem',
    borderRadius: '8px',
    border: '1.5px solid var(--border)',
    background: 'var(--white)',
    color: 'var(--text-primary)',
    fontWeight: '500',
    cursor: 'pointer'
  },
  pageInfo: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem'
  }
};

export default Home;