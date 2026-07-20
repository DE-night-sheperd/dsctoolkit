import { createServerClient } from './supabase';

export interface DocumentData {
  id: string;
  title: string;
  description: string;
  category: 'Templates' | 'Guides' | 'Resources';
  type: string;
  size: string;
  filePath: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export async function readDocuments(): Promise<DocumentData[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error reading documents:', error);
    // Fallback to initial data if table doesn't exist yet
    const initialData: DocumentData[] = [
      {
        id: '1',
        title: 'Hackathon Pitch Deck',
        description: 'Professional pitch deck template for hackathon presentations',
        category: 'Templates',
        type: 'PPTX',
        size: '5.2 MB',
        filePath: '',
        status: 'approved',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Project Proposal Guide',
        description: 'Step-by-step guide to writing a winning project proposal',
        category: 'Guides',
        type: 'PDF',
        size: '1.8 MB',
        filePath: '',
        status: 'approved',
        createdAt: new Date().toISOString(),
      },
      {
        id: '3',
        title: 'React Best Practices',
        description: 'Comprehensive guide to React development best practices',
        category: 'Resources',
        type: 'PDF',
        size: '2.1 MB',
        filePath: '',
        status: 'approved',
        createdAt: new Date().toISOString(),
      },
    ];
    return initialData;
  }
  
  // Map Supabase snake_case to camelCase
  return data.map((doc: any) => ({
    id: doc.id,
    title: doc.title,
    description: doc.description,
    category: doc.category,
    type: doc.type,
    size: doc.size,
    filePath: doc.file_path,
    status: doc.status,
    createdAt: doc.created_at,
  }));
}

export async function writeDocuments(documents: DocumentData[]) {
  // For Supabase, we don't need to write all documents at once - we'll use individual operations
  console.warn('writeDocuments is deprecated for Supabase, use individual CRUD operations');
}

// New Supabase-specific functions
export async function createDocumentSupabase(doc: Omit<DocumentData, 'createdAt'>): Promise<DocumentData> {
  const supabase = createServerClient();
  const newDoc = {
    id: doc.id,
    title: doc.title,
    description: doc.description,
    category: doc.category,
    type: doc.type,
    size: doc.size,
    file_path: doc.filePath,
    status: doc.status,
    created_at: new Date().toISOString(),
  };
  
  const { data, error } = await supabase
    .from('documents')
    .insert([newDoc])
    .select()
    .single();
  
  if (error) {
    throw new Error(`Error creating document: ${error.message}`);
  }
  
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    category: data.category,
    type: data.type,
    size: data.size,
    filePath: data.file_path,
    status: data.status,
    createdAt: data.created_at,
  };
}

export async function updateDocumentStatusSupabase(id: string, status: DocumentData['status']): Promise<DocumentData> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('documents')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    throw new Error(`Error updating document: ${error.message}`);
  }
  
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    category: data.category,
    type: data.type,
    size: data.size,
    filePath: data.file_path,
    status: data.status,
    createdAt: data.created_at,
  };
}

export async function deleteDocumentSupabase(id: string): Promise<boolean> {
  const supabase = createServerClient();
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', id);
  
  if (error) {
    throw new Error(`Error deleting document: ${error.message}`);
  }
  
  return true;
}
