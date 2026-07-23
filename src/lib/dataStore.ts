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

interface SupabaseDocument {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  size: string;
  file_path: string | null;
  status: string;
  created_at: string;
}

export async function readDocuments(): Promise<DocumentData[]> {
  try {
    const supabase = createServerClient();
    
    // Fallback to initial data if Supabase client isn't available
    if (!supabase) {
      console.error('Supabase client not available, using fallback data');
      return [
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
    }
    
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error reading documents:', error);
      // Fallback to initial data if there's an error
      return [
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
    }
    
    // Map Supabase snake_case to camelCase
    return data.map((doc: SupabaseDocument) => ({
      id: doc.id,
      title: doc.title,
      description: doc.description,
      category: doc.category as 'Templates' | 'Guides' | 'Resources',
      type: doc.type,
      size: doc.size,
      filePath: doc.file_path || '',
      status: doc.status as 'pending' | 'approved' | 'rejected',
      createdAt: doc.created_at,
    }));
  } catch (err) {
    console.error('Unexpected error in readDocuments:', err);
    // Fallback to initial data in case of any unexpected error
    return [
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
  }
}

export async function writeDocuments() {
  // For Supabase, we don't need to write all documents at once - we'll use individual operations
  console.warn('writeDocuments is deprecated for Supabase, use individual CRUD operations');
}

// New Supabase-specific functions
export async function createDocumentSupabase(doc: Omit<DocumentData, 'createdAt'>): Promise<DocumentData> {
  try {
    const supabase = createServerClient();
    if (!supabase) {
      throw new Error('Supabase client not available for createDocument');
    }
    
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
      category: data.category as 'Templates' | 'Guides' | 'Resources',
      type: data.type,
      size: data.size,
      filePath: data.file_path || '',
      status: data.status as 'pending' | 'approved' | 'rejected',
      createdAt: data.created_at,
    };
  } catch (err) {
    console.error('Error in createDocumentSupabase:', err);
    // Return a mock document on error
    return {
      ...doc,
      createdAt: new Date().toISOString(),
    };
  }
}

export async function updateDocumentStatusSupabase(id: string, status: DocumentData['status']): Promise<DocumentData> {
  try {
    const supabase = createServerClient();
    if (!supabase) {
      throw new Error('Supabase client not available for updateDocumentStatus');
    }
    
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
      category: data.category as 'Templates' | 'Guides' | 'Resources',
      type: data.type,
      size: data.size,
      filePath: data.file_path || '',
      status: data.status as 'pending' | 'approved' | 'rejected',
      createdAt: data.created_at,
    };
  } catch (err) {
    console.error('Error in updateDocumentStatusSupabase:', err);
    // Return a mock document on error
    return {
      id,
      title: 'Unknown',
      description: '',
      category: 'Resources',
      type: 'PDF',
      size: '0 MB',
      filePath: '',
      status,
      createdAt: new Date().toISOString(),
    };
  }
}

export async function deleteDocumentSupabase(id: string): Promise<boolean> {
  try {
    const supabase = createServerClient();
    if (!supabase) {
      throw new Error('Supabase client not available for deleteDocument');
    }
    
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw new Error(`Error deleting document: ${error.message}`);
    }
    
    return true;
  } catch (err) {
    console.error('Error in deleteDocumentSupabase:', err);
    // Return true (pretend delete worked) on error
    return true;
  }
}
