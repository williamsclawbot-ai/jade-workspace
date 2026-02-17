'use client';

import { useState, useEffect } from 'react';
import { BookOpen, ChevronDown, ChevronUp, CheckCircle2, Circle, Star } from 'lucide-react';

interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

interface GuideTask {
  id: string;
  title: string;
  priority: 'high' | 'normal';
  dueDate: string;
  subTasks: SubTask[];
  expanded: boolean;
}

const INITIAL_TASKS: GuideTask[] = [
  {
    id: 'sleep-guide-5-18',
    title: '5–18 Month Sleep Guide',
    priority: 'high',
    dueDate: '2026-02-28',
    subTasks: [
      { id: 'st1', title: 'Finish written copy', completed: false },
      { id: 'st2', title: 'Design in Canva', completed: false },
      { id: 'st3', title: 'Set up product in GoHighLevel', completed: false },
      { id: 'st4', title: 'Create workflows in GoHighLevel', completed: false },
      { id: 'st5', title: 'Create email sequences', completed: false },
      { id: 'st6', title: 'Email to database announcing launch', completed: false },
      { id: 'st7', title: 'Create social media launch content', completed: false },
      { id: 'st8', title: 'Set up meta ads', completed: false },
    ],
    expanded: true,
  },
  {
    id: 'bridging-guide-4-5',
    title: '4–5 Month Bridging Guide',
    priority: 'normal',
    dueDate: '2026-02-28',
    subTasks: [
      { id: 'st1', title: 'Find existing draft (check Claude, ChatGPT, saved files)', completed: false },
      { id: 'st2', title: 'Review and finalise written copy', completed: false },
      { id: 'st3', title: 'Design in Canva', completed: false },
      { id: 'st4', title: 'Set up product in GoHighLevel', completed: false },
      { id: 'st5', title: 'Create workflows in GoHighLevel', completed: false },
      { id: 'st6', title: 'Create email sequences', completed: false },
      { id: 'st7', title: 'Email to database', completed: false },
      { id: 'st8', title: 'Create social media launch content', completed: false },
      { id: 'st9', title: 'Set up meta ads', completed: false },
    ],
    expanded: false,
  },
  {
    id: 'toddler-guide-18-3y',
    title: '18 Month – 3 Year Toddler Guide',
    priority: 'normal',
    dueDate: '2026-02-28',
    subTasks: [
      { id: 'st1', title: 'Find existing written copy (check Claude, ChatGPT, saved files)', completed: false },
      { id: 'st2', title: 'Review and finalise written copy', completed: false },
      { id: 'st3', title: 'Design in Canva', completed: false },
      { id: 'st4', title: 'Set up product in GoHighLevel', completed: false },
      { id: 'st5', title: 'Create workflows in GoHighLevel', completed: false },
      { id: 'st6', title: 'Create email sequences', completed: false },
      { id: 'st7', title: 'Email to database', completed: false },
      { id: 'st8', title: 'Create social media launch content', completed: false },
      { id: 'st9', title: 'Set up meta ads', completed: false },
    ],
    expanded: false,
  },
  {
    id: 'newborn-guide',
    title: 'Newborn Guide',
    priority: 'normal',
    dueDate: '2026-02-28',
    subTasks: [
      { id: 'st1', title: 'Review current guide', completed: false },
      { id: 'st2', title: 'Identify what needs redesigning and rewriting', completed: false },
      { id: 'st3', title: 'Rewrite and redesign to align with the other guides', completed: false },
      { id: 'st4', title: 'Update in Canva', completed: false },
      { id: 'st5', title: 'Update product in GoHighLevel', completed: false },
      { id: 'st6', title: 'Create bundle product in GoHighLevel with all guides', completed: false },
    ],
    expanded: false,
  },
  {
    id: 'sample-schedules',
    title: 'Sample Schedules Guide',
    priority: 'normal',
    dueDate: '2026-02-28',
    subTasks: [
      { id: 'st1', title: 'Decide age range (12–18 months or up to 3 years)', completed: false },
      { id: 'st2', title: 'Write content', completed: false },
      { id: 'st3', title: 'Design as PDF ebook', completed: false },
      { id: 'st4', title: 'Set up product in GoHighLevel', completed: false },
      { id: 'st5', title: 'Create workflows and emails', completed: false },
      { id: 'st6', title: 'Launch content', completed: false },
    ],
    expanded: false,
  },
  {
    id: 'daycare-prep',
    title: 'Daycare Prep Guide',
    priority: 'normal',
    dueDate: '2026-02-28',
    subTasks: [
      { id: 'st1', title: 'Decide if this is still worth creating or if the window has passed for this year', completed: false },
      { id: 'st2', title: 'If yes, outline and begin drafting', completed: false },
    ],
    expanded: false,
  },
];

