'use client';

import { useState, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import DocumentViewer from '@/components/DocumentViewer';
import SearchBar from '@/components/SearchBar';
import { BookOpen, Grid, Plus } from 'lucide-react';

interface Document {
  id: string;
  folder: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const SAMPLE_DOCUMENTS: Document[] = [
  {
    id: '1',
    folder: 'Documents',
    title: 'Hello Little Sleepers Overview',
    content: `# Hello Little Sleepers Overview

## Mission
To provide comprehensive childcare guidance and support for parents and educators.

## Core Services
- **Daycare Management**: Tools for organizing and running quality daycare operations
- **Content Hub**: Educational resources for child development
- **Meal Planning**: Nutrition-focused meal plans for children
- **Task Management**: Integrated workflow management

## Brand Values
- Warmth and care for every child
- Professional, evidence-based guidance
- Community support and collaboration
- Accessibility and inclusivity

## Growth Metrics
- Current subscribers: 1,250+
- Monthly revenue: $15,840
- Active deals in pipeline: $45,000`,
    createdAt: '2026-02-10',
    updatedAt: '2026-02-17',
  },
  {
    id: '2',
    folder: 'Concepts',
    title: 'Child Development Stages',
    content: `# Child Development Stages

## Infancy (0-12 months)
- Physical: Rapid growth, motor skill development
- Cognitive: Object permanence, cause and effect
- Social: Attachment formation

## Toddlerhood (1-3 years)
- Physical: Walking, running, climbing
- Cognitive: Language explosion, pretend play
- Emotional: Separation anxiety, independence seeking

## Preschool (3-5 years)
- Academic: Pre-literacy and numeracy skills
- Social: Peer interaction, cooperation
- Creative: Imagination and play

## School Age (6+ years)
- Academic: Formal learning, reading and writing
- Social: Friendship formation, team skills
- Interests: Hobbies and extracurricular activities`,
    createdAt: '2026-02-05',
    updatedAt: '2026-02-15',
  },
  {
    id: '3',
    folder: 'Specs',
    title: 'API Integration Specifications',
    content: `# API Integration Specifications

## GHL Integration
- **Endpoint**: GoHighLevel API
- **Purpose**: Real-time subscriber and revenue tracking
- **Authentication**: API key (pit-03aa8ac2-f6cb-4644-951d-c64f4682ca38)
- **Read-only access**: Enabled for security

### Available Data Points
\`\`\`json
{
  "subscribers": 1250,
  "revenue": 15840,
  "deals": 12,
  "pipeline": 45000
}
\`\`\`

## Supabase Integration
- **Database**: PostgreSQL
- **Real-time**: WebSocket subscriptions enabled
- **RLS**: Row-level security policies active

### Tables
- projects
- tasks
- documents
- metrics`,
    createdAt: '2026-02-08',
    updatedAt: '2026-02-17',
  },
  {
    id: '4',
    folder: 'Daily Journal',
    title: '2026-02-17 Daily Note',
    content: `# Daily Journal - February 17, 2026

## Today's Focus
- Build Mission Control dashboard
- Implement 2nd Brain knowledge base
- Deploy to Vercel staging

## Accomplished
✅ Created monorepo structure
✅ Set up Next.js apps
✅ Built dashboard components
✅ Created Kanban board
✅ Added metrics visualization

## Next Steps
- [ ] Deploy to Vercel
- [ ] Test GHL integration
- [ ] Refine UI/UX
- [ ] Document API

## Notes
- Jade's brand colors: #fbecdb, #563f57, #e5ccc6
- MVP focus: functional over perfect
- Ready for iteration`,
    createdAt: '2026-02-17',
    updatedAt: '2026-02-17',
  },
  {
    id: '5',
    folder: 'Learnings',
    title: 'Next.js Best Practices',
    content: `# Next.js Best Practices

## App Router Benefits
- Server components by default
- Streaming and suspense support
- Better code organization
- Improved performance

## Performance Optimization
1. **Image Optimization**: Use next/image
2. **Code Splitting**: Automatic route-based splitting
3. **CSS-in-JS**: Avoid unnecessary CSS
4. **Data Fetching**: Cache strategies

## Security Considerations
- Environment variables for sensitive data
- Input validation and sanitization
- CORS configuration
- CSP headers setup

## Deployment
- Vercel: Native integration
- Environment variables: Securely stored
- Preview deployments: Automatic
- Analytics: Built-in monitoring`,
    createdAt: '2026-02-12',
    updatedAt: '2026-02-16',
  },
];

export default function Home() {
  const [selectedDocId, setSelectedDocId] = useState<string>('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const selectedDocument = SAMPLE_DOCUMENTS.find(doc => doc.id === selectedDocId);

  const filteredDocuments = useMemo(() => {
    if (!searchQuery) return SAMPLE_DOCUMENTS;
    
    const query = searchQuery.toLowerCase();
    return SAMPLE_DOCUMENTS.filter(doc =>
      doc.title.toLowerCase().includes(query) ||
      doc.content.toLowerCase().includes(query) ||
      doc.folder.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const documentsByFolder = useMemo(() => {
    const grouped: Record<string, Document[]> = {};
    filteredDocuments.forEach(doc => {
      if (!grouped[doc.folder]) {
        grouped[doc.folder] = [];
      }
      grouped[doc.folder].push(doc);
    });
    return grouped;
  }, [filteredDocuments]);

  return (
    <div className="min-h-screen bg-jade-cream flex flex-col">
      {/* Header */}
      <header className="bg-jade-purple text-jade-cream shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🧠</span>
              <h1 className="text-2xl font-bold">2nd Brain</h1>
              <span className="text-sm text-jade-light ml-2">Knowledge Base</span>
            </div>
            <button className="flex items-center space-x-2 bg-jade-cream text-jade-purple px-4 py-2 rounded-lg hover:bg-jade-light transition-colors">
              <Plus size={20} />
              <span className="hidden sm:inline">New Document</span>
            </button>
          </div>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          documents={documentsByFolder}
          selectedDocId={selectedDocId}
          onSelectDoc={setSelectedDocId}
          viewMode={viewMode}
        />

        {/* Document Viewer */}
        {selectedDocument ? (
          <DocumentViewer document={selectedDocument} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <BookOpen size={48} className="mx-auto mb-4 text-jade-light opacity-50" />
              <p className="text-gray-600">Select a document to view</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
