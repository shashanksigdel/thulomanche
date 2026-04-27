import React, { useState, useEffect } from 'react';
import { BarChart3, Eye, Users, Tag, FileText } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { postsService, statsService } from '../../services/api';

// Chart colors
const chartColors = ['#06b6d4', '#0891b2', '#22d3ee', '#10b981', '#f59e0b'];

// Mock data for charts (replace with real data when you have it)
const viewsData = [
  { day: 'Mon', views: 240 },
  { day: 'Tue', views: 380 },
  { day: 'Wed', views: 200 },
  { day: 'Thu', views: 490 },
  { day: 'Fri', views: 620 },
  { day: 'Sat', views: 520 },
  { day: 'Sun', views: 780 }
];

const categoryData = [
  { name: 'Technology', value: 35 },
  { name: 'Politics', value: 25 },
  { name: 'Finance', value: 20 },
  { name: 'Others', value: 20 }
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    totalUsers: 0,
    totalCategories: 0
  });
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const posts = await postsService.getAllPosts();
      const stats = await statsService.getStats();
      
      setStats(stats);
      setRecentPosts(posts.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-section">
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}><BarChart3 size={32} strokeWidth={1.5} /> Dashboard</h2>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Overview of your site's performance and recent activity</p>
      </div>
      
      {/* Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <FileText size={36} strokeWidth={1.5} style={{ color: '#06b6d4', marginBottom: '14px' }} />
          <div>
            <p className="stat-value">{stats.totalPosts}</p>
            <p className="stat-label">Total Posts</p>
          </div>
        </div>
        <div className="stat-card">
          <Eye size={36} strokeWidth={1.5} style={{ color: '#06b6d4', marginBottom: '14px' }} />
          <div>
            <p className="stat-value">{stats.totalViews.toLocaleString()}</p>
            <p className="stat-label">Total Views</p>
          </div>
        </div>
        <div className="stat-card">
          <Users size={36} strokeWidth={1.5} style={{ color: '#06b6d4', marginBottom: '14px' }} />
          <div>
            <p className="stat-value">{stats.totalUsers || 1}</p>
            <p className="stat-label">Users</p>
          </div>
        </div>
        <div className="stat-card">
          <Tag size={36} strokeWidth={1.5} style={{ color: '#06b6d4', marginBottom: '14px' }} />
          <div>
            <p className="stat-value">{stats.totalCategories}</p>
            <p className="stat-label">Categories</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '28px', marginTop: '36px' }}>
        {/* Views Trend Chart */}
        <div className="settings-group" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', fontWeight: '700' }}>
            <Eye size={18} strokeWidth={2} style={{ color: '#06b6d4' }} /> Views Trend
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={viewsData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(6, 182, 212, 0.1)" />
              <XAxis dataKey="day" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(255, 255, 255, 0.9)', 
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="views" 
                stroke="#06b6d4" 
                strokeWidth={3}
                dot={{ fill: '#06b6d4', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution Chart */}
        <div className="settings-group" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', fontWeight: '700' }}>
            <Tag size={18} strokeWidth={2} style={{ color: '#06b6d4' }} /> Category Distribution
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(255, 255, 255, 0.9)', 
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '16px' }}>
            {categoryData.map((cat, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: chartColors[idx % chartColors.length] }} />
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Posts Table */}
      <div className="settings-group" style={{ marginTop: '36px' }}>
        <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FileText size={20} strokeWidth={2} style={{ color: '#06b6d4' }} /> Recent Posts
        </h3>
        {recentPosts.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>No posts yet</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Views</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentPosts.map(post => (
                <tr key={post.id}>
                  <td>{post.title}</td>
                  <td>{post.view_count || 0}</td>
                  <td>{new Date(post.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