export default function Guides() {
  const [tasks, setTasks] = useState<GuideTask[]>(INITIAL_TASKS);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('guideTasksData');
      if (saved) {
        const parsed = JSON.parse(saved);
        setTasks(parsed);
      }
    } catch (e) {
      console.log('No saved guide tasks data');
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage whenever tasks change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('guideTasksData', JSON.stringify(tasks));
    }
  }, [tasks, isLoading]);

  const toggleTaskExpanded = (taskId: string) => {
    setTasks(tasks.map(t =>
      t.id === taskId ? { ...t, expanded: !t.expanded } : t
    ));
  };

  const toggleSubTaskCompleted = (taskId: string, subTaskId: string) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          subTasks: t.subTasks.map(st =>
            st.id === subTaskId ? { ...st, completed: !st.completed } : st
          ),
        };
      }
      return t;
    }));
  };

  const getProgressPercentage = (task: GuideTask): number => {
    if (task.subTasks.length === 0) return 0;
    const completed = task.subTasks.filter(st => st.completed).length;
    return Math.round((completed / task.subTasks.length) * 100);
  };

  const daysUntilDue = (dueDate: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getDueStatus = (daysUntil: number): { text: string; color: string } => {
    if (daysUntil < 0) {
      return { text: `${Math.abs(daysUntil)} days overdue`, color: 'text-red-600 bg-red-50' };
    } else if (daysUntil === 0) {
      return { text: 'Due TODAY', color: 'text-orange-600 bg-orange-50' };
    } else if (daysUntil <= 7) {
      return { text: `${daysUntil} days left`, color: 'text-amber-600 bg-amber-50' };
    } else {
      return { text: `${daysUntil} days left`, color: 'text-blue-600 bg-blue-50' };
    }
  };

  const totalProgress = Math.round(
    (tasks.reduce((sum, t) => sum + t.subTasks.filter(st => st.completed).length, 0) /
      tasks.reduce((sum, t) => sum + t.subTasks.length, 0)) * 100
  );

  const totalSubTasks = tasks.reduce((sum, t) => sum + t.subTasks.length, 0);
  const completedSubTasks = tasks.reduce((sum, t) => sum + t.subTasks.filter(st => st.completed).length, 0);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-jade-purple to-jade-light rounded-lg shadow-lg p-8 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">📚 Hello Little Sleepers Guides</h1>
            <p className="text-jade-cream opacity-90">
              Track progress on all guide creation projects — all due February 28, 2026
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{totalProgress}%</div>
            <div className="text-sm opacity-90">Overall Progress</div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-jade-purple">
          <p className="text-gray-600 text-xs uppercase tracking-wider mb-1">Total Guides</p>
          <p className="text-3xl font-bold text-jade-purple">{tasks.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
          <p className="text-gray-600 text-xs uppercase tracking-wider mb-1">Completed Tasks</p>
          <p className="text-3xl font-bold text-green-600">{completedSubTasks}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
          <p className="text-gray-600 text-xs uppercase tracking-wider mb-1">Total Sub-Tasks</p>
          <p className="text-3xl font-bold text-blue-600">{totalSubTasks}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500">
          <p className="text-gray-600 text-xs uppercase tracking-wider mb-1">Priority Tasks</p>
          <p className="text-3xl font-bold text-red-600">1</p>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {tasks.map((task) => {
          const progress = getProgressPercentage(task);
          const daysLeft = daysUntilDue(task.dueDate);
          const dueStatus = getDueStatus(daysLeft);
          const completedCount = task.subTasks.filter(st => st.completed).length;

          return (
            <div key={task.id} className="bg-white rounded-lg shadow-md overflow-hidden border-l-4" style={{
              borderColor: task.priority === 'high' ? '#c41e3a' : '#7c7c7c'
            }}>
              {/* Main Task Header */}
              <div
                onClick={() => toggleTaskExpanded(task.id)}
                className="p-6 cursor-pointer hover:bg-jade-light/10 active:bg-jade-light/20 transition-all duration-200 select-none"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 hover:text-jade-purple transition-colors">
                        {task.title}
                      </h3>
                      {task.priority === 'high' && (
                        <div className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                          <Star size={14} className="fill-current" />
                          PRIORITY
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className={`text-sm font-medium px-3 py-1 rounded ${dueStatus.color}`}>
                        📅 {dueStatus.text}
                      </span>
                      <span className="text-sm text-gray-600">
                        {completedCount}/{task.subTasks.length} sub-tasks done
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-right mb-2">
                      <div className="text-2xl font-bold text-jade-purple">{progress}%</div>
                      <div className="text-xs text-gray-600">Complete</div>
                    </div>
                    <button className="text-jade-purple hover:text-jade-light transition-colors">
                      {task.expanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-jade-purple to-jade-light h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Sub-Tasks (Expandable) */}
              {task.expanded && (
                <div className="bg-gradient-to-br from-gray-50 to-white border-t border-gray-200 px-6 py-4 space-y-3">
                  <h4 className="font-semibold text-gray-700 mb-4 text-sm">Sub-tasks ({task.subTasks.filter(st => st.completed).length}/{task.subTasks.length} completed)</h4>
                  {task.subTasks.map((subTask) => (
                    <div key={subTask.id} className="flex items-start gap-3 p-2 rounded hover:bg-white transition-colors cursor-pointer group">
                      <button
                        onClick={() => toggleSubTaskCompleted(task.id, subTask.id)}
                        className="mt-1 focus:outline-none transition-all hover:scale-110"
                      >
                        {subTask.completed ? (
                          <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" />
                        ) : (
                          <Circle size={20} className="text-gray-400 flex-shrink-0 group-hover:text-jade-purple group-hover:scale-110" />
                        )}
                      </button>
                      <span
                        className={`flex-1 text-sm transition-all ${
                          subTask.completed
                            ? 'line-through text-gray-500'
                            : 'text-gray-700 group-hover:text-jade-purple font-medium'
                        }`}
                      >
                        {subTask.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
        <p className="text-sm text-gray-700">
          <strong>💾 Auto-saving:</strong> All progress is saved automatically to your browser.
          <br />
          <strong>⭐ Priority:</strong> The 5–18 Month Sleep Guide is flagged as the most important project.
          <br />
          <strong>📅 Deadline:</strong> All guides must be completed and launched by February 28, 2026.
        </p>
      </div>
    </div>
  );
}
