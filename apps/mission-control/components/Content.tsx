'use client';

import { useState, useMemo } from 'react';
import { FileText, Plus, Trash2, Filter, Search, Eye, Edit2 } from 'lucide-react';
import { getStatusColor } from '@/lib/statusColors';

interface WeeklyContentItem {
  id: string;
  day: string;
  title: string;
  type: 'Reel' | 'Carousel' | 'Static' | 'Newsletter' | 'Email';
  description: string;
  status: 'Ready to Film' | 'Ready to Schedule' | 'In Progress' | 'Scheduled' | 'Due for Review';
  script?: string;
  caption?: string;
  duration?: string;
  setting?: string;
  postTime?: string;
  reviewStatus?: 'needs-review' | 'approved' | 'changes-requested' | 'pending';
  reviewDueDate?: string;
}

type StatusFilter = 'all' | 'Ready to Film' | 'Ready to Schedule' | 'In Progress' | 'Scheduled' | 'Due for Review';

// Sample data from existing component
const THIS_WEEK_CONTENT: WeeklyContentItem[] = [
  {
    id: '1',
    day: 'Monday',
    title: 'Toddler Pillow',
    type: 'Reel',
    description: 'Quick tip on choosing the right pillow for toddlers',
    status: 'Ready to Film',
    duration: '45 seconds',
    setting: 'Home - nursery room',
    reviewStatus: 'needs-review',
    reviewDueDate: '2026-02-18'
  },
  {
    id: '2',
    day: 'Tuesday',
    title: 'Educational Carousel',
    type: 'Carousel',
    description: 'Sleep myths debunked - 5 common misconceptions',
    status: 'Ready to Schedule',
    duration: '5 slides',
    reviewStatus: 'needs-review',
    reviewDueDate: '2026-02-19'
  },
  {
    id: '3',
    day: 'Wednesday',
    title: 'Harvey Turning 2',
    type: 'Static',
    description: 'Harvey\'s 2nd birthday - personal milestone + sleep tips',
    status: 'Ready to Film',
    reviewStatus: 'approved',
    reviewDueDate: '2026-02-18'
  },
  {
    id: '4',
    day: 'Thursday',
    title: 'Myth-Busting Reel',
    type: 'Reel',
    description: 'Challenging the "cry it out" misconception',
    status: 'In Progress',
    reviewStatus: 'changes-requested',
    reviewDueDate: '2026-02-20'
  },
  {
    id: '5',
    day: 'Friday',
    title: 'Weekly Roundup',
    type: 'Newsletter',
    description: 'Best of the week - curated sleep tips',
    status: 'Scheduled',
    reviewStatus: 'approved',
  },
  {
    id: '6',
    day: 'Saturday',
    title: 'Parent Win Celebration',
    type: 'Reel',
    description: 'Celebrate small parenting wins from community',
    status: 'Due for Review',
    reviewStatus: 'pending',
  },
];

const CURATED_IDEAS_BY_THEME = {
  'Sleep Science & Myths': [
    { topic: 'Sleep Myths Debunked', description: 'Debunk common sleep myths with science-backed information', useCase: 'Instagram Reels, Blog post, TikTok' },
    { topic: 'Sleep Architecture', description: 'Explain REM vs NREM sleep cycles for babies and toddlers', useCase: 'Blog, Newsletter, Video content' },
    { topic: 'Circadian Rhythm Basics', description: 'How natural light affects baby sleep patterns', useCase: 'Educational carousel, Instagram post' },
  ],
  'Parent Wins & Stories': [
    { topic: 'Success Stories', description: 'Real parent transformations from sleep struggles to success', useCase: 'Before/after reels, testimonial videos' },
    { topic: 'Parent Wins Celebration', description: 'Celebrate small parenting wins to build community', useCase: 'Instagram stories, TikTok duets' },
  ],
  'Quick Tips & Hacks': [
    { topic: 'Wind-Down Routine Tips', description: 'Quick 30-second tips for bedtime routines', useCase: 'Instagram carousel, TikTok, Pinterest' },
    { topic: 'Sleep Hacks', description: '3-5 minute practical strategies parents can use today', useCase: 'Short-form video, Instagram captions' },
  ],
};

