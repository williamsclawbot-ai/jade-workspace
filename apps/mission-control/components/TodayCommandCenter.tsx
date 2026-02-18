'use client';

import { useState, useEffect } from 'react';
import {
  Sun,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Mail,
  Clock,
  TrendingUp,
  ChevronRight,
  Edit2,
  Eye,
} from 'lucide-react';
import ContentStore, { ContentItem } from '@/lib/contentStore';
import { useNewsletterTopic } from '@/lib/useNewsletterTopic';

interface UrgentItem {
  id: string;
  title: string;
  category: 'content' | 'newsletter' | 'appointment' | 'task' | 'household';
  dueDate?: string;
  status: string;
  feedback?: string;
  feedbackDate?: string;
  revisionDate?: string;
  content?: ContentItem;
  action: () => void;
}

export default function TodayCommandCenter() {
  const [urgentItems, setUrgentItems] = useState<UrgentItem[]>([]);
  const [weekOutlook, setWeekOutlook] = useState({
    contentDueForReview: 0,
    contentReadyToFilm: 0,
    contentScheduled: 0,
    newsletterTopicSelected: false,
    progressPercent: 0,
  });
  const [selectedItem, setSelectedItem] = useState<UrgentItem | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const { topicData } = useNewsletterTopic();

  // Load newsletter data
  const [newsletterData, setNewsletterData] = useState<any>(null);

  useEffect(() => {
    // Load newsletter
    const saved = localStorage.getItem('jadeNewsletterData');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setNewsletterData(data[0]); // Current week
      } catch (e) {
        console.log('No newsletter data');
      }
    }
  }, []);

  useEffect(() => {
    loadUrgentItems();

    // Refresh every second for real-time sync
    const interval = setInterval(() => {
      loadUrgentItems();
      setRefreshKey(k => k + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const loadUrgentItems = () => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const items: UrgentItem[] = [];

    // 1. CONTENT DUE FOR REVIEW
    const allContent = ContentStore.getAll();
    const duForReview = allContent.filter(c => c.status === 'Due for Review');
    duForReview.forEach(item => {
      items.push({
        id: `content-${item.id}`,
        title: `Review: ${item.title}`,
        category: 'content',
        dueDate: item.reviewDueDate,
        status: 'Due for Review',
        content: item,
        action: () => {
          // This will trigger content modal
          console.log('Review content:', item);
        },
      });
    });

    // 2. CONTENT WITH FEEDBACK (Awaiting Revision)
    const withFeedback = allContent.filter(c => c.status === 'Feedback Given');
    withFeedback.forEach(item => {
      items.push({
        id: `feedback-${item.id}`,
        title: `Revise: ${item.title}`,
        category: 'content',
        feedback: item.feedback,
        feedbackDate: item.feedbackDate,
        status: 'Feedback Given',
        content: item,
        action: () => {
          console.log('Revise content:', item);
        },
      });
    });

    // 3. NEWSLETTER STATUS
    const saved = localStorage.getItem('jadeNewsletterData');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        const currentWeek = data[0];
        if (!currentWeek.selectedTopic) {
          items.push({
            id: 'newsletter-topic',
            title: '📧 Newsletter: Pick topic for this week',
            category: 'newsletter',
            status: 'Topic not selected',
            action: () => {
              console.log('Pick newsletter topic');
            },
          });
        }
      } catch (e) {}
    }

    // 4. CALCULATE WEEK OUTLOOK
    const contentDueForReview = allContent.filter(
      c => c.status === 'Due for Review'
    ).length;
    const contentReadyToFilm = allContent.filter(
      c => c.status === 'Ready to Film'
    ).length;
    const contentScheduled = allContent.filter(
      c => c.status === 'Scheduled'
    ).length;

    const totalContent = allContent.length;
    const progressPercent =
      totalContent > 0
        ? Math.round(
            ((contentScheduled + allContent.filter(c => c.status === 'Posted').length) / totalContent) * 100
          )
        : 0;

    setWeekOutlook({
      contentDueForReview,
      contentReadyToFilm,
      contentScheduled,
      newsletterTopicSelected: !!newsletterData?.selectedTopic,
      progressPercent,
    });

    setUrgentItems(items);
  };

  return (
    <div key={refreshKey} className="h-full flex flex-col bg-white overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-gradient-to-r from-jade-purple to-jade-light px-4 md:px-6 py-4 md:py-6 text-jade-cream shadow-sm">
        <div className="flex items-center space-x-2 md:space-x-3 mb-2">
          <Sun size={28} className="md:w-8 md:h-8 text-jade-cream" />
          <h1 className="text-2xl md:text-3xl font-bold">Today</h1>
        </div>
        <p className="text-jade-cream/90 text-xs md:text-sm">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Main Sections */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 space-y-4 md:space-y-6 max-w-4xl mx-auto w-full">
        {/* 1. URGENT TODAY - Top Priority Items */}
        <section>
          <h2 className="text-xl font-bold text-jade-purple mb-4 flex items-center space-x-2">
            <AlertCircle size={24} />
            <span>⚡ URGENT TODAY</span>
          </h2>

          {urgentItems.length === 0 ? (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center">
              <CheckCircle2 size={48} className="mx-auto text-green-600 mb-3" />
              <h3 className="text-lg font-bold text-green-700 mb-2">All Clear!</h3>
              <p className="text-green-600">No urgent items today. Great work! 🎉</p>
            </div>
          ) : (
            <div className="space-y-3">
              {urgentItems.slice(0, 5).map(item => (
                <div
                  key={item.id}
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    item.category === 'content'
                      ? 'border-blue-300 bg-blue-50 hover:bg-blue-100'
                      : item.category === 'newsletter'
                      ? 'border-purple-300 bg-purple-50 hover:bg-purple-100'
                      : 'border-orange-300 bg-orange-50 hover:bg-orange-100'
                  }`}
                  onClick={item.action}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                      {item.feedback && (
                        <p className="text-sm text-gray-700 mb-2">
                          <span className="font-semibold">Feedback:</span> {item.feedback.substring(0, 100)}
                          {item.feedback.length > 100 ? '...' : ''}
                        </p>
                      )}
                      {item.feedbackDate && (
                        <p className="text-xs text-gray-600">
                          Feedback given: {new Date(item.feedbackDate).toLocaleDateString()}
                        </p>
                      )}
                      {item.dueDate && (
                        <p className="text-xs text-gray-600">
                          Due: {new Date(item.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <ChevronRight size={20} className="text-gray-400 flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 2. THIS WEEK'S OUTLOOK */}
        <section>
          <h2 className="text-xl font-bold text-jade-purple mb-4 flex items-center space-x-2">
            <TrendingUp size={24} />
            <span>📊 THIS WEEK'S OUTLOOK</span>
          </h2>

          {/* Progress Bar */}
          <div className="bg-white border-2 border-jade-light rounded-lg p-6 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Weekly Progress</h3>
              <span className="text-2xl font-bold text-jade-purple">
                {weekOutlook.progressPercent}%
              </span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-jade-purple to-jade-light h-full transition-all"
                style={{ width: `${weekOutlook.progressPercent}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {weekOutlook.contentScheduled} scheduled • Newsletter{' '}
              {weekOutlook.newsletterTopicSelected ? '✅ ready' : '❌ topic needed'}
            </p>
          </div>

          {/* Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <p className="text-xs font-bold text-blue-700 uppercase">Due for Review</p>
              <p className="text-3xl font-bold text-blue-700 my-2">
                {weekOutlook.contentDueForReview}
              </p>
              <p className="text-sm text-blue-600">pieces awaiting review</p>
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <p className="text-xs font-bold text-green-700 uppercase">Ready to Film</p>
              <p className="text-3xl font-bold text-green-700 my-2">
                {weekOutlook.contentReadyToFilm}
              </p>
              <p className="text-sm text-green-600">pieces approved & ready</p>
            </div>

            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
              <p className="text-xs font-bold text-purple-700 uppercase">Scheduled</p>
              <p className="text-3xl font-bold text-purple-700 my-2">
                {weekOutlook.contentScheduled}
              </p>
              <p className="text-sm text-purple-600">pieces scheduled this week</p>
            </div>
          </div>

          {/* Key Dates */}
          <div className="mt-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
            <h4 className="font-bold text-yellow-900 mb-2">📅 Key Dates This Week</h4>
            <div className="space-y-2 text-sm text-yellow-800">
              <p>✉️ Newsletter goes out: Friday 11pm</p>
              <p>🎬 Content filming window: Mon-Wed</p>
              <p>📤 Scheduling deadline: Thursday</p>
            </div>
          </div>
        </section>

        {/* 3. QUICK ACTIONS */}
        <section>
          <h2 className="text-xl font-bold text-jade-purple mb-4 flex items-center space-x-2">
            <ChevronRight size={24} />
            <span>⚡ QUICK ACTIONS</span>
          </h2>

          <div className="space-y-3">
            {weekOutlook.contentDueForReview > 0 && (
              <button className="w-full bg-blue-600 text-white rounded-lg p-4 hover:bg-blue-700 transition-colors text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold">Review {weekOutlook.contentDueForReview} Script(s)</p>
                    <p className="text-sm text-blue-200">
                      Open Content tab to start review
                    </p>
                  </div>
                  <Eye size={24} />
                </div>
              </button>
            )}

            {!weekOutlook.newsletterTopicSelected && (
              <button className="w-full bg-purple-600 text-white rounded-lg p-4 hover:bg-purple-700 transition-colors text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold">Pick Newsletter Topic</p>
                    <p className="text-sm text-purple-200">
                      Select from suggested topics
                    </p>
                  </div>
                  <Mail size={24} />
                </div>
              </button>
            )}

            {weekOutlook.contentReadyToFilm > 0 && (
              <button className="w-full bg-green-600 text-white rounded-lg p-4 hover:bg-green-700 transition-colors text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold">Mark {weekOutlook.contentReadyToFilm} Filmed</p>
                    <p className="text-sm text-green-200">
                      Update status after filming
                    </p>
                  </div>
                  <CheckCircle2 size={24} />
                </div>
              </button>
            )}
          </div>
        </section>

        {/* Mobile Note */}
        <div className="md:hidden bg-jade-cream/50 border border-jade-light rounded-lg p-4 text-center text-sm text-gray-700">
          💡 <strong>Tip:</strong> Tap any urgent item to open editor or navigate to detailed view
        </div>
      </div>
    </div>
  );
}
