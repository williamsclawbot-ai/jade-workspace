'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { overnightReviewStore, OvernightWorkItem } from '../lib/overnightReviewStore';
import { awaitingReviewStore } from '../lib/awaitingReviewStore';

const CATEGORY_CONFIG: Record<string, { label: string; emoji: string; color: string }> = {
  'bug-fix': { label: 'Bug Fix', emoji: '🐛', color: 'text-red-700' },
  'content': { label: 'Content', emoji: '✍️', color: 'text-blue-700' },
  'automation': { label: 'Automation', emoji: '⚙️', color: 'text-gray-700' },
  'analysis': { label: 'Analysis', emoji: '📊', color: 'text-green-700' },
  'build': { label: 'Build', emoji: '🔨', color: 'text-amber-700' },
  'feature': { label: 'Feature', emoji: '✨', color: 'text-purple-700' },
  'other': { label: 'Other', emoji: '📝', color: 'text-gray-700' },
};

const STATUS_ICON: Record<string, string> = {
  'done': '✅',
  'needs-review': '🔍',
  'needs-decision': '⏳',
};

export default function OvernightReviewTab() {
  const [itemsByDate, setItemsByDate] = useState<Record<string, OvernightWorkItem[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
    const loaded = overnightReviewStore.getItemsByDate();
    setItemsByDate(loaded);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'overnight-review-items-v1') {
        const updated = overnightReviewStore.getItemsByDate();
        setItemsByDate(updated);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const needsAttention = overnightReviewStore.getItemsNeedingAttention();
  const totalItems = Object.values(itemsByDate).flat().length;

  const handleAddToReview = (item: OvernightWorkItem) => {
    // Add to Awaiting Review if it needs attention
    if (item.status !== 'done') {
      awaitingReviewStore.addItem({
        itemName: item.taskName,
        topic: item.category || 'Work',
        description: item.summary,
        linkLabel: 'View overnight work',
        linkPath: '#overnight', // Links back to this tab
        status: item.status === 'needs-review' ? 'ready-for-review' : 'pending-decision',
        priority: 'normal',
      });
      alert('✅ Added to Awaiting Review');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4">
        <h2 className="text-xl font-bold text-indigo-700 mb-2">Overnight Work Review</h2>
        <p className="text-sm text-indigo-600 mb-3">
          Work completed while you're away. Organized by date for easy morning scanning.
        </p>
        <div className="flex gap-4 text-sm">
          <span className="text-gray-700">
            <strong>{totalItems}</strong> {totalItems === 1 ? 'task' : 'tasks'} logged
          </span>
          {needsAttention.length > 0 && (
            <span className="flex items-center gap-1 text-amber-700 font-semibold">
              <AlertCircle size={16} /> {needsAttention.length} needs attention
            </span>
          )}
        </div>
      </div>

      {/* Items by date */}
      {totalItems === 0 ? (
        <div className="text-center py-12">
          <Clock size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-600 font-semibold">No overnight work yet</p>
          <p className="text-gray-500 text-sm mt-1">Work you complete at night will appear here for morning review.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(itemsByDate).map(([dateStr, items]) => {
            const date = new Date(dateStr);
            const today = new Date().toISOString().split('T')[0];
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

            let dateLabel = date.toLocaleDateString('en-AU', { weekday: 'short', month: 'short', day: 'numeric' });
            if (dateStr === today) dateLabel += ' (Today)';
            else if (dateStr === yesterday) dateLabel += ' (Yesterday)';

            return (
              <div key={dateStr} className="border-l-4 border-indigo-300 pl-6 space-y-3">
                <h3 className="text-lg font-bold text-gray-800">{dateLabel}</h3>

                <div className="space-y-3">
                  {items.map(item => {
                    const catConfig = CATEGORY_CONFIG[item.category || 'other'];
                    const time = new Date(item.completedAt).toLocaleTimeString('en-AU', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    });

                    return (
                      <div
                        key={item.id}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-sm transition"
                      >
                        {/* Time + Category + Task Name */}
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold text-gray-500 tabular-nums">{time}</span>
                              <span className={`text-sm font-semibold ${catConfig.color}`}>
                                {catConfig.emoji} {catConfig.label}
                              </span>
                            </div>
                            <h4 className="font-semibold text-gray-800 text-base">{item.taskName}</h4>
                          </div>
                          <span className="text-lg">{STATUS_ICON[item.status]}</span>
                        </div>

                        {/* Summary - keep it concise */}
                        <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                          {item.summary}
                        </p>

                        {/* Link to full detail + Status + Actions */}
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            {item.linkPath && (
                              <a
                                href={item.linkPath}
                                className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition"
                              >
                                {item.linkLabel || 'View full detail'} <ChevronRight size={14} />
                              </a>
                            )}
                            {item.status !== 'done' && (
                              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded font-medium">
                                {item.status === 'needs-review' ? '🔍 Review needed' : '⏳ Decision needed'}
                                {item.statusDetail && ` — ${item.statusDetail}`}
                              </span>
                            )}
                          </div>

                          {item.status !== 'done' && (
                            <button
                              onClick={() => handleAddToReview(item)}
                              className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded transition font-semibold"
                            >
                              Add to Review
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-xs font-semibold text-gray-600 mb-2">STATUS MEANINGS:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div>
            <span className="font-semibold text-gray-700">✅ Done</span>
            <p className="text-gray-600 text-xs mt-1">Complete and ready. No action needed.</p>
          </div>
          <div>
            <span className="font-semibold text-gray-700">🔍 Needs Review</span>
            <p className="text-gray-600 text-xs mt-1">Finished but needs your feedback or approval.</p>
          </div>
          <div>
            <span className="font-semibold text-gray-700">⏳ Needs Decision</span>
            <p className="text-gray-600 text-xs mt-1">Built options or analysis. Pick a path forward.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
