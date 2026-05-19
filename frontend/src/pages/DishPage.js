import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

const DishPage = () => {
  const { id, dishId } = useParams();
  const { user } = useAuth();
  const [dish, setDish] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchDish();
    fetchReviews();
  }, [dishId]);

  const fetchDish = async () => {
    try {
      const { data } = await axios.get(`/restaurants/${id}/dishes/${dishId}`);
      setDish(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`/restaurants/${id}/dishes/${dishId}/reviews`);
      setReviews(data.reviews);
      setAvgRating(data.avgRating);
      setTotalReviews(data.totalReviews);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!rating) return setError('Please select a star rating');
    if (!comment) return setError('Please write a comment');
    setError('');
    setSubmitting(true);
    try {
      await axios.post(`/restaurants/${id}/dishes/${dishId}/reviews`, { rating, comment });
      setSuccess('Review posted! 🎉');
      setToast({ message: 'Review posted successfully!', type: 'success' });
      setRating(0);
      setComment('');
      fetchReviews();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (count, interactive = false) => {
    return [1, 2, 3, 4, 5].map(star => (
      <span
        key={star}
        onClick={() => interactive && setRating(star)}
        style={{
          fontSize: interactive ? '2rem' : '1rem',
          cursor: interactive ? 'pointer' : 'default',
          color: star <= count ? '#F6A623' : '#E8D5C4',
          transition: 'color 0.15s'
        }}
      >
        ★
      </span>
    ));
  };

  const timeAgo = (date) => {
    const diff = Math.floor((new Date() - new Date(date)) / 60000);
    if (diff < 1) return 'just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  if (loading) return (
    <div>
      <Navbar />
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
        <p>Loading dish...</p>
      </div>
    </div>
  );

  return (
    <div style={styles.page}>
      <Navbar />

      {dish && (
        <>
          <div style={styles.hero}>
            {dish.image ? (
              <img src={dish.image} alt={dish.name} style={styles.heroImage} />
            ) : (
              <div style={styles.heroPlaceholder}>🍴</div>
            )}
            <div style={styles.heroOverlay}>
              <div style={styles.heroContent}>
                <h1 style={styles.dishName}>{dish.name}</h1>
                {dish.flavor && <p style={styles.dishFlavor}>✨ {dish.flavor}</p>}
                <div style={styles.dishMeta}>
                  {dish.weight && <span style={styles.metaBadge}>⚖️ {dish.weight}</span>}
                  {dish.price > 0 && <span style={styles.metaBadge}>₹{dish.price}</span>}
                </div>
              </div>
            </div>
          </div>

          <div style={styles.container}>
            <div style={styles.layout}>

              <div style={styles.leftCol}>
                <div style={styles.card}>
                  <h3 style={styles.cardTitle}>About this dish</h3>
                  {dish.description && <p style={styles.description}>{dish.description}</p>}
                  {dish.ingredients && (
                    <div style={styles.ingredientsBox}>
                      <p style={styles.ingredientsLabel}>🌿 Ingredients</p>
                      <p style={styles.ingredientsText}>{dish.ingredients}</p>
                    </div>
                  )}
                </div>

                <div style={styles.card}>
                  <div style={styles.ratingHeader}>
                    <div>
                      <div style={styles.ratingBig}>{avgRating}</div>
                      <div style={styles.stars}>{renderStars(Math.round(avgRating))}</div>
                      <div style={styles.totalReviews}>{totalReviews} reviews</div>
                    </div>
                  </div>
                </div>

                {user ? (
                  <div style={styles.card}>
                    <h3 style={styles.cardTitle}>Write a Review</h3>

                    {error && <div style={styles.error}>{error}</div>}
                    {success && <div style={styles.successMsg}>{success}</div>}

                    <div style={styles.starsInput}>
                      <p style={styles.starLabel}>Your rating:</p>
                      <div>{renderStars(rating, true)}</div>
                    </div>

                    <textarea
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      placeholder="Share your experience with this dish..."
                      style={styles.textarea}
                      rows={4}
                    />

                    <button
                      onClick={handleSubmitReview}
                      disabled={submitting}
                      style={submitting ? { ...styles.submitBtn, opacity: 0.7 } : styles.submitBtn}
                    >
                      {submitting ? 'Posting...' : 'Post Review'}
                    </button>
                  </div>
                ) : (
                  <div style={styles.card}>
                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
                      <a href="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Sign in</a> to write a review
                    </p>
                  </div>
                )}
              </div>

              <div style={styles.rightCol}>
                <h3 style={styles.reviewsTitle}>Reviews ({totalReviews})</h3>
                {reviews.length === 0 ? (
                  <div style={styles.empty}>
                    <p style={{ fontSize: '2rem' }}>💬</p>
                    <p>No reviews yet — be the first!</p>
                  </div>
                ) : (
                  <div style={styles.reviewsList}>
                    {reviews.map(review => (
                      <div key={review._id} style={styles.reviewCard}>
                        <div style={styles.reviewHeader}>
                          <div style={styles.avatar}>
                            {review.user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p style={styles.reviewerName}>{review.user.name}</p>
                            <p style={styles.reviewTime}>{timeAgo(review.createdAt)}</p>
                          </div>
                          <div style={styles.reviewStars}>
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <p style={styles.reviewComment}>{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </>
      )}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: 'var(--bg)' },
  loading: { textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' },
  spinner: {
    width: '40px', height: '40px',
    border: '3px solid var(--border)',
    borderTop: '3px solid var(--primary)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    margin: '0 auto 1rem'
  },
  hero: { position: 'relative', height: '280px', overflow: 'hidden' },
  heroImage: { width: '100%', height: '100%', objectFit: 'cover' },
  heroPlaceholder: {
    width: '100%', height: '100%',
    background: 'var(--surface)',
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '5rem'
  },
  heroOverlay: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(to top, rgba(44,24,16,0.85) 0%, transparent 50%)',
    display: 'flex', alignItems: 'flex-end'
  },
  heroContent: { padding: '2rem', color: 'var(--white)' },
  dishName: { fontSize: '2rem', fontWeight: '800', marginBottom: '0.25rem' },
  dishFlavor: { fontSize: '0.9rem', opacity: 0.85, marginBottom: '0.5rem' },
  dishMeta: { display: 'flex', gap: '0.75rem' },
  metaBadge: {
    background: 'rgba(255,255,255,0.15)',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    backdropFilter: 'blur(4px)'
  },
  container: { maxWidth: '1100px', margin: '0 auto', padding: '2rem' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' },
  leftCol: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  rightCol: {},
  card: {
    background: 'var(--white)',
    borderRadius: '16px',
    padding: '1.5rem',
    border: '1px solid var(--border)'
  },
  cardTitle: { fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' },
  description: { color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1rem' },
  ingredientsBox: {
    background: 'var(--surface)',
    borderRadius: '10px',
    padding: '0.75rem 1rem'
  },
  ingredientsLabel: { fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' },
  ingredientsText: { fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' },
  ratingHeader: { display: 'flex', alignItems: 'center' },
  ratingBig: { fontSize: '3rem', fontWeight: '800', color: 'var(--primary)', lineHeight: 1 },
  stars: { fontSize: '1.2rem', margin: '0.25rem 0' },
  totalReviews: { fontSize: '0.85rem', color: 'var(--text-secondary)' },
  starsInput: { marginBottom: '1rem' },
  starLabel: { fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' },
  textarea: {
    width: '100%', padding: '0.75rem 1rem',
    borderRadius: '10px', border: '1.5px solid var(--border)',
    background: 'var(--surface)', fontSize: '0.9rem',
    color: 'var(--text-primary)', resize: 'vertical',
    fontFamily: 'Segoe UI, sans-serif', marginBottom: '1rem'
  },
  submitBtn: {
    width: '100%', background: 'var(--primary)',
    color: 'var(--white)', padding: '0.875rem',
    borderRadius: '10px', fontSize: '1rem',
    fontWeight: '600', cursor: 'pointer', border: 'none'
  },
  error: {
    background: '#FFF5F5', color: '#E53E3E',
    padding: '0.75rem 1rem', borderRadius: '10px',
    marginBottom: '1rem', fontSize: '0.875rem',
    border: '1px solid #FED7D7'
  },
  successMsg: {
    background: '#F0FFF4', color: '#38A169',
    padding: '0.75rem 1rem', borderRadius: '10px',
    marginBottom: '1rem', fontSize: '0.875rem',
    border: '1px solid #C6F6D5'
  },
  reviewsTitle: { fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' },
  empty: { textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' },
  reviewsList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  reviewCard: {
    background: 'var(--white)', borderRadius: '14px',
    padding: '1.25rem', border: '1px solid var(--border)'
  },
  reviewHeader: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' },
  avatar: {
    width: '38px', height: '38px', borderRadius: '50%',
    background: 'var(--primary)', color: 'var(--white)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '1rem', flexShrink: 0
  },
  reviewerName: { fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-primary)' },
  reviewTime: { fontSize: '0.78rem', color: 'var(--text-secondary)' },
  reviewStars: { marginLeft: 'auto' },
  reviewComment: { fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }
};

export default DishPage;