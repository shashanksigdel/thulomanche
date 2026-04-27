import { supabase } from '../config/supabase.js';

// Get aggregate stats: total posts, total views, total categories
export const getStats = async (req, res) => {
  try {
    // Count posts (exact)
    const { count: totalPosts, error: postsCountError } = await supabase
      .from('posts')
      .select('id', { head: true, count: 'exact' });

    if (postsCountError) throw postsCountError;

    // Sum view_count across posts and get categories
    const { data: postsData, error: postsDataError } = await supabase
      .from('posts')
      .select('view_count, categories');

    if (postsDataError) throw postsDataError;

    const totalViews = (postsData || []).reduce((sum, p) => sum + (p.view_count || 0), 0);

    // Build category list from actual posts, not seeded defaults
    const categories = [...new Set(
      (postsData || []).flatMap((p) => Array.isArray(p.categories) ? p.categories : [])
    )].sort((a, b) => a.localeCompare(b));

    const totalCategories = categories.length;

    res.status(200).json({
      success: true,
      totalPosts: totalPosts || 0,
      totalViews: totalViews || 0,
      totalCategories: totalCategories || 0,
      categories
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, message: 'Error fetching stats', error: error.message });
  }
};
