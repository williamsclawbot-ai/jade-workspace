'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import TodayDashboard from '@/components/TodayDashboard';
import GuidePipeline from '@/components/GuidePipeline';
import ContentDashboard from '@/components/ContentDashboard';
import Campaigns from '@/components/Campaigns';
import GoHighLevel from '@/components/GoHighLevel';
import HLSTasks from '@/components/HLSTasks';
import Tasks from '@/components/Tasks';
import Calendar from '@/components/Calendar';
import MealPlanning from '@/components/MealPlanning';
import Memory from '@/components/Memory';
import Office from '@/components/Office';

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
      case 'today':
        return <TodayDashboard />;
      case 'guides':
        return <GuidePipeline />;
      case 'content':
        return <ContentDashboard />;
      case 'campaigns':
        return <Campaigns />;
      case 'ghl':
        return <GoHighLevel />;
      case 'hls-tasks':
        return <HLSTasks />;
      case 'tasks':
        return <Tasks />;
      case 'calendar':
        return <Calendar />;
      case 'meal-planning':
        return <MealPlanning />;
      case 'memory':
        return <Memory />;
      case 'office':
        return <Office />;
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
              <p className="text-jade-purple">Loading Mission Control...</p>
            </div>
          </div>
        ) : (
          <div className="h-screen bg-white rounded-tl-2xl shadow-2xl overflow-y-auto">
            <div className="p-8">
              {renderContent()}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
