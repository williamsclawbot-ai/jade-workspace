'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Tasks from '@/components/Tasks';
import Dashboard from '@/components/Dashboard';
import Content from '@/components/Content';
import ContentDashboard from '@/components/ContentDashboard';
import HLSTasks from '@/components/HLSTasks';
import Approvals from '@/components/Approvals';
import Council from '@/components/Council';
import Calendar from '@/components/Calendar';
import Projects from '@/components/Projects';
import MealPlanning from '@/components/MealPlanning';
import Memory from '@/components/Memory';
import DocsTab from '@/components/DocsTab';
import People from '@/components/People';
import Office from '@/components/Office';
import Team from '@/components/Team';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial load
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return <Tasks />;
      case 'content':
        return <ContentDashboard />;
      case 'hls-tasks':
        return <HLSTasks />;
      case 'approvals':
        return <Approvals />;
      case 'council':
        return <Council />;
      case 'calendar':
        return <Calendar />;
      case 'projects':
        return <Projects />;
      case 'meal-planning':
        return <MealPlanning />;
      case 'memory':
        return <Memory />;
      case 'docs':
        return <DocsTab />;
      case 'people':
        return <People />;
      case 'office':
        return <Office />;
      case 'team':
        return <Team />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-jade-cream flex">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 ml-64 transition-all duration-300">
        {isLoading ? (
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-jade-purple border-t-jade-cream mx-auto mb-4"></div>
              <p className="text-jade-purple">Loading Workspace...</p>
            </div>
          </div>
        ) : (
          <div className="h-screen bg-white rounded-tl-2xl shadow-2xl overflow-hidden">
            {renderContent()}
          </div>
        )}
      </main>
    </div>
  );
}
