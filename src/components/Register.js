// src/components/Register.js
import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';  // Use navigate to redirect

function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();  // Added for redirection

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (password.length < 6) {
      setError('Password should be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        return db.collection('users').doc(user.uid).set({
          firstName,
          lastName,
          email
        });
      })
      .then(() => {
        setSuccess(true);
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');

        // After successful registration, redirect to login page
        navigate("/login");
      })
      .catch((error) => {
        setError(error.message);
        console.error("Registration failed:", error);
      });
  };

  return (
    <div>
      <h2>Create a DEV@Deakin Account</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
          required
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          required
        />
        <button type="submit">Create</button>
      </form>

      {/* Error message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Success message */}
      {success && <p style={{ color: 'green' }}>Account created successfully! You can now log in.</p>}

      {/* Link to go back to the login page */}
      <p>
        Already have an account? 
        <Link to="/login"> Back to Login</Link>
      </p>
    </div>
  );
}

export default Register;
