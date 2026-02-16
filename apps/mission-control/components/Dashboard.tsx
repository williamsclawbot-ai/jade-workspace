'use client';

import { useState, useEffect } from 'react';
import { BookOpen, TrendingUp, AlertCircle, CheckCircle, Clock, Target, Users, Zap } from 'lucide-react';

export default function Dashboard() {
  const [ghlData, setGhlData] = useState({
    subscribers: 1250,
    revenue: 15840,
    deals: 12,
    pipeline: 45000,
  });

  const [guidesSummary, setGuidesSummary] = useState({
    totalGuides: 5,
    inProgress: 3,
    readyToLaunch: 1,
    avgProgress: 45,
  });

  const [contentStats, setContentStats] = useState({
    weekDrafted: 4,
    weekTarget: 7,
    scheduledPosts: 12,
    bestPerformer: 'TikTok - Sleep Myth Busting',
  });

  const [todayPriorities, setTodayPriorities] = useState({
    urgent: 2,
    high: 3,
    completed: 1,
  });

  return (
    <div className="space-y-8 pb-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-jade-purple to-jade-light rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome Back, Jade! 👋</h1>
        <p className="text-jade-cream opacity-90">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
        <p className="text-sm mt-4 opacity-80">You have <span className="font-bold">{todayPriorities.urgent}</span> urgent tasks and <span className="font-bold">{todayPriorities.completed}</span> already completed today. Keep going! 💪</p>
      </div>

      {/* Key Metrics Overview */}
      <section>
        <h2 className="text-2xl font-bold text-jade-purple mb-4 flex items-center space-x-2">
          <TrendingUp size={24} />
          <span>Business Overview</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-jade-purple hover:shadow-lg transition-shadow">
            <p className="text-gray-600 text-sm mb-2">💌 Email Subscribers</p>
            <p className="text-3xl font-bold text-jade-purple">{ghlData.subscribers.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2">+42 this month</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <p className="text-gray-600 text-sm mb-2">💰 Monthly Revenue</p>
            <p className="text-3xl font-bold text-green-600">${(ghlData.revenue / 1000).toFixed(1)}k</p>
            <p className="text-xs text-gray-500 mt-2">+$2,145 increase</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
            <p className="text-gray-600 text-sm mb-2">📈 Pipeline Value</p>
            <p className="text-3xl font-bold text-blue-600">${(ghlData.pipeline / 1000).toFixed(0)}k</p>
            <p className="text-xs text-gray-500 mt-2">27% conversion rate</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
            <p className="text-gray-600 text-sm mb-2">🤝 Active Deals</p>
            <p className="text-3xl font-bold text-purple-600">{ghlData.deals}</p>
            <p className="text-xs text-gray-500 mt-2">3 closing this week</p>
          </div>
        </div>
      </section>

      {/* Guides Pipeline at a Glance */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-jade-purple flex items-center space-x-2">
            <BookOpen size={24} />
            <span>Product Pipeline Status</span>
          </h2>
          <a href="#guides" className="text-jade-purple hover:text-jade-light font-semibold text-sm">
            View Full Pipeline →
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
            <p className="text-red-700 text-sm font-semibold mb-1">🔴 In Writing/Review</p>
            <p className="text-3xl font-bold text-red-600">{guidesSummary.inProgress}</p>
            <p className="text-xs text-red-600 mt-2">5-18 Month (80% done)</p>
          </div>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4">
            <p className="text-yellow-700 text-sm font-semibold mb-1">🟡 Awaiting Design</p>
            <p className="text-3xl font-bold text-yellow-600">2</p>
            <p className="text-xs text-yellow-600 mt-2">Bridging Guide, Toddler Guide</p>
          </div>
          <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
            <p className="text-green-700 text-sm font-semibold mb-1">✅ Ready to Launch</p>
            <p className="text-3xl font-bold text-green-600">{guidesSummary.readyToLaunch}</p>
            <p className="text-xs text-green-600 mt-2">Once design complete</p>
          </div>
        </div>

        {/* Quick View */}
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-jade-purple">
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-semibold text-gray-800">5-18 Month Sleep Guide (KEY)</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-300 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
                <span className="text-sm font-bold text-green-600">80%</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-semibold text-gray-800">4-5 Month Bridging Guide</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-300 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                </div>
                <span className="text-sm font-bold text-yellow-600">15%</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-semibold text-gray-800">18 Month – 3 Year Toddler</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-300 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                </div>
                <span className="text-sm font-bold text-blue-600">10%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content & Marketing Summary */}
      <section>
        <h2 className="text-2xl font-bold text-jade-purple mb-4 flex items-center space-x-2">
          <Zap size={24} />
          <span>Content & Marketing</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📝 This Week's Content</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-800">Drafts Completed</span>
                <span className="font-bold text-blue-600">{contentStats.weekDrafted}/{contentStats.weekTarget}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-800">Scheduled Posts</span>
                <span className="font-bold text-blue-600">{contentStats.scheduledPosts}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-800">Best Performer</span>
                <span className="text-xs font-semibold text-blue-700 text-right">{contentStats.bestPerformer}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-500 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Active Campaigns</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                <span className="text-lg">🚀</span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Hello Little Traveller</p>
                  <p className="text-xs text-gray-600">Apr 1 - Apr 30 (Planning phase)</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                <span className="text-lg">📊</span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Meta Ads Performance</p>
                  <p className="text-xs text-gray-600">2.4x ROI on current spend</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Quick Actions */}
      <section>
        <h2 className="text-2xl font-bold text-jade-purple mb-4 flex items-center space-x-2">
          <Target size={24} />
          <span>Today's Top Priorities</span>
        </h2>
        <div className="space-y-3">
          <div className="flex items-start space-x-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg hover:shadow-md transition-shadow">
            <AlertCircle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Daily Content Draft</p>
              <p className="text-sm text-gray-700 mt-1">1 piece for content calendar due by 5 PM EOD</p>
            </div>
            <Clock size={18} className="text-red-600 flex-shrink-0" />
          </div>

          <div className="flex items-start space-x-4 p-4 bg-orange-50 border-l-4 border-orange-500 rounded-lg hover:shadow-md transition-shadow">
            <Zap size={20} className="text-orange-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Support Reel</p>
              <p className="text-sm text-gray-700 mt-1">Film quick testimonial/demo showing your support process</p>
            </div>
            <span className="text-xs font-semibold text-orange-700 flex-shrink-0">This Week</span>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg hover:shadow-md transition-shadow">
            <BookOpen size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-gray-900">5-18 Month Guide Progress</p>
              <p className="text-sm text-gray-700 mt-1">Current: 80% → Target: 90% by Friday EOW</p>
            </div>
            <CheckCircle size={18} className="text-blue-600 flex-shrink-0" />
          </div>
        </div>
      </section>

      {/* Decision Banner */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-6 flex items-start space-x-4">
        <AlertCircle size={24} className="text-yellow-600 mt-1 flex-shrink-0" />
        <div>
          <h3 className="text-lg font-bold text-yellow-900 mb-2">⚠️ Pending Decision</h3>
          <p className="text-yellow-800 mb-3">
            Should we launch guides one at a time or wait for the full bundle?
          </p>
          <div className="flex space-x-3">
            <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors font-semibold text-sm">
              Launch 5-18 Month First
            </button>
            <button className="bg-white text-yellow-600 border-2 border-yellow-600 px-4 py-2 rounded-lg hover:bg-yellow-50 transition-colors font-semibold text-sm">
              Wait for Full Bundle
            </button>
          </div>
        </div>
      </div>

      {/* Quick Navigation to Detailed Views */}
      <section className="bg-gradient-to-r from-jade-purple/5 to-jade-light/10 rounded-lg p-8">
        <h3 className="text-lg font-bold text-jade-purple mb-6">📊 Need more details?</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a href="#guides" className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow cursor-pointer border-t-2 border-purple-500">
            <BookOpen size={24} className="text-purple-600 mx-auto mb-2" />
            <p className="font-semibold text-gray-900">Guides</p>
            <p className="text-xs text-gray-600">Pipeline</p>
          </a>
          <a href="#content" className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow cursor-pointer border-t-2 border-blue-500">
            <Zap size={24} className="text-blue-600 mx-auto mb-2" />
            <p className="font-semibold text-gray-900">Content</p>
            <p className="text-xs text-gray-600">Calendar</p>
          </a>
          <a href="#campaigns" className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow cursor-pointer border-t-2 border-pink-500">
            <Target size={24} className="text-pink-600 mx-auto mb-2" />
            <p className="font-semibold text-gray-900">Campaigns</p>
            <p className="text-xs text-gray-600">Marketing</p>
          </a>
          <a href="#ghl" className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow cursor-pointer border-t-2 border-green-500">
            <Users size={24} className="text-green-600 mx-auto mb-2" />
            <p className="font-semibold text-gray-900">GHL</p>
            <p className="text-xs text-gray-600">Products</p>
          </a>
        </div>
      </section>
    </div>
  );
}
