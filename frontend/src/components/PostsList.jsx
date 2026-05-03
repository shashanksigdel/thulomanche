import React from 'react';
import '../styles/posts.css';

const staticPosts = [
  {
    _id: '1',
    title: 'Welcome to Thulomanche',
    slug: 'welcome-to-thulomanche',
    excerpt: 'Introducing my personal blog and portfolio site. A space for sharing thoughts, projects, and useful tools.',
    content: 'Full content here...',
    author: { name: 'Thulomanche', avatar: 'T' },
    categories: ['Personal', 'Blog'],
    tags: ['introduction', 'portfolio'],
    createdAt: new Date('2024-01-01'),
    viewCount: 150
  }
];

export const PostsList = () => {
  
  return (
    <div className="container">
      <div className="posts-list">
        {staticPosts.map((post) => (
          <article key={post._id} className="post-card">
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
                  {post.excerpt}
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
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
