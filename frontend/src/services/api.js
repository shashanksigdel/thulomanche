import { supabase } from './supabase.js';

// Posts Service
export const postsService = {
  getAllPosts: async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  },

  getPostBySlug: async (slug) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error fetching post:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching post:', error);
      return null;
    }
  },

  createPost: async (data) => {
    const { data: result, error } = await supabase
      .from('posts')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  updatePost: async (id, data) => {
    const { data: result, error } = await supabase
      .from('posts')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  deletePost: async (id) => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Stats Service
export const statsService = {
  getStats: async () => {
    try {
      // Get total posts count
      const { count: totalPosts, error: postsError } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true });

      if (postsError) {
        console.error('Error fetching posts count:', postsError);
      }

      // Get total views (sum of view_count)
      const { data: postsData, error: viewsError } = await supabase
        .from('posts')
        .select('view_count');

      let totalViews = 0;
      if (!viewsError && postsData) {
        totalViews = postsData.reduce((sum, post) => sum + (post.view_count || 0), 0);
      }

      // Get unique categories count
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('posts')
        .select('categories');

      let totalCategories = 0;
      if (!categoriesError && categoriesData) {
        const uniqueCategories = new Set();
        categoriesData.forEach(post => {
          if (post.categories && Array.isArray(post.categories)) {
            post.categories.forEach(cat => uniqueCategories.add(cat));
          }
        });
        totalCategories = uniqueCategories.size;
      }

      return {
        totalPosts: totalPosts || 0,
        totalViews: totalViews || 0,
        totalCategories: totalCategories || 0
      };
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
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching comments:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  },

  createComment: async (postId, data) => {
    const { data: result, error } = await supabase
      .from('comments')
      .insert([{
        ...data,
        post_id: postId
      }])
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  deleteComment: async (commentId) => {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) throw error;
  }
};

// Settings Service
export const settingsService = {
  getSettings: async () => {
    try {
      console.log('Fetching settings from Supabase');
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .single();

      if (error) {
        console.log('Settings not found, using defaults:', error);
        return {
          siteName: 'Thulomanche',
          siteTagline: 'A space for ideas, stories, and perspectives on life, technology, and creativity.'
        };
      }

      console.log('Settings found:', data);
      return data || {};
    } catch (error) {
      console.error('Error fetching settings:', error);
      return {
        siteName: 'Thulomanche',
        siteTagline: 'A space for ideas, stories, and perspectives on life, technology, and creativity.'
      };
    }
  },

  updateSettings: async (data) => {
    try {
      console.log('Updating settings in Supabase:', data);

      // First check if settings exist
      const { data: existingSettings, error: selectError } = await supabase
        .from('settings')
        .select('*')
        .single();

      let result;
      if (selectError && selectError.code === 'PGRST116') {
        // Settings don't exist, insert new
        const { data: insertResult, error: insertError } = await supabase
          .from('settings')
          .insert([data])
          .select()
          .single();

        if (insertError) throw insertError;
        result = insertResult;
      } else {
        // Settings exist, update
        const { data: updateResult, error: updateError } = await supabase
          .from('settings')
          .update(data)
          .eq('id', existingSettings.id)
          .select()
          .single();

        if (updateError) throw updateError;
        result = updateResult;
      }

      console.log('Settings updated successfully:', result);
      return result;
    } catch (error) {
      console.error('Settings update failed:', error);
      throw error;
    }
  }
};
