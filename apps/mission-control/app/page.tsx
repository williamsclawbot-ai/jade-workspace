'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import Guides from '@/components/Guides';
import Content from '@/components/Content';
import WeeklyNewsletter from '@/components/WeeklyNewsletter';
import Campaigns from '@/components/Campaigns';
import MetaAds from '@/components/MetaAds';
import GoHighLevel from '@/components/GoHighLevel';
import Today from '@/components/Today';
import HLSPipeline from '@/components/HLSPipeline';
import Tasks from '@/components/Tasks';
import Decisions from '@/components/Decisions';
import MealPlanning from '@/components/MealPlanning';
import Calendar from '@/components/Calendar';
import Memory from '@/components/Memory';
import Office from '@/components/Office';
import QuickCapture from '@/components/QuickCapture';
import Appointments from '@/components/Appointments';
import CleaningSchedule from '@/components/CleaningSchedule';
import RemindersForJohn from '@/components/RemindersForJohn';
import HouseholdTodos from '@/components/HouseholdTodos';
import GoHighLevelMetrics from '@/components/GoHighLevelMetrics';
import StripeRevenue from '@/components/StripeRevenue';
import CombinedMetrics from '@/components/CombinedMetrics';
import PersonalTasks from '@/components/PersonalTasks';
import Notes from '@/components/Notes';
import TodayCommandCenter from '@/components/TodayCommandCenter';
import WeeklyContentView from '@/components/WeeklyContentView';
import ShoppingCart from '@/components/ShoppingCart';
import AwaitingReviewTab from '@/components/AwaitingReviewTab';
import OvernightReviewTab from '@/components/OvernightReviewTab';
import FunnelAnalysisView from '@/components/FunnelAnalysisView';
import weeklyContentData from '@/lib/weeklyContentData.json';
import { initializeWeeklyContent } from '@/lib/initializeContentData';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize weekly content data on app startup
    initializeWeeklyContent(weeklyContentData);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'guides':
        return <Guides />;
      case 'content':
        return <Content />;
      case 'weekly-view':
        return <WeeklyContentView />;
      case 'weekly-newsletter':
        return <WeeklyNewsletter />;
      case 'campaigns':
        return <Campaigns />;
      case 'meta-ads':
        return <MetaAds />;
      case 'ghl-metrics':
        return <GoHighLevelMetrics />;
      case 'stripe-revenue':
        return <StripeRevenue />;
      case 'combined-metrics':
        return <CombinedMetrics />;
      case 'ghl':
        return <GoHighLevel />;
      case 'today':
        return <TodayCommandCenter />;
      case 'hls-tasks':
        return <HLSPipeline />;
      case 'tasks':
        return <Tasks />;
      case 'decisions':
        return <Decisions />;
      case 'inbox':
        return <QuickCapture onNavigate={setActiveTab} />;
      case 'meal-planning':
        return <MealPlanning />;
      case 'calendar':
        return <Calendar />;
      case 'appointments':
        return <Appointments />;
      case 'cleaning-schedule':
        return <CleaningSchedule />;
      case 'reminders-john':
        return <RemindersForJohn />;
      case 'household-todos':
        return <HouseholdTodos />;
      case 'personal-tasks':
        return <PersonalTasks />;
      case 'woolworths':
        return <ShoppingCart />;
      case 'notes':
        return <Notes />;
      case 'memory':
        return <Memory />;
      case 'office':
        return <Office />;
      case 'awaiting-review':
        return <AwaitingReviewTab />;
      case 'overnight-review':
        return <OvernightReviewTab />;
      case 'funnel-analysis':
        return <FunnelAnalysisView />;
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
              {activeTab === 'dashboard' ? (
                <Dashboard onNavigate={setActiveTab} />
              ) : (
                renderContent()
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
