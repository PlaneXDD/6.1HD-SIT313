import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Import Router, Routes, and Route from react-router-dom
import Login from './components/Login';  // Ensure Login component is correctly imported
import FindQuestion from './components/FindQuestion';  // Import Find Question Page component
import Post from './components/Post';  // Import Post Page component
import Messaging from './components/Messaging';  // Import Messaging component
import TutorialUpload from './components/TutorialUpload';  // Import TutorialUpload component
import PrivateRoute from './components/PrivateRoute';  // Import PrivateRoute for protecting routes

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route for login */}
        <Route path="/login" element={<Login />} />

        {/* Private routes */}
        <Route path="/find-questions" element={<PrivateRoute element={<FindQuestion />} />} />
        <Route path="/post" element={<PrivateRoute element={<Post />} />} />
        <Route path="/messaging" element={<PrivateRoute element={<Messaging />} />} />
        <Route path="/tutorial-upload" element={<PrivateRoute element={<TutorialUpload />} />} />

        {/* Redirect root to login */}
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
