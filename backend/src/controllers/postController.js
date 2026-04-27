import { supabase } from '../config/supabase.js';

// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Parse categories if they're stored as JSON strings
    const parsedPosts = (data || []).map(post => ({
      ...post,
      categories: typeof post.categories === 'string' ? JSON.parse(post.categories || '[]') : (Array.isArray(post.categories) ? post.categories : []),
      tags: typeof post.tags === 'string' ? JSON.parse(post.tags || '[]') : (Array.isArray(post.tags) ? post.tags : [])
    }));

    res.status(200).json({ success: true, posts: parsedPosts || [] });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
};

// Get post by slug
export const getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ message: 'Post not found' });

    // Parse categories and tags if they're stored as JSON strings
    const parsedPost = {
      ...data,
      categories: typeof data.categories === 'string' ? JSON.parse(data.categories || '[]') : (Array.isArray(data.categories) ? data.categories : []),
      tags: typeof data.tags === 'string' ? JSON.parse(data.tags || '[]') : (Array.isArray(data.tags) ? data.tags : [])
    };

    // Increment view count
    await supabase
      .from('posts')
      .update({ view_count: (data.view_count || 0) + 1 })
      .eq('id', data.id);

    res.status(200).json({ success: true, post: parsedPost });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'Error fetching post', error: error.message });
  }
};

// Create post
export const createPost = async (req, res) => {
  try {
    const { title, content, excerpt, featured_image, categories, tags } = req.body;

    // Generate slug
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          title,
          slug,
          content,
          excerpt: excerpt || content.substring(0, 150),
          featured_image,
          author_name: 'Thulomanche',
          categories: categories || [],
          tags: tags || []
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, post: data });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
};

// Update post
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, featured_image, categories, tags } = req.body;

    const { data, error } = await supabase
      .from('posts')
      .update({
        title,
        content,
        excerpt,
        featured_image,
        categories,
        tags,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({ success: true, post: data });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Error updating post', error: error.message });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
};

// Get posts by category
export const getPostsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .contains('categories', [category])
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Parse categories and tags if they're stored as JSON strings
    const parsedPosts = (data || []).map(post => ({
      ...post,
      categories: typeof post.categories === 'string' ? JSON.parse(post.categories || '[]') : (Array.isArray(post.categories) ? post.categories : []),
      tags: typeof post.tags === 'string' ? JSON.parse(post.tags || '[]') : (Array.isArray(post.tags) ? post.tags : [])
    }));

    res.status(200).json({ success: true, posts: parsedPosts || [] });
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
};
