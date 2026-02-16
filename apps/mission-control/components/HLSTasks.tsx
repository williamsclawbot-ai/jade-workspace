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

type TabType = 'today' | 'week' | 'month' | 'calendar' | 'content' | 'admin' | 'ads' | 'client' | 'all';

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
  const [activeTab, setActiveTab] = useState<TabType>('today');
  const [tasks, setTasks] = useState<Task[]>([]);

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
      case 'calendar':
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

  const tabsList: TabType[] = ['today', 'week', 'month', 'calendar', 'content', 'admin', 'ads', 'client', 'all'];
  const tabLabels: Record<TabType, string> = {
    today: '📅 Today',
    week: '📆 This Week',
    month: '📊 This Month',
    calendar: '📅 Calendar',
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
        {/* Calendar Tab */}
        {activeTab === 'calendar' && (
          <div>
            <div className="bg-yellow-50 border-l-4 border-jade-light p-4 rounded mb-6">
              <p className="text-sm text-gray-700 font-semibold">
                📅 Content Calendar - Key dates for HLS newsletters & content
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CALENDAR_EVENTS.map((event, idx) => {
                const date = new Date(event.date);
                const formatted = date.toLocaleDateString('en-AU', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                });

                const typeClasses = {
                  seasonal: 'bg-green-100 text-green-700',
                  holiday: 'bg-red-100 text-red-700',
                  awareness: 'bg-blue-100 text-blue-700',
                  school: 'bg-orange-100 text-orange-700'
                };

                return (
                  <div key={idx} className="bg-white p-4 rounded border-l-4 border-jade-light shadow-sm">
                    <div className="text-sm text-gray-600 font-semibold mb-1">{formatted}</div>
                    <h3 className="text-lg font-semibold text-jade-purple mb-2">{event.title}</h3>
                    <div className="mb-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${typeClasses[event.type]}`}>
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </span>
                    </div>
                    {event.newsletter && (
                      <div className="mb-2 bg-gray-100 p-2 rounded text-sm">
                        <strong>Newsletter:</strong> {event.newsletter}
                      </div>
                    )}
                    {event.content && (
                      <div className="mb-2 text-sm text-gray-700">
                        <strong>Content:</strong> {event.content}
                      </div>
                    )}
                    {event.notes && (
                      <div className="text-sm text-gray-600 italic">{event.notes}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* All Other Tabs */}
        {activeTab !== 'calendar' && (
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

                switch (activeTab) {
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
