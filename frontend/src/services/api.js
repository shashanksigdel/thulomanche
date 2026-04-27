import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add JWT token interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Posts Service
export const postsService = {
  getAllPosts: async () => {
    try {
      const response = await apiClient.get('/posts');
      return response.data.posts || [];
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  },

  getPostBySlug: async (slug) => {
    try {
      const response = await apiClient.get(`/posts/${slug}`);
      return response.data.post;
    } catch (error) {
      console.error('Error fetching post:', error);
      return null;
    }
  },

  createPost: (data) =>
    apiClient.post('/posts', data),

  updatePost: (id, data) =>
    apiClient.put(`/posts/${id}`, data),

  deletePost: (id) =>
    apiClient.delete(`/posts/${id}`)
};

// Stats Service
export const statsService = {
  getStats: async () => {
    try {
      const response = await apiClient.get('/stats');
      return response.data || { totalPosts: 0, totalViews: 0, totalCategories: 0 };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return { totalPosts: 0, totalViews: 0, totalCategories: 0 };
    }
  }
};

// Comments Service
export const commentsService = {
  getCommentsByPost: async (postId) => {
    try {
      const response = await apiClient.get(`/posts/${postId}/comments`);
      return response.data.comments || [];
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  },

  createComment: (postId, data) =>
    apiClient.post(`/posts/${postId}/comments`, data),

  deleteComment: (commentId) =>
    apiClient.delete(`/comments/${commentId}`)
};

// Settings Service
export const settingsService = {
  getSettings: async () => {
    try {
      console.log('Fetching settings from /api/settings');
      const response = await apiClient.get('/settings');
      console.log('Settings response:', response.data);
      console.log('Settings response type:', typeof response.data);
      console.log('Settings response keys:', Object.keys(response.data));

      // Backend returns {success: true, settings: {...}}
      if (response.data && response.data.settings && typeof response.data.settings === 'object') {
        console.log('Extracted settings:', response.data.settings);
        return response.data.settings;
      }

      console.log('No settings found in expected format');
      return {};
    } catch (error) {
      console.error('Error fetching settings:', error);
      return {};
    }
  },

  updateSettings: async (data) => {
    try {
      console.log('Sending settings to /api/settings:', data);
      const response = await apiClient.put('/settings', data);
      console.log('Backend response:', response.data);

      // Extract settings from response
      if (response.data && response.data.settings) {
        return response.data.settings;
      }
      return response.data;
    } catch (error) {
      console.error('Settings update failed:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw error;
    }
  }
};

export default apiClient;
