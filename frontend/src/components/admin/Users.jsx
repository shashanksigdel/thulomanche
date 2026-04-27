import React, { useState } from 'react';
import { Users, Plus, Edit2, Trash2 } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([
    { id: 1, name: 'Admin', email: 'admin@thulomanche.com', role: 'admin', joinDate: '2026-01-01' }
  ]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingUser) {
      // Update existing user
      setUsers(users.map(u => 
        u.id === editingUser.id 
          ? { ...u, ...formData }
          : u
      ));
    } else {
      // Add new user
      const newUser = {
        id: Date.now(),
        ...formData,
        joinDate: new Date().toISOString().split('T')[0]
      };
      setUsers([...users, newUser]);
    }
    
    resetForm();
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', role: 'user' });
    setEditingUser(null);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (confirm('Delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="admin-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}><Users size={32} strokeWidth={1.5} /> Users</h2>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Manage website users and their roles</p>
        </div>
        <button className="btn-primary" onClick={() => !showForm ? setShowForm(true) : resetForm()} style={{ height: 'fit-content', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {showForm ? (<><span>×</span> Close</>) : (<><Plus size={18} /> Add User</>)}
        </button>
      </div>

      {showForm && (
        <div className="settings-group" style={{ marginBottom: '32px', padding: '24px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 20px 0' }}>{editingUser ? 'Edit User' : 'Add New User'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Full name"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email@example.com"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select name="role" value={formData.role} onChange={handleInputChange} className="form-input" style={{ cursor: 'pointer' }}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>Select the user's role and permissions</small>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                {editingUser ? '✓ Update User' : '✓ Add User'}
              </button>
              <button type="button" className="btn-secondary" onClick={resetForm} style={{ flex: 1 }}>✕ Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="settings-group">
        <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Users size={20} strokeWidth={2} style={{ color: '#06b6d4' }} /> All Users ({users.length})
        </h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td><span className={`badge badge-${user.role}`}>{user.role}</span></td>
                <td>{user.joinDate}</td>
                <td className="actions-cell">
                  <button 
                    className="btn-small btn-edit"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-small btn-delete"
                    onClick={() => handleDelete(user.id)}
                    disabled={user.role === 'admin'}
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
