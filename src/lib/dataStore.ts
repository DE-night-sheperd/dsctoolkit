import * as fs from 'fs';
import * as path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'documents.json');

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
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
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
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  const content = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(content);
}

export async function writeDocuments(documents: DocumentData[]) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(documents, null, 2));
}
