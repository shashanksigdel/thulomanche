import React, { useState, useEffect } from 'react';
import { FileText, Plus, Edit2, Trash2 } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { postsService } from '../../services/api';

// Predefined categories
const PREDEFINED_CATEGORIES = [
  'Technology',
  'Politics',
  'Finance',
  'Others'
];

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    featured_image: '',
    categories: [],
    tags: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, postId: null, postTitle: '' });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await postsService.getAllPosts();
      setPosts(data || []);
    } catch (err) {
      setError('Error loading posts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const postData = {
        ...formData,
        categories: formData.categories,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
      };

      if (editingPost) {
        await postsService.updatePost(editingPost.id, postData);
        setSuccess('Post updated successfully!');
      } else {
        await postsService.createPost(postData);
        setSuccess('Post created successfully!');
      }

      resetForm();
      loadPosts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving post');
    }
  };

  const handleDelete = async (id) => {
    const post = posts.find(p => p.id === id);
    setDeleteConfirm({
      show: true,
      postId: id,
      postTitle: post?.title || 'this post'
    });
  };

  const confirmDelete = async () => {
    try {
      await postsService.deletePost(deleteConfirm.postId);
      setSuccess('Post deleted successfully!');
      loadPosts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error deleting post');
    } finally {
      setDeleteConfirm({ show: false, postId: null, postTitle: '' });
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, postId: null, postTitle: '' });
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || '',
      featured_image: post.featured_image || '',
      categories: post.categories || [],
      tags: (post.tags || []).join(', ')
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      featured_image: '',
      categories: [],
      tags: ''
    });
    setEditingPost(null);
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'categories') {
      // Handle multi-select
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      setFormData(prev => ({
        ...prev,
        categories: selectedOptions
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="admin-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}><FileText size={32} strokeWidth={1.5} /> Posts</h2>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Manage your blog posts and articles</p>
        </div>
        <button className="btn-primary" onClick={() => !showForm ? setShowForm(true) : resetForm()} style={{ height: 'fit-content', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {showForm ? (<><span>×</span> Close</>) : (<><Plus size={18} /> New Post</>)}
        </button>
      </div>

      {error && <div className="alert alert-error">✗ {error}</div>}
      {success && <div className="alert alert-success">✓ {success}</div>}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '32px',
            maxWidth: '400px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '18px' }}>Delete Post?</h3>
            <p style={{ margin: '0 0 24px 0', color: '#666', fontSize: '14px' }}>
              Are you sure you want to delete "<strong>{deleteConfirm.postTitle}</strong>"? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={cancelDelete}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Delete Post
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="settings-group" style={{ marginBottom: '32px', padding: '24px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 20px 0' }}>{editingPost ? 'Edit Post' : 'Create New Post'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Post title"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Content</label>
              <ReactQuill
                value={formData.content}
                onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                modules={{
                  toolbar: [
                    [{ 'font': [] }],
                    [{ 'size': ['small', false, 'large', 'huge'] }],
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'code-block'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'script': 'sub' }, { 'script': 'super' }],
                    [{ 'indent': '-1' }, { 'indent': '+1' }],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'align': [] }],
                    ['link', 'image'],
                    ['clean']
                  ]
                }}
                formats={[
                  'font', 'size', 'header', 'bold', 'italic', 'underline', 'strike',
                  'blockquote', 'code-block', 'list', 'script',
                  'indent', 'color', 'background', 'align',
                  'link', 'image'
                ]}
                theme="snow"
                style={{ minHeight: '300px', backgroundColor: 'white' }}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Excerpt</label>
                <input
                  type="text"
                  name="excerpt"
                  className="form-input"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  placeholder="Short summary"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Featured Image URL</label>
                <input
                  type="url"
                  name="featured_image"
                  className="form-input"
                  value={formData.featured_image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Categories</label>
                <div className="categories-checkboxes">
                  {PREDEFINED_CATEGORIES.map(cat => (
                    <label key={cat} className="checkbox-item">
                      <input
                        type="checkbox"
                        name="categories"
                        value={cat}
                        checked={formData.categories.includes(cat)}
                        onChange={(e) => {
                          const { value, checked } = e.target;
                          setFormData(prev => ({
                            ...prev,
                            categories: checked
                              ? [...prev.categories, value]
                              : prev.categories.filter(c => c !== value)
                          }));
                        }}
                      />
                      <span className="checkbox-label">{cat}</span>
                    </label>
                  ))}
                </div>
                <small style={{ color: '#666', marginTop: '8px', display: 'block' }}>
                  Select up to 4 categories ({formData.categories.length} selected)
                </small>
              </div>
              <div className="form-group">
                <label className="form-label">Tags (comma-separated)</label>
                <input
                  type="text"
                  name="tags"
                  className="form-input"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="javascript, react, web"
                />
                <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>Separate multiple tags with commas</small>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                {editingPost ? '✓ Update Post' : '✓ Create Post'}
              </button>
              <button type="button" className="btn-secondary" onClick={resetForm} style={{ flex: 1 }}>
                ✕ Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="settings-group">
        <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FileText size={20} strokeWidth={2} style={{ color: '#06b6d4' }} /> All Posts ({posts.length})
        </h3>
        {posts.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>No posts yet. Create your first post!</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Views</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id}>
                  <td className="title-cell">{post.title}</td>
                  <td><span className="badge badge-published">Published</span></td>
                  <td>{post.view_count || 0}</td>
                  <td>{new Date(post.created_at).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    <button 
                      className="btn-small btn-edit"
                      onClick={() => handleEdit(post)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn-small btn-delete"
                      onClick={() => handleDelete(post.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
