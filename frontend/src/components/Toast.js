import { useState, useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{
      ...styles.toast,
      background: type === 'success' ? '#F0FFF4' : '#FFF5F5',
      border: `1px solid ${type === 'success' ? '#C6F6D5' : '#FED7D7'}`,
      color: type === 'success' ? '#38A169' : '#E53E3E'
    }}>
      <span>{type === 'success' ? '✅' : '❌'} {message}</span>
      <button onClick={onClose} style={styles.close}>✕</button>
    </div>
  );
};

const styles = {
  toast: {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    padding: '0.875rem 1.25rem',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    fontSize: '0.9rem',
    fontWeight: '500',
    zIndex: 1000,
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
    animation: 'slideIn 0.3s ease'
  },
  close: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.8rem',
    opacity: 0.7
  }
};

export default Toast;