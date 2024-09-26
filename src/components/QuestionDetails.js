// src/components/QuestionDetails.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { useParams } from 'react-router-dom';

function QuestionDetails() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    db.collection('questions').doc(id).get()
      .then((doc) => {
        if (doc.exists) {
          setQuestion(doc.data());
        }
      });
  }, [id]);

  if (!question) return <p>Loading...</p>;

  return (
    <div>
      <h2>{question.title}</h2>
      <p>{question.description}</p>
      <p>{question.tag}</p>
      <p>{new Date(question.timestamp?.toDate()).toDateString()}</p>
    </div>
  );
}

export default QuestionDetails;
