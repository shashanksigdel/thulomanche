import React, { useState } from 'react';
import { Image, Upload, Eye, Trash2, Plus } from 'lucide-react';

export default function AdminMedia() {
  const [media, setMedia] = useState([
    { id: 1, name: 'sample-image.jpg', url: 'https://via.placeholder.com/300', type: 'image', size: '245 KB', uploadDate: '2026-04-20' }
  ]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const newMedia = {
        id: Date.now(),
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type.split('/')[0],
        size: (file.size / 1024).toFixed(0) + ' KB',
        uploadDate: new Date().toISOString().split('T')[0]
      };
      setMedia([newMedia, ...media]);
    }
  };

  const handleDelete = (id) => {
    if (confirm('Delete this media?')) {
      setMedia(media.filter(m => m.id !== id));
    }
  };

  return (
    <div className="admin-section">
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}><Image size={32} strokeWidth={1.5} /> Media Library</h2>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Manage your images and media files</p>
      </div>

      <div 
        className={`settings-group`}
        style={{
          padding: '48px',
          textAlign: 'center',
          border: `2px dashed ${dragActive ? '#06b6d4' : '#cbd5e1'}`,
          borderRadius: '14px',
          backgroundColor: dragActive ? 'rgba(6, 182, 212, 0.08)' : '#f8fafc',
          transition: 'all 0.2s',
          cursor: 'pointer',
          marginBottom: '32px'
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload size={40} strokeWidth={1.5} style={{ color: '#06b6d4', margin: '0 auto 16px', display: 'block' }} />
        <p style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>Drag and drop images here</p>
        <p style={{ margin: '0 0 16px 0', color: '#64748b', fontSize: '14px' }}>or</p>
        <button className="btn-primary" style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', margin: '0 auto' }}><Plus size={18} /> Choose Files</button>
      </div>

      <div className="settings-group">
        <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Image size={20} strokeWidth={2} style={{ color: '#06b6d4' }} /> Media Files ({media.length})
        </h3>
        {media.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>No media files yet. Upload your first image above!</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Size</th>
                <th>Upload Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {media.map(item => (
                <tr key={item.id}>
                  <td className="media-name">
                    <img src={item.url} alt={item.name} style={{ width: '40px', height: '40px', marginRight: '10px' }} />
                    {item.name}
                  </td>
                  <td>{item.type}</td>
                  <td>{item.size}</td>
                  <td>{item.uploadDate}</td>
                  <td className="actions-cell">
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn-small">View</a>
                    <button 
                      className="btn-small btn-delete"
                      onClick={() => handleDelete(item.id)}
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
