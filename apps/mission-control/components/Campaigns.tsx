'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, AlertCircle, CheckCircle, Calendar, BarChart3, Zap, Target } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  status: 'planning' | 'active' | 'completed';
  startDate: string;
  endDate: string;
  description: string;
  platforms: string[];
  budget?: number;
  performance?: {
    impressions: number;
    clicks: number;
    conversions: number;
    roi: number;
  };
  nextActions: string[];
}

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 'hello-traveller',
      name: 'Hello Little Traveller',
      status: 'planning',
      startDate: 'Apr 1',
      endDate: 'Apr 30',
      description: 'April school holidays campaign — reaching families planning travel with young kids',
      platforms: ['TikTok', 'Instagram', 'Facebook', 'Email'],
      budget: 2000,
      nextActions: [
        'Create timeline and content calendar (Feb 28)',
        'Design social media graphics',
        'Write ad copy (travel angle)',
        'Set up Meta ads (Mar 15)',
        'Schedule content in advance',
      ],
    },
    {
      id: 'meta-ads',
      name: 'Meta Ads Performance Tracking',
      status: 'active',
      startDate: 'Jan 15',
      endDate: 'Dec 31',
      description: 'Ongoing Meta ads for sleep guides and email list growth',
      platforms: ['Facebook', 'Instagram'],
      budget: 5000,
      performance: {
        impressions: 145230,
        clicks: 3425,
        conversions: 287,
        roi: 2.4,
      },
      nextActions: [
        'Review performance weekly',
        'Optimize underperforming ads',
        'A/B test new creative',
        'Scale successful campaigns',
      ],
    },
  ]);

  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [showReporting, setShowReporting] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('jade_campaigns');
    if (saved) {
      setCampaigns(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('jade_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border border-green-300';
      case 'planning':
        return 'bg-blue-100 text-blue-800 border border-blue-300';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const activeCampaigns = campaigns.filter(c => c.status === 'active');
  const planningCampaigns = campaigns.filter(c => c.status === 'planning');

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="border-b border-jade-light pb-6">
        <h1 className="text-3xl font-bold text-jade-purple mb-2">Marketing Campaigns</h1>
        <p className="text-gray-600">Track campaigns, timeline, platforms, and Meta ads performance</p>
      </div>

      {/* Active Campaigns */}
      {activeCampaigns.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-jade-purple mb-4 flex items-center space-x-2">
            <Zap size={24} className="text-green-500" />
            <span>Active Campaigns</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeCampaigns.map(campaign => (
              <div
                key={campaign.id}
                className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-green-500 hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setSelectedCampaign(selectedCampaign === campaign.id ? null : campaign.id)}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-jade-purple">{campaign.name}</h3>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(campaign.status)}`}>
                    {campaign.status}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4">{campaign.description}</p>

                {/* Timeline */}
                <div className="flex items-center space-x-2 mb-4 text-sm text-gray-700">
                  <Calendar size={16} />
                  <span>{campaign.startDate} — {campaign.endDate}</span>
                </div>

                {/* Platforms */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-600 mb-2">Platforms</p>
                  <div className="flex flex-wrap gap-2">
                    {campaign.platforms.map(platform => (
                      <span key={platform} className="bg-jade-cream text-jade-purple text-xs font-semibold px-3 py-1 rounded-full">
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Performance Metrics (if active and has data) */}
                {campaign.performance && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Impressions</p>
                        <p className="text-lg font-bold text-jade-purple">{campaign.performance.impressions.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Clicks</p>
                        <p className="text-lg font-bold text-blue-600">{campaign.performance.clicks.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Conversions</p>
                        <p className="text-lg font-bold text-green-600">{campaign.performance.conversions}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">ROI</p>
                        <p className="text-lg font-bold text-green-600">{campaign.performance.roi.toFixed(1)}x</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Budget */}
                {campaign.budget && (
                  <div className="text-sm text-gray-700 mb-4">
                    Budget: <span className="font-bold">${campaign.budget.toLocaleString()}</span>
                  </div>
                )}

                {/* Expand Indicator */}
                {selectedCampaign === campaign.id && (
                  <div className="text-center pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">👇 Expanded below</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Planning Campaigns */}
      {planningCampaigns.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-jade-purple mb-4 flex items-center space-x-2">
            <AlertCircle size={24} className="text-blue-500" />
            <span>Upcoming Campaigns</span>
          </h2>
          <div className="space-y-4">
            {planningCampaigns.map(campaign => (
              <div
                key={campaign.id}
                className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedCampaign(selectedCampaign === campaign.id ? null : campaign.id)}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-blue-900">{campaign.name}</h3>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(campaign.status)}`}>
                    {campaign.status}
                  </span>
                </div>

                <p className="text-blue-800 text-sm mb-3">{campaign.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <div>
                    <p className="text-xs text-blue-700 font-semibold">Starts</p>
                    <p className="text-sm font-bold text-blue-900">{campaign.startDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-700 font-semibold">Ends</p>
                    <p className="text-sm font-bold text-blue-900">{campaign.endDate}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-blue-700 font-semibold mb-1">Platforms</p>
                    <div className="flex flex-wrap gap-1">
                      {campaign.platforms.map(platform => (
                        <span key={platform} className="bg-white text-blue-700 text-xs font-semibold px-2 py-0.5 rounded border border-blue-300">
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {selectedCampaign === campaign.id && (
                  <div className="text-center pt-3 border-t border-blue-200">
                    <p className="text-xs text-blue-600">👇 Details expanded below</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Expanded Campaign Details */}
      {selectedCampaign && campaigns.find(c => c.id === selectedCampaign) && (
        <div className="bg-white rounded-lg shadow-xl p-8 border-l-4 border-jade-purple">
          <button
            onClick={() => setSelectedCampaign(null)}
            className="float-right text-gray-400 hover:text-gray-600 text-2xl"
          >
            ✕
          </button>

          {campaigns.find(c => c.id === selectedCampaign) && (
            <div>
              <h2 className="text-2xl font-bold text-jade-purple mb-6">
                {campaigns.find(c => c.id === selectedCampaign)?.name}
              </h2>

              {/* Next Actions */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-jade-purple mb-4 flex items-center space-x-2">
                  <Target size={20} />
                  <span>Next Actions</span>
                </h3>
                <ul className="space-y-2">
                  {campaigns.find(c => c.id === selectedCampaign)?.nextActions.map((action, idx) => (
                    <li key={idx} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border-l-2 border-blue-500">
                      <CheckCircle size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-800">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Performance Data (if available) */}
              {campaigns.find(c => c.id === selectedCampaign)?.performance && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <TrendingUp size={20} className="text-green-600" />
                    <span>Performance Metrics</span>
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg p-4 shadow">
                      <p className="text-sm text-gray-600 mb-1">Impressions</p>
                      <p className="text-2xl font-bold text-jade-purple">
                        {campaigns.find(c => c.id === selectedCampaign)?.performance?.impressions.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow">
                      <p className="text-sm text-gray-600 mb-1">Clicks</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {campaigns.find(c => c.id === selectedCampaign)?.performance?.clicks.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow">
                      <p className="text-sm text-gray-600 mb-1">Conversions</p>
                      <p className="text-2xl font-bold text-green-600">
                        {campaigns.find(c => c.id === selectedCampaign)?.performance?.conversions}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow">
                      <p className="text-sm text-gray-600 mb-1">ROI</p>
                      <p className="text-2xl font-bold text-green-600">
                        {campaigns.find(c => c.id === selectedCampaign)?.performance?.roi.toFixed(1)}x
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button className="bg-jade-purple text-jade-cream px-6 py-2 rounded-lg hover:bg-jade-light hover:text-jade-purple transition-colors font-semibold">
                  Edit Campaign
                </button>
                <button className="bg-white text-jade-purple border-2 border-jade-purple px-6 py-2 rounded-lg hover:bg-jade-cream transition-colors font-semibold">
                  View Full Report
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Meta Ads Setup Guide */}
      <section className="bg-purple-50 border-l-4 border-purple-500 rounded-lg p-6">
        <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center space-x-2">
          <BarChart3 size={20} />
          <span>Meta Ads Setup & Management</span>
        </h3>
        <ul className="space-y-2 text-purple-800">
          <li className="flex items-start space-x-3">
            <span className="text-purple-600 font-bold">✓</span>
            <span>Create Meta Business Manager account (if not done)</span>
          </li>
          <li className="flex items-start space-x-3">
            <span className="text-purple-600 font-bold">✓</span>
            <span>Set up Conversion API to track guide purchases</span>
          </li>
          <li className="flex items-start space-x-3">
            <span className="text-purple-600 font-bold">✓</span>
            <span>Create custom audiences (email list, website visitors)</span>
          </li>
          <li className="flex items-start space-x-3">
            <span className="text-purple-600 font-bold">✓</span>
            <span>Launch campaigns for each guide launch</span>
          </li>
          <li className="flex items-start space-x-3">
            <span className="text-purple-600 font-bold">✓</span>
            <span>Weekly performance reviews and optimization</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
