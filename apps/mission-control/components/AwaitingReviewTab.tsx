'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { awaitingReviewStore, AwaitingReviewItem } from '../lib/awaitingReviewStore';

const STATUS_CONFIG = {
  'ready-for-review': {
    label: '🔍 Ready for Review',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    icon: AlertCircle,
  },
  'feedback-given': {
    label: '💬 Feedback Given',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    icon: Clock,
  },
  'pending-decision': {
    label: '⏳ Pending Decision',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    icon: Clock,
  },
  'approved': {
    label: '✅ Approved',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
    icon: CheckCircle2,
  },
};

export default function AwaitingReviewTab() {
  const [items, setItems] = useState<AwaitingReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
    const loaded = awaitingReviewStore.getItems();
    setItems(loaded);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'awaiting-review-items-v1') {
        const updated = awaitingReviewStore.getItems();
        setItems(updated);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleApprove = (id: string) => {
    awaitingReviewStore.approve(id);
    const updated = awaitingReviewStore.getItems();
    setItems(updated);
  };

  const handleDismiss = (id: string) => {
    awaitingReviewStore.removeItem(id);
    const updated = awaitingReviewStore.getItems();
    setItems(updated);
  };

  // Group by status for overview
  const readyCount = awaitingReviewStore.getCountByStatus('ready-for-review');
  const decisionCount = awaitingReviewStore.getCountByStatus('pending-decision');
  const feedbackCount = awaitingReviewStore.getCountByStatus('feedback-given');

  return (
    <div className="space-y-6">
      {/* Header with quick count */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-xl font-bold text-blue-700 mb-2">Awaiting Your Review</h2>
        <div className="flex gap-4 text-sm">
          {readyCount > 0 && (
            <span className="flex items-center gap-1 text-blue-600 font-semibold">
              <AlertCircle size={16} /> {readyCount} ready for review
            </span>
          )}
          {decisionCount > 0 && (
            <span className="flex items-center gap-1 text-purple-600 font-semibold">
              <Clock size={16} /> {decisionCount} pending decision
            </span>
          )}
          {feedbackCount > 0 && (
            <span className="flex items-center gap-1 text-amber-600 font-semibold">
              <Clock size={16} /> {feedbackCount} feedback given
            </span>
          )}
          {items.length === 0 && (
            <span className="text-gray-500 italic">All clear! Nothing awaiting your attention.</span>
          )}
        </div>
      </div>

      {/* Items list */}
      {items.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle2 size={48} className="mx-auto mb-4 text-green-300" />
          <p className="text-gray-600 font-semibold">Nothing awaiting review</p>
          <p className="text-gray-500 text-sm mt-1">When there's something that needs your attention, it'll appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => {
            const config = STATUS_CONFIG[item.status];
            const Icon = config.icon;
            const priorityIndicator = item.priority === 'high' ? '🔴' : item.priority === 'low' ? '⚪' : '🟡';

            return (
              <div key={item.id} className={`border rounded-lg p-4 ${config.bgColor} ${config.borderColor} border-l-4`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    {/* Header: Priority + Topic + Item Name */}
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm">{priorityIndicator}</span>
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{item.topic}</span>
                      <span className="text-xs px-2 py-1 bg-white bg-opacity-60 rounded text-gray-700 font-medium">
                        {item.status === 'ready-for-review' && '🔍 Ready for Review'}
                        {item.status === 'feedback-given' && '💬 Feedback Given'}
                        {item.status === 'pending-decision' && '⏳ Pending Decision'}
                        {item.status === 'approved' && '✅ Approved'}
                        {item.statusLabel || ''}
                      </span>
                    </div>

                    {/* Item name - main text */}
                    <h3 className={`font-semibold text-lg ${config.textColor} mb-2`}>
                      {item.itemName}
                    </h3>

                    {/* Description if provided */}
                    {item.description && (
                      <p className="text-sm text-gray-700 mb-2">{item.description}</p>
                    )}

                    {/* Link to full detail */}
                    {item.linkPath && (
                      <div className="mt-2">
                        <a
                          href={item.linkPath}
                          className={`inline-flex items-center gap-1 text-sm font-medium transition ${config.textColor} hover:underline`}
                        >
                          {item.linkLabel || 'View details'} <ChevronRight size={14} />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {item.status !== 'approved' && (
                      <>
                        {item.status === 'ready-for-review' && (
                          <button
                            onClick={() => handleApprove(item.id)}
                            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded transition"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => handleDismiss(item.id)}
                          className="px-3 py-1 bg-gray-300 hover:bg-gray-400 text-gray-700 text-sm font-semibold rounded transition"
                        >
                          Dismiss
                        </button>
                      </>
                    )}
                    {item.status === 'approved' && (
                      <button
                        onClick={() => handleDismiss(item.id)}
                        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-600 text-sm font-semibold rounded transition"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                {/* Due date if set */}
                {item.dueDate && (
                  <div className="mt-2 text-xs text-gray-600">
                    Due: {new Date(item.dueDate).toLocaleDateString('en-AU')}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
