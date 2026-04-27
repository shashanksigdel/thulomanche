import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postsService, commentsService } from '../services/api';
import '../styles/post-detail.css';

export const PostDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        const fetchedPost = await postsService.getPostBySlug(slug);
        
        if (fetchedPost) {
          const transformedPost = {
            _id: fetchedPost.id,
            title: fetchedPost.title,
            slug: fetchedPost.slug,
            excerpt: fetchedPost.excerpt,
            content: fetchedPost.content,
            author: { name: fetchedPost.author_name || 'Thulomanche', avatar: 'T', bio: 'Creator and writer at Thulomanche' },
            categories: fetchedPost.categories || [],
            tags: fetchedPost.tags || [],
            createdAt: new Date(fetchedPost.created_at),
            viewCount: fetchedPost.view_count || 0
          };
          setPost(transformedPost);
          
          // Load all posts to find related ones
          const allPosts = await postsService.getAllPosts();
          if (allPosts && allPosts.length > 0) {
            const related = findRelatedPosts(transformedPost, allPosts);
            setRelatedPosts(related);
          }
          
          // Load comments for this post
          const fetchedComments = await commentsService.getCommentsByPost(fetchedPost.id);
          if (fetchedComments && fetchedComments.length > 0) {
            setComments(fetchedComments);
          }
        } else {
          setPost(null);
          setComments([]);
          setRelatedPosts([]);
        }
      } catch (error) {
        console.error('Failed to load post:', error);
        setPost(null);
        setComments([]);
        setRelatedPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  const findRelatedPosts = (currentPost, allPosts) => {
    // Filter out current post and find posts with shared categories or tags
    const related = allPosts.filter(p => p.id !== currentPost._id)
      .map(p => {
        const transformedPost = {
          _id: p.id,
          title: p.title,
          slug: p.slug,
          excerpt: p.excerpt || p.content?.substring(0, 150),
          featured_image: p.featured_image,
          categories: p.categories || [],
          tags: p.tags || [],
          createdAt: new Date(p.created_at),
          viewCount: p.view_count || 0
        };
        
        // Calculate relevance score
        let score = 0;
        const postCategories = Array.isArray(transformedPost.categories) ? transformedPost.categories : [];
        const postTags = Array.isArray(transformedPost.tags) ? transformedPost.tags : [];
        
        // Add score for shared categories (higher weight)
        postCategories.forEach(cat => {
          if (currentPost.categories.includes(cat)) score += 3;
        });
        
        // Add score for shared tags
        postTags.forEach(tag => {
          if (currentPost.tags.includes(tag)) score += 1;
        });
        
        return { ...transformedPost, score };
      })
      .filter(p => p.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3); // Show top 3 related posts
    
    return related;
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!commentText.trim() || !authorName.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setSubmittingComment(true);
    
    // Simulate a slight delay
    setTimeout(() => {
      const newComment = {
        _id: 'c' + Date.now(),
        authorName: authorName,
        content: commentText,
        createdAt: new Date()
      };
      
      setComments([newComment, ...comments]);
      setCommentText('');
      setAuthorName('');
      setSubmittingComment(false);
    }, 300);
  };

  return (
    <div className="post-content">
      <div className="post-back-button">
        <button onClick={() => navigate('/')} className="back-btn">
          ← Back to all posts
        </button>
      </div>
      {post && (
      <article>
        <div className="post-header">
          <h1 className="post-header-title">{post.title}</h1>
          {post.categories && post.categories.length > 0 && (
            <div className="post-detail-categories">
              {post.categories.map((category) => (
                <span key={category} className="detail-category-badge">{category}</span>
              ))}
            </div>
          )}
          <div className="post-header-meta">
            <div className="post-author-info">
              <img src="/logo.jpg" alt={post.author.name} className="post-avatar" style={{ width: 40, height: 40 }} />
              <div className="post-author-details">
                <div className="post-author-name">{post.author.name}</div>
                <div className="post-date">
                  {post.createdAt.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
            <div className="post-date">{post.viewCount} views</div>
          </div>
        </div>

        <div
          className="post-body"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
      )}

      {/* Comments section disabled 
      <section className="comments-section">
        <h2 className="comments-title">Comments ({comments.length})</h2>

        <form onSubmit={handleCommentSubmit} className="comment-form">
          <div className="form-group">
            <label className="form-label">Your Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter your name"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              required
            />
          </div>
          <textarea
            className="comment-textarea"
            placeholder="Share your thoughts..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            required
          />
          <button
            type="submit"
            className="button button-primary"
            disabled={submittingComment}
          >
            {submittingComment ? 'Posting...' : 'Post Comment'}
          </button>
        </form>

        <div className="comments-list">
          {comments.length === 0 ? (
            <p>No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="comment-item">
                <div className="comment-author">{comment.authorName}</div>
                <div className="comment-date">
                  {comment.createdAt.toLocaleDateString()}
                </div>
                <div className="comment-text">{comment.content}</div>
              </div>
            ))
          )}
        </div>
      </section>
      */}

      {/* Related Posts Section */}
      {relatedPosts.length > 0 && (
        <section className="related-posts-section">
          <h2 className="related-posts-title">Related Posts</h2>
          <div className="related-posts-grid">
            {relatedPosts.map((relPost) => (
              <Link
                key={relPost._id}
                to={`/post/${relPost.slug}`}
                className="related-post-card"
              >
                <div className="related-post-content">
                  <h3 className="related-post-title">{relPost.title}</h3>
                  <p className="related-post-excerpt">
                    {relPost.excerpt || 'No excerpt available'}
                  </p>
                  <div className="related-post-meta">
                    <span className="related-post-date">
                      {relPost.createdAt.toLocaleDateString()}
                    </span>
                    <span className="related-post-views">
                      {relPost.viewCount} views
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
