'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, AlertCircle, Calendar } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  category: 'today' | 'content' | 'admin' | 'ads' | 'client';
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'to-do' | 'in-progress' | 'done';
  notes: string;
}

interface CalendarEvent {
  date: string;
  title: string;
  type: 'seasonal' | 'holiday' | 'awareness' | 'school';
  newsletter: string;
  content: string;
  notes: string;
}

type TabType = 'today' | 'week' | 'month' | 'guides' | 'content' | 'admin' | 'ads' | 'client' | 'all';

const GUIDE_TASKS: Task[] = [
  {
    id: 1001,
    title: '5–18 Month Sleep Guide',
    category: 'content',
    dueDate: '2026-02-28',
    priority: 'high',
    status: 'to-do' as const,
    notes: 'Complete comprehensive sleep guide for 5-18 month olds'
  },
  {
    id: 1002,
    title: '4–5 Month Bridging Guide',
    category: 'content',
    dueDate: '2026-02-28',
    priority: 'medium',
    status: 'to-do' as const,
    notes: 'Bridge guide for 4-5 month sleep transition'
  },
  {
    id: 1003,
    title: '18 Month – 3 Year Toddler Guide',
    category: 'content',
    dueDate: '2026-02-28',
    priority: 'medium',
    status: 'to-do' as const,
    notes: 'Toddler sleep management for 18 months to 3 years'
  },
  {
    id: 1004,
    title: 'Newborn Guide',
    category: 'content',
    dueDate: '2026-02-28',
    priority: 'medium',
    status: 'to-do' as const,
    notes: 'Newborn sleep guide for first 0-4 months'
  },
  {
    id: 1005,
    title: 'Sample Schedules Guide',
    category: 'content',
    dueDate: '2026-02-28',
    priority: 'medium',
    status: 'to-do' as const,
    notes: 'Age-appropriate sample sleep schedules'
  },
  {
    id: 1006,
    title: 'Daycare Prep Guide',
    category: 'content',
    dueDate: '2026-02-28',
    priority: 'medium',
    status: 'to-do' as const,
    notes: 'Guide for preparing children for daycare transitions'
  }
];

const CALENDAR_EVENTS: CalendarEvent[] = [
  {
    date: '2026-02-22',
    title: 'Daylight Saving Ends (QLD)',
    type: 'seasonal',
    newsletter: 'Sleep adjustments after daylight saving - 1 hour earlier bedtime',
    content: 'Instagram tips on adjusting sleep schedules post-DST',
    notes: 'Clocks go back 1 hour (2am → 1am). Expect sleep disruptions for 3-7 days.'
  },
  {
    date: '2026-03-03',
    title: 'School Holidays Begin (QLD)',
    type: 'school',
    newsletter: 'Sleep routines during school holidays - keeping schedules vs. flexibility',
    content: 'Blog post: "Holiday Sleep Guide"',
    notes: 'Schools break until ~April 17. Major routine disruption for many families.'
  },
  {
    date: '2026-03-17',
    title: 'Hello Little Traveller Launch',
    type: 'awareness',
    newsletter: 'Easter travel sleep tips - preview of ebook',
    content: 'Countdown content (5 days to launch), testimonials, behind-the-scenes',
    notes: 'Major campaign launch date. Pre-launch social content this week.'
  },
  {
    date: '2026-04-03',
    title: 'Easter Holidays (QLD)',
    type: 'holiday',
    newsletter: 'Post-Easter sleep recovery - back to normal routines',
    content: 'Email to ebook buyers: "Welcome home" recovery guide',
    notes: 'Easter break: April 3-19. Biggest travel/routine disruption of year.'
  },
  {
    date: '2026-05-10',
    title: "Mother's Day (QLD)",
    type: 'holiday',
    newsletter: 'Self-care for sleep-deprived mums',
    content: 'Blog: "Sleep tips for tired mums" + gift guide',
    notes: 'Second Sunday in May. Opportunity for community + connection.'
  },
  {
    date: '2026-06-21',
    title: 'Winter Solstice (QLD)',
    type: 'seasonal',
    newsletter: 'Sleep patterns in winter - darker mornings, earlier nights',
    content: 'Blog: "Seasonal sleep changes"',
    notes: 'Shortest day. Natural sleep timing shifts earlier.'
  }
];

