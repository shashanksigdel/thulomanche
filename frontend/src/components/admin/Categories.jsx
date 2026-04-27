import React, { useState } from 'react';
import { Tag, Plus, Edit2, Trash2 } from 'lucide-react';

// Fixed categories - only 4 allowed
const PREDEFINED_CATEGORIES = [
  { id: 1, name: 'Technology', slug: 'technology', count: 0 },
  { id: 2, name: 'Politics', slug: 'politics', count: 0 },
  { id: 3, name: 'Finance', slug: 'finance', count: 0 },
  { id: 4, name: 'Others', slug: 'others', count: 0 }
];

export default function AdminCategories() {
  const [categories, setCategories] = useState(PREDEFINED_CATEGORIES);

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/\s+/g, '-');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCategory = {
      id: Date.now(),
      name: formData.name,
      slug: formData.slug || generateSlug(formData.name),
      count: 0
    };
    setCategories([...categories, newCategory]);
    setFormData({ name: '', slug: '' });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (confirm('Delete this category?')) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  return (
    <div className="admin-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}><Tag size={32} strokeWidth={1.5} /> Categories</h2>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Organize posts with categories</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)} style={{ height: 'fit-content', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {showForm ? (<><span>×</span> Close</>) : (<><Plus size={18} /> Add Category</>)}
        </button>
      </div>

      {showForm && (
        <div className="settings-group" style={{ marginBottom: '32px', padding: '24px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 20px 0' }}>Add New Category</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Category name"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Slug</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.slug || generateSlug(formData.name)}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="auto-generated"
                />
                <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>URL-friendly slug (auto-generated from name)</small>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button type="submit" className="btn-primary" style={{ flex: 1 }}>✓ Add Category</button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)} style={{ flex: 1 }}>✕ Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="settings-group">
        <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Tag size={20} strokeWidth={2} style={{ color: '#06b6d4' }} /> All Categories ({categories.length})
        </h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Posts</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id}>
                <td>{cat.name}</td>
                <td><code>{cat.slug}</code></td>
                <td>{cat.count}</td>
                <td className="actions-cell">
                  <button className="btn-small btn-edit">Edit</button>
                  <button 
                    className="btn-small btn-delete"
                    onClick={() => handleDelete(cat.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
