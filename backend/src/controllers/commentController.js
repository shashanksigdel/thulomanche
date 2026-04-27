import { supabase } from '../config/supabase.js';

// Get comments for a post
export const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({ success: true, comments: data || [] });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Error fetching comments', error: error.message });
  }
};

// Create comment
export const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, authorName } = req.body;

    if (!authorName || !content) {
      return res.status(400).json({ message: 'Author name and content are required' });
    }

    const { data, error } = await supabase
      .from('comments')
      .insert([
        {
          post_id: postId,
          author_name: authorName,
          content
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, comment: data });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Error creating comment', error: error.message });
  }
};

// Delete comment
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) throw error;

    res.status(200).json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Error deleting comment', error: error.message });
  }
};

