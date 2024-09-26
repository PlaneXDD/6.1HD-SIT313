import React from 'react';

function NotificationBanner({ message, isVisible }) {
  return (
    isVisible ? (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: '10px',
        backgroundColor: '#4CAF50',
        color: 'white',
        textAlign: 'center',
        zIndex: 1000,
      }}>
        {message}
      </div>
    ) : null
  );
}

export default NotificationBanner;
