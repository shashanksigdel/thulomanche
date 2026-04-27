import React, { useEffect, useState } from 'react';
import '../styles/profile-header.css';
import { statsService, settingsService } from '../services/api';

export const ProfileHeader = ({ selectedCategory, onCategoryChange }) => {
  const joinDate = 'Joined April 2026';
  const [stats, setStats] = useState({ totalPosts: 0, totalViews: 0, totalCategories: 0, categories: [] });
  const [settings, setSettings] = useState({ siteName: 'Thulomanche', siteTagline: 'A space for ideas, stories, and perspectives on life, technology, and creativity.' });

  useEffect(() => {
    const loadStats = async () => {
      const data = await statsService.getStats();
      if (data) setStats({
        totalPosts: data.totalPosts || 0,
        totalViews: data.totalViews || 0,
        totalCategories: data.totalCategories || 0,
        categories: Array.isArray(data.categories) ? data.categories : []
      });
    };
    loadStats();
  }, []);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await settingsService.getSettings();
        if (data) {
          setSettings({
            siteName: data.siteName || 'Thulomanche',
            siteTagline: data.siteTagline || 'A space for ideas, stories, and perspectives on life, technology, and creativity.'
          });
        }
      } catch (err) {
        console.error('Error loading settings:', err);
      }
    };
    loadSettings();
  }, []);

  const categories = ['All', ...stats.categories];

  return (
    <div className="profile-header">
      {/* Banner */}
      <div className="profile-banner" style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&h=400&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }} />

      {/* Profile Info */}
      <div className="profile-container">
        <div className="profile-info-section">
          {/* Avatar */}
          <div className="profile-avatar-wrapper">
            <img src="/logo.jpg" alt="Thulomanche" className="profile-avatar" />
          </div>

          {/* Profile Details */}
          <div className="profile-details">
            <div className="profile-header-top">
              <div>
                <h1 className="profile-name">{settings.siteName}</h1>
                <p className="profile-bio">
                  {settings.siteTagline}
                </p>
              </div>
               <div className="social-links">
                 <a href="https://www.tiktok.com/@thulomanche" target="_blank" rel="noopener noreferrer" title="TikTok"><i className="fab fa-tiktok"></i></a>
                 <a href="https://www.x.com/thulomanche" target="_blank" rel="noopener noreferrer" title="X"><svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g></svg></a>
                 <a href="https://www.instagram.com/thulomanche" target="_blank" rel="noopener noreferrer" title="Instagram"><i className="fab fa-instagram"></i></a>
                 <a href="https://www.facebook.com/thulomanchey" target="_blank" rel="noopener noreferrer" title="Facebook"><i className="fab fa-facebook-f"></i></a>
                 <a href="https://www.youtube.com/@thulomanche" target="_blank" rel="noopener noreferrer" title="YouTube"><i className="fab fa-youtube"></i></a>
                 <a href="http://buymemomo.com/thulomanche" target="_blank" rel="noopener noreferrer" title="Website"><i className="fas fa-globe"></i></a>
               </div>
            </div>

            {/* Stats */}
            <div className="profile-stats">
                <div className="stat">
                  <span className="stat-value">{stats.totalPosts}</span>
                  <span className="stat-label">Posts</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{(stats.totalViews || 0).toLocaleString()}</span>
                  <span className="stat-label">Views</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{stats.totalCategories}</span>
                  <span className="stat-label">Categories</span>
                </div>
              <div className="stat-text">{joinDate}</div>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="category-tabs">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
