'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Calendar, User, Flag } from 'lucide-react';

interface PipelineTask {
  id: string;
  title: string;
  description: string;
  assignee: 'You' | 'John' | 'Team';
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  status: 'backlog' | 'in-progress' | 'in-review' | 'done';
  createdAt: string;
}

type StatusType = 'backlog' | 'in-progress' | 'in-review' | 'done';

const DEFAULT_TASKS: PipelineTask[] = [
  {
    id: 'task-1',
    title: '5–18 Month Sleep Guide',
    description: 'Complete comprehensive sleep guide for 5-18 month olds',
    assignee: 'You',
    priority: 'High',
    dueDate: '2026-02-28',
    status: 'backlog',
    createdAt: '2026-02-17'
  },
  {
    id: 'task-2',
    title: '4–5 Month Bridging Guide',
    description: 'Bridge guide for 4-5 month sleep transition',
    assignee: 'You',
    priority: 'Medium',
    dueDate: '2026-02-28',
    status: 'in-progress',
    createdAt: '2026-02-17'
  },
  {
    id: 'task-3',
    title: '18 Month – 3 Year Toddler Guide',
    description: 'Toddler sleep management for 18 months to 3 years',
    assignee: 'Team',
    priority: 'Medium',
    dueDate: '2026-02-28',
    status: 'backlog',
    createdAt: '2026-02-17'
  },
  {
    id: 'task-4',
    title: 'Newborn Guide',
    description: 'Newborn sleep guide for first 0-4 months',
    assignee: 'You',
    priority: 'Medium',
    dueDate: '2026-02-28',
    status: 'in-review',
    createdAt: '2026-02-17'
  },
  {
    id: 'task-5',
    title: 'Sample Schedules Guide',
    description: 'Age-appropriate sample sleep schedules',
    assignee: 'John',
    priority: 'Medium',
    dueDate: '2026-02-28',
    status: 'done',
    createdAt: '2026-02-17'
  },
  {
    id: 'task-6',
    title: 'Daycare Prep Guide',
    description: 'Guide for preparing children for daycare transitions',
    assignee: 'Team',
    priority: 'Low',
    dueDate: '2026-03-15',
    status: 'backlog',
    createdAt: '2026-02-17'
  }
];

const COLUMN_CONFIG = {
  backlog: { title: '📌 BACKLOG', color: 'bg-slate-50', borderColor: 'border-slate-300' },
  'in-progress': { title: '🚀 IN PROGRESS', color: 'bg-blue-50', borderColor: 'border-blue-300' },
  'in-review': { title: '👀 IN REVIEW', color: 'bg-amber-50', borderColor: 'border-amber-300' },
  done: { title: '✅ DONE', color: 'bg-green-50', borderColor: 'border-green-300' }
};

const PRIORITY_COLORS = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-blue-100 text-blue-700'
};

const ASSIGNEE_COLORS = {
  'You': 'bg-purple-100 text-purple-700',
  'John': 'bg-indigo-100 text-indigo-700',
  'Team': 'bg-teal-100 text-teal-700'
};

