'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import KanbanBoard from '@/components/KanbanBoard';
import Metrics from '@/components/Metrics';

export default function Home() {
  const [activeView, setActiveView] = useState<'dashboard' | 'kanban' | 'metrics'>('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial load
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-jade-cream">
      <Navigation activeView={activeView} setActiveView={setActiveView} />
      
      <main className="pt-20 px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-jade-purple border-t-jade-cream mx-auto mb-4"></div>
              <p className="text-jade-purple">Loading Workspace...</p>
            </div>
          </div>
        ) : (
          <>
            {activeView === 'dashboard' && <Dashboard />}
            {activeView === 'kanban' && <KanbanBoard />}
            {activeView === 'metrics' && <Metrics />}
          </>
        )}
      </main>
    </div>
  );
}
