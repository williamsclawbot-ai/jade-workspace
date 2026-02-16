'use client';

import { useState } from 'react';
import Dashboard from './Dashboard';
import KanbanBoard from './KanbanBoard';
import Metrics from './Metrics';

type TaskView = 'dashboard' | 'kanban' | 'metrics';

export default function Tasks() {
  const [activeView, setActiveView] = useState<TaskView>('dashboard');

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Task View Selector */}
      <div className="border-b border-jade-light px-6 py-4 flex items-center space-x-4">
        <h2 className="text-2xl font-bold text-jade-purple">Tasks</h2>
        <div className="flex items-center space-x-2 ml-auto">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'kanban', label: 'Kanban' },
            { id: 'metrics', label: 'Metrics' },
          ].map(view => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id as TaskView)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeView === view.id
                  ? 'bg-jade-purple text-jade-cream'
                  : 'bg-jade-cream text-jade-purple hover:bg-jade-light'
              }`}
            >
              {view.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {activeView === 'dashboard' && <Dashboard />}
        {activeView === 'kanban' && <KanbanBoard />}
        {activeView === 'metrics' && <Metrics />}
      </div>
    </div>
  );
}
