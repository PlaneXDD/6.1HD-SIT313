import React, { useState } from 'react';
import { db, storage } from '../firebase';  // Ensure Firebase services are correctly configured
import { Link } from 'react-router-dom';  // Import Link for navigation

function Post() {
  const [postType, setPostType] = useState('question');  // Manage post type (question or article)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');  // For questions
  const [abstract, setAbstract] = useState('');  // For articles
  const [articleText, setArticleText] = useState('');  // For articles
  const [tags, setTags] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePostTypeChange = (e) => {
    setPostType(e.target.value);
  };

  const handleImageUpload = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handlePost = (e) => {
    e.preventDefault();
    if (!title || !tags) {
      setError('Title and tags are required');
      return;
    }

    if (image) {
      const uploadTask = storage.ref(`images/${image.name}`).put(image);
      uploadTask.on(
        "state_changed",
        snapshot => {},
        error => {
          setError(error.message);
        },
        () => {
          storage.ref("images")
            .child(image.name)
            .getDownloadURL()
            .then(url => {
              savePost(url);  // Save post with image URL
            });
        }
      );
    } else {
      savePost();  // Save post without image
    }
  };

  const savePost = (imageUrl = '') => {
    const postData = {
      postType,
      title,
      tags: tags.split(',').map(tag => tag.trim()),  // Split and trim tags
      imageUrl,  // Save the image URL (or leave empty)
      timestamp: new Date(),
    };

    // Add question-specific fields
    if (postType === 'question') {
      postData.description = description;
    }

    // Add article-specific fields
    if (postType === 'article') {
      postData.abstract = abstract;
      postData.articleText = articleText;
    }

    db.collection('posts').add(postData)
      .then(() => {
        setSuccess('Post created successfully!');
        setTitle('');
        setDescription('');
        setAbstract('');
        setArticleText('');
        setTags('');
        setImage(null);
      })
      .catch(error => {
        setError(error.message);
      });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: '0 auto', border: '1px solid #ccc' }}>
      <h2>Create a New Post</h2>

      {/* Back Button to Navigate to the Find Question Page */}
      <div style={{ marginBottom: '20px' }}>
        <Link to="/find-questions">
          <button style={{ padding: '10px 20px', background: '#4CAF50', color: 'white', border: 'none' }}>
            Back to Find Questions
          </button>
        </Link>
      </div>

      {/* Post Type Selection */}
      <div style={{ marginBottom: '10px' }}>
        <label>Select Post Type: </label>
        <input
          type="radio"
          value="question"
          checked={postType === 'question'}
          onChange={handlePostTypeChange}
        /> Question
        <input
          type="radio"
          value="article"
          checked={postType === 'article'}
          onChange={handlePostTypeChange}
          style={{ marginLeft: '10px' }}
        /> Article
      </div>

      {/* Conditional Rendering for Question and Article Fields */}
      {postType === 'question' && (
        <div style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '20px' }}>
          <p><strong>What do you want to ask or share?</strong></p>

          <div style={{ marginBottom: '10px' }}>
            <label>Title</label>
            <input
              type="text"
              placeholder="Enter a descriptive title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: '10px', marginTop: '5px' }}
              required
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Description</label>
            <textarea
              placeholder="Describe your problem"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', height: '150px', padding: '10px', marginTop: '5px' }}
              required
            />
          </div>
        </div>
      )}

      {postType === 'article' && (
        <div style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '20px' }}>
          <p><strong>What do you want to ask or share?</strong></p>

          <div style={{ marginBottom: '10px' }}>
            <label>Title</label>
            <input
              type="text"
              placeholder="Enter a descriptive title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: '10px', marginTop: '5px' }}
              required
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Add an image:</label>
            <input type="file" onChange={handleImageUpload} />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Abstract</label>
            <textarea
              placeholder="Enter a 1-paragraph abstract"
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              style={{ width: '100%', height: '100px', padding: '10px', marginTop: '5px' }}
              required
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Article Text</label>
            <textarea
              placeholder="Enter the article text"
              value={articleText}
              onChange={(e) => setArticleText(e.target.value)}
              style={{ width: '100%', height: '150px', padding: '10px', marginTop: '5px' }}
              required
            />
          </div>
        </div>
      )}

      {/* Tags Input */}
      <div style={{ marginBottom: '10px' }}>
        <label>Tags</label>
        <input
          type="text"
          placeholder="Please add up to 3 tags to describe what your post is about e.g., Java"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          style={{ width: '100%', padding: '10px', marginTop: '5px' }}
          required
        />
      </div>

      {/* Submit Button */}
      <button onClick={handlePost} style={{ padding: '10px 20px', background: '#4CAF50', color: 'white', border: 'none' }}>Post</button>

      {/* Error and Success Messages */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}

export default Post;
