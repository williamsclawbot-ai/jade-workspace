'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle, Clock, BookOpen } from 'lucide-react';

interface Guide {
  id: string;
  name: string;
  category: string;
  progress: number;
  currentStage: string;
  nextAction: string;
  blocker?: string;
  stages: { name: string; status: 'completed' | 'current' | 'pending' }[];
  details?: string;
}

export default function GuidePipeline() {
  const [guides, setGuides] = useState<Guide[]>([
    {
      id: 'sleep-5-18',
      name: '5-18 Month Sleep Guide',
      category: 'KEY PRODUCT',
      progress: 80,
      currentStage: 'Writing',
      nextAction: 'Complete writing by Feb 24, then hand off to design',
      blocker: undefined,
      stages: [
        { name: 'Writing', status: 'current' },
        { name: 'Design', status: 'pending' },
        { name: 'GHL', status: 'pending' },
        { name: 'Launch', status: 'pending' },
      ],
      details: 'Core product — critical for launch. On track for Feb 28 design handoff.',
    },
    {
      id: 'bridging-4-5',
      name: '4-5 Month Bridging Guide',
      category: 'PRODUCT',
      progress: 15,
      currentStage: 'Find Draft',
      nextAction: 'Locate existing draft, review for updates',
      blocker: undefined,
      stages: [
        { name: 'Find Draft', status: 'current' },
        { name: 'Design', status: 'pending' },
        { name: 'GHL', status: 'pending' },
        { name: 'Launch', status: 'pending' },
      ],
      details: 'Bridge between newborn and toddler content. Start after 5-18 Month launch.',
    },
    {
      id: 'toddler-18-3yr',
      name: '18 Month – 3 Year Toddler Guide',
      category: 'PRODUCT',
      progress: 10,
      currentStage: 'Find Draft',
      nextAction: 'Search archives for existing toddler guide content',
      blocker: undefined,
      stages: [
        { name: 'Find Draft', status: 'current' },
        { name: 'Design', status: 'pending' },
        { name: 'GHL', status: 'pending' },
        { name: 'Launch', status: 'pending' },
      ],
      details: 'Complete the sleep guide trilogy. Lower priority until core products ship.',
    },
    {
      id: 'newborn',
      name: 'Newborn Guide',
      category: 'PRODUCT',
      progress: 35,
      currentStage: 'Review',
      nextAction: 'Review existing guide, decide on redesign scope',
      blocker: undefined,
      stages: [
        { name: 'Review', status: 'current' },
        { name: 'Redesign', status: 'pending' },
        { name: 'Bundle', status: 'pending' },
        { name: 'Launch', status: 'pending' },
      ],
      details: 'Update existing content. Could bundle with other guides for higher perceived value.',
    },
    {
      id: 'sample-schedules',
      name: 'Sample Schedules Guide',
      category: 'PRODUCT',
      progress: 5,
      currentStage: 'Planning',
      nextAction: 'Decide: which age ranges? PDF ebook or premium content?',
      blocker: 'Need to confirm scope (age ranges, format)',
      stages: [
        { name: 'Planning', status: 'current' },
        { name: 'Writing', status: 'pending' },
        { name: 'Design', status: 'pending' },
        { name: 'Launch', status: 'pending' },
      ],
      details: 'PDF ebook with sample schedules. Could be lead magnet or premium upsell.',
    },
  ]);

  const [expandedGuide, setExpandedGuide] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('jade_guides');
    if (saved) {
      setGuides(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('jade_guides', JSON.stringify(guides));
  }, [guides]);

  const handleUpdateProgress = (guideId: string, newProgress: number) => {
    setGuides(guides.map(g => g.id === guideId ? { ...g, progress: newProgress } : g));
  };

  const getProgressColor = (progress: number) => {
    if (progress < 25) return 'bg-red-500';
    if (progress < 50) return 'bg-yellow-500';
    if (progress < 75) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getCategoryColor = (category: string) => {
    if (category === 'KEY PRODUCT') return 'bg-red-100 text-red-800 border border-red-300';
    return 'bg-blue-100 text-blue-800 border border-blue-300';
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="border-b border-jade-light pb-6">
        <h1 className="text-3xl font-bold text-jade-purple mb-2">Product Pipeline</h1>
        <p className="text-gray-600">All guides in one view. Track progress, blockers, and next actions.</p>
      </div>

      {/* Pipeline Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {guides.map((guide) => (
          <div
            key={guide.id}
            className="bg-white rounded-lg shadow-md p-4 border-l-4 border-jade-purple hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setExpandedGuide(expandedGuide === guide.id ? null : guide.id)}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-sm text-jade-purple line-clamp-2">{guide.name}</h3>
              <span className={`text-xs font-semibold px-2 py-1 rounded ${getCategoryColor(guide.category)}`}>
                {guide.category === 'KEY PRODUCT' ? '🔑' : '📘'}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-600">Progress</span>
                <span className="text-sm font-bold text-jade-purple">{guide.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${getProgressColor(guide.progress)}`}
                  style={{ width: `${guide.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Current Stage */}
            <div className="mb-3 pb-3 border-b border-gray-200">
              <p className="text-xs text-gray-600">Current Stage</p>
              <p className="text-sm font-semibold text-gray-800">{guide.currentStage}</p>
            </div>

            {/* Next Action */}
            <div className="flex items-start space-x-2">
              <Clock size={14} className="text-blue-500 mt-1 flex-shrink-0" />
              <p className="text-xs text-gray-700 line-clamp-2">{guide.nextAction}</p>
            </div>

            {/* Blocker Badge */}
            {guide.blocker && (
              <div className="mt-3 flex items-start space-x-2 bg-yellow-50 p-2 rounded border border-yellow-200">
                <AlertCircle size={14} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-yellow-800">{guide.blocker}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Expanded Details */}
      {expandedGuide && (
        <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-jade-purple">
          {guides.find(g => g.id === expandedGuide) && (
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-jade-purple mb-2">
                    {guides.find(g => g.id === expandedGuide)?.name}
                  </h2>
                  <p className="text-gray-600">
                    {guides.find(g => g.id === expandedGuide)?.details}
                  </p>
                </div>
                <button
                  onClick={() => setExpandedGuide(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Detailed Progress */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-jade-purple mb-4">Pipeline Stages</h3>
                <div className="space-y-3">
                  {guides.find(g => g.id === expandedGuide)?.stages.map((stage, idx) => (
                    <div key={idx} className="flex items-center space-x-4">
                      <div className="w-32">
                        <p className="text-sm font-semibold text-gray-800">{stage.name}</p>
                      </div>
                      <div className="flex-1 h-8 bg-gray-200 rounded-lg overflow-hidden">
                        {stage.status === 'completed' && (
                          <div className="h-full bg-green-500 flex items-center justify-center">
                            <CheckCircle size={16} className="text-white" />
                          </div>
                        )}
                        {stage.status === 'current' && (
                          <div className="h-full bg-blue-500 flex items-center justify-center">
                            <Clock size={16} className="text-white animate-pulse" />
                          </div>
                        )}
                        {stage.status === 'pending' && (
                          <div className="h-full bg-gray-300"></div>
                        )}
                      </div>
                      <span className="text-sm text-gray-600 w-20">
                        {stage.status === 'completed' && '✅ Done'}
                        {stage.status === 'current' && '⏳ In Progress'}
                        {stage.status === 'pending' && '⏳ Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Update Overall Progress
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={guides.find(g => g.id === expandedGuide)?.progress || 0}
                    onChange={(e) => handleUpdateProgress(expandedGuide, parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <button className="bg-jade-purple text-jade-cream px-4 py-2 rounded-lg hover:bg-jade-light hover:text-jade-purple transition-colors font-semibold">
                  Update Status
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Decision Section */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle size={24} className="text-yellow-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-bold text-yellow-900 mb-2">Decision Point: Launch Strategy</h3>
            <p className="text-yellow-800 mb-4">
              Should we launch guides one at a time, or wait for the full bundle?
            </p>
            <div className="flex space-x-3">
              <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors font-semibold">
                Launch 5-18 Month First
              </button>
              <button className="bg-white text-yellow-600 border-2 border-yellow-600 px-4 py-2 rounded-lg hover:bg-yellow-50 transition-colors font-semibold">
                Wait for Full Bundle
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
