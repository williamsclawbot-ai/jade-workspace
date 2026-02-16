'use client';

import { Calendar as CalendarIcon, Plus } from 'lucide-react';

export default function Calendar() {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b border-jade-light px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CalendarIcon size={32} className="text-jade-purple" />
            <div>
              <h2 className="text-2xl font-bold text-jade-purple">Calendar</h2>
              <p className="text-sm text-gray-600">Events & scheduling</p>
            </div>
          </div>
          <button className="flex items-center space-x-2 bg-jade-purple text-jade-cream px-4 py-2 rounded-lg hover:bg-jade-light hover:text-jade-purple transition-colors">
            <Plus size={20} />
            <span>New Event</span>
          </button>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <CalendarIcon size={64} className="mx-auto mb-4 text-jade-light opacity-30" />
          <h3 className="text-2xl font-bold text-jade-purple mb-2">Calendar View</h3>
          <p className="text-gray-600 max-w-md">
            View events and schedule meetings. This feature is coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
