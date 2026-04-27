-- Supabase SQL Setup for Thulomanche Blog
-- Run this in your Supabase SQL Editor

-- Create posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  author_id TEXT,
  author_name TEXT DEFAULT 'Thulomanche',
  categories TEXT[] DEFAULT ARRAY[]::TEXT[],
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX posts_slug_idx ON posts(slug);
CREATE INDEX posts_created_at_idx ON posts(created_at DESC);
CREATE INDEX comments_post_id_idx ON comments(post_id);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies to allow public read access
CREATE POLICY "Allow public read on posts" ON posts
  FOR SELECT USING (true);

CREATE POLICY "Allow public read on comments" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Allow public read on categories" ON categories
  FOR SELECT USING (true);

-- Insert default categories
INSERT INTO categories (name, slug, description) VALUES
  ('Personal', 'personal', 'Personal thoughts and experiences'),
  ('Writing', 'writing', 'Writing tips and tutorials'),
  ('Technology', 'technology', 'Tech articles and insights'),
  ('Productivity', 'productivity', 'Productivity and lifestyle'),
  ('Books', 'books', 'Book reviews and recommendations')
ON CONFLICT (slug) DO NOTHING;
