'use client';

import { Mail, Plus, CheckCircle2, FileText, Code, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNewsletterTopic } from '@/lib/useNewsletterTopic';
import { type NewsletterTopicIdea } from '@/lib/newsletterTopicUtils';

interface NewsletterStage {
  stage: 1 | 2 | 3 | 4;
  name: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  dueDate?: string;
}

interface WeeklyNewsletter {
  week: string;
  startDate: string;
  endDate: string;
  topic?: string;
  outline?: string;
  fullCopy?: string;
  notes?: string;
  selectedTopic?: string | null;
  stages: NewsletterStage[];
}

export default function WeeklyNewsletter() {
  const [newsletters, setNewsletters] = useState<WeeklyNewsletter[]>([]);
  const [editingWeek, setEditingWeek] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  
  // Use shared newsletter topic hook
  const { topicData, selectTopic: handleSelectTopicUtil } = useNewsletterTopic();

  const [formData, setFormData] = useState({
    topic: '',
    outline: '',
    fullCopy: '',
  });

  // Load from localStorage
  useEffect(() => {
    // Load newsletter data
    const saved = localStorage.getItem('jadeNewsletterData');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setNewsletters(data);
      } catch (e) {
        console.log('No saved newsletter data');
      }
    } else {
      // Initialize with current week
      initializeCurrentWeek();
    }
  }, []);

  const initializeCurrentWeek = () => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const currentWeek: WeeklyNewsletter = {
      week: `Week of ${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      startDate: weekStart.toISOString().split('T')[0],
      endDate: weekEnd.toISOString().split('T')[0],
      selectedTopic: null,
      stages: [
        {
          stage: 1,
          name: 'Topic & Outline',
          description: 'Felicia suggests topic + outline',
          icon: '📋',
          completed: false,
        },
        {
          stage: 2,
          name: 'Full Copy Drafted',
          description: 'Complete newsletter copy written',
          icon: '✍️',
          completed: false,
        },
        {
          stage: 3,
          name: 'Copy Reviewed & Approved',
          description: 'Jade reviews and approves',
          icon: '👀',
          completed: false,
        },
        {
          stage: 4,
          name: 'HTML Coded & Ready',
          description: 'Ready to paste into GoHighLevel',
          icon: '⚙️',
          completed: false,
        },
      ],
    };

    const nextWeek: WeeklyNewsletter = {
      week: `Week of ${new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      startDate: new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date(weekEnd.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      selectedTopic: null,
      stages: [
        {
          stage: 1,
          name: 'Topic & Outline',
          description: 'Felicia suggests topic + outline',
          icon: '📋',
          completed: false,
        },
        {
          stage: 2,
          name: 'Full Copy Drafted',
          description: 'Complete newsletter copy written',
          icon: '✍️',
          completed: false,
        },
        {
          stage: 3,
          name: 'Copy Reviewed & Approved',
          description: 'Jade reviews and approves',
          icon: '👀',
          completed: false,
        },
        {
          stage: 4,
          name: 'HTML Coded & Ready',
          description: 'Ready to paste into GoHighLevel',
          icon: '⚙️',
          completed: false,
        },
      ],
    };

    setNewsletters([currentWeek, nextWeek]);
    localStorage.setItem('jadeNewsletterData', JSON.stringify([currentWeek, nextWeek]));
  };

  const saveData = (data: WeeklyNewsletter[]) => {
    localStorage.setItem('jadeNewsletterData', JSON.stringify(data));
  };

  const toggleStageCompletion = (weekIndex: number, stageNum: number) => {
    const updated = [...newsletters];
    const stage = updated[weekIndex].stages.find(s => s.stage === stageNum);
    if (stage) {
      stage.completed = !stage.completed;
    }
    setNewsletters(updated);
    saveData(updated);
  };

  const updateNewsletterContent = (weekIndex: number, field: 'topic' | 'outline' | 'fullCopy', value: string) => {
    const updated = [...newsletters];
    updated[weekIndex][field] = value;
    setNewsletters(updated);
    saveData(updated);
  };

  const getProgressPercentage = (stages: NewsletterStage[]) => {
    const completed = stages.filter(s => s.completed).length;
    return (completed / stages.length) * 100;
  };

  const getStageStatus = (stages: NewsletterStage[]) => {
    const completed = stages.filter(s => s.completed).length;
    if (completed === stages.length) {
      return { text: 'Complete', color: 'bg-green-100 text-green-700' };
    } else if (completed > 0) {
      return { text: 'In Progress', color: 'bg-blue-100 text-blue-700' };
    } else {
      return { text: 'Not Started', color: 'bg-gray-100 text-gray-700' };
    }
  };

  const pickTopic = (weekIndex: number, topicIdea: NewsletterTopicIdea) => {
    // Update shared topic data
    handleSelectTopicUtil(topicIdea.id);

    // Update newsletter data
    const updated = [...newsletters];
    updated[weekIndex].selectedTopic = topicIdea.title;
    updated[weekIndex].topic = topicIdea.title;
    setNewsletters(updated);
    saveData(updated);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-jade-light px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Mail size={32} className="text-jade-purple" />
            <div>
              <h2 className="text-2xl font-bold text-jade-purple">Weekly Newsletter</h2>
              <p className="text-sm text-gray-600">Track newsletter stages: outline → draft → review → HTML ready</p>
            </div>
          </div>
          <button
            onClick={() => setShowNewForm(true)}
            className="flex items-center space-x-2 bg-jade-purple text-jade-cream px-4 py-2 rounded-lg hover:bg-jade-light hover:text-jade-purple transition-colors"
          >
            <Plus size={20} />
            <span>New Week</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {newsletters.length === 0 ? (
          <div className="text-center py-12">
            <Mail size={64} className="mx-auto mb-4 text-jade-light opacity-30" />
            <h3 className="text-2xl font-bold text-jade-purple mb-2">No Newsletters Yet</h3>
            <p className="text-gray-600 max-w-md mb-6">Start tracking your weekly newsletters. Each newsletter moves through stages from outline to HTML ready.</p>
            <button
              onClick={() => setShowNewForm(true)}
              className="bg-jade-purple text-jade-cream px-6 py-3 rounded-lg hover:bg-jade-light hover:text-jade-purple transition-colors font-medium"
            >
              Start First Newsletter
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {newsletters.map((newsletter, weekIndex) => {
              const progress = getProgressPercentage(newsletter.stages);
              const status = getStageStatus(newsletter.stages);
              const isCurrentWeek = weekIndex === 0;

              return (
                <div
                  key={weekIndex}
                  className={`rounded-lg shadow-md border overflow-hidden ${
                    isCurrentWeek ? 'border-jade-purple bg-gradient-to-r from-jade-purple/5 to-jade-light/10' : 'border-jade-light'
                  }`}
                >
                  {/* Week Header */}
                  <div className={`px-6 py-4 border-b border-jade-light ${isCurrentWeek ? 'bg-jade-purple text-jade-cream' : 'bg-white'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className={`text-xl font-bold ${isCurrentWeek ? 'text-jade-cream' : 'text-jade-purple'}`}>
                          {newsletter.week}
                          {isCurrentWeek && <span className="ml-2 text-sm">📌 Current Week</span>}
                        </h3>
                        <p className={`text-sm ${isCurrentWeek ? 'text-jade-cream opacity-90' : 'text-gray-600'}`}>
                          {new Date(newsletter.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — {new Date(newsletter.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <span className={`text-sm font-semibold px-3 py-1 rounded ${status.color}`}>
                        {status.text}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="px-6 py-3 bg-gray-50 border-b border-jade-light">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">Progress</span>
                      <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-2">
                      <div
                        className="bg-jade-purple h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Topic Ideas Section */}
                  {!newsletter.selectedTopic && (
                    <div className="p-6 bg-jade-cream/20 border-b border-jade-light">
                      <h3 className="text-lg font-bold text-jade-purple mb-4 flex items-center space-x-2">
                        <span>📚</span>
                        <span>Topic Ideas for This Week</span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {topicData?.topicIdeas.map((idea) => (
                          <div key={idea.id} className="bg-white rounded-lg border-2 border-jade-light hover:border-jade-purple hover:shadow-md transition-all p-4">
                            <h4 className="font-bold text-jade-purple mb-2 text-sm leading-tight">{idea.title}</h4>
                            <div className="space-y-2 mb-4">
                              <div>
                                <p className="text-xs font-semibold text-gray-600 uppercase">Relevance</p>
                                <p className="text-sm text-gray-700">{idea.relevance}</p>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-gray-600 uppercase">Suggested Angle</p>
                                <p className="text-sm text-gray-700">{idea.angle}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => pickTopic(weekIndex, idea)}
                              className="w-full bg-jade-purple text-jade-cream py-2 rounded font-medium text-sm hover:bg-jade-light hover:text-jade-purple transition-colors"
                            >
                              Pick This Topic
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stages */}
                  <div className="p-6 space-y-4">
                    {newsletter.stages.map((stage) => {
                      const isCompleted = stage.completed;
                      return (
                        <div
                          key={stage.stage}
                          className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                            isCompleted
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 bg-white hover:border-jade-purple hover:bg-jade-cream/30'
                          }`}
                          onClick={() => toggleStageCompletion(weekIndex, stage.stage)}
                        >
                          <div className="flex items-start space-x-4">
                            {/* Stage Icon and Number */}
                            <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                              isCompleted ? 'bg-green-200' : 'bg-jade-light'
                            }`}>
                              {isCompleted ? '✅' : stage.icon}
                            </div>

                            {/* Stage Info */}
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className={`text-lg font-bold ${isCompleted ? 'text-green-700' : 'text-jade-purple'}`}>
                                  Stage {stage.stage}: {stage.name}
                                </h4>
                                {isCompleted && <CheckCircle2 size={20} className="text-green-600" />}
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{stage.description}</p>

                              {/* Stage Content */}
                              {stage.stage === 1 && (
                                <div className="space-y-2">
                                  <input
                                    type="text"
                                    placeholder="Newsletter topic (e.g., 'Sleep Training for Toddlers')"
                                    value={newsletter.topic || ''}
                                    onChange={(e) => updateNewsletterContent(weekIndex, 'topic', e.target.value)}
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-jade-purple"
                                  />
                                  <textarea
                                    placeholder="Outline (main points to cover)"
                                    value={newsletter.outline || ''}
                                    onChange={(e) => updateNewsletterContent(weekIndex, 'outline', e.target.value)}
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-jade-purple"
                                    rows={3}
                                  />
                                </div>
                              )}

                              {stage.stage === 2 && (
                                <textarea
                                  placeholder="Write your complete newsletter copy here..."
                                  value={newsletter.fullCopy || ''}
                                  onChange={(e) => updateNewsletterContent(weekIndex, 'fullCopy', e.target.value)}
                                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-jade-purple font-mono"
                                  rows={6}
                                />
                              )}

                              {stage.stage === 3 && (
                                <div className="bg-yellow-50 p-3 rounded border border-yellow-200 text-sm text-yellow-800">
                                  <p className="font-semibold mb-2">📋 Ready for Jade's Review</p>
                                  <p>Copy is drafted and ready for Jade to review and approve before HTML coding.</p>
                                  {newsletter.fullCopy && (
                                    <div className="mt-3 p-3 bg-white rounded border border-yellow-300 max-h-48 overflow-y-auto text-gray-700">
                                      {newsletter.fullCopy}
                                    </div>
                                  )}
                                </div>
                              )}

                              {stage.stage === 4 && (
                                <div className="bg-blue-50 p-3 rounded border border-blue-200 text-sm text-blue-800">
                                  <p className="font-semibold mb-2">⚙️ HTML Coding</p>
                                  <p>Copy has been approved and is ready to be coded as HTML for GoHighLevel paste.</p>
                                  <div className="mt-3">
                                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors font-medium text-sm">
                                      Generate HTML Code
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-jade-light flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {progress === 100 ? (
                        <span className="text-green-700 font-semibold">✅ This newsletter is complete and ready!</span>
                      ) : (
                        <span>{Math.round(progress)}% complete. Keep going!</span>
                      )}
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => setEditingWeek(editingWeek === `week-${weekIndex}` ? null : `week-${weekIndex}`)}
                        className="text-jade-purple hover:text-jade-purple/80 font-medium text-sm"
                      >
                        {editingWeek === `week-${weekIndex}` ? 'Collapse' : 'Expand'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
