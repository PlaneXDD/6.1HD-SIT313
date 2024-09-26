import React, { useState, useEffect } from 'react';
import { db } from '../firebase';  // Firebase Firestore instance

function Messaging() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Fetch messages from Firestore in real-time
  useEffect(() => {
    const unsubscribe = db.collection('messages')
      .orderBy('timestamp', 'asc')  // Order messages by timestamp
      .onSnapshot((snapshot) => {
        setMessages(snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })));
      });

    return () => unsubscribe();  // Clean up listener on component unmount
  }, []);

  // Function to send a new message
  const sendMessage = () => {
    if (newMessage.trim()) {
      db.collection('messages').add({
        text: newMessage,
        timestamp: new Date(),
      });
      setNewMessage('');  // Clear the input field
    }
  };

  return (
    <div style={{ marginTop: '50px', textAlign: 'center' }}>
      <h2>Real-Time Messaging</h2>

      {/* Display Messages */}
      <div style={{ marginBottom: '20px', maxHeight: '300px', overflowY: 'auto', border: '1px solid #ddd', padding: '10px' }}>
        {messages.map((message) => (
          <p key={message.id}><strong>{message.text}</strong></p>
        ))}
      </div>

      {/* Input to Send New Messages */}
      <input
        type="text"
        placeholder="Type your message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        style={{ padding: '10px', width: '300px', marginBottom: '10px' }}
      />
      <br />
      <button onClick={sendMessage} style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
        Send Message
      </button>
    </div>
  );
}

export default Messaging;
