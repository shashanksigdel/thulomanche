import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postsService } from '../services/api';
import '../styles/posts.css';

export const PostsList = ({ selectedCategory = 'All' }) => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;
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
  const filteredPosts = selectedCategory === 'All' 
    ? posts 
    : posts.filter(post => post.categories.includes(selectedCategory));
  
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container">
      <div className="posts-list">
        {currentPosts.map((post) => (
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

      <div className="pagination">
        <button
          className="pagination-btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ← Previous
        </button>

        <div className="pagination-numbers">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`pagination-number ${currentPage === page ? 'active' : ''}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          className="pagination-btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next →
        </button>
      </div>

      {currentPage === totalPages && (
        <div className="caught-up-message">
          <div className="caught-up-icon">✓</div>
          <h3>You're all caught up</h3>
          <p>Check back soon for new stories</p>
        </div>
      )}
    </div>
  );
};
