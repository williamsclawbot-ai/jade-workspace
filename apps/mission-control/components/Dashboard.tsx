'use client';

import { useState, useEffect } from 'react';
import { LayoutGrid, FileText, CheckSquare, UtensilsCrossed, Calendar, Brain, Settings, Mail } from 'lucide-react';
import QuickCaptureWidget from './QuickCaptureWidget';

interface DashboardProps {
  onNavigate?: (tab: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [stats, setStats] = useState({
    totalTasks: 24,
    completedToday: 3,
    upcomingMeals: 5,
    contentItems: 12,
  });

  return (
    <div className="space-y-8 pb-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-jade-purple to-jade-light rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome Back, Jade! 👋</h1>
        <p className="text-jade-cream opacity-90">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <p className="text-sm mt-4 opacity-80">You have <span className="font-bold">{stats.totalTasks}</span> tasks in progress and <span className="font-bold">{stats.completedToday}</span> completed today. Great work! 💪</p>
      </div>

      {/* Quick Capture Widget - Prominent Position */}
      <section>
        <h2 className="text-2xl font-bold text-jade-purple mb-4">Capture</h2>
        <QuickCaptureWidget onNavigate={onNavigate} />
      </section>

      {/* Quick Stats */}
      <section>
        <h2 className="text-2xl font-bold text-jade-purple mb-4">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-jade-purple hover:shadow-lg transition-shadow">
            <p className="text-gray-600 text-sm mb-2">📋 Total Tasks</p>
            <p className="text-3xl font-bold text-jade-purple">{stats.totalTasks}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <p className="text-gray-600 text-sm mb-2">✅ Completed Today</p>
            <p className="text-3xl font-bold text-green-600">{stats.completedToday}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
            <p className="text-gray-600 text-sm mb-2">🍽️ Meal Plans</p>
            <p className="text-3xl font-bold text-blue-600">{stats.upcomingMeals}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
            <p className="text-gray-600 text-sm mb-2">📝 Content</p>
            <p className="text-3xl font-bold text-purple-600">{stats.contentItems}</p>
          </div>
        </div>
      </section>

      {/* Main Navigation */}
      <section>
        <h2 className="text-2xl font-bold text-jade-purple mb-4">Access Your Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigate?.('content')}
            className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg hover:scale-105 transition-all cursor-pointer border-t-2 border-jade-purple active:scale-95"
          >
            <FileText size={28} className="text-jade-purple mx-auto mb-3" />
            <p className="font-semibold text-gray-900">Content</p>
            <p className="text-xs text-gray-600">Dashboard</p>
          </button>
          <button
            onClick={() => onNavigate?.('weekly-newsletter')}
            className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg hover:scale-105 transition-all cursor-pointer border-t-2 border-blue-500 active:scale-95"
          >
            <Mail size={28} className="text-blue-600 mx-auto mb-3" />
            <p className="font-semibold text-gray-900">Weekly Newsletter</p>
            <p className="text-xs text-gray-600">Tracking</p>
          </button>
          <button
            onClick={() => onNavigate?.('campaigns')}
            className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg hover:scale-105 transition-all cursor-pointer border-t-2 border-green-500 active:scale-95"
          >
            <CheckSquare size={28} className="text-green-600 mx-auto mb-3" />
            <p className="font-semibold text-gray-900">Campaigns</p>
            <p className="text-xs text-gray-600">Tracking</p>
          </button>
          <button
            onClick={() => onNavigate?.('meta-ads')}
            className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg hover:scale-105 transition-all cursor-pointer border-t-2 border-purple-500 active:scale-95"
          >
            <Settings size={28} className="text-purple-600 mx-auto mb-3" />
            <p className="font-semibold text-gray-900">Meta Ads</p>
            <p className="text-xs text-gray-600">Reporting</p>
          </button>
          <button
            onClick={() => onNavigate?.('hls-tasks')}
            className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg hover:scale-105 transition-all cursor-pointer border-t-2 border-orange-500 active:scale-95"
          >
            <CheckSquare size={28} className="text-orange-600 mx-auto mb-3" />
            <p className="font-semibold text-gray-900">HLS Tasks</p>
            <p className="text-xs text-gray-600">Projects</p>
          </button>
          <button
            onClick={() => onNavigate?.('meal-planning')}
            className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg hover:scale-105 transition-all cursor-pointer border-t-2 border-amber-500 active:scale-95"
          >
            <UtensilsCrossed size={28} className="text-amber-600 mx-auto mb-3" />
            <p className="font-semibold text-gray-900">Meal Planning</p>
            <p className="text-xs text-gray-600">Weekly</p>
          </button>
          <button
            onClick={() => onNavigate?.('calendar')}
            className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg hover:scale-105 transition-all cursor-pointer border-t-2 border-cyan-500 active:scale-95"
          >
            <Calendar size={28} className="text-cyan-600 mx-auto mb-3" />
            <p className="font-semibold text-gray-900">Calendar</p>
            <p className="text-xs text-gray-600">All Events</p>
          </button>
          <button
            onClick={() => onNavigate?.('memory')}
            className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg hover:scale-105 transition-all cursor-pointer border-t-2 border-pink-500 active:scale-95"
          >
            <Brain size={28} className="text-pink-600 mx-auto mb-3" />
            <p className="font-semibold text-gray-900">Memory</p>
            <p className="text-xs text-gray-600">2nd Brain</p>
          </button>
        </div>
      </section>

      {/* Quick Info */}
      <section className="bg-gradient-to-r from-jade-purple/5 to-jade-light/10 rounded-lg p-6">
        <h3 className="text-lg font-bold text-jade-purple mb-4">About Mission Control</h3>
        <p className="text-gray-700">
          Your unified hub for managing content, tasks, meal planning, and more. All your tools in one place.
        </p>
      </section>
    </div>
  );
}
