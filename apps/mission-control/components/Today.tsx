'use client';

import { useState, useEffect } from 'react';
import { Sun, ChevronDown, ChevronUp, CheckCircle2, Clock, AlertCircle, Trash2 } from 'lucide-react';

interface AggregatedItem {
  id: string;
  section: string;
  title: string;
  status: 'urgent' | 'in-progress' | 'coming-up';
  description?: string;
  icon?: string;
  subTaskProgress?: { completed: number; total: number };
  dueTime?: string;
  actions?: Array<{
    label: string;
    callback: () => void;
    style?: 'primary' | 'secondary' | 'danger';
  }>;
}

export default function Today() {
  const [items, setItems] = useState<AggregatedItem[]>([]);
  const [collapsedSections, setCollapsedSections] = useState<{
    urgent: boolean;
    'in-progress': boolean;
    'coming-up': boolean;
  }>({
    urgent: false,
    'in-progress': false,
    'coming-up': true,
  });
  const [mounted, setMounted] = useState(false);

  const today = new Date();
  const todayString = today.toISOString().split('T')[0];
  const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });

  // Aggregate items from all sources
  useEffect(() => {
    setMounted(true);

    if (typeof window === 'undefined') return;

    const aggregated: AggregatedItem[] = [];

    try {
      // 1. GUIDES - Get sub-tasks due today
      const guideTasksData = localStorage.getItem('guideTasksData');
      if (guideTasksData) {
        const guides = JSON.parse(guideTasksData);
        guides.forEach((guide: any) => {
          // Check if any sub-tasks are due today or overdue
          const urgentTasks = guide.subTasks.filter((st: any) => !st.completed);
          if (urgentTasks.length > 0 && guide.dueDate <= todayString) {
            aggregated.push({
              id: guide.id,
              section: 'Guides',
              title: guide.title,
              status: 'urgent',
              icon: '📚',
              subTaskProgress: {
                completed: guide.subTasks.filter((st: any) => st.completed).length,
                total: guide.subTasks.length,
              },
              actions: [
                {
                  label: '✓ Mark Done',
                  callback: () => console.log('Mark guide done'),
                  style: 'primary',
                },
                {
                  label: 'Details',
                  callback: () => console.log('View guide details'),
                  style: 'secondary',
                },
              ],
            });
          }
        });
      }

      // 2. APPOINTMENTS - Get today's appointments
      const appointmentsData = localStorage.getItem('appointmentsData');
      if (appointmentsData) {
        const appointments = JSON.parse(appointmentsData);
        appointments.forEach((apt: any) => {
          if (apt.date === todayString) {
            aggregated.push({
              id: apt.id,
              section: 'Appointments',
              title: `${apt.description} (${apt.person})`,
              status: 'urgent',
              icon: '📅',
              dueTime: apt.time,
              description: apt.location,
              actions: [
                {
                  label: '✓ Done',
                  callback: () => console.log('Mark appointment done'),
                  style: 'primary',
                },
                {
                  label: 'Details',
                  callback: () => console.log('View appointment details'),
                  style: 'secondary',
                },
              ],
            });
          }
        });
      }

      // 3. HOUSEHOLD TODOS - Get today's todos
      const householdData = localStorage.getItem('householdTodosData');
      if (householdData) {
        const todos = JSON.parse(householdData);
        todos.forEach((todo: any) => {
          if (!todo.completed && todo.dueDate === todayString) {
            const statusMap: Record<string, 'urgent' | 'in-progress' | 'coming-up'> = {
              high: 'urgent',
              medium: 'in-progress',
              low: 'coming-up',
            };
            const status = statusMap[todo.priority] || 'in-progress';
            aggregated.push({
              id: todo.id,
              section: 'Household To-Dos',
              title: todo.task,
              status: status,
              icon: '🏠',
              description: todo.description,
              actions: [
                {
                  label: '✓ Done',
                  callback: () => console.log('Mark todo done'),
                  style: 'primary',
                },
              ],
            });
          }
        });
      }

      // 4. CLEANING SCHEDULE - Get today's tasks
      const cleaningData = localStorage.getItem('cleaningScheduleAssignments');
      if (cleaningData) {
        const assignments = JSON.parse(cleaningData);
        const taskLibrary: any = {
          tidy: { name: 'Tidy living areas', timeEstimate: '15-20 min' },
          bathrooms: { name: 'Clean bathrooms', timeEstimate: '20-30 min' },
          kitchen: { name: 'Kitchen deep clean', timeEstimate: '45-60 min' },
          mop: { name: 'Mop floors', timeEstimate: '30-45 min' },
          vacuum: { name: 'Vacuum carpets', timeEstimate: '20-30 min' },
          laundry: { name: 'Wash & fold laundry', timeEstimate: '30-45 min' },
          sheets: { name: 'Change bed sheets', timeEstimate: '15-20 min' },
          dust: { name: 'Dust surfaces', timeEstimate: '20-30 min' },
          trash: { name: 'Take out trash/recycling', timeEstimate: '10-15 min' },
          windows: { name: 'Clean windows', timeEstimate: '30-45 min' },
          mirrors: { name: 'Clean mirrors & glass', timeEstimate: '15-20 min' },
          toilets: { name: 'Clean toilets', timeEstimate: '15-20 min' },
          appliances: { name: 'Wipe down appliances', timeEstimate: '20-30 min' },
          organize: { name: 'Organize closets/storage', timeEstimate: '45-60 min' },
          baseboards: { name: 'Wipe baseboards', timeEstimate: '30-40 min' },
        };

        const todayTasks = assignments.filter((a: any) => a.day === dayOfWeek);
        if (todayTasks.length > 0) {
          aggregated.push({
            id: 'cleaning-today',
            section: 'Cleaning Schedule',
            title: `Cleaning Tasks (${todayTasks.length})`,
            status: 'in-progress',
            icon: '🧹',
            description: todayTasks.map((t: any) => taskLibrary[t.taskId]?.name || t.taskId).join(', '),
            actions: [
              {
                label: '✓ Done',
                callback: () => console.log('Mark cleaning done'),
                style: 'primary',
              },
              {
                label: 'Details',
                callback: () => console.log('View cleaning details'),
                style: 'secondary',
              },
            ],
          });
        }
      }

      // 5. REMINDERS FOR JOHN - Get pending reminders
      const remindersData = localStorage.getItem('remindersForJohnData');
      if (remindersData) {
        const reminders = JSON.parse(remindersData);
        reminders.forEach((reminder: any) => {
          if (reminder.status === 'not-sent') {
            aggregated.push({
              id: reminder.id,
              section: 'Reminders for John',
              title: reminder.text,
              status: reminder.priority === 'high' ? 'urgent' : 'in-progress',
              icon: '🔔',
              actions: [
                {
                  label: '✓ Send',
                  callback: () => console.log('Send reminder'),
                  style: 'primary',
                },
              ],
            });
          }
        });
      }

      // 6. QUICK CAPTURES - Get pending captures
      const capturesData = localStorage.getItem('quickCaptures');
      if (capturesData) {
        const captures = JSON.parse(capturesData);
        captures.forEach((capture: any) => {
          if (capture.status === 'captured') {
            aggregated.push({
              id: capture.id,
              section: 'Quick Captures',
              title: capture.text,
              status: 'coming-up',
              icon: '📸',
              actions: [
                {
                  label: 'Process',
                  callback: () => console.log('Process capture'),
                  style: 'primary',
                },
              ],
            });
          }
        });
      }

      // 7. DECISIONS - Get open decisions
      const decisionsData = localStorage.getItem('decisionsData');
      if (decisionsData) {
        const decisions = JSON.parse(decisionsData);
        decisions.forEach((decision: any) => {
          if (decision.status === 'open') {
            aggregated.push({
              id: decision.id,
              section: 'Decisions',
              title: decision.title,
              status: 'coming-up',
              icon: '⚖️',
              description: decision.question,
              actions: [
                {
                  label: 'Decide',
                  callback: () => console.log('Decide now'),
                  style: 'primary',
                },
              ],
            });
          }
        });
      }

      // 8. CONTENT - Check if daily draft or work in progress
      const jadeContentData = localStorage.getItem('jadeContentData');
      if (jadeContentData) {
        try {
          const content = JSON.parse(jadeContentData);
          // Check for drafts in progress
          if (content.posts && Array.isArray(content.posts)) {
            content.posts.forEach((post: any) => {
              if (post.status === 'draft' && post.dueDate === todayString) {
                aggregated.push({
                  id: post.id || `post-${post.date}`,
                  section: 'Content',
                  title: `Content: ${post.content_type || 'Post'}`,
                  status: 'in-progress',
                  icon: '✍️',
                  dueTime: 'EOD',
                  actions: [
                    {
                      label: '✓ Done',
                      callback: () => console.log('Mark post done'),
                      style: 'primary',
                    },
                    {
                      label: 'Details',
                      callback: () => console.log('View post'),
                      style: 'secondary',
                    },
                  ],
                });
              }
            });
          }
        } catch (e) {
          // No content data
        }
      }

      // 9. HLS TASKS - Check for today's tasks
      const hlsTasksData = localStorage.getItem('jadeHLSTasksData');
      if (hlsTasksData) {
        try {
          const hlsTasks = JSON.parse(hlsTasksData);
          if (hlsTasks && Array.isArray(hlsTasks)) {
            hlsTasks.forEach((task: any) => {
              if (task.dueDate === todayString) {
                const statusMap: Record<string, 'urgent' | 'in-progress' | 'coming-up'> = {
                  'to-do': 'urgent',
                  'in-progress': 'in-progress',
                  done: 'coming-up',
                };
                const status = statusMap[task.status] || 'urgent';
                aggregated.push({
                  id: task.id,
                  section: 'HLS Tasks',
                  title: task.title,
                  status: status,
                  icon: '📝',
                  actions: [
                    {
                      label: '✓ Done',
                      callback: () => console.log('Mark HLS task done'),
                      style: 'primary',
                    },
                  ],
                });
              }
            });
          }
        } catch (e) {
          // No HLS tasks data
        }
      }

      // 10. MEAL PLANNING - Check Harvey's meals for today
      const harveyMealsData = localStorage.getItem('harveyMealPlanningData');
      if (harveyMealsData) {
        try {
          const mealData = JSON.parse(harveyMealsData);
          const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          const todayDayIndex = today.getDay();
          const todayDayName = daysOfWeek[todayDayIndex];
          
          if (mealData[todayDayName] && Array.isArray(mealData[todayDayName])) {
            const mealCount = mealData[todayDayName].length;
            aggregated.push({
              id: 'harvey-meals',
              section: 'Meal Planning',
              title: `Harvey's Meals (${mealCount})`,
              status: 'in-progress',
              icon: '🍽️',
              description: mealData[todayDayName].map((m: any) => m.name || m.meal).join(', '),
              actions: [
                {
                  label: '✓ Done',
                  callback: () => console.log('Mark meals done'),
                  style: 'primary',
                },
                {
                  label: 'Details',
                  callback: () => console.log('View meals'),
                  style: 'secondary',
                },
              ],
            });
          }
        } catch (e) {
          // No meal data
        }
      }

      setItems(aggregated);
    } catch (e) {
      console.error('Error aggregating today items:', e);
    }
  }, [todayString, dayOfWeek]);

  const urgentCount = items.filter((i) => i.status === 'urgent').length;
  const inProgressCount = items.filter((i) => i.status === 'in-progress').length;
  const comingUpCount = items.filter((i) => i.status === 'coming-up').length;

  const renderItemsSection = (status: 'urgent' | 'in-progress' | 'coming-up', label: string, emoji: string) => {
    const sectionItems = items.filter((i) => i.status === status);
    const count = sectionItems.length;
    const isCollapsed = collapsedSections[status];

    if (count === 0) {
      return null;
    }

    return (
      <div key={status} className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Section Header */}
        <div
          className={`p-4 cursor-pointer flex items-center justify-between ${
            status === 'urgent'
              ? 'bg-red-50 border-l-4 border-red-500 hover:bg-red-100'
              : status === 'in-progress'
              ? 'bg-yellow-50 border-l-4 border-yellow-500 hover:bg-yellow-100'
              : 'bg-green-50 border-l-4 border-green-500 hover:bg-green-100'
          }`}
          onClick={() => setCollapsedSections({ ...collapsedSections, [status]: !isCollapsed })}
        >
          <div className="flex items-center space-x-3">
            <span className="text-xl">{emoji}</span>
            <div>
              <h3 className="font-bold text-gray-800">
                {label} ({count})
              </h3>
              <p className="text-xs text-gray-600">
                {status === 'urgent' && 'Must do today'}
                {status === 'in-progress' && 'Working on it'}
                {status === 'coming-up' && 'Schedule for later'}
              </p>
            </div>
          </div>
          {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </div>

        {/* Items */}
        {!isCollapsed && (
          <div className="divide-y">
            {sectionItems.map((item) => (
              <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                {/* Item Header */}
                <div className="flex items-start space-x-3 mb-2">
                  <span className="text-lg mt-1">{item.icon || '📌'}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{item.title}</h4>
                    {item.description && (
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    )}
                    {item.subTaskProgress && (
                      <div className="mt-2 flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{
                              width: `${(item.subTaskProgress.completed / item.subTaskProgress.total) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600 whitespace-nowrap">
                          {item.subTaskProgress.completed}/{item.subTaskProgress.total}
                        </span>
                      </div>
                    )}
                    {item.dueTime && (
                      <p className="text-xs text-gray-500 mt-2">
                        ⏰ {item.dueTime}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {item.actions && (
                  <div className="flex flex-wrap gap-2 ml-8">
                    {item.actions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={action.callback}
                        className={`text-xs font-medium px-3 py-1 rounded transition-colors ${
                          action.style === 'primary'
                            ? 'bg-jade-purple text-white hover:bg-jade-light hover:text-jade-purple'
                            : action.style === 'danger'
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Loading today's view...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-jade-purple to-jade-light rounded-lg shadow-lg p-8 text-white">
        <div className="flex items-center space-x-3 mb-2">
          <Sun size={32} />
          <h1 className="text-3xl font-bold">Today's Focus</h1>
        </div>
        <p className="text-jade-cream opacity-90">
          {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 rounded-lg shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center space-x-3">
            <AlertCircle size={32} className="text-red-600" />
            <div>
              <p className="text-sm text-gray-600">🔴 Urgent</p>
              <p className="text-3xl font-bold text-red-600">{urgentCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center space-x-3">
            <Clock size={32} className="text-yellow-600" />
            <div>
              <p className="text-sm text-gray-600">🟡 In Progress</p>
              <p className="text-3xl font-bold text-yellow-600">{inProgressCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center space-x-3">
            <CheckCircle2 size={32} className="text-green-600" />
            <div>
              <p className="text-sm text-gray-600">🟢 Coming Up</p>
              <p className="text-3xl font-bold text-green-600">{comingUpCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {renderItemsSection('urgent', 'URGENT', '🔴')}
        {renderItemsSection('in-progress', 'IN PROGRESS', '🟡')}
        {renderItemsSection('coming-up', 'COMING UP', '🟢')}
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Sun size={48} className="mx-auto text-jade-purple opacity-30 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No tasks for today</h3>
          <p className="text-gray-600">Great! You have a clear day ahead. 🎉</p>
        </div>
      )}
    </div>
  );
}
