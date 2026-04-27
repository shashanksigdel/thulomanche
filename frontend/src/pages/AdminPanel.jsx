import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Globe, LogOut, LayoutDashboard, FileText, Users, Image, Settings, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import '../styles/admin-panel.css';
import AdminDashboard from '../components/admin/Dashboard';
import AdminPosts from '../components/admin/Posts';
import AdminMedia from '../components/admin/Media';
import AdminSettings from '../components/admin/Settings';

export const AdminPanel = () => {
  const navigate = useNavigate();
  const { user, logout, loading } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Check if user is admin
  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      navigate('/login');
    }
  }, [user, navigate, loading]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'posts':
        return <AdminPosts />;
      case 'media':
        return <AdminMedia />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="admin-container">
      {/* Top Bar */}
      <div className="admin-topbar">
        <div className="admin-topbar-left">
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="admin-title">Thulomanche</h1>
        </div>
        <div className="admin-topbar-right">
          <a 
            href="/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="view-site-btn"
            title="View published site"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Globe size={18} /> View Site
          </a>
          <button className="logout-btn" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      <div className="admin-main">
        {/* Sidebar */}
        <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <nav className="admin-nav">
            <button
              className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
              style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              <LayoutDashboard size={18} /> Dashboard
            </button>
            <button
              className={`nav-item ${activeTab === 'posts' ? 'active' : ''}`}
              onClick={() => setActiveTab('posts')}
              style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              <FileText size={18} /> Posts
            </button>
            <button
              className={`nav-item ${activeTab === 'media' ? 'active' : ''}`}
              onClick={() => setActiveTab('media')}
              style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              <Image size={18} /> Media
            </button>
            <button
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
              style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              <Settings size={18} /> Settings
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="admin-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};
