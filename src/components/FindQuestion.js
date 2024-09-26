import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';  // Ensure Firebase is properly configured
import { Link, useNavigate } from 'react-router-dom';  // Import useNavigate for redirection after logout
import NotificationBanner from './NotificationBanner';  // Import the notification component

function FindQuestion() {
  const [questions, setQuestions] = useState([]);
  const [tutorials, setTutorials] = useState([]);
  const [filter, setFilter] = useState('');
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({});  // Store ratings for each tutorial
  const [newPostMessage, setNewPostMessage] = useState('');  // To store the notification message
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);  // Control notification visibility

  const navigate = useNavigate();  // Hook for navigating after logout

  // Logout function
  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        navigate('/login');  // Redirect to login page after successful logout
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  // Fetch questions from Firestore in real-time
  useEffect(() => {
    const unsubscribe = db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      const questionData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQuestions(questionData);
      setFilteredQuestions(questionData);

      // Show notification when a new post is detected
      if (snapshot.docChanges().some(change => change.type === 'added')) {
        setNewPostMessage('A new question has been posted!');
        setIsNotificationVisible(true);

        setTimeout(() => {
          setIsNotificationVisible(false);
        }, 5000);  // Hide notification after 5 seconds
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch tutorials from Firestore in real-time
  useEffect(() => {
    const unsubscribe = db.collection('tutorials').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      const tutorialData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTutorials(tutorialData);

      // Show notification when a new tutorial is detected
      if (snapshot.docChanges().some(change => change.type === 'added')) {
        setNewPostMessage('A new tutorial has been uploaded!');
        setIsNotificationVisible(true);

        setTimeout(() => {
          setIsNotificationVisible(false);
        }, 5000);  // Hide notification after 5 seconds
      }
    });

    return () => unsubscribe();
  }, []);

  // Filter questions based on user input
  useEffect(() => {
    if (filter) {
      const filtered = questions.filter(
        (question) =>
          question.title.toLowerCase().includes(filter.toLowerCase()) ||
          question.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase()))
      );
      setFilteredQuestions(filtered);
    } else {
      setFilteredQuestions(questions);
    }
  }, [filter, questions]);

  const handleDelete = (id) => {
    db.collection('posts').doc(id).delete()
      .then(() => {
        setQuestions(prevQuestions => prevQuestions.filter(question => question.id !== id));
      })
      .catch(error => {
        console.error("Error deleting question:", error);
      });
  };

  const handleRatingChange = (id, rating) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [id]: rating
    }));
    // Update Firestore with the new rating
    db.collection('tutorials').doc(id).update({ rating });
  };

  if (loading) {
    return <p>Loading questions...</p>;
  }

  return (
    <div style={{ padding: '20px', position: 'relative' }}>
      <h2>Find a Question</h2>

      {/* Notification Banner */}
      <NotificationBanner message={newPostMessage} isVisible={isNotificationVisible} />

      {/* Logout button at top right corner */}
      <button 
        onClick={handleLogout} 
        style={{ position: 'absolute', top: '10px', right: '10px', padding: '10px 20px', background: '#ff4d4f', color: 'white', border: 'none', cursor: 'pointer' }}
      >
        Logout
      </button>

      <input
        type="text"
        placeholder="Filter by title or tag"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ padding: '10px', width: '300px', marginBottom: '20px' }}
      />

      {/* Add a button to navigate to the Post page */}
      <div style={{ marginBottom: '20px' }}>
        <Link to="/post">
          <button style={{ padding: '10px 20px', background: '#4CAF50', color: 'white', border: 'none' }}>
            Create New Post
          </button>
        </Link>
      </div>

      {/* Add a button to navigate to the Tutorial Upload Page */}
      <div style={{ marginBottom: '20px' }}>
        <Link to="/tutorial-upload">
          <button style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
            Upload Tutorial
          </button>
        </Link>
      </div>

      {/* Display the list of questions */}
      {filteredQuestions.length > 0 ? (
        filteredQuestions.map((question) => (
          <div key={question.id} className="question-card" style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
            <h3>{question.title}</h3>
            <p>{question.description || question.abstract}</p>
            <p><strong>Tags:</strong> {question.tags.join(', ')}</p>
            <p><small>{new Date(question.timestamp?.toDate()).toLocaleDateString()}</small></p>

            {/* Display Image if Available */}
            {question.imageUrl && (
              <div style={{ marginBottom: '10px' }}>
                <img src={question.imageUrl} alt="Uploaded" style={{ maxWidth: '100%', height: 'auto' }} />
              </div>
            )}

            <button onClick={() => handleDelete(question.id)} style={{ background: '#ff4d4f', color: 'white', padding: '5px 10px', border: 'none' }}>
              Delete
            </button>
          </div>
        ))
      ) : (
        <p>No questions found</p>
      )}

      {/* Section to display tutorials */}
      <h2 style={{ marginTop: '40px' }}>Tutorial Video List</h2>
      {tutorials.length > 0 ? (
        tutorials.map((tutorial) => (
          <div key={tutorial.id} className="tutorial-card" style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
            <h3>{tutorial.title}</h3>
            <p>{tutorial.description}</p>
            <video width="400" controls>
              <source src={tutorial.videoUrl} type="video/mp4" />
            </video>
            <p><strong>Rating:</strong> {tutorial.rating || 'No rating yet'}</p>
            <div>
              <label htmlFor={`rating-${tutorial.id}`}>Rate this tutorial: </label>
              <input
                id={`rating-${tutorial.id}`}
                type="number"
                value={ratings[tutorial.id] || tutorial.rating || 0}
                min="1"
                max="5"
                onChange={(e) => handleRatingChange(tutorial.id, e.target.value)}
                style={{ width: '50px', marginLeft: '10px' }}
              />
            </div>
          </div>
        ))
      ) : (
        <p>No tutorials uploaded yet</p>
      )}
    </div>
  );
}

export default FindQuestion;
