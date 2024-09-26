import React, { useState } from 'react';
import { auth } from '../firebase';
import { Navigate } from 'react-router-dom';  // Import Navigate for redirection

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // State to handle redirection

  // Function to handle email login
  const handleEmailLogin = async () => {
    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (user.emailVerified) {
        // Set the login state to true if email is verified
        setIsLoggedIn(true);
      } else {
        // Send email verification if not yet verified
        await user.sendEmailVerification();
        setSuccess('Verification email sent! Please check your inbox.');
      }
    } catch (err) {
      setError("Failed to log in with email. Please try again.");
    }
  };

  // Function to handle email sign-up
  const handleEmailSignUp = async () => {
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      await user.sendEmailVerification();
      setSuccess('Account created successfully! Verification email sent. Please check your inbox.');
    } catch (err) {
      setError("Failed to create an account. Please try again.");
    }
  };

  // Redirect to Find Question Page if logged in
  if (isLoggedIn) {
    return <Navigate to="/find-questions" />;
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>{isSigningUp ? 'Sign Up' : 'Login'}</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: '10px', marginBottom: '10px', width: '300px' }}
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: '10px', marginBottom: '10px', width: '300px' }}
      />
      <br />

      {isSigningUp ? (
        <button onClick={handleEmailSignUp} style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}>
          Sign Up
        </button>
      ) : (
        <button onClick={handleEmailLogin} style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}>
          Login
        </button>
      )}

      <p onClick={() => setIsSigningUp(!isSigningUp)}>
        {isSigningUp ? 'Already have an account? Login here' : 'Don’t have an account? Sign Up here'}
      </p>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}

export default Login;
