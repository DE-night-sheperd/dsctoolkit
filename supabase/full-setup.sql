-- Full Supabase Setup Script
-- Run this in your Supabase SQL Editor

-- 1. Create documents table
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

-- 2. Enable RLS on documents table
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS policies for documents table
DROP POLICY IF EXISTS "Allow public read access" ON documents;
DROP POLICY IF EXISTS "Allow public insert access" ON documents;
DROP POLICY IF EXISTS "Allow public update access" ON documents;
DROP POLICY IF EXISTS "Allow public delete access" ON documents;

CREATE POLICY "Allow public read access" ON documents FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON documents FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON documents FOR DELETE USING (true);

-- 4. Create documents storage bucket (if not exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('documents', 'documents', true, 52428800, '{
  "application/pdf",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml"
}')
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 5. Create storage policies
DROP POLICY IF EXISTS "Public can read" ON storage.objects;
DROP POLICY IF EXISTS "Public can insert" ON storage.objects;
DROP POLICY IF EXISTS "Public can update" ON storage.objects;
DROP POLICY IF EXISTS "Public can delete" ON storage.objects;

CREATE POLICY "Public can read" ON storage.objects FOR SELECT USING (bucket_id = 'documents');
CREATE POLICY "Public can insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents');
CREATE POLICY "Public can update" ON storage.objects FOR UPDATE USING (bucket_id = 'documents');
CREATE POLICY "Public can delete" ON storage.objects FOR DELETE USING (bucket_id = 'documents');

-- 6. Insert sample data (optional)
INSERT INTO documents (title, description, category, type, size, status)
VALUES 
  ('Hackathon Pitch Deck', 'Professional pitch deck template for hackathon presentations', 'Templates', 'PPTX', '5.2 MB', 'approved'),
  ('Project Proposal Guide', 'Step-by-step guide to writing a winning project proposal', 'Guides', 'PDF', '1.8 MB', 'approved'),
  ('React Best Practices', 'Comprehensive guide to React development best practices', 'Resources', 'PDF', '2.1 MB', 'approved')
ON CONFLICT DO NOTHING;
