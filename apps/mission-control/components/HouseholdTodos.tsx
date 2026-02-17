'use client';

import { useState, useEffect } from 'react';
import { ClipboardList, Plus, Trash2, Edit2 } from 'lucide-react';

interface TodoItem {
  id: string;
  task: string;
  category: 'general' | 'maintenance' | 'urgent' | 'shopping';
  description?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  dueDate?: string;
}

const categories = [
  { id: 'general', label: 'General', emoji: '✓' },
  { id: 'maintenance', label: 'Maintenance', emoji: '🔧' },
  { id: 'urgent', label: 'Urgent', emoji: '⚡' },
  { id: 'shopping', label: 'Shopping', emoji: '🛒' },
];

export default function HouseholdTodos() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<'all' | 'general' | 'maintenance' | 'urgent' | 'shopping'>('all');
  const [formData, setFormData] = useState<{
    task: string;
    category: 'general' | 'maintenance' | 'urgent' | 'shopping';
    description: string;
    priority: 'low' | 'medium' | 'high';
    dueDate: string;
  }>({
    task: '',
    category: 'general',
    description: '',
    priority: 'medium',
    dueDate: '',
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('householdTodosData');
    if (saved) {
      try {
        setTodos(JSON.parse(saved));
      } catch (e) {
        console.log('No saved todos');
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('householdTodosData', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = () => {
    if (!formData.task.trim()) {
      alert('Please enter a task');
      return;
    }

    if (editingId) {
      setTodos(
        todos.map((t) =>
          t.id === editingId
            ? {
                ...t,
                task: formData.task,
                category: formData.category,
                description: formData.description,
                priority: formData.priority,
                dueDate: formData.dueDate,
              }
            : t
        )
      );
      setEditingId(null);
    } else {
      const newTodo: TodoItem = {
        id: Date.now().toString(),
        task: formData.task,
        category: formData.category,
        description: formData.description,
        priority: formData.priority,
        dueDate: formData.dueDate,
        completed: false,
      };
      setTodos([...todos, newTodo]);
    }

    setFormData({
      task: '',
      category: 'general',
      description: '',
      priority: 'medium',
      dueDate: '',
    });
    setShowForm(false);
  };

  const handleEdit = (todo: TodoItem) => {
    setFormData({
      task: todo.task,
      category: todo.category,
      description: todo.description || '',
      priority: todo.priority,
      dueDate: todo.dueDate || '',
    });
    setEditingId(todo.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this task?')) {
      setTodos(todos.filter((t) => t.id !== id));
    }
  };

  const toggleComplete = (id: string) => {
    setTodos(
      todos.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const filteredTodos = todos.filter((t) => {
    if (filterCategory === 'all') return !t.completed;
    return !t.completed && t.category === filterCategory;
  });

  const completedTodos = todos.filter((t) => t.completed);

  const priorityColor = {
    low: 'bg-blue-50 border-blue-200',
    medium: 'bg-yellow-50 border-yellow-200',
    high: 'bg-red-50 border-red-200',
  };

  const priorityBadge = {
    low: 'bg-blue-100 text-blue-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700',
  };

  const getCategoryInfo = (cat: string) => {
    return categories.find((c) => c.id === cat);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ClipboardList size={32} className="text-jade-purple" />
            <div>
              <h2 className="text-2xl font-bold text-jade-purple">Household To-Dos</h2>
              <p className="text-sm text-gray-600">General tasks, maintenance, and fixes</p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({
                task: '',
                category: 'general',
                description: '',
                priority: 'medium',
                dueDate: '',
              });
              setShowForm(!showForm);
            }}
            className="bg-jade-purple text-white px-4 py-2 rounded-lg hover:bg-jade-purple/80 transition flex items-center gap-2"
          >
            <Plus size={18} /> Add Task
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Form */}
        {showForm && (
          <div className="bg-jade-cream rounded-lg p-4 border border-jade-light">
            <h3 className="text-lg font-semibold text-jade-purple mb-4">
              {editingId ? 'Edit Task' : 'New Task'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                value={formData.task}
                onChange={(e) => setFormData({ ...formData, task: e.target.value })}
                placeholder="Task (e.g., Fix leaky tap)"
                className="col-span-1 md:col-span-2 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-jade-light focus:ring-1 focus:ring-jade-light"
              />

              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as any,
                  })
                }
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-jade-light focus:ring-1 focus:ring-jade-light"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.emoji} {cat.label}
                  </option>
                ))}
              </select>

              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: e.target.value as 'low' | 'medium' | 'high',
                  })
                }
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-jade-light focus:ring-1 focus:ring-jade-light"
              >
                <option value="low">🟦 Low Priority</option>
                <option value="medium">🟨 Medium Priority</option>
                <option value="high">🟥 High Priority</option>
              </select>

              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-jade-light focus:ring-1 focus:ring-jade-light"
              />

              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Description (optional)"
                className="col-span-1 md:col-span-2 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-jade-light focus:ring-1 focus:ring-jade-light min-h-[80px]"
              />

              <div className="col-span-1 md:col-span-2 flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTodo}
                  className="px-4 py-2 bg-jade-purple text-white rounded hover:bg-jade-purple/80 transition"
                >
                  {editingId ? 'Update' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition ${
              filterCategory === 'all'
                ? 'bg-jade-purple text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({todos.filter((t) => !t.completed).length})
          </button>
          {categories.map((cat) => {
            const count = todos.filter((t) => !t.completed && t.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id as any)}
                className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  filterCategory === cat.id
                    ? 'bg-jade-purple text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.emoji} {cat.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Active Tasks */}
        {filteredTodos.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardList size={48} className="mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">No active tasks</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className={`p-4 rounded-lg border ${priorityColor[todo.priority]}`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo.id)}
                    className="w-5 h-5 rounded accent-jade-purple mt-1 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-lg text-gray-800">
                      {todo.task}
                    </p>
                    {todo.description && (
                      <p className="text-gray-600 mt-1">{todo.description}</p>
                    )}
                    <div className="flex gap-3 mt-2 flex-wrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          priorityBadge[todo.priority]
                        }`}
                      >
                        {todo.priority === 'low'
                          ? '🟦 Low'
                          : todo.priority === 'medium'
                          ? '🟨 Medium'
                          : '🟥 High'}
                      </span>
                      <span className="px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-700">
                        {getCategoryInfo(todo.category)?.emoji} {getCategoryInfo(todo.category)?.label}
                      </span>
                      {todo.dueDate && (
                        <span className="text-xs text-gray-600">
                          Due: {new Date(todo.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-2">
                    <button
                      onClick={() => handleEdit(todo)}
                      className="p-2 text-gray-600 hover:bg-white/50 rounded transition"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="p-2 text-red-600 hover:bg-white/50 rounded transition"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Completed Tasks */}
        {completedTodos.length > 0 && (
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-500 mb-3">
              ✅ Completed ({completedTodos.length})
            </h3>
            <div className="space-y-2">
              {completedTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="p-3 rounded-lg bg-green-50 border border-green-200 flex items-start gap-3"
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo.id)}
                    className="w-5 h-5 rounded accent-jade-purple mt-0.5 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="line-through text-gray-500">
                      {todo.task}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="p-1.5 text-red-600 hover:bg-white/50 rounded transition flex-shrink-0"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
