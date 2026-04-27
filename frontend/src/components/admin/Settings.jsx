import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import { settingsService } from '../../services/api';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: 'Thulomanche',
    siteTagline: 'big talks only.',
    siteUrl: 'http://localhost:3000',
    adminEmail: 'sashanksigdel@gmail.com',
    postsPerPage: 3,
    enableComments: true,
    enableSearch: true
  });

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await settingsService.getSettings();
        console.log('Fetched settings:', data);
        if (data && Object.keys(data).length > 0) {
          setSettings(data);
        } else {
          console.log('No settings found, using defaults');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error loading settings:', err);
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaved(false);
    setSaving(true);

    try {
      console.log('Submitting settings:', settings);
      const response = await settingsService.updateSettings(settings);
      console.log('Settings updated response:', response);
      
      // Update the settings state with the returned data
      if (response && typeof response === 'object') {
        setSettings(response);
        console.log('Settings state updated with:', response);
      }
      
      setSaved(true);
      setSaving(false);
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      setSaving(false);
      console.error('Settings update error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Error saving settings';
      console.error('Error message:', errorMsg);
      setError(errorMsg);
      setTimeout(() => setError(''), 4000);
    }
  };

  return (
    <div className="admin-section">
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}><SettingsIcon size={32} strokeWidth={1.5} /> Site Settings</h2>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Manage your website configuration and preferences</p>
      </div>

      {saved && (
        <div className="alert alert-success">
          ✓ Settings saved successfully!
        </div>
      )}
      {error && (
        <div className="alert alert-error">
          ✗ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="settings-form">
        {/* General Settings */}
        <div className="settings-group">
          <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📝</span> General Settings
          </h3>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Site Name</label>
              <input
                type="text"
                name="siteName"
                value={settings.siteName}
                onChange={handleChange}
                className="form-input"
                placeholder="Your site name"
              />
              <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>
                The name of your website
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">Admin Email</label>
              <input
                type="email"
                name="adminEmail"
                value={settings.adminEmail}
                onChange={handleChange}
                className="form-input"
                placeholder="admin@example.com"
              />
              <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>
                Primary admin email address
              </small>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Site Tagline</label>
            <input
              type="text"
              name="siteTagline"
              value={settings.siteTagline}
              onChange={handleChange}
              className="form-input"
              placeholder="Your site description"
            />
            <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>
              A short description of your website
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">Site URL</label>
            <input
              type="url"
              name="siteUrl"
              value={settings.siteUrl}
              onChange={handleChange}
              className="form-input"
              placeholder="http://localhost:3000"
            />
            <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>
              The main URL of your website
            </small>
          </div>
        </div>

        {/* Reading Settings */}
        <div className="settings-group">
          <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📖</span> Reading Settings
          </h3>

          <div className="form-group">
            <label className="form-label">Posts Per Page</label>
            <input
              type="number"
              name="postsPerPage"
              value={settings.postsPerPage}
              onChange={handleChange}
              min="1"
              max="50"
              className="form-input"
            />
            <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>
              Number of posts to display per page (1-50)
            </small>
          </div>
        </div>

        {/* Features */}
        <div className="settings-group">
          <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⚡</span> Features
          </h3>

          {/* Enable Comments option disabled
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                name="enableComments"
                checked={settings.enableComments}
                onChange={handleChange}
              />
              <span style={{ marginLeft: '8px' }}>Enable Comments</span>
            </label>
            <small style={{ color: '#666', marginLeft: '26px', display: 'block', marginTop: '4px' }}>
              Allow visitors to leave comments on posts
            </small>
          </div>
          */}

          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                name="enableSearch"
                checked={settings.enableSearch}
                onChange={handleChange}
              />
              <span style={{ marginLeft: '8px' }}>Enable Search</span>
            </label>
            <small style={{ color: '#666', marginLeft: '26px', display: 'block', marginTop: '4px' }}>
              Enable search functionality on your website
            </small>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn-primary"
            disabled={saving}
            style={{ minWidth: '160px' }}
          >
            {saving ? 'Saving...' : '💾 Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
