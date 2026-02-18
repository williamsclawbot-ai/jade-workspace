'use client';

import { useState, useEffect } from 'react';
import { Calendar, Mail, CheckCircle2, AlertCircle, Film, Clock } from 'lucide-react';
import ContentStore, { ContentItem } from '@/lib/contentStore';

interface DayContent {
  day: string;
  date: string;
  content: ContentItem[];
}

export default function WeeklyContentView() {
  const [weekContent, setWeekContent] = useState<DayContent[]>([]);
  const [newsletterData, setNewsletterData] = useState<any>(null);

  useEffect(() => {
    loadWeeklyContent();

    // Reload every second for real-time sync
    const interval = setInterval(loadWeeklyContent, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadWeeklyContent = () => {
    // Get all content
    const allContent = ContentStore.getAll();

    // Get this week's content by day
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const weekData: DayContent[] = days.map((day, index) => {
      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());

      const currentDate = new Date(weekStart);
      currentDate.setDate(weekStart.getDate() + index);

      return {
        day,
        date: currentDate.toISOString().split('T')[0],
        content: allContent.filter(item => item.day === day),
      };
    });

    setWeekContent(weekData);

    // Load newsletter data
    const saved = localStorage.getItem('jadeNewsletterData');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setNewsletterData(data[0]);
      } catch (e) {}
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Due for Review': 'bg-blue-100 text-blue-700 border-blue-300',
      'Ready to Film': 'bg-green-100 text-green-700 border-green-300',
      'Filmed': 'bg-purple-100 text-purple-700 border-purple-300',
      'Scheduled': 'bg-indigo-100 text-indigo-700 border-indigo-300',
      'Posted': 'bg-gray-100 text-gray-700 border-gray-300',
      'Feedback Given': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      'In Progress': 'bg-orange-100 text-orange-700 border-orange-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
      'Due for Review': <AlertCircle size={16} />,
      'Ready to Film': <Film size={16} />,
      'Filmed': <CheckCircle2 size={16} />,
      'Scheduled': <Clock size={16} />,
      'Posted': <CheckCircle2 size={16} />,
    };
    return icons[status] || <Clock size={16} />;
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-gradient-to-r from-jade-purple to-jade-light px-6 py-4 text-jade-cream shadow-sm">
        <div className="flex items-center space-x-3 mb-2">
          <Calendar size={28} />
          <h1 className="text-2xl font-bold">Weekly Content Calendar</h1>
        </div>
        <p className="text-sm text-jade-cream/90">
          This week's content plan with newsletter integration
        </p>
      </div>

      {/* Newsletter Status Banner */}
      {newsletterData && (
        <div
          className={`mx-6 mt-6 rounded-lg border-2 p-4 flex items-center justify-between ${
            newsletterData.selectedTopic
              ? 'border-green-300 bg-green-50'
              : 'border-orange-300 bg-orange-50'
          }`}
        >
          <div>
            <h3 className="font-bold text-gray-900 flex items-center space-x-2">
              <Mail size={20} />
              <span>
                📧 Newsletter{' '}
                {newsletterData.selectedTopic
                  ? `Topic: "${newsletterData.selectedTopic}"`
                  : 'Topic not selected'}
              </span>
            </h3>
            <p className="text-sm text-gray-700 mt-1">
              Goes out Friday at 11:00 AM
            </p>
          </div>
          {newsletterData.selectedTopic && (
            <div className="text-green-700 font-bold text-lg">✅</div>
          )}
        </div>
      )}

      {/* Weekly Timeline */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-6 max-w-5xl mx-auto">
          {weekContent.map((dayData, index) => (
            <div key={dayData.day} className="border-l-4 border-jade-purple pl-6">
              {/* Day Header */}
              <div className="flex items-baseline space-x-3 mb-4">
                <h2 className="text-2xl font-bold text-jade-purple">
                  {dayData.day}
                </h2>
                <span className="text-sm text-gray-500">
                  {new Date(dayData.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                {index === 4 && (
                  <span className="ml-auto text-lg">
                    📧 Newsletter goes out tonight
                  </span>
                )}
              </div>

              {/* Content for This Day */}
              {dayData.content.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-600">
                  <p>No content scheduled for {dayData.day}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {dayData.content.map(item => (
                    <div
                      key={item.id}
                      className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-jade-purple hover:shadow-md transition-all"
                    >
                      {/* Content Type & Title */}
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-semibold text-jade-purple">
                            {item.type === 'Reel' && '🎬'}
                            {item.type === 'Carousel' && '📸'}
                            {item.type === 'Static' && '📷'}
                            {item.type === 'Email' && '✉️'}{' '}
                            {item.type}
                          </p>
                          <h3 className="text-lg font-bold text-gray-900 mt-1">
                            {item.title}
                          </h3>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center space-x-1 ${getStatusColor(
                              item.status
                            )}`}
                          >
                            {getStatusIcon(item.status)}
                            <span>{item.status}</span>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-3">
                        {item.description}
                      </p>

                      {/* Metadata */}
                      <div className="flex flex-wrap gap-4 text-xs text-gray-600 mb-3">
                        {item.duration && (
                          <div>
                            <span className="font-semibold">Duration:</span>{' '}
                            {item.duration}
                          </div>
                        )}
                        {item.postTime && (
                          <div>
                            <span className="font-semibold">Post Time:</span>{' '}
                            {item.postTime}
                          </div>
                        )}
                        {item.reviewDueDate && (
                          <div>
                            <span className="font-semibold">Review Due:</span>{' '}
                            {new Date(item.reviewDueDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>

                      {/* Script Preview (if available) */}
                      {item.script && (
                        <div className="bg-gray-50 rounded p-3 mb-3 max-h-24 overflow-y-auto">
                          <p className="text-xs font-bold text-gray-700 mb-1">
                            Script Preview:
                          </p>
                          <p className="text-xs text-gray-600 line-clamp-3">
                            {item.script.substring(0, 150)}
                            {item.script.length > 150 ? '...' : ''}
                          </p>
                        </div>
                      )}

                      {/* Feedback (if given) */}
                      {item.feedback && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                          <p className="text-xs font-bold text-yellow-700 mb-1">
                            💬 Feedback from Jade:
                          </p>
                          <p className="text-xs text-yellow-700">
                            {item.feedback}
                          </p>
                          {item.feedbackDate && (
                            <p className="text-xs text-yellow-600 mt-1">
                              Given: {new Date(item.feedbackDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-3 border-t border-gray-200 mt-3">
                        <button className="px-3 py-1 text-xs font-medium bg-jade-purple text-jade-cream rounded hover:bg-jade-light hover:text-jade-purple transition-colors">
                          View Details
                        </button>
                        <button className="px-3 py-1 text-xs font-medium border border-jade-purple text-jade-purple rounded hover:bg-jade-cream transition-colors">
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Footer Note */}
          <div className="bg-jade-cream/50 border-2 border-jade-light rounded-lg p-4 text-center text-sm text-gray-700 mt-8">
            <p>
              💡 <strong>Timeline:</strong> Content review (Mon-Tue) → Filming (Wed) →
              Scheduling (Thu) → Newsletter content feature (Fri)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
