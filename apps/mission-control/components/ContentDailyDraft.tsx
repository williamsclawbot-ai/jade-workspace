'use client';

import { FileText, CheckCircle2, Clock, AlertCircle, Plus } from 'lucide-react';
import { useState } from 'react';

interface DailyContent {
  date: string;
  platform: string;
  script: string;
  caption: string;
  hooks: string[];
  status: 'draft' | 'ready' | 'scheduled' | 'published';
}

interface WeeklyPlan {
  week: string;
  status: 'incomplete' | 'complete';
  daysPlanned: number;
  daysTotal: number;
}

export default function ContentDailyDraft() {
  const [activeView, setActiveView] = useState<'today' | 'week' | 'upcoming'>('today');

  // Sample data - will be connected to actual content management
  const todayContent: DailyContent = {
    date: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
    platform: 'All Platforms',
    script: '[Ready for creation]',
    caption: '[Ready for creation]',
    hooks: ['[Hook 1 ready]', '[Hook 2 ready]'],
    status: 'draft',
  };

  const thisWeekPlan: WeeklyPlan = {
    week: 'This Week',
    status: 'incomplete',
    daysPlanned: 3,
    daysTotal: 7,
  };

  const nextWeekPlan: WeeklyPlan = {
    week: 'Next Week',
    status: 'incomplete',
    daysPlanned: 0,
    daysTotal: 7,
  };

  const getStatusColor = (status: DailyContent['status']) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-700';
      case 'scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'ready':
        return 'bg-emerald-100 text-emerald-700';
      case 'draft':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-jade-light px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText size={32} className="text-jade-purple" />
            <div>
              <h2 className="text-2xl font-bold text-jade-purple">Daily Content</h2>
              <p className="text-sm text-gray-600">Content drafting system & weekly planning</p>
            </div>
          </div>
          <button className="flex items-center space-x-2 bg-jade-purple text-jade-cream px-4 py-2 rounded-lg hover:bg-jade-light hover:text-jade-purple transition-colors">
            <Plus size={20} />
            <span>New Draft</span>
          </button>
        </div>
      </div>

      {/* View Tabs */}
      <div className="border-b border-jade-light px-6 py-4 flex items-center space-x-2">
        {(['today', 'week', 'upcoming'] as const).map((view) => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium whitespace-nowrap ${
              activeView === view
                ? 'bg-jade-purple text-jade-cream'
                : 'bg-jade-cream text-jade-purple hover:bg-jade-light'
            }`}
          >
            {view === 'today' && "📅 Today's Draft"}
            {view === 'week' && '📆 This Week'}
            {view === 'upcoming' && '🔮 Upcoming'}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeView === 'today' && (
          <div className="space-y-6">
            {/* Today's Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-jade-purple">
                <p className="text-sm text-gray-600 mb-2">Status</p>
                <span className={`inline-block text-sm font-semibold px-3 py-1 rounded ${getStatusColor(todayContent.status)}`}>
                  {todayContent.status.charAt(0).toUpperCase() + todayContent.status.slice(1)}
                </span>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
                <p className="text-sm text-gray-600 mb-2">Platform</p>
                <p className="text-lg font-semibold text-blue-600">{todayContent.platform}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
                <p className="text-sm text-gray-600 mb-2">Components Ready</p>
                <p className="text-lg font-semibold text-green-600">3 / 3</p>
              </div>
            </div>

            {/* Content Components */}
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-jade-purple">
                <div className="flex items-center space-x-2 mb-3">
                  <FileText size={20} className="text-jade-purple" />
                  <h3 className="text-lg font-semibold text-jade-purple">Script</h3>
                </div>
                <div className="bg-jade-cream/50 p-4 rounded text-gray-700 min-h-24">
                  {todayContent.script}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex items-center space-x-2 mb-3">
                  <FileText size={20} className="text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-600">Caption</h3>
                </div>
                <div className="bg-blue-50 p-4 rounded text-gray-700 min-h-20">
                  {todayContent.caption}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                <div className="flex items-center space-x-2 mb-3">
                  <FileText size={20} className="text-purple-600" />
                  <h3 className="text-lg font-semibold text-purple-600">Hooks</h3>
                </div>
                <div className="space-y-2">
                  {todayContent.hooks.map((hook, idx) => (
                    <div key={idx} className="bg-purple-50 p-3 rounded text-gray-700">
                      {hook}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button className="flex-1 bg-jade-purple text-jade-cream px-4 py-2 rounded-lg hover:bg-jade-light hover:text-jade-purple transition-colors font-medium">
                Draft Script
              </button>
              <button className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium">
                Draft Caption
              </button>
              <button className="flex-1 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors font-medium">
                Add Hooks
              </button>
            </div>
          </div>
        )}

        {activeView === 'week' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-jade-purple to-jade-light rounded-lg shadow-lg p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">This Week's Content Plan</h3>
              <p className="text-jade-cream opacity-90">Full week drafted by Sunday</p>
            </div>

            {/* Weekly Progress */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-jade-purple">Progress: {thisWeekPlan.daysPlanned} / {thisWeekPlan.daysTotal} days</h3>
                <span className={`text-sm font-semibold px-3 py-1 rounded ${
                  thisWeekPlan.status === 'complete' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {thisWeekPlan.status === 'complete' ? 'Complete' : 'In Progress'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-jade-purple h-3 rounded-full transition-all"
                  style={{ width: `${(thisWeekPlan.daysPlanned / thisWeekPlan.daysTotal) * 100}%` }}
                />
              </div>
            </div>

            {/* Daily Content Items */}
            <div className="space-y-3">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                <div key={day} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-jade-light">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{day}</p>
                      <p className="text-sm text-gray-600">Content components ready to draft</p>
                    </div>
                    <button className="text-jade-purple hover:text-jade-purple/80 font-medium text-sm">
                      Edit →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'upcoming' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-600 to-purple-400 rounded-lg shadow-lg p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">Next Week's Planning</h3>
              <p className="text-purple-100 opacity-90">Get ahead with next week's content</p>
            </div>

            {/* Next Week Status */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-jade-purple">Next Week: {nextWeekPlan.daysPlanned} / {nextWeekPlan.daysTotal} days planned</h3>
                <button className="bg-jade-purple text-jade-cream px-4 py-2 rounded-lg hover:bg-jade-light hover:text-jade-purple transition-colors font-medium">
                  Start Planning
                </button>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-purple-600 h-3 rounded-full transition-all"
                  style={{ width: `${(nextWeekPlan.daysPlanned / nextWeekPlan.daysTotal) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-jade-cream/50 rounded-lg p-6 text-center">
              <p className="text-gray-700">Next week's content planning will appear here once you start adding items.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
