'use client';

import { Zap, Plus, Calendar, CheckCircle2, Target } from 'lucide-react';
import { useState } from 'react';

interface Campaign {
  id: string;
  name: string;
  period: string;
  status: 'planning' | 'active' | 'paused' | 'completed';
  startDate: string;
  endDate: string;
  content: {
    socialMedia: boolean;
    metaAds: boolean;
    email: boolean;
    blog: boolean;
  };
  milestones: string[];
  notes: string;
}

export default function Campaigns() {
  const [campaigns] = useState<Campaign[]>([
    {
      id: 'hlt-2026',
      name: 'Hello Little Traveller',
      period: 'April 2026 School Holidays',
      status: 'planning',
      startDate: '2026-04-02',
      endDate: '2026-04-30',
      content: {
        socialMedia: true,
        metaAds: true,
        email: false,
        blog: false,
      },
      milestones: [
        'Campaign launch (April 2)',
        'Peak marketing push (April 30)',
        'Campaign wrap-up reporting',
      ],
      notes: 'Marketing campaign targeting school holidays. Focuses on travel content, destination ideas for families with young children.',
    },
  ]);

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active':
        return { bg: 'bg-green-100', text: 'text-green-800', icon: '🚀' };
      case 'planning':
        return { bg: 'bg-blue-100', text: 'text-blue-800', icon: '📋' };
      case 'paused':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '⏸️' };
      case 'completed':
        return { bg: 'bg-gray-100', text: 'text-gray-800', icon: '✅' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', icon: '📌' };
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-jade-light px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Zap size={32} className="text-jade-purple" />
            <div>
              <h2 className="text-2xl font-bold text-jade-purple">Campaigns</h2>
              <p className="text-sm text-gray-600">Manage and track marketing campaigns</p>
            </div>
          </div>
          <button className="flex items-center space-x-2 bg-jade-purple text-jade-cream px-4 py-2 rounded-lg hover:bg-jade-light hover:text-jade-purple transition-colors">
            <Plus size={20} />
            <span>New Campaign</span>
          </button>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {campaigns.map((campaign) => {
          const statusColor = getStatusColor(campaign.status);
          
          return (
            <div key={campaign.id} className="bg-white rounded-lg shadow-md border border-jade-light overflow-hidden">
              {/* Campaign Header */}
              <div className="bg-gradient-to-r from-jade-purple/5 to-jade-light/10 px-6 py-4 border-b border-jade-light">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-2xl font-bold text-jade-purple">{campaign.name}</h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${statusColor.bg} ${statusColor.text}`}>
                        {statusColor.icon} {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{campaign.period}</p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="flex items-center space-x-3 text-sm text-gray-700">
                  <Calendar size={16} />
                  <span>
                    {new Date(campaign.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    {' '}—{' '}
                    {new Date(campaign.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Campaign Details */}
              <div className="p-6 space-y-6">
                {/* Notes */}
                <div>
                  <h4 className="font-semibold text-jade-purple mb-2">Overview</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">{campaign.notes}</p>
                </div>

                {/* Content Types */}
                <div>
                  <h4 className="font-semibold text-jade-purple mb-3">Content Channels</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(campaign.content).map(([channel, included]) => (
                      <div
                        key={channel}
                        className={`p-3 rounded-lg text-center border-2 transition-all ${
                          included
                            ? 'border-jade-purple bg-jade-purple/5'
                            : 'border-gray-300 bg-gray-50 opacity-50'
                        }`}
                      >
                        <div className="flex items-center justify-center mb-1">
                          {included ? (
                            <CheckCircle2 size={20} className="text-jade-purple" />
                          ) : (
                            <Target size={20} className="text-gray-400" />
                          )}
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {channel === 'socialMedia' && 'Social Media'}
                          {channel === 'metaAds' && 'Meta Ads'}
                          {channel === 'email' && 'Email'}
                          {channel === 'blog' && 'Blog'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Milestones */}
                <div>
                  <h4 className="font-semibold text-jade-purple mb-3">Key Milestones & Deadlines</h4>
                  <div className="space-y-2">
                    {campaign.milestones.map((milestone, idx) => (
                      <div key={idx} className="flex items-start space-x-3 p-3 bg-jade-cream/50 rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-jade-purple text-jade-cream flex items-center justify-center flex-shrink-0 text-sm font-bold">
                          {idx + 1}
                        </div>
                        <p className="text-gray-700 flex-1">{milestone}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button className="flex-1 bg-jade-purple text-jade-cream px-4 py-2 rounded-lg hover:bg-jade-light hover:text-jade-purple transition-colors font-medium">
                    View Details
                  </button>
                  <button className="flex-1 bg-jade-cream text-jade-purple px-4 py-2 rounded-lg hover:bg-jade-light transition-colors font-medium border border-jade-purple">
                    Edit Campaign
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Future Campaign Placeholder */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-md border-2 border-dashed border-gray-300 p-6 text-center">
          <Plus size={40} className="mx-auto mb-3 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-700 mb-1">Ready to Launch Another Campaign?</h3>
          <p className="text-sm text-gray-600 mb-4">Add new campaigns as needed for content, seasonal promotions, or product launches.</p>
          <button className="bg-jade-purple text-jade-cream px-6 py-2 rounded-lg hover:bg-jade-light hover:text-jade-purple transition-colors font-medium">
            Create New Campaign
          </button>
        </div>
      </div>
    </div>
  );
}
