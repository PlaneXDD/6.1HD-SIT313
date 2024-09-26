import React, { useState, useEffect } from 'react';
import { storage, db } from '../firebase';  // Import Firebase Storage and Firestore

function TutorialUpload() {
  const [tutorials, setTutorials] = useState([]);
  const [newTutorial, setNewTutorial] = useState(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);

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
    if (newTutorial && title) {
      setUploading(true);

      const storageRef = storage.ref(`tutorials/${newTutorial.name}`);
      storageRef.put(newTutorial).then(() => {
        storageRef.getDownloadURL().then((url) => {
          db.collection('tutorials').add({
            title: title,
            videoUrl: url,
            viewCount: 0,
          });
          setUploading(false);
          setTitle('');
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
      <input type="file" onChange={handleFileChange} />
      <br />
      <button onClick={handleUpload} style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      <h3>Available Tutorials</h3>
      {tutorials.map((tutorial) => (
        <div key={tutorial.id} style={{ marginBottom: '20px' }}>
          <h4>{tutorial.title}</h4>
          <video width="400" controls>
            <source src={tutorial.videoUrl} type="video/mp4" />
          </video>
          <p>Views: {tutorial.viewCount}</p>
        </div>
      ))}
    </div>
  );
}

export default TutorialUpload;
