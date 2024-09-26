import React from 'react';
import { Link } from 'react-router-dom';

function MainPage() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to DEV@Deakin</h1>
      <p>Your platform for questions and collaboration</p>
      
      {/* Login Button */}
      <Link to="/login">
        <button style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
          Login
        </button>
      </Link>
    </div>
  );
}

export default MainPage;
