'use client';

import { ContentItem } from '@/lib/contentStore';

interface TimelineStage {
  name: string;
  date?: string;
  completed: boolean;
  current: boolean;
  notes?: string;
  waitingOn?: string;
}

interface ContentTimelineProps {
  item: ContentItem;
}

export default function ContentWorkflowTimeline({ item }: ContentTimelineProps) {
  const stages: TimelineStage[] = [
    {
      name: 'Created',
      date: item.createdAt,
      completed: !!item.createdAt,
      current: false,
    },
    {
      name: 'Due for Review',
      date: item.reviewDueDate,
      completed: ['Due for Review', 'Feedback Given', 'Ready to Film', 'Filmed', 'Scheduled', 'Posted'].includes(item.status),
      current: item.status === 'Due for Review',
      waitingOn: item.waitingOn === 'felicia' ? 'Felicia reviewing...' : undefined,
    },
    {
      name: 'Feedback Given',
      date: item.feedbackDate,
      completed: ['Feedback Given', 'Ready to Film', 'Filmed', 'Scheduled', 'Posted'].includes(item.status),
      current: item.status === 'Feedback Given',
      notes: item.feedback,
      waitingOn: item.waitingOn === 'you' ? 'Awaiting revision...' : undefined,
    },
    {
      name: 'Revised',
      date: item.revisionDate,
      completed: !!item.revisionDate,
      current: false,
    },
    {
      name: 'Approved',
      date: item.approvedAt,
      completed: ['Ready to Film', 'Filmed', 'Scheduled', 'Posted'].includes(item.status),
      current: item.status === 'Ready to Film',
      waitingOn: item.waitingOn === 'felicia' ? 'Felicia approved!' : undefined,
    },
    {
      name: 'Filmed',
      date: item.filmedAt,
      completed: ['Filmed', 'Scheduled', 'Posted'].includes(item.status),
      current: item.status === 'Filmed',
    },
    {
      name: 'Scheduled',
      date: item.scheduledAt,
      completed: ['Scheduled', 'Posted'].includes(item.status),
      current: item.status === 'Scheduled',
    },
    {
      name: 'Posted',
      date: item.postedAt,
      completed: item.status === 'Posted',
      current: item.status === 'Posted',
    },
  ];

  return (
    <div className="py-6">
      <h3 className="text-lg font-bold text-jade-purple mb-6">📊 Workflow Timeline</h3>

      {/* Timeline Visual */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-6 top-0 bottom-0 w-1 bg-jade-light"></div>

        {/* Timeline Steps */}
        <div className="space-y-6">
          {stages.map((stage, index) => (
            <div key={stage.name} className="relative pl-20">
              {/* Timeline Dot */}
              <div
                className={`absolute left-0 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all ${
                  stage.completed
                    ? 'bg-green-100 border-green-500 text-green-700'
                    : stage.current
                    ? 'bg-blue-100 border-blue-500 text-blue-700 animate-pulse'
                    : 'bg-gray-100 border-gray-300 text-gray-400'
                }`}
              >
                {stage.completed ? '✅' : stage.current ? '→' : '○'}
              </div>

              {/* Content */}
              <div
                className={`p-4 rounded-lg border-2 transition-all ${
                  stage.current
                    ? 'border-blue-300 bg-blue-50'
                    : stage.completed
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4
                    className={`font-bold text-base ${
                      stage.completed
                        ? 'text-green-700'
                        : stage.current
                        ? 'text-blue-700'
                        : 'text-gray-600'
                    }`}
                  >
                    {stage.name}
                  </h4>
                  {stage.waitingOn && (
                    <span className="text-xs font-semibold text-blue-700 bg-blue-200 px-2 py-1 rounded">
                      {stage.waitingOn}
                    </span>
                  )}
                </div>

                {stage.date && (
                  <p className="text-sm text-gray-700 mb-2">
                    <span className="font-semibold">Date:</span>{' '}
                    {new Date(stage.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                )}

                {stage.notes && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-sm text-yellow-800 mt-2">
                    <p className="font-semibold mb-1">💬 Notes:</p>
                    <p>{stage.notes}</p>
                  </div>
                )}

                {!stage.completed && !stage.current && (
                  <p className="text-xs text-gray-500 italic">Pending...</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Handoff Information */}
      <div className="mt-8 p-4 bg-jade-cream/50 border-2 border-jade-light rounded-lg">
        <h4 className="font-bold text-jade-purple mb-3">🤝 Handoff Info</h4>
        <div className="space-y-2 text-sm">
          {item.waitingOn === 'felicia' && (
            <p>
              ⏳ <strong>Waiting on Felicia:</strong> Next action required from Felicia
            </p>
          )}
          {item.waitingOn === 'you' && (
            <p>
              ⏳ <strong>Waiting on You:</strong> You need to take the next action
            </p>
          )}
          {!item.waitingOn && item.status === 'Posted' && (
            <p>
              ✅ <strong>Complete:</strong> This piece has been published!
            </p>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-3 pt-3 border-t border-jade-light">
          <p className="text-xs text-gray-600">
            <strong>Current Status:</strong> {item.status}
          </p>
          <p className="text-xs text-gray-600">
            <strong>Review Status:</strong>{' '}
            {item.reviewStatus === 'needs-review'
              ? '⚠️ Needs Review'
              : item.reviewStatus === 'approved'
              ? '✅ Approved'
              : item.reviewStatus === 'changes-requested'
              ? '🔄 Changes Requested'
              : '⏳ Pending'}
          </p>
        </div>
      </div>
    </div>
  );
}
