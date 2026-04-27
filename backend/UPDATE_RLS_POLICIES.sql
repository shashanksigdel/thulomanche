-- Update RLS policies to allow public write access

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read on posts" ON posts;
DROP POLICY IF EXISTS "Allow public write on posts" ON posts;
DROP POLICY IF EXISTS "Allow public update on posts" ON posts;
DROP POLICY IF EXISTS "Allow public delete on posts" ON posts;
DROP POLICY IF EXISTS "Allow public read on comments" ON comments;
DROP POLICY IF EXISTS "Allow public write on comments" ON comments;
DROP POLICY IF EXISTS "Allow public delete on comments" ON comments;
DROP POLICY IF EXISTS "Allow public read on categories" ON categories;

-- Create policies for public read and write access
CREATE POLICY "Allow public read on posts" ON posts
  FOR SELECT USING (true);

CREATE POLICY "Allow public write on posts" ON posts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on posts" ON posts
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public delete on posts" ON posts
  FOR DELETE USING (true);

CREATE POLICY "Allow public read on comments" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Allow public write on comments" ON comments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public delete on comments" ON comments
  FOR DELETE USING (true);

CREATE POLICY "Allow public read on categories" ON categories
  FOR SELECT USING (true);
