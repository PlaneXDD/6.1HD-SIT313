import React, { useState, useEffect } from 'react';
import { storage, db } from '../firebase';  // Import Firebase Storage and Firestore
import { Link } from 'react-router-dom';  // For navigation back to Find Question page

function TutorialUpload() {
  const [tutorials, setTutorials] = useState([]);
  const [newTutorial, setNewTutorial] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [rating, setRating] = useState(0);  // Rating for the tutorial

  // Fetch tutorials from Firestore
  useEffect(() => {
    db.collection('tutorials').onSnapshot(snapshot => {
      setTutorials(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })));
    });
  }, []);

  // Handle tutorial video upload
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setNewTutorial(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (newTutorial && title && description) {
      setUploading(true);

      const storageRef = storage.ref(`tutorials/${newTutorial.name}`);
      storageRef.put(newTutorial).then(() => {
        storageRef.getDownloadURL().then((url) => {
          db.collection('tutorials').add({
            title: title,
            description: description,
            videoUrl: url,
            viewCount: 0,
            rating: 0,  // Initial rating is set to 0
            timestamp: new Date(),  // Store upload timestamp
          });
          setUploading(false);
          setTitle('');
          setDescription('');
          setNewTutorial(null);
        });
      });
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Upload a Tutorial</h2>

      <input
        type="text"
        placeholder="Tutorial title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ padding: '10px', marginBottom: '10px', width: '300px' }}
      />
      <br />
      <textarea
        placeholder="Tutorial description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ padding: '10px', marginBottom: '10px', width: '300px', height: '100px' }}
      />
      <br />
      <input type="file" onChange={handleFileChange} />
      <br />
      <button onClick={handleUpload} style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      {/* Button to return to Find Question Page */}
      <div style={{ marginTop: '20px' }}>
        <Link to="/find-questions">
          <button style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
            Return to Find Question Page
          </button>
        </Link>
      </div>

      <h3>Available Tutorials</h3>
      {tutorials.map((tutorial) => (
        <div key={tutorial.id} style={{ marginBottom: '20px' }}>
          <h4>{tutorial.title}</h4>
          <p>{tutorial.description}</p>
          <video width="400" controls>
            <source src={tutorial.videoUrl} type="video/mp4" />
          </video>
          <p>Views: {tutorial.viewCount}</p>
          <p>Rating: {tutorial.rating || 'No rating yet'}</p>

          {/* Add rating input for each tutorial */}
          <div>
            <label htmlFor={`rating-${tutorial.id}`}>Rate this tutorial: </label>
            <input
              id={`rating-${tutorial.id}`}
              type="number"
              value={rating}
              min="1"
              max="5"
              onChange={(e) => setRating(e.target.value)}
              style={{ width: '50px', marginLeft: '10px' }}
            />
            <button
              onClick={() => {
                db.collection('tutorials').doc(tutorial.id).update({ rating });
              }}
              style={{ padding: '5px 10px', marginLeft: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}
            >
              Submit Rating
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TutorialUpload;
