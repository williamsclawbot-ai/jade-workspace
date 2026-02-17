'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, Clock, Zap } from 'lucide-react';

interface PersonalTask {
  id: string;
  name: string;
  status: 'to-do' | 'in-progress' | 'done';
  dateAdded: string;
  completedDate: string | null;
  dueDate?: string;
}

export default function PersonalTasks() {
  const [tasks, setTasks] = useState<PersonalTask[]>([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('personalTasks');
    if (savedTasks) {
      try {
        const parsed = JSON.parse(savedTasks);
        setTasks(parsed);
      } catch (error) {
        console.error('Failed to load personal tasks:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage whenever tasks change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('personalTasks', JSON.stringify(tasks));
    }
  }, [tasks, isLoading]);

  const addTask = () => {
    if (newTaskName.trim()) {
      const newTask: PersonalTask = {
        id: `task-${Date.now()}`,
        name: newTaskName,
        status: 'to-do',
        dateAdded: new Date().toISOString().split('T')[0],
        completedDate: null,
        dueDate: newTaskDueDate || undefined,
      };
      setTasks([newTask, ...tasks]);
      setNewTaskName('');
      setNewTaskDueDate('');
    }
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleTaskStatus = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        let nextStatus: 'to-do' | 'in-progress' | 'done';
        
        if (task.status === 'to-do') {
          nextStatus = 'in-progress';
        } else if (task.status === 'in-progress') {
          nextStatus = 'done';
        } else {
          nextStatus = 'to-do';
        }

        return {
          ...task,
          status: nextStatus,
          completedDate: nextStatus === 'done' ? new Date().toISOString().split('T')[0] : null,
        };
      }
      return task;
    }));
  };

  const markComplete = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        return {
          ...task,
          status: 'done',
          completedDate: new Date().toISOString().split('T')[0],
        };
      }
      return task;
    }));
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircle2 size={20} className="text-green-600" />;
      case 'in-progress':
        return <Zap size={20} className="text-amber-600" />;
      case 'to-do':
      default:
        return <Clock size={20} className="text-gray-400" />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'done':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'in-progress':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'to-do':
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'done':
        return '🟢 Done';
      case 'in-progress':
        return '🟡 In Progress';
      case 'to-do':
      default:
        return '🔴 To Do';
    }
  };

  const toDoCount = tasks.filter(t => t.status === 'to-do').length;
  const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;
  const doneCount = tasks.filter(t => t.status === 'done').length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-jade-purple border-t-jade-cream"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-jade-purple to-jade-light rounded-lg shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-4xl">✓</span>
              <h1 className="text-3xl font-bold">Personal Tasks</h1>
            </div>
            <p className="text-jade-cream opacity-90">
              Track your personal to-dos, projects, and goals.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-right">
            <div>
              <p className="text-3xl font-bold">{toDoCount}</p>
              <p className="text-jade-cream opacity-90 text-sm">To Do</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{inProgressCount}</p>
              <p className="text-jade-cream opacity-90 text-sm">In Progress</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{doneCount}</p>
              <p className="text-jade-cream opacity-90 text-sm">Done</p>
            </div>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-lg shadow-md p-6 border-2 border-jade-light">
        <label className="block text-sm font-semibold text-jade-purple mb-3">
          ➕ Add a new personal task
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type your task description..."
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addTask();
              }
            }}
            className="flex-1 px-4 py-3 border border-jade-light rounded-lg focus:outline-none focus:ring-2 focus:ring-jade-purple transition-all"
          />
          <input
            type="date"
            value={newTaskDueDate}
            onChange={(e) => setNewTaskDueDate(e.target.value)}
            className="px-4 py-3 border border-jade-light rounded-lg focus:outline-none focus:ring-2 focus:ring-jade-purple transition-all"
            title="Due date (optional)"
          />
          <button
            onClick={addTask}
            disabled={!newTaskName.trim()}
            className="flex items-center gap-2 px-6 py-3 bg-jade-purple text-white rounded-lg font-semibold hover:bg-jade-purple/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
          >
            <Plus size={20} />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center border-2 border-dashed border-jade-light">
          <span className="text-5xl mb-4 block">✓</span>
          <p className="text-gray-600 text-lg mb-2">No personal tasks yet</p>
          <p className="text-gray-500">Add your first task above to get started!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white rounded-lg shadow-md p-6 border-l-4 hover:shadow-lg transition-shadow ${
                task.status === 'done'
                  ? 'border-green-500 opacity-75'
                  : task.status === 'in-progress'
                  ? 'border-amber-500'
                  : 'border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Task Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className="mt-1 p-1 hover:bg-jade-cream rounded-lg transition-colors flex-shrink-0"
                      title="Change status"
                    >
                      {getStatusIcon(task.status)}
                    </button>
                    <div className="flex-1">
                      <p
                        className={`text-lg font-medium ${
                          task.status === 'done'
                            ? 'line-through text-gray-500'
                            : 'text-gray-900'
                        }`}
                      >
                        {task.name}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Added: {formatDate(task.dateAdded)}
                        {task.dueDate && ` • Due: ${formatDate(task.dueDate)}`}
                        {task.completedDate && ` • Completed: ${formatDate(task.completedDate)}`}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(
                        task.status
                      )}`}
                    >
                      {getStatusLabel(task.status)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 flex-shrink-0">
                  {task.status !== 'done' && (
                    <button
                      onClick={() => markComplete(task.id)}
                      className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium border border-green-200 whitespace-nowrap"
                      title="Mark as done"
                    >
                      <CheckCircle2 size={16} />
                      <span className="hidden sm:inline">Done</span>
                    </button>
                  )}
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium border border-red-200"
                    title="Delete task"
                  >
                    <Trash2 size={16} />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
