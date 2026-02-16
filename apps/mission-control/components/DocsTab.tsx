'use client';

import { BookOpen, Plus } from 'lucide-react';

export default function DocsTab() {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b border-jade-light px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BookOpen size={32} className="text-jade-purple" />
            <div>
              <h2 className="text-2xl font-bold text-jade-purple">Docs</h2>
              <p className="text-sm text-gray-600">Documentation & guides</p>
            </div>
          </div>
          <button className="flex items-center space-x-2 bg-jade-purple text-jade-cream px-4 py-2 rounded-lg hover:bg-jade-light hover:text-jade-purple transition-colors">
            <Plus size={20} />
            <span>New Doc</span>
          </button>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <BookOpen size={64} className="mx-auto mb-4 text-jade-light opacity-30" />
          <h3 className="text-2xl font-bold text-jade-purple mb-2">Documentation</h3>
          <p className="text-gray-600 max-w-md">
            Access your documentation and guides. This feature is coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
