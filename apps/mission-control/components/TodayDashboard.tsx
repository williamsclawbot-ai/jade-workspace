'use client';

import { useState, useEffect } from 'react';
import { Check, Clock, AlertCircle, Zap, CheckCircle, Calendar } from 'lucide-react';

interface TodayTask {
  id: string;
  title: string;
  dueTime?: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  category: 'content' | 'guide' | 'campaign' | 'admin';
  completed: boolean;
  notes?: string;
}

export default function TodayDashboard() {
  const [todayTasks, setTodayTasks] = useState<TodayTask[]>([
    {
      id: 'content-draft',
      title: 'Daily Content Draft',
      dueTime: '5:00 PM EOD',
      priority: 'urgent',
      category: 'content',
      completed: false,
      notes: '1 piece for content calendar — TikTok, Instagram, or Blog format',
    },
    {
      id: 'support-reel',
      title: 'Film Support Reel',
      dueTime: 'This Week',
      priority: 'high',
      category: 'content',
      completed: false,
      notes: 'Quick testimonial/demo reel showing your support process',
    },
    {
      id: 'guides-review',
      title: '5-18 Month Guide Writing Review',
      dueTime: 'EOW',
      priority: 'high',
      category: 'guide',
      completed: false,
      notes: 'Check progress on current writing. Aim for 80% → 90% by Friday',
    },
    {
      id: 'calendar-draft',
      title: 'Full Weekly Content Calendar',
      dueTime: 'Sunday 11:59 PM',
      priority: 'high',
      category: 'content',
      completed: false,
      notes: 'All 7 days planned and drafted by Sunday',
    },
    {
      id: 'campaign-prep',
      title: 'Hello Little Traveller Campaign Setup',
      dueTime: 'Feb 28',
      priority: 'medium',
      category: 'campaign',
      completed: false,
      notes: 'April school holidays — timeline, social posts, Meta ads',
    },
  ]);

  const [showCompleted, setShowCompleted] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('jade_today_tasks');
    if (saved) {
      setTodayTasks(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('jade_today_tasks', JSON.stringify(todayTasks));
  }, [todayTasks]);

  const toggleTask = (taskId: string) => {
    setTodayTasks(todayTasks.map(t =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    ));
  };

  const getTaskColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-4 border-red-500 bg-red-50';
      case 'high':
        return 'border-l-4 border-orange-500 bg-orange-50';
      case 'medium':
        return 'border-l-4 border-blue-500 bg-blue-50';
      case 'low':
        return 'border-l-4 border-green-500 bg-green-50';
      default:
        return 'border-l-4 border-gray-500 bg-gray-50';
    }
  };

  const getCategoryBadge = (category: string) => {
    const badges = {
      content: { label: '📝 Content', color: 'bg-blue-100 text-blue-800' },
      guide: { label: '📘 Guide', color: 'bg-purple-100 text-purple-800' },
      campaign: { label: '🎯 Campaign', color: 'bg-pink-100 text-pink-800' },
      admin: { label: '⚙️ Admin', color: 'bg-gray-100 text-gray-800' },
    };
    const badge = badges[category as keyof typeof badges];
    return badge || badges.admin;
  };

  const incompleteTasks = todayTasks.filter(t => !t.completed);
  const completedTasks = todayTasks.filter(t => t.completed);
  const urgentTasks = incompleteTasks.filter(t => t.priority === 'urgent');

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="border-b border-jade-light pb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-jade-purple mb-2">Today's Dashboard</h1>
            <p className="text-gray-600">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-jade-purple">{incompleteTasks.length}</p>
            <p className="text-sm text-gray-600">tasks remaining</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500">
          <p className="text-gray-600 text-sm mb-1">🔴 Urgent</p>
          <p className="text-3xl font-bold text-red-600">{urgentTasks.length}</p>
          <p className="text-xs text-gray-500 mt-2">Must complete today</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500">
          <p className="text-gray-600 text-sm mb-1">🟠 High Priority</p>
          <p className="text-3xl font-bold text-orange-600">{incompleteTasks.filter(t => t.priority === 'high').length}</p>
          <p className="text-xs text-gray-500 mt-2">This week</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm mb-1">📋 Total Tasks</p>
          <p className="text-3xl font-bold text-blue-600">{todayTasks.length}</p>
          <p className="text-xs text-gray-500 mt-2">Planned</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
          <p className="text-gray-600 text-sm mb-1">✅ Completed</p>
          <p className="text-3xl font-bold text-green-600">{completedTasks.length}</p>
          <p className="text-xs text-gray-500 mt-2">{Math.round((completedTasks.length / todayTasks.length) * 100)}% done</p>
        </div>
      </div>

      {/* Urgent Tasks (Always visible) */}
      {urgentTasks.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-900 mb-4 flex items-center space-x-2">
            <AlertCircle size={24} />
            <span>⚡ URGENT — Must Do Today</span>
          </h2>
          <div className="space-y-3">
            {urgentTasks.map(task => (
              <div
                key={task.id}
                className={`p-4 rounded-lg ${getTaskColor(task.priority)} cursor-pointer hover:shadow-md transition-shadow`}
                onClick={() => toggleTask(task.id)}
              >
                <div className="flex items-start space-x-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTask(task.id);
                    }}
                    className="mt-1 flex-shrink-0"
                  >
                    <div className="w-6 h-6 border-2 border-red-600 rounded flex items-center justify-center hover:bg-red-100 transition-colors">
                      {task.completed && (
                        <CheckCircle size={20} className="text-red-600" />
                      )}
                    </div>
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className={`font-bold text-gray-900 ${task.completed ? 'line-through text-gray-500' : ''}`}>
                        {task.title}
                      </h3>
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${getCategoryBadge(task.category).color}`}>
                        {getCategoryBadge(task.category).label}
                      </span>
                    </div>
                    {task.notes && (
                      <p className="text-sm text-gray-700 mb-2">{task.notes}</p>
                    )}
                    {task.dueTime && (
                      <p className="text-xs text-red-700 font-semibold flex items-center space-x-1">
                        <Clock size={14} />
                        <span>{task.dueTime}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regular Tasks */}
      <div>
        <h2 className="text-2xl font-bold text-jade-purple mb-4">
          📋 All Tasks ({incompleteTasks.filter(t => t.priority !== 'urgent').length} remaining)
        </h2>
        <div className="space-y-3">
          {incompleteTasks
            .filter(t => t.priority !== 'urgent')
            .map(task => (
              <div
                key={task.id}
                className={`p-4 rounded-lg ${getTaskColor(task.priority)} cursor-pointer hover:shadow-md transition-shadow`}
                onClick={() => toggleTask(task.id)}
              >
                <div className="flex items-start space-x-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTask(task.id);
                    }}
                    className="mt-1 flex-shrink-0"
                  >
                    <div className="w-6 h-6 border-2 border-gray-400 rounded flex items-center justify-center hover:bg-gray-200 transition-colors">
                      {task.completed && (
                        <CheckCircle size={20} className="text-gray-600" />
                      )}
                    </div>
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className={`font-semibold text-gray-900 ${task.completed ? 'line-through text-gray-500' : ''}`}>
                        {task.title}
                      </h3>
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${getCategoryBadge(task.category).color}`}>
                        {getCategoryBadge(task.category).label}
                      </span>
                    </div>
                    {task.notes && (
                      <p className="text-sm text-gray-700 mb-2">{task.notes}</p>
                    )}
                    {task.dueTime && (
                      <p className="text-xs text-gray-600 flex items-center space-x-1">
                        <Clock size={14} />
                        <span>{task.dueTime}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Completed Tasks Toggle */}
      {completedTasks.length > 0 && (
        <div>
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="text-jade-purple font-semibold flex items-center space-x-2 hover:text-jade-light transition-colors mb-4"
          >
            <Check size={20} />
            <span>
              {showCompleted ? 'Hide' : 'Show'} Completed Tasks ({completedTasks.length})
            </span>
          </button>
          {showCompleted && (
            <div className="space-y-3">
              {completedTasks.map(task => (
                <div
                  key={task.id}
                  className="p-4 rounded-lg bg-gray-100 border-l-4 border-green-500 cursor-pointer hover:shadow-md transition-shadow opacity-60"
                  onClick={() => toggleTask(task.id)}
                >
                  <div className="flex items-start space-x-4">
                    <button className="mt-1 flex-shrink-0">
                      <CheckCircle size={24} className="text-green-600" />
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="line-through text-gray-600 font-semibold">
                          {task.title}
                        </h3>
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${getCategoryBadge(task.category).color}`}>
                          {getCategoryBadge(task.category).label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Progress Motivator */}
      {incompleteTasks.length > 0 && (
        <div className="bg-jade-purple text-jade-cream rounded-lg p-6 text-center">
          <p className="text-sm opacity-90 mb-2">You're making progress! 💪</p>
          <p className="text-lg font-bold">
            {completedTasks.length} / {todayTasks.length} tasks complete
          </p>
          <div className="w-full bg-jade-light rounded-full h-2 mt-4">
            <div
              className="bg-jade-cream h-2 rounded-full transition-all"
              style={{ width: `${(completedTasks.length / todayTasks.length) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