export default function HLSTasks() {
  const [activeTab, setActiveTab] = useState<TabType>('guides');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedGuideId, setSelectedGuideId] = useState<number | null>(1001);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('jadeHLSTasksData');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setTasks(data.tasks || []);
      } catch (e) {
        console.log('No saved data');
      }
    }
  }, []);

  const saveData = (newTasks: Task[]) => {
    localStorage.setItem('jadeHLSTasksData', JSON.stringify({ tasks: newTasks }));
  };

  const handleStatusChange = (id: number, newStatus: Task['status']) => {
    const updated = tasks.map(t =>
      t.id === id ? { ...t, status: newStatus } : t
    );
    setTasks(updated);
    saveData(updated);
  };

  const filterTasks = (filterFn: (task: Task) => boolean): Task[] => {
    return tasks.filter(filterFn);
  };

  const getTasksByTab = (): Task[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (activeTab) {
      case 'today':
        return filterTasks(task => {
          const taskDate = new Date(task.dueDate);
          taskDate.setHours(0, 0, 0, 0);
          return taskDate.getTime() === today.getTime();
        });
      case 'week':
        return filterTasks(task => {
          const taskDate = new Date(task.dueDate);
          taskDate.setHours(0, 0, 0, 0);
          const daysUntil = Math.floor((taskDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          return daysUntil >= 0 && daysUntil <= 6;
        });
      case 'month':
        return filterTasks(task => {
          const taskDate = new Date(task.dueDate);
          return taskDate.getMonth() === today.getMonth() && taskDate.getFullYear() === today.getFullYear();
        });
      case 'guides':
        return GUIDE_TASKS;
      case 'content':
        return filterTasks(task => task.category === 'content');
      case 'admin':
        return filterTasks(task => task.category === 'admin');
      case 'ads':
        return filterTasks(task => task.category === 'ads');
      case 'client':
        return filterTasks(task => task.category === 'client');
      case 'all':
        return tasks;
      default:
        return [];
    }
  };

  const getStats = (filterFn: (task: Task) => boolean) => {
    const filtered = tasks.filter(filterFn);
    return {
      total: filtered.length,
      todo: filtered.filter(t => t.status === 'to-do').length,
      progress: filtered.filter(t => t.status === 'in-progress').length,
      done: filtered.filter(t => t.status === 'done').length
    };
  };

  const getDaysUntil = (dueDate: string): { label: string; class: string } => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(dueDate);
    taskDate.setHours(0, 0, 0, 0);
    const daysUntil = Math.floor((taskDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntil < 0) {
      return { label: `${Math.abs(daysUntil)} days overdue`, class: 'bg-red-100 text-red-700' };
    } else if (daysUntil === 0) {
      return { label: 'Due TODAY', class: 'bg-orange-100 text-orange-700' };
    } else if (daysUntil === 1) {
      return { label: 'Due tomorrow', class: 'bg-yellow-100 text-yellow-700' };
    } else {
      return { label: `Due in ${daysUntil} days`, class: 'bg-blue-100 text-blue-700' };
    }
  };

  const GuideTaskCard = ({ task, isSelected }: { task: Task; isSelected: boolean }) => {
    const isHighPriority = task.priority === 'high';
    const statusIcon = {
      'to-do': '○',
      'in-progress': '◐',
      'done': '●'
    };
    const statusColor = {
      'to-do': 'text-gray-400',
      'in-progress': 'text-orange-400',
      'done': 'text-green-500'
    };

    return (
      <div
        onClick={() => setSelectedGuideId(task.id)}
        className={`p-4 rounded border-l-4 border-jade-light cursor-pointer transition-all active:scale-95 ${
          isSelected
            ? 'bg-jade-light shadow-lg border-l-4 border-jade-purple scale-[1.02]'
            : 'bg-white hover:shadow-md hover:border-jade-purple'
        } ${task.status === 'done' ? 'opacity-75 bg-gray-50' : ''}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-2xl ${statusColor[task.status]}`}>{statusIcon[task.status]}</span>
              <h4 className={`font-semibold text-gray-800 text-base ${task.status === 'done' ? 'line-through text-gray-500' : ''}`}>
                {task.title}
              </h4>
              {isHighPriority && (
                <span className="text-lg">⭐</span>
              )}
            </div>
            <p className="text-xs text-gray-600 ml-8">{task.notes}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-xs font-semibold text-gray-600 mb-1">Due Feb 28</div>
            <div className="text-xs text-gray-500">{task.status === 'done' ? '✓ Complete' : 'In Progress'}</div>
          </div>
        </div>
      </div>
    );
  };

  const TaskCard = ({ task }: { task: Task }) => {
    const daysInfo = getDaysUntil(task.dueDate);
    const priorityClasses = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-orange-100 text-orange-700',
      low: 'bg-blue-100 text-blue-700'
    };

    return (
      <div className={`bg-white p-4 rounded border-l-4 border-jade-light ${task.status === 'done' ? 'opacity-60' : ''}`}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h4 className={`font-semibold text-gray-800 ${task.status === 'done' ? 'line-through text-gray-500' : ''}`}>
              {task.title}
            </h4>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs font-semibold bg-jade-light text-jade-purple px-2 py-1 rounded">
            {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
          </span>
          <span className={`text-xs font-semibold px-2 py-1 rounded ${priorityClasses[task.priority]}`}>
            Priority: {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
          <span className={`text-xs font-semibold px-2 py-1 rounded ${daysInfo.class}`}>
            {daysInfo.label}
          </span>
        </div>

        {task.notes && <p className="text-sm text-gray-700 mb-3">{task.notes}</p>}

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => handleStatusChange(task.id, 'to-do')}
            className={`text-xs font-semibold px-3 py-1 rounded transition-colors ${
              task.status === 'to-do'
                ? 'bg-gray-400 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            To Do
          </button>
          <button
            onClick={() => handleStatusChange(task.id, 'in-progress')}
            className={`text-xs font-semibold px-3 py-1 rounded transition-colors ${
              task.status === 'in-progress'
                ? 'bg-orange-400 text-white'
                : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => handleStatusChange(task.id, 'done')}
            className={`text-xs font-semibold px-3 py-1 rounded transition-colors ${
              task.status === 'done'
                ? 'bg-green-500 text-white'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            Done
          </button>
        </div>
      </div>
    );
  };

  const StatCard = ({ number, label }: { number: number; label: string }) => (
    <div className="bg-white p-4 rounded border-t-4 border-jade-light text-center shadow-sm">
      <div className="text-3xl font-bold text-jade-purple">{number}</div>
      <div className="text-sm text-gray-600 mt-1">{label}</div>
    </div>
  );

  const tabsList: TabType[] = ['today', 'week', 'month', 'guides', 'content', 'admin', 'ads', 'client', 'all'];
  const tabLabels: Record<TabType, string> = {
    today: '📅 Today',
    week: '📆 This Week',
    month: '📊 This Month',
    guides: '📚 Guides',
    content: '✍️ Content',
    admin: '⚙️ Admin',
    ads: '📢 Ads',
    client: '👤 Client',
    all: '📋 All Tasks'
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-jade-light px-6 py-4">
        <div className="flex items-center space-x-3">
          <CheckCircle2 size={32} className="text-jade-purple" />
          <div>
            <h2 className="text-2xl font-bold text-jade-purple">HLS Tasks</h2>
            <p className="text-sm text-gray-600">Project management & planning dashboard</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-jade-light px-6 py-4 flex items-center space-x-2 overflow-x-auto">
        {tabsList.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium whitespace-nowrap ${
              activeTab === tab
                ? 'bg-jade-purple text-jade-cream'
                : 'bg-jade-cream text-jade-purple hover:bg-jade-light'
            }`}
          >
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Guides Tab */}
        {activeTab === 'guides' && (
          <div>
            <div className="bg-blue-50 border-l-4 border-jade-light p-4 rounded mb-6">
              <p className="text-sm text-gray-700 font-semibold">
                📚 HLS Content Guides - All due Feb 28, 2026
              </p>
              <p className="text-xs text-gray-600 mt-1">⭐ = Priority task • Click a guide to see details</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Guide List */}
              <div className="lg:col-span-1 space-y-3">
                <h3 className="font-semibold text-gray-700 mb-3">Available Guides</h3>
                {GUIDE_TASKS.map(task => (
                  <GuideTaskCard
                    key={task.id}
                    task={task}
                    isSelected={selectedGuideId === task.id}
                  />
                ))}
              </div>

              {/* Selected Guide Details */}
              <div className="lg:col-span-2">
                {selectedGuideId ? (() => {
                  const selectedGuide = GUIDE_TASKS.find(t => t.id === selectedGuideId);
                  if (!selectedGuide) return null;
                  return (
                    <div className="bg-white p-6 rounded-lg shadow-md border-2 border-jade-purple sticky top-6">
                      <div className="mb-4">
                        <div className="flex items-start justify-between mb-2">
                          <h2 className="text-2xl font-bold text-jade-purple">{selectedGuide.title}</h2>
                          {selectedGuide.priority === 'high' && (
                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                              ⭐ PRIORITY
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-4">{selectedGuide.notes}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-jade-light/20 p-4 rounded">
                          <p className="text-sm text-gray-600 mb-1">Due Date</p>
                          <p className="font-semibold text-gray-900">Feb 28, 2026</p>
                        </div>
                        <div className="bg-orange-100/30 p-4 rounded">
                          <p className="text-sm text-gray-600 mb-1">Status</p>
                          <p className="font-semibold text-orange-700">
                            {selectedGuide.status === 'done' ? '✓ Complete' : '◐ In Progress'}
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Project Details</h3>
                        <div className="space-y-2 text-sm text-gray-700">
                          <p><strong>Category:</strong> {selectedGuide.category}</p>
                          <p><strong>Priority:</strong> <span className="text-red-600 font-semibold">{selectedGuide.priority === 'high' ? 'High' : 'Medium'}</span></p>
                          <p><strong>Description:</strong> {selectedGuide.notes}</p>
                        </div>
                      </div>

                      <div className="mt-6 p-4 bg-blue-50 rounded border-l-4 border-blue-500">
                        <p className="text-xs text-gray-700">
                          💡 <strong>Tip:</strong> View the <span className="text-jade-purple font-semibold">Guides tab</span> in the sidebar to see all sub-tasks and track progress for this guide.
                        </p>
                      </div>
                    </div>
                  );
                })() : null}
              </div>
            </div>

            <div className="mt-8 bg-gray-50 p-4 rounded text-sm text-gray-600">
              <p><strong>Status Legend:</strong> ○ = To Do | ◐ = In Progress | ● = Done</p>
            </div>
          </div>
        )}

        {/* All Other Tabs */}
        {activeTab !== 'guides' && (
          <div>
            {/* Update Note */}
            <div className="bg-yellow-50 border-l-4 border-jade-light p-4 rounded mb-6">
              <p className="text-sm text-gray-700 font-semibold">
                📝 Update Instructions: Add your tasks above. They'll display here organized by status.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {(() => {
                let filterFn: (task: Task) => boolean;
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const tab = activeTab as Exclude<TabType, 'guides' | 'calendar'>;
                switch (tab) {
                  case 'today':
                    filterFn = t => {
                      const td = new Date(t.dueDate);
                      td.setHours(0, 0, 0, 0);
                      return td.getTime() === today.getTime();
                    };
                    break;
                  case 'week':
                    filterFn = t => {
                      const td = new Date(t.dueDate);
                      td.setHours(0, 0, 0, 0);
                      const days = Math.floor((td.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                      return days >= 0 && days <= 6;
                    };
                    break;
                  case 'month':
                    filterFn = t => {
                      const td = new Date(t.dueDate);
                      return td.getMonth() === today.getMonth() && td.getFullYear() === today.getFullYear();
                    };
                    break;
                  case 'content':
                    filterFn = t => t.category === 'content';
                    break;
                  case 'admin':
                    filterFn = t => t.category === 'admin';
                    break;
                  case 'ads':
                    filterFn = t => t.category === 'ads';
                    break;
                  case 'client':
                    filterFn = t => t.category === 'client';
                    break;
                  case 'all':
                  default:
                    filterFn = () => true;
                    break;
                }

                const stats = getStats(filterFn);
                return (
                  <>
                    <StatCard number={stats.total} label="Total Tasks" />
                    <StatCard number={stats.todo} label="To Do" />
                    <StatCard number={stats.progress} label="In Progress" />
                    <StatCard number={stats.done} label="Done" />
                  </>
                );
              })()}
            </div>

            {/* Tasks */}
            <div className="space-y-4">
              {getTasksByTab().length === 0 ? (
                <div className="bg-gray-50 p-12 rounded text-center text-gray-600">
                  <p className="text-lg font-semibold mb-2">No tasks</p>
                  <p className="text-sm">Give John your task list to add them here.</p>
                </div>
              ) : (
                getTasksByTab().map(task => <TaskCard key={task.id} task={task} />)
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
