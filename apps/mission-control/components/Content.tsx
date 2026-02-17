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

// Real content pipeline data
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
    script: 'Hook: "Does your toddler refuse to use a pillow?"\n\nContent: "Here\'s the thing - toddlers under 2 shouldn\'t have pillows at all. It\'s a safety thing. But I know what you\'re thinking - my kid\'s thrashing around and looks super uncomfortable.\n\nHere\'s the safe sleep setup:\n- Under 2 years: NO pillows, NO blankets, just a fitted sheet\n- 2-3 years: You can introduce a pillow NOW, but keep it FLAT and FIRM\n- Over 3: Regular pillow, but keep it simple\n\nWhat helps comfort instead? A lovey or stuffed animal they can snuggle."\n\nCTA: "What\'s your toddler sleep hack? Drop it below!"',
    reviewStatus: 'needs-review',
    reviewDueDate: '2026-02-18'
  },
  {
    id: '2',
    day: 'Tuesday',
    title: 'Educational Carousel',
    type: 'Carousel',
    description: '5 sleep myths debunked with science-backed facts',
    status: 'Ready to Schedule',
    duration: '5 slides',
    setting: 'Graphic design',
    script: 'Slide 1: 5 Sleep Myths That Are Keeping You Stuck\n\nSlide 2: MYTH: More tired = better sleep\nFACT: Overtired babies sleep WORSE\n\nSlide 3: MYTH: Skip naps so they sleep at night\nFACT: Naps regulate cortisol (stress hormone)\n\nSlide 4: MYTH: Feed more at night = longer sleep\nFACT: Sleep is about circadian rhythm, not calories\n\nSlide 5: MYTH: Later bedtime = sleeping in\nFACT: Kids wake at natural times regardless\n\nSlide 6: MYTH: Some babies just don\'t sleep\nFACT: All babies have sleep potential - something\'s fixable',
    reviewStatus: 'needs-review',
    reviewDueDate: '2026-02-19'
  },
  {
    id: '3',
    day: 'Wednesday',
    title: 'Harvey Turning 2',
    type: 'Static',
    description: 'Harvey\'s 2nd birthday - personal milestone + sleep journey',
    status: 'Ready to Film',
    setting: 'Home - with Harvey',
    postTime: '5:00 PM',
    script: 'Harvey is TWO and I honestly can\'t believe it.\n\nTwo years ago, I was sleep-deprived, questioning everything, wondering if I was doing it right.\n\nFrom a newborn who woke every 2 hours to a toddler who sleeps 11-12 hours solid at night? That\'s not luck. That\'s consistency, patience, and understanding that sleep is a skill.\n\nTo the parents in the thick of it: You\'ve got this. It doesn\'t feel like it now, but two years goes fast. 🤍',
    caption: 'Harvey is TWO! 🎂\n\nFrom waking every 2 hours to sleeping 11-12 hours solid. That\'s not luck - that\'s consistency and understanding sleep as a skill.',
    reviewStatus: 'approved',
    reviewDueDate: '2026-02-18'
  },
  {
    id: '4',
    day: 'Thursday',
    title: 'Myth-Busting Reel',
    type: 'Reel',
    description: 'Challenging the "cry it out" misconception - gentle alternatives',
    status: 'In Progress',
    duration: '50 seconds',
    setting: 'Home - bedroom / nursery',
    script: 'Hook (0-3 sec): "Your pediatrician said let them cry? Here\'s what she probably meant..."\n\nContent: "There\'s a HUGE difference between:\n\n❌ Ignoring your baby for hours\n✅ Teaching them to fall asleep independently while you\'re present and responsive\n\nYou can be gentle AND set boundaries. You can be responsive AND help them learn.\n\nMethod matters WAY more than belief."\n\nCTA: "What scares you most about sleep independence?"',
    postTime: '7:30 PM',
    reviewStatus: 'changes-requested',
    reviewDueDate: '2026-02-20'
  },
  {
    id: '5',
    day: 'Friday',
    title: 'Monthly Sleep Guidelines',
    type: 'Static',
    description: 'Age-specific sleep needs and schedules by month',
    status: 'In Progress',
    duration: 'Reference infographic',
    setting: 'Detailed reference design',
    postTime: '10:00 AM',
    script: 'HOW MUCH SLEEP DOES YOUR BABY ACTUALLY NEED?\n\n0-3 MONTHS: 16-17 hours (fragmented, all night)\n4-6 MONTHS: 15-16 hours (patterns emerging)\n7-12 MONTHS: 14-15 hours (consolidation)\n1-2 YEARS: 13-14 hours (schedule developing)\n2-3 YEARS: 12-13 hours (nap + night)\n\nMost important: Watch YOUR BABY\'s mood and energy - that tells you more than any chart. Overtired babies sleep WORSE.',
    caption: 'HOW MUCH SLEEP DOES YOUR BABY ACTUALLY NEED? 📌 SAVE THIS.',
    reviewStatus: 'needs-review',
    reviewDueDate: '2026-02-21'
  },
  {
    id: '6',
    day: 'Saturday',
    title: 'Sample Schedule Static',
    type: 'Static',
    description: 'Real example: What a realistic 6-month-old schedule looks like',
    status: 'Ready to Schedule',
    duration: 'Sample schedule post',
    setting: 'Daily routine visual',
    postTime: '6:00 PM',
    script: 'WHAT A REALISTIC 6-MONTH-OLD SCHEDULE LOOKS LIKE\n\n6:00 AM - Wake & feed\n7:00-8:30 AM - NAP #1 (90 min)\n10:30-12:00 PM - NAP #2 (90 min)\n2:00-3:30 PM - NAP #3 (90 min)\n6:00-7:00 PM - Bedtime routine\n7:00 PM - Lights out\n\nTotal: 11 hours nighttime + 4.5 hours naps = 15.5 hours\n\nKey: Wake windows matter more than clock times.',
    caption: 'THIS IS WHAT A REALISTIC 6-MONTH-OLD SCHEDULE LOOKS LIKE ✨',
    reviewStatus: 'approved',
    reviewDueDate: '2026-02-20'
  },
  {
    id: '7',
    day: 'Sunday',
    title: 'Soft Sell: 3 Options',
    type: 'Reel',
    description: 'Community connection - ask followers about their biggest sleep struggle',
    status: 'Ready to Film',
    duration: '45 seconds',
    setting: 'Home - casual',
    postTime: '7:30 PM',
    script: 'Option 1: "Real talk - what\'s ACTUALLY harder for you? Bedtime battles? Or night wakings? The solution is SO different."\n\nOption 2: "Between schedule stress and actual behavior problems... which one keeps you up at night?"\n\nOption 3: "First month survival mode? Or first year frustration?"\n\nCTA: "Comment below. Tell me which one is YOU."',
    caption: 'Real talk: What\'s YOUR biggest sleep challenge right now? 🤔',
    reviewStatus: 'changes-requested',
    reviewDueDate: '2026-02-22'
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
  const [selectedContent, setSelectedContent] = useState<WeeklyContentItem | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState<Partial<WeeklyContentItem>>({});

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

        {/* Add Content Button Handler */}
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
                    <button 
                      onClick={() => setSelectedContent(item)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 transition-colors"
                    >
                      <Eye size={14} /> View
                    </button>
                    <button 
                      onClick={() => setSelectedContent(item)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 transition-colors"
                    >
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

      {/* Content Detail Modal */}
      {selectedContent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">{editedContent.title || selectedContent.title}</h3>
              <button
                onClick={() => {
                  setSelectedContent(null);
                  setEditMode(false);
                  setEditedContent({});
                }}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>
            
            <div className="p-8">
              {!editMode ? (
                // View Mode
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase mb-1">Day</p>
                      <p className="font-semibold">{selectedContent.day}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase mb-1">Type</p>
                      <p className="font-semibold">{selectedContent.type}</p>
                    </div>
                  </div>

                  {selectedContent.script && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase mb-2 font-semibold">Script</p>
                      <div className="bg-gray-50 p-4 rounded border border-gray-200 whitespace-pre-wrap text-sm text-gray-700 max-h-48 overflow-y-auto">
                        {selectedContent.script}
                      </div>
                    </div>
                  )}

                  {selectedContent.caption && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase mb-2 font-semibold">Caption</p>
                      <div className="bg-gray-50 p-4 rounded border border-gray-200 whitespace-pre-wrap text-sm text-gray-700 max-h-48 overflow-y-auto">
                        {selectedContent.caption}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 border-t pt-6">
                    <button 
                      onClick={() => {
                        setEditMode(true);
                        setEditedContent({...selectedContent});
                      }}
                      className="flex-1 px-4 py-2 bg-jade-purple text-white rounded-lg hover:bg-jade-purple/90 font-medium"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => setSelectedContent(null)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                // Edit Mode
                <div className="space-y-6">
                  {/* 6 Content Boxes Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    {/* Hook */}
                    <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
                      <p className="text-sm font-bold text-red-700 mb-3">📢 HOOK</p>
                      <textarea
                        value={(editedContent as any).script?.split('\n')[0] || ''}
                        onChange={(e) => setEditedContent({...editedContent, script: e.target.value} as any)}
                        className="w-full h-32 p-3 border border-red-300 rounded bg-white text-sm resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Hook text..."
                      />
                    </div>

                    {/* Setting */}
                    <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
                      <p className="text-sm font-bold text-red-700 mb-3">📍 SETTING</p>
                      <textarea
                        value={(editedContent as any).setting || ''}
                        onChange={(e) => setEditedContent({...editedContent, setting: e.target.value} as any)}
                        className="w-full h-32 p-3 border border-red-300 rounded bg-white text-sm resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Setting details..."
                      />
                    </div>

                    {/* Script */}
                    <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
                      <p className="text-sm font-bold text-red-700 mb-3">📋 SCRIPT</p>
                      <textarea
                        value={(editedContent as any).script || ''}
                        onChange={(e) => setEditedContent({...editedContent, script: e.target.value} as any)}
                        className="w-full h-32 p-3 border border-red-300 rounded bg-white text-sm resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Full script..."
                      />
                    </div>

                    {/* On Screen Hook Text */}
                    <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
                      <p className="text-sm font-bold text-red-700 mb-3">📺 ON SCREEN HOOK TEXT</p>
                      <textarea
                        value={(editedContent as any).onScreenText || ''}
                        onChange={(e) => setEditedContent({...editedContent, onScreenText: e.target.value} as any)}
                        className="w-full h-32 p-3 border border-red-300 rounded bg-white text-sm resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="On screen text..."
                      />
                    </div>

                    {/* On Screen Text */}
                    <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
                      <p className="text-sm font-bold text-red-700 mb-3">💬 ON SCREEN TEXT</p>
                      <textarea
                        value={(editedContent as any).onScreenText || ''}
                        onChange={(e) => setEditedContent({...editedContent, onScreenText: e.target.value} as any)}
                        className="w-full h-32 p-3 border border-red-300 rounded bg-white text-sm resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Additional on-screen text..."
                      />
                    </div>

                    {/* Caption */}
                    <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
                      <p className="text-sm font-bold text-red-700 mb-3">💭 CAPTION</p>
                      <textarea
                        value={(editedContent as any).caption || ''}
                        onChange={(e) => setEditedContent({...editedContent, caption: e.target.value} as any)}
                        className="w-full h-32 p-3 border border-red-300 rounded bg-white text-sm resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Post caption..."
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 border-t pt-6">
                    <button 
                      onClick={() => {
                        // Save changes (in real app, would update data)
                        setEditMode(false);
                      }}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                    >
                      ✅ Save Changes
                    </button>
                    <button 
                      onClick={() => {
                        setEditMode(false);
                        setEditedContent({});
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
