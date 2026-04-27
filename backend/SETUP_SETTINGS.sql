-- Drop and recreate settings table with correct snake_case columns
DROP TABLE IF EXISTS settings CASCADE;

CREATE TABLE settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  site_name VARCHAR(255) DEFAULT 'Thulomanche',
  site_tagline TEXT DEFAULT 'big talks only.',
  site_url VARCHAR(255) DEFAULT 'http://localhost:3000',
  admin_email VARCHAR(255) DEFAULT 'sashanksigdel@gmail.com',
  posts_per_page INTEGER DEFAULT 3,
  enable_comments BOOLEAN DEFAULT true,
  enable_search BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT only_one_row CHECK (id = 1)
);

-- Enable RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON settings
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON settings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON settings
  FOR UPDATE USING (true) WITH CHECK (true);

-- Insert default settings
INSERT INTO settings (id, site_name, site_tagline, site_url, admin_email, posts_per_page, enable_comments, enable_search)
VALUES (1, 'Thulomanche', 'big talks only.', 'http://localhost:3000', 'sashanksigdel@gmail.com', 3, true, true);
