-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Templates', 'Guides', 'Resources')),
  type TEXT NOT NULL,
  size TEXT NOT NULL,
  file_path TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for now, adjust as needed)
CREATE POLICY "Allow public read access" ON documents
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON documents
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access" ON documents
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access" ON documents
  FOR DELETE USING (true);

-- Insert initial data (let Supabase generate UUIDs automatically)
INSERT INTO documents (title, description, category, type, size, file_path, status)
VALUES 
  (
    'Hackathon Pitch Deck',
    'Professional pitch deck template for hackathon presentations',
    'Templates',
    'PPTX',
    '5.2 MB',
    '',
    'approved'
  ),
  (
    'Project Proposal Guide',
    'Step-by-step guide to writing a winning project proposal',
    'Guides',
    'PDF',
    '1.8 MB',
    '',
    'approved'
  ),
  (
    'React Best Practices',
    'Comprehensive guide to React development best practices',
    'Resources',
    'PDF',
    '2.1 MB',
    '',
    'approved'
  );
