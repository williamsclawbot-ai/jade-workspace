'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Plus, Trash2, X } from 'lucide-react';

interface CleaningTask {
  id: string;
  name: string;
  timeEstimate: string;
  category: string;
}

interface Assignment {
  taskId: string;
  day: string;
  completed: boolean;
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// 15 comprehensive cleaning tasks with time estimates
const taskLibrary: CleaningTask[] = [
  { id: 'tidy', name: 'Tidy living areas', timeEstimate: '15-20 min', category: 'General' },
  { id: 'bathrooms', name: 'Clean bathrooms', timeEstimate: '20-30 min', category: 'Bathrooms' },
  { id: 'kitchen', name: 'Kitchen deep clean', timeEstimate: '45-60 min', category: 'Kitchen' },
  { id: 'mop', name: 'Mop floors', timeEstimate: '30-45 min', category: 'Floors' },
  { id: 'vacuum', name: 'Vacuum carpets', timeEstimate: '20-30 min', category: 'Floors' },
  { id: 'laundry', name: 'Wash & fold laundry', timeEstimate: '30-45 min', category: 'Laundry' },
  { id: 'sheets', name: 'Change bed sheets', timeEstimate: '15-20 min', category: 'Bedrooms' },
  { id: 'dust', name: 'Dust surfaces', timeEstimate: '20-30 min', category: 'General' },
  { id: 'trash', name: 'Take out trash/recycling', timeEstimate: '10-15 min', category: 'General' },
  { id: 'windows', name: 'Clean windows', timeEstimate: '30-45 min', category: 'General' },
  { id: 'mirrors', name: 'Clean mirrors & glass', timeEstimate: '15-20 min', category: 'Bathrooms' },
  { id: 'toilets', name: 'Clean toilets', timeEstimate: '15-20 min', category: 'Bathrooms' },
  { id: 'appliances', name: 'Wipe down appliances', timeEstimate: '20-30 min', category: 'Kitchen' },
  { id: 'organize', name: 'Organize closets/storage', timeEstimate: '45-60 min', category: 'Organization' },
  { id: 'baseboards', name: 'Wipe baseboards', timeEstimate: '30-40 min', category: 'General' },
];

export default function CleaningSchedule() {
  const [activeTab, setActiveTab] = useState<'library' | 'schedule'>('library');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [assignmentModal, setAssignmentModal] = useState<{
    isOpen: boolean;
    selectedTaskId: string | null;
  }>({
    isOpen: false,
    selectedTaskId: null,
  });
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('cleaningScheduleAssignments');
    if (saved) {
      try {
        setAssignments(JSON.parse(saved));
      } catch (e) {
        console.log('No saved assignments');
      }
    }
  }, []);

  // Save to localStorage whenever assignments change
  useEffect(() => {
    localStorage.setItem('cleaningScheduleAssignments', JSON.stringify(assignments));
  }, [assignments]);

  const openAssignmentModal = (taskId: string) => {
    setAssignmentModal({ isOpen: true, selectedTaskId: taskId });
    setSelectedDays([]);
  };

  const closeAssignmentModal = () => {
    setAssignmentModal({ isOpen: false, selectedTaskId: null });
    setSelectedDays([]);
  };

  const assignTaskToDays = () => {
    if (!assignmentModal.selectedTaskId || selectedDays.length === 0) {
      alert('Please select at least one day');
      return;
    }

    // Add new assignments for selected days
    selectedDays.forEach((day) => {
      const alreadyExists = assignments.some(
        (a) => a.taskId === assignmentModal.selectedTaskId && a.day === day
      );
      if (!alreadyExists) {
        setAssignments([
          ...assignments,
          {
            taskId: assignmentModal.selectedTaskId!,
            day,
            completed: false,
          },
        ]);
      }
    });

    closeAssignmentModal();
  };

  const toggleComplete = (taskId: string, day: string) => {
    setAssignments(
      assignments.map((a) =>
        a.taskId === taskId && a.day === day
          ? { ...a, completed: !a.completed }
          : a
      )
    );
  };

  const removeAssignment = (taskId: string, day: string) => {
    setAssignments(
      assignments.filter((a) => !(a.taskId === taskId && a.day === day))
    );
  };

  const getTaskName = (taskId: string) => {
    return taskLibrary.find((t) => t.id === taskId)?.name || 'Unknown Task';
  };

  const getTaskTime = (taskId: string) => {
    return taskLibrary.find((t) => t.id === taskId)?.timeEstimate || '';
  };

  const getTaskCategory = (taskId: string) => {
    return taskLibrary.find((t) => t.id === taskId)?.category || '';
  };

  const getAssignmentsByDay = (day: string) => {
    return assignments.filter((a) => a.day === day);
  };

  const categoryColors: Record<string, string> = {
    'General': 'bg-blue-50 border-blue-200',
    'Bathrooms': 'bg-purple-50 border-purple-200',
    'Kitchen': 'bg-orange-50 border-orange-200',
    'Floors': 'bg-green-50 border-green-200',
    'Laundry': 'bg-cyan-50 border-cyan-200',
    'Bedrooms': 'bg-pink-50 border-pink-200',
    'Organization': 'bg-amber-50 border-amber-200',
  };

  const categoryBadge: Record<string, string> = {
    'General': 'bg-blue-100 text-blue-700',
    'Bathrooms': 'bg-purple-100 text-purple-700',
    'Kitchen': 'bg-orange-100 text-orange-700',
    'Floors': 'bg-green-100 text-green-700',
    'Laundry': 'bg-cyan-100 text-cyan-700',
    'Bedrooms': 'bg-pink-100 text-pink-700',
    'Organization': 'bg-amber-100 text-amber-700',
  };

  // Task Library Tab
  const TaskLibraryTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Available Cleaning Tasks</h3>
        <p className="text-gray-600">Click any task to assign it to specific days of the week.</p>
      </div>

      {/* Tasks by Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from(new Set(taskLibrary.map((t) => t.category))).map((category) => {
          const categoryTasks = taskLibrary.filter((t) => t.category === category);
          return (
            <div
              key={category}
              className={`rounded-lg p-4 border ${
                categoryColors[category] || 'bg-gray-50 border-gray-200'
              }`}
            >
              <h4 className="font-semibold text-gray-800 mb-3">{category}</h4>
              <div className="space-y-2">
                {categoryTasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => openAssignmentModal(task.id)}
                    className="w-full text-left px-3 py-3 rounded bg-white/50 hover:bg-white border border-gray-200 hover:border-gray-400 transition group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 group-hover:text-jade-purple transition">
                          {task.name}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">⏱️ {task.timeEstimate}</p>
                      </div>
                      <div className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${categoryBadge[category] || 'bg-gray-100 text-gray-700'}`}>
                        {category}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50 border-l-4 border-jade-light rounded-lg p-4">
        <p className="font-semibold text-jade-purple mb-2">💡 How to Use:</p>
        <p className="text-gray-700 text-sm">
          Click any task to assign it to one or more days. Once assigned, it will appear in your Weekly Schedule where you can mark it complete.
        </p>
      </div>
    </div>
  );

  // Weekly Schedule Tab
  const WeeklyScheduleTab = () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Weekly Cleaning Schedule</h3>
        <p className="text-gray-600">Your assigned tasks for each day. Check off as you complete them.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {daysOfWeek.map((day) => {
          const dayAssignments = getAssignmentsByDay(day);
          return (
            <div
              key={day}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <h4 className="text-lg font-semibold text-jade-purple mb-3 pb-2 border-b-2 border-jade-light">
                {day}
              </h4>

              {dayAssignments.length === 0 ? (
                <div className="text-gray-400 italic text-sm py-4 text-center">
                  No tasks assigned
                </div>
              ) : (
                <div className="space-y-2">
                  {dayAssignments.map((assignment) => {
                    const taskName = getTaskName(assignment.taskId);
                    const taskTime = getTaskTime(assignment.taskId);
                    const taskCategory = getTaskCategory(assignment.taskId);
                    return (
                      <div
                        key={`${assignment.taskId}-${day}`}
                        className={`p-3 rounded-lg border ${
                          categoryColors[taskCategory] || 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={assignment.completed}
                            onChange={() => toggleComplete(assignment.taskId, day)}
                            className="w-5 h-5 rounded accent-jade-purple mt-0.5 cursor-pointer flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p
                              className={`font-medium transition ${
                                assignment.completed
                                  ? 'line-through text-gray-500'
                                  : 'text-gray-800'
                              }`}
                            >
                              {taskName}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">⏱️ {taskTime}</p>
                            <span
                              className={`inline-block mt-2 px-2 py-0.5 text-xs font-semibold rounded ${
                                categoryBadge[taskCategory] || 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {taskCategory}
                            </span>
                          </div>
                          <button
                            onClick={() => removeAssignment(assignment.taskId, day)}
                            className="p-1.5 text-red-600 hover:bg-white/50 rounded transition flex-shrink-0"
                            title="Remove"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add Task Button for Day */}
              <button
                onClick={() => {
                  setSelectedDays([day]);
                  openAssignmentModal('');
                }}
                className="w-full mt-3 px-3 py-2 rounded border border-dashed border-jade-light text-jade-purple hover:bg-jade-light/10 transition font-medium text-sm flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Add Task
              </button>
            </div>
          );
        })}
      </div>

      {assignments.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
          <CheckCircle2 size={32} className="mx-auto mb-3 text-amber-600" />
          <p className="font-semibold text-gray-800">No tasks scheduled yet</p>
          <p className="text-gray-600 text-sm mt-1">Go to Task Library and assign some tasks to get started!</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-3">
          <CheckCircle2 size={32} className="text-jade-purple" />
          <div>
            <h2 className="text-2xl font-bold text-jade-purple">Cleaning Schedule</h2>
            <p className="text-sm text-gray-600">Organize and track your weekly cleaning tasks</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 px-6 py-3 flex flex-wrap gap-2 bg-gray-50">
        {[
          { id: 'library' as const, label: '📋 Task Library' },
          { id: 'schedule' as const, label: '📅 Weekly Schedule' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === tab.id
                ? 'bg-jade-purple text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {activeTab === 'library' && <TaskLibraryTab />}
        {activeTab === 'schedule' && <WeeklyScheduleTab />}
      </div>

      {/* Assignment Modal */}
      {assignmentModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-jade-purple">
                Assign Task to Days
              </h3>
              <button
                onClick={closeAssignmentModal}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Selected Task */}
              {assignmentModal.selectedTaskId && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Task
                  </label>
                  <div className="bg-jade-light/20 px-3 py-2 rounded border border-jade-light text-gray-800 font-medium">
                    {getTaskName(assignmentModal.selectedTaskId)}
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    ⏱️ {getTaskTime(assignmentModal.selectedTaskId)}
                  </div>
                </div>
              )}

              {/* Day Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Days (choose one or more)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day}
                      onClick={() =>
                        setSelectedDays((prev) =>
                          prev.includes(day)
                            ? prev.filter((d) => d !== day)
                            : [...prev, day]
                        )
                      }
                      className={`px-3 py-2 rounded text-sm font-medium transition ${
                        selectedDays.includes(day)
                          ? 'bg-jade-purple text-white border border-jade-purple'
                          : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Selected: {selectedDays.length > 0 ? selectedDays.join(', ') : 'None'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={closeAssignmentModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition font-medium text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={assignTaskToDays}
                  disabled={selectedDays.length === 0}
                  className="flex-1 px-4 py-2 bg-jade-purple text-white rounded hover:bg-jade-purple/80 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Assign to {selectedDays.length} Day{selectedDays.length !== 1 ? 's' : ''}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
