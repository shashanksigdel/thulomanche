import React from 'react';
import { useSearchParams } from 'react-router-dom';
import '../styles/profile-header.css';

export const ProfileHeader = ({ onToolSelect, activeTab }) => {
  const [searchParams, setSearchParams] = useSearchParams();

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
                <h1 className="profile-name">Thulomanche</h1>
                <p className="profile-bio">
                  Minimal blog + tools. No backend needed for this UI — tools run fully in the browser.
                </p>
              </div>
               <div className="social-links">
                 <a href="https://www.tiktok.com/@thulomanche" target="_blank" rel="noopener noreferrer" title="TikTok"><i className="fab fa-tiktok"></i></a>
                 <a href="https://www.x.com/thulomanche" target="_blank" rel="noopener noreferrer" title="X"><svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g></svg></a>
                 <a href="https://www.instagram.com/thulomanche" target="_blank" rel="noopener noreferrer" title="Instagram"><i className="fab fa-instagram"></i></a>
                 <a href="https://www.facebook.com/thulomanchey" target="_blank" rel="noopener noreferrer" title="Facebook"><i className="fab fa-facebook-f"></i></a>
                 <a href="http://buymemomo.com/thulomanche" target="_blank" rel="noopener noreferrer" title="Website"><i className="fas fa-globe"></i></a>
               </div>
            </div>

            {/* Stats removed */}
          </div>
        </div>

        {/* Tools Navigation */}
        <div className="category-tabs">
          <button onClick={() => { setSearchParams({}); onToolSelect(null); }} className={`category-tab ${activeTab === null ? 'active' : ''}`}>Home</button>
          <button onClick={() => { setSearchParams({ tab: 'unicode-to-preeti' }); onToolSelect('unicode-to-preeti'); }} className={`category-tab ${activeTab === 'unicode-to-preeti' ? 'active' : ''}`}>Unicode to Preeti</button>
        </div>
      </div>
    </div>
  );
};
