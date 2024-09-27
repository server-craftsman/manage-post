import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { IPost } from '../../../models/Posts';
import { v4 as uuidv4 } from 'uuid';
import Compressor from 'compressorjs'; // Import Compressor.js

const CreatePost: React.FC = () => {
  const { createPost, user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postImage, setPostImage] = useState<File | null>(null);
  const [status, setStatus] = useState('published'); // Add state for status
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to create a post');
      return;
    }

    const newPost: IPost = {
      id: uuidv4(), // This will be set by the backend
      title,
      description: '',
      userId: user.id || '',
      status, // Use the selected status
      postImage: '',
      createDate: new Date(),
      updateDate: new Date(),
    };

    try {
      let compressedImage;
      if (postImage) {
        compressedImage = await new Promise<File>((resolve, reject) => {
          new Compressor(postImage, {
            quality: 0.6,
            success: (file: File) => resolve(file),
            error: reject,
          });
        });
      }

      await createPost(newPost, compressedImage || undefined);
      setTitle('');
      setContent('');
      setPostImage(null);
      setStatus('published'); // Reset status to default
      setError(null);
    } catch (err) {
      if (err instanceof Error && err.message.includes('Payload Too Large')) {
        setError('Post image is too large. Please upload a smaller image.');
      } else {
        setError('Failed to create post');
      }
    }
  };

  return (
    <div>
      <h2>Create Post</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Post Image</label>
          <input
            type="file"
            onChange={(e) => setPostImage(e.target.files ? e.target.files[0] : null)}
          />
        </div>
        <div>
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
