import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postsService } from '../services/api';
import '../styles/posts.css';

export const PostsList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const fetchedPosts = await postsService.getAllPosts();
        
        // Transform Supabase posts to match frontend format
        if (fetchedPosts && fetchedPosts.length > 0) {
          const transformedPosts = fetchedPosts.map(post => ({
            _id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt || post.content.substring(0, 150),
            featured_image: post.featured_image,
            content: post.content,
            author: { name: post.author_name || 'Thulomanche', avatar: 'T' },
            categories: post.categories || [],
            tags: post.tags || [],
            createdAt: new Date(post.created_at),
            viewCount: post.view_count || 0
          }));
          setPosts(transformedPosts);
        } else {
          setPosts([]);
        }
      } catch (error) {
        console.error('Failed to load posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);
  
  // Filter posts by category
  const filteredPosts = posts;

  return (
    <div className="container">
      <div className="posts-list">
        {filteredPosts.map((post) => (
          <Link
            key={post._id}
            to={`/post/${post.slug}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <article className="post-card">
              <div className="post-card-content">
                <div className="post-card-text">
                  <h2 className="post-title">{post.title}</h2>
                  {post.categories && post.categories.length > 0 && (
                    <div className="post-categories">
                      {post.categories.map((category) => (
                        <span key={category} className="category-badge">{category}</span>
                      ))}
                    </div>
                  )}
                  <p className="post-excerpt">
                    {post.excerpt || post.content.slice(0, 150) + '...'}
                  </p>
                  <div className="post-meta">
                <div className="post-author">
                  <img src="/logo.jpg" alt="author" className="post-avatar" />
                  <span>{post.author.name}</span>
                </div>
                <span>{post.createdAt.toLocaleDateString()}</span>
                <span>{post.viewCount} views</span>
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className="post-tags">
                  {post.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              )}
                </div>
                {post.featuredImage && (
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="post-thumbnail"
                    loading="lazy"
                  />
                )}
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
};
