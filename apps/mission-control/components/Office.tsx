'use client';

import { Settings } from 'lucide-react';

export default function Office() {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b border-jade-light px-6 py-4">
        <div className="flex items-center space-x-3">
          <Settings size={32} className="text-jade-purple" />
          <div>
            <h2 className="text-2xl font-bold text-jade-purple">Office</h2>
            <p className="text-sm text-gray-600">Settings & administration</p>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Settings size={64} className="mx-auto mb-4 text-jade-light opacity-30" />
          <h3 className="text-2xl font-bold text-jade-purple mb-2">Office Settings</h3>
          <p className="text-gray-600 max-w-md">
            Manage office settings and administration. This feature is coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