export default function HLSPipeline() {
  const [tasks, setTasks] = useState<PipelineTask[]>(DEFAULT_TASKS);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [filterAssignee, setFilterAssignee] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState<Partial<PipelineTask>>({
    title: '',
    description: '',
    assignee: 'You',
    priority: 'Medium',
    dueDate: new Date().toISOString().split('T')[0]
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('jadeHLSPipelineData');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setTasks(data.tasks || DEFAULT_TASKS);
      } catch (e) {
        console.log('No saved data, using defaults');
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('jadeHLSPipelineData', JSON.stringify({ tasks }));
  }, [tasks]);

  const getDaysUntil = (dueDate: string): { label: string; class: string } => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(dueDate);
    taskDate.setHours(0, 0, 0, 0);
    const daysUntil = Math.floor((taskDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntil < 0) {
      return { label: `${Math.abs(daysUntil)}d overdue`, class: 'bg-red-100 text-red-700' };
    } else if (daysUntil === 0) {
      return { label: 'Due TODAY', class: 'bg-orange-100 text-orange-700' };
    } else if (daysUntil === 1) {
      return { label: 'Due tomorrow', class: 'bg-yellow-100 text-yellow-700' };
    } else {
      return { label: `${daysUntil}d left`, class: 'bg-blue-100 text-blue-700' };
    }
  };

  const moveTask = (taskId: string, newStatus: StatusType) => {
    const updated = tasks.map(t =>
      t.id === taskId ? { ...t, status: newStatus } : t
    );
    setTasks(updated);
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
    setExpandedTaskId(null);
  };

  const addTask = () => {
    if (!newTask.title?.trim()) return;
    
    const task: PipelineTask = {
      id: `task-${Date.now()}`,
      title: newTask.title || '',
      description: newTask.description || '',
      assignee: (newTask.assignee as PipelineTask['assignee']) || 'You',
      priority: (newTask.priority as PipelineTask['priority']) || 'Medium',
      dueDate: newTask.dueDate || new Date().toISOString().split('T')[0],
      status: 'backlog',
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setTasks([...tasks, task]);
    setNewTask({
      title: '',
      description: '',
      assignee: 'You',
      priority: 'Medium',
      dueDate: new Date().toISOString().split('T')[0]
    });
    setShowAddForm(false);
  };

  const getFilteredTasks = (status: StatusType) => {
    return tasks.filter(task => {
      if (task.status !== status) return false;
      if (filterPriority && task.priority !== filterPriority) return false;
      if (filterAssignee && task.assignee !== filterAssignee) return false;
      return true;
    });
  };

  const TaskCard = ({ task }: { task: PipelineTask }) => {
    const isExpanded = expandedTaskId === task.id;
    const daysInfo = getDaysUntil(task.dueDate);

    return (
      <div
        className={`bg-white rounded-lg shadow-sm border-l-4 transition-all hover:shadow-md ${
          task.status === 'done' ? 'opacity-75' : ''
        } ${
          isExpanded ? 'ring-2 ring-jade-purple' : ''
        }`}
        style={{
          borderLeftColor:
            task.status === 'backlog' ? '#64748b' :
            task.status === 'in-progress' ? '#3b82f6' :
            task.status === 'in-review' ? '#f59e0b' :
            '#10b981'
        }}
      >
        <div className="p-4">
          {/* Card Header */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex-1">
              <h4 className={`font-semibold text-sm text-gray-900 ${
                task.status === 'done' ? 'line-through text-gray-500' : ''
              }`}>
                {task.title}
              </h4>
            </div>
            <button
              onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
              className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`text-xs font-semibold px-2 py-1 rounded ${PRIORITY_COLORS[task.priority]}`}>
              {task.priority}
            </span>
            <span className={`text-xs font-semibold px-2 py-1 rounded ${ASSIGNEE_COLORS[task.assignee]}`}>
              {task.assignee}
            </span>
            <span className={`text-xs font-semibold px-2 py-1 rounded ${daysInfo.class}`}>
              {daysInfo.label}
            </span>
          </div>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="border-t pt-3 mt-3 space-y-3">
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-1">Description</p>
                <p className="text-sm text-gray-700">{task.description || 'No description'}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">Due Date</p>
                  <p className="text-sm text-gray-700">{new Date(task.dueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">Created</p>
                  <p className="text-sm text-gray-700">{new Date(task.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Move to Status Buttons */}
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2">Move to</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(COLUMN_CONFIG).map(([status, config]) => (
                    <button
                      key={status}
                      onClick={() => moveTask(task.id, status as StatusType)}
                      disabled={task.status === status}
                      className={`text-xs px-2 py-1 rounded font-semibold transition-colors ${
                        task.status === status
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {config.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => deleteTask(task.id)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded font-semibold text-sm hover:bg-red-100 transition-colors"
              >
                <Trash2 size={14} />
                Delete Task
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const Column = ({ status, config }: { status: StatusType; config: typeof COLUMN_CONFIG[StatusType] }) => {
    const columnTasks = getFilteredTasks(status);

    return (
      <div className={`flex-1 min-w-0 rounded-lg border-2 flex flex-col overflow-hidden ${config.color} ${config.borderColor} border`}>
        {/* Column Header */}
        <div className="px-4 py-3 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-gray-900">{config.title}</h3>
            <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-2 py-1 rounded">
              {columnTasks.length}
            </span>
          </div>
        </div>

        {/* Column Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {columnTasks.length === 0 ? (
            <div className="h-32 flex items-center justify-center text-gray-400 text-xs text-center px-2">
              <p>No tasks here yet</p>
            </div>
          ) : (
            columnTasks.map(task => <TaskCard key={task.id} task={task} />)
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-jade-light px-6 py-4">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">🚀</span>
          <div>
            <h2 className="text-2xl font-bold text-jade-purple">HLS Pipeline</h2>
            <p className="text-sm text-gray-600">Kanban workflow for HLS content projects</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="border-b border-jade-light px-6 py-4 bg-gray-50">
        <div className="flex flex-wrap items-center gap-4">
          {/* Filters */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-gray-700">Filter:</label>
            <select
              value={filterPriority || ''}
              onChange={(e) => setFilterPriority(e.target.value || null)}
              className="px-3 py-2 text-sm border border-gray-300 rounded hover:border-gray-400 transition-colors cursor-pointer"
            >
              <option value="">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <select
              value={filterAssignee || ''}
              onChange={(e) => setFilterAssignee(e.target.value || null)}
              className="px-3 py-2 text-sm border border-gray-300 rounded hover:border-gray-400 transition-colors cursor-pointer"
            >
              <option value="">All Assignees</option>
              <option value="You">You</option>
              <option value="John">John</option>
              <option value="Team">Team</option>
            </select>
          </div>

          {/* Add Task Button */}
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="ml-auto flex items-center gap-2 px-4 py-2 bg-jade-purple text-jade-cream rounded font-semibold text-sm hover:bg-jade-purple/90 transition-colors"
          >
            <Plus size={16} />
            Add Task
          </button>
        </div>

        {/* Add Task Form */}
        {showAddForm && (
          <div className="mt-4 p-4 bg-white rounded border-l-4 border-jade-purple space-y-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Task Title *</label>
              <input
                type="text"
                value={newTask.title || ''}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Enter task title..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-jade-purple"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
              <textarea
                value={newTask.description || ''}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Enter task description..."
                rows={2}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-jade-purple"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
                <select
                  value={newTask.priority || 'Medium'}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as PipelineTask['priority'] })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-jade-purple"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Assignee</label>
                <select
                  value={newTask.assignee || 'You'}
                  onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value as PipelineTask['assignee'] })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-jade-purple"
                >
                  <option value="You">You</option>
                  <option value="John">John</option>
                  <option value="Team">Team</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={newTask.dueDate || ''}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-jade-purple"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={addTask}
                className="px-4 py-2 bg-jade-purple text-jade-cream rounded font-semibold text-sm hover:bg-jade-purple/90 transition-colors"
              >
                Create Task
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded font-semibold text-sm hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-6 h-full min-w-full">
          <Column status="backlog" config={COLUMN_CONFIG.backlog} />
          <Column status="in-progress" config={COLUMN_CONFIG['in-progress']} />
          <Column status="in-review" config={COLUMN_CONFIG['in-review']} />
          <Column status="done" config={COLUMN_CONFIG.done} />
        </div>
      </div>
    </div>
  );
}
