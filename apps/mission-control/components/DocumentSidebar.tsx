'use client';

import { useState } from 'react';
import { ChevronDown, File, FolderOpen } from 'lucide-react';

interface Document {
  id: string;
  folder: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface DocumentSidebarProps {
  documents: Record<string, Document[]>;
  selectedDocId: string;
  onSelectDoc: (id: string) => void;
}

export default function DocumentSidebar({
  documents,
  selectedDocId,
  onSelectDoc,
}: DocumentSidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    Documents: true,
    Concepts: true,
    'Daily Journal': false,
    Learnings: false,
    Specs: false,
  });

  const toggleFolder = (folder: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folder]: !prev[folder],
    }));
  };

  const folderEmojis: Record<string, string> = {
    Documents: '📄',
    Concepts: '💡',
    'Daily Journal': '📔',
    Learnings: '📚',
    Specs: '📋',
  };

  return (
    <aside className="w-72 bg-white shadow-sm flex flex-col border-r border-jade-light max-h-full overflow-y-auto">
      <div className="p-4 space-y-4">
        {Object.entries(documents).map(([folder, docs]) => (
          <div key={folder}>
            <button
              onClick={() => toggleFolder(folder)}
              className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-jade-cream transition-colors text-left font-semibold text-jade-purple"
            >
              <ChevronDown
                size={20}
                className={`transition-transform ${expandedFolders[folder] ? '' : '-rotate-90'}`}
              />
              <FolderOpen size={20} />
              <span>{folderEmojis[folder] || '📁'} {folder}</span>
              <span className="ml-auto text-xs bg-jade-light text-jade-purple px-2 py-1 rounded">
                {docs.length}
              </span>
            </button>

            {expandedFolders[folder] && (
              <div className="ml-4 mt-2 space-y-1">
                {docs.map(doc => (
                  <button
                    key={doc.id}
                    onClick={() => onSelectDoc(doc.id)}
                    className={`w-full flex items-start space-x-2 px-4 py-2 rounded-lg transition-colors text-left text-sm ${
                      selectedDocId === doc.id
                        ? 'bg-jade-purple text-jade-cream'
                        : 'text-gray-700 hover:bg-jade-cream'
                    }`}
                  >
                    <File size={16} className="mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{doc.title}</p>
                      <p className="text-xs opacity-70">
                        {new Date(doc.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-auto border-t border-jade-light p-4 text-xs text-gray-600">
        <p>💾 Auto-saving enabled</p>
        <p>🔄 Last synced: Just now</p>
      </div>
    </aside>
  );
}