export default function ContentRefactored() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredContent = useMemo(() => {
    return THIS_WEEK_CONTENT.filter(item => {
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.day.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [statusFilter, searchQuery]);

  const statusCounts = useMemo(() => {
    return {
      'Ready to Film': THIS_WEEK_CONTENT.filter(c => c.status === 'Ready to Film').length,
      'Ready to Schedule': THIS_WEEK_CONTENT.filter(c => c.status === 'Ready to Schedule').length,
      'In Progress': THIS_WEEK_CONTENT.filter(c => c.status === 'In Progress').length,
      'Scheduled': THIS_WEEK_CONTENT.filter(c => c.status === 'Scheduled').length,
      'Due for Review': THIS_WEEK_CONTENT.filter(c => c.status === 'Due for Review').length,
    };
  }, []);

  const getReviewBadge = (status?: string) => {
    const icons: Record<string, string> = {
      'needs-review': '⚠️',
      'approved': '✅',
      'changes-requested': '🔄',
      'pending': '⏳',
    };
    return icons[status || 'pending'] || '⏳';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-jade-purple mb-2">📹 Content</h2>
        <p className="text-gray-600">Plan, create, and schedule your weekly content.</p>
      </div>

      {/* THIS WEEK TAB - PRIMARY VIEW */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">This Week's Content</h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-jade-purple text-white rounded-lg hover:bg-jade-purple/90">
            <Plus size={18} /> Add Content
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="space-y-3">
          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by day, title, or description..."
              className="w-full pl-10 pr-4 py-2 border border-jade-light rounded-lg focus:ring-2 focus:ring-jade-purple focus:border-transparent"
            />
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                statusFilter === 'all'
                  ? 'bg-jade-purple text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({THIS_WEEK_CONTENT.length})
            </button>

            {(Object.entries(statusCounts) as [StatusFilter, number][]).map(([status, count]) => {
              const colors = getStatusColor(status);
              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    statusFilter === status
                      ? `${colors.badge} ring-2 ring-offset-2 ring-jade-purple`
                      : `${colors.bg} ${colors.text} hover:opacity-80`
                  }`}
                >
                  {status} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredContent.length > 0 ? (
            filteredContent.map(item => {
              const statusColors = getStatusColor(item.status);
              const isExpanded = expandedId === item.id;

              return (
                <div
                  key={item.id}
                  className={`border-2 rounded-lg p-4 transition-all ${statusColors.border} ${statusColors.bg}`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-gray-500 uppercase">{item.day}</span>
                        <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-700 rounded">
                          {item.type}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900">{item.title}</h4>
                    </div>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className="p-1.5 hover:bg-white/50 rounded"
                    >
                      {isExpanded ? '▲' : '▼'}
                    </button>
                  </div>

                  {/* Status Badges */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors.badge}`}>
                      {item.status}
                    </span>
                    {item.reviewStatus && (
                      <span className="text-lg" title={item.reviewStatus}>
                        {getReviewBadge(item.reviewStatus)}
                      </span>
                    )}
                    {item.reviewDueDate && (
                      <span className="text-xs text-gray-500">Due: {item.reviewDueDate}</span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-700 mb-3">{item.description}</p>

                  {/* Metadata */}
                  <div className="text-xs text-gray-600 space-y-1 mb-3">
                    {item.duration && <div>📹 Duration: {item.duration}</div>}
                    {item.setting && <div>📍 Setting: {item.setting}</div>}
                    {item.postTime && <div>🕐 Post Time: {item.postTime}</div>}
                  </div>

                  {/* Expanded View - Script/Caption */}
                  {isExpanded && (
                    <div className="border-t pt-3 space-y-2 mb-3">
                      {item.script && (
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-1">Script:</p>
                          <p className="text-xs text-gray-700 line-clamp-4">{item.script}</p>
                        </div>
                      )}
                      {item.caption && (
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-1">Caption:</p>
                          <p className="text-xs text-gray-700 line-clamp-4">{item.caption}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50">
                      <Eye size={14} /> View
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50">
                      <Edit2 size={14} /> Edit
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-2 text-center py-12">
              <p className="text-gray-500">
                {searchQuery ? 'No content matches your search.' : 'No content yet. Add one to get started!'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* IDEAS QUICK ACCESS */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">💡 Ideas (Quick Access)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(CURATED_IDEAS_BY_THEME).map(([theme, ideas]) => (
            <div key={theme} className="border border-jade-light rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-jade-purple mb-3">{theme}</h4>
              <div className="space-y-2">
                {ideas.map((idea, idx) => (
                  <div key={idx} className="text-sm p-2 bg-gray-50 rounded hover:bg-jade-light transition-colors cursor-pointer">
                    <p className="font-medium text-gray-900">{idea.topic}</p>
                    <p className="text-gray-600 text-xs">{idea.description}</p>
                    <button className="text-xs text-jade-purple font-semibold mt-1 hover:underline">
                      + Add to This Week
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Weekly Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white border border-jade-light rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-jade-purple">{THIS_WEEK_CONTENT.length}</p>
          </div>
          {(Object.entries(statusCounts) as [StatusFilter, number][]).map(([status, count]) => {
            const colors = getStatusColor(status);
            return (
              <div key={status} className={`rounded-lg p-4 text-center ${colors.bg}`}>
                <p className={`text-sm ${colors.text}`}>{status}</p>
                <p className={`text-2xl font-bold ${colors.text}`}>{count}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
