'use client';

import { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, CheckCircle2, Send, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface Reminder {
  id: string;
  text: string;
  status: 'not-sent' | 'sent' | 'completed';
  sentDate: string | null;
  createdDate: string;
  priority: 'low' | 'normal' | 'high';
}

export default function RemindersForJohn() {
  const [mounted, setMounted] = useState(false);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    pending: true,
    sent: true,
    completed: true,
  });
  const [formData, setFormData] = useState<{
    text: string;
    priority: 'low' | 'normal' | 'high';
  }>({
    text: '',
    priority: 'normal',
  });

  // Initialize and load from localStorage (client-side only)
  useEffect(() => {
    // Mark component as mounted to ensure we're on the client
    setMounted(true);

    // Load from localStorage
    try {
      const saved = localStorage.getItem('remindersForJohnData');
      let loaded: Reminder[] = [];
      
      if (saved) {
        const parsed = JSON.parse(saved);
        loaded = Array.isArray(parsed) ? parsed : [];
      }

      // Check if gummies reminder exists
      const gummiesReminder = loaded.find(
        (r) => r.text === 'Send Steph gummies — apple and strawberry'
      );

      // If it doesn't exist, add it
      if (!gummiesReminder) {
        const newReminder: Reminder = {
          id: crypto.randomUUID?.() || 'gummies-' + Date.now().toString(),
          text: 'Send Steph gummies — apple and strawberry',
          status: 'not-sent',
          sentDate: null,
          createdDate: new Date().toISOString().split('T')[0],
          priority: 'normal',
        };
        loaded = [...loaded, newReminder];
        console.log('Added gummies reminder:', newReminder);
      }

      // Check if integrations reminder exists
      const integrationsReminder = loaded.find(
        (r) => r.text === 'Set up Meta Ads, GoHighLevel, and Stripe integrations for Mission Control'
      );

      // If it doesn't exist, add it
      if (!integrationsReminder) {
        const integrationsReminder: Reminder = {
          id: crypto.randomUUID?.() || 'integrations-' + Date.now().toString(),
          text: 'Set up Meta Ads, GoHighLevel, and Stripe integrations for Mission Control — The dashboard is live but missing integrations. Meta Ads (access ready), GoHighLevel API (token ready), Stripe (approach pending). Review and set up.',
          status: 'sent',
          sentDate: new Date().toISOString().split('T')[0],
          createdDate: new Date().toISOString().split('T')[0],
          priority: 'high',
        };
        loaded = [...loaded, integrationsReminder];
        console.log('Added integrations reminder:', integrationsReminder);
      }

      setReminders(loaded);
    } catch (e) {
      console.error('Error loading reminders from localStorage:', e);
    }
  }, []);

  // Save to localStorage (only after component is mounted)
  useEffect(() => {
    if (!mounted) return;
    
    try {
      localStorage.setItem('remindersForJohnData', JSON.stringify(reminders));
      console.log('Reminders saved to localStorage:', reminders);
    } catch (e) {
      console.error('Error saving reminders to localStorage:', e);
    }
  }, [reminders, mounted]);

  const handleAddReminder = () => {
    if (!formData.text.trim()) {
      alert('Please enter a reminder');
      return;
    }

    if (editingId) {
      setReminders(
        reminders.map((r) =>
          r.id === editingId
            ? {
                ...r,
                text: formData.text,
                priority: formData.priority,
              }
            : r
        )
      );
      setEditingId(null);
    } else {
      const newReminder: Reminder = {
        id: crypto.randomUUID?.() || Date.now().toString(),
        text: formData.text,
        priority: formData.priority,
        status: 'not-sent',
        sentDate: null,
        createdDate: new Date().toISOString().split('T')[0],
      };
      setReminders([...reminders, newReminder]);
    }

    setFormData({
      text: '',
      priority: 'normal',
    });
    setShowForm(false);
  };

  const handleEdit = (reminder: Reminder) => {
    setFormData({
      text: reminder.text,
      priority: reminder.priority,
    });
    setEditingId(reminder.id);
    setShowForm(true);
  };

  const handleMarkSent = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setReminders(
      reminders.map((r) =>
        r.id === id
          ? { ...r, status: 'sent', sentDate: today }
          : r
      )
    );
  };

  const handleMarkCompleted = (id: string) => {
    setReminders(
      reminders.map((r) =>
        r.id === id
          ? { ...r, status: 'completed' }
          : r
      )
    );
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this reminder?')) {
      setReminders(reminders.filter((r) => r.id !== id));
    }
  };

  const toggleSection = (section: 'pending' | 'sent' | 'completed') => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const pendingReminders = reminders.filter((r) => r.status === 'not-sent');
  const sentReminders = reminders.filter((r) => r.status === 'sent');
  const completedReminders = reminders.filter((r) => r.status === 'completed');

  const getStatusBadgeColor = (status: 'not-sent' | 'sent' | 'completed') => {
    switch (status) {
      case 'not-sent':
        return 'bg-red-100 text-red-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
    }
  };

  const getStatusBgColor = (status: 'not-sent' | 'sent' | 'completed') => {
    switch (status) {
      case 'not-sent':
        return 'bg-red-50 border-red-200';
      case 'sent':
        return 'bg-blue-50 border-blue-200';
      case 'completed':
        return 'bg-green-50 border-green-200';
    }
  };

  const getPriorityBadge = (priority: 'low' | 'normal' | 'high') => {
    switch (priority) {
      case 'low':
        return 'bg-slate-100 text-slate-700';
      case 'normal':
        return 'bg-amber-100 text-amber-700';
      case 'high':
        return 'bg-red-100 text-red-700';
    }
  };

  const renderReminderCard = (reminder: Reminder) => (
    <div key={reminder.id} className={`p-4 rounded-lg border ${getStatusBgColor(reminder.status)}`}>
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-lg text-gray-800">{reminder.text}</p>
          <div className="flex gap-3 mt-2 flex-wrap items-center">
            <span className={`px-2 py-1 text-xs font-semibold rounded ${getStatusBadgeColor(reminder.status)}`}>
              {reminder.status === 'not-sent' && '📋 Not sent to John'}
              {reminder.status === 'sent' && `📤 Sent to John ${reminder.sentDate}`}
              {reminder.status === 'completed' && '✅ Completed'}
            </span>
            {reminder.priority !== 'normal' && (
              <span className={`px-2 py-1 text-xs font-semibold rounded ${getPriorityBadge(reminder.priority)}`}>
                {reminder.priority === 'high' ? '🔴 High' : '🔵 Low'}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2 ml-2 flex-shrink-0">
          {reminder.status === 'not-sent' && (
            <button
              onClick={() => handleMarkSent(reminder.id)}
              className="p-2 text-blue-600 hover:bg-blue-100 rounded transition"
              title="Mark sent"
            >
              <Send size={16} />
            </button>
          )}
          {reminder.status !== 'completed' && (
            <button
              onClick={() => handleMarkCompleted(reminder.id)}
              className="p-2 text-green-600 hover:bg-green-100 rounded transition"
              title="Mark completed"
            >
              <Check size={16} />
            </button>
          )}
          <button
            onClick={() => handleDelete(reminder.id)}
            className="p-2 text-red-600 hover:bg-red-100 rounded transition"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderSection = (
    title: string,
    sectionKey: 'pending' | 'sent' | 'completed',
    reminders: Reminder[],
    badgeColor: string
  ) => (
    <div className="mb-6">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center gap-3 w-full p-4 bg-gray-100 hover:bg-gray-150 rounded-lg transition"
      >
        {expandedSections[sectionKey] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <span className={`ml-auto px-3 py-1 text-sm font-bold rounded-full ${badgeColor}`}>
          {reminders.length}
        </span>
      </button>
      {expandedSections[sectionKey] && (
        <div className="mt-3 space-y-3 ml-2">
          {reminders.length === 0 ? (
            <p className="text-gray-500 text-sm italic py-4">No reminders</p>
          ) : (
            reminders.map(renderReminderCard)
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Clock size={32} className="text-jade-purple" />
            <div>
              <h2 className="text-2xl font-bold text-jade-purple">Reminders for John</h2>
              <p className="text-sm text-gray-600">Track what John needs to do and what he's completed</p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({
                text: '',
                priority: 'normal',
              });
              setShowForm(!showForm);
            }}
            className="bg-jade-purple text-white px-4 py-2 rounded-lg hover:bg-jade-purple/80 transition flex items-center gap-2"
          >
            <Plus size={18} /> Add Reminder
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-red-700">{pendingReminders.length}</p>
            <p className="text-xs text-red-600">Not Sent</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-blue-700">{sentReminders.length}</p>
            <p className="text-xs text-blue-600">Sent</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-green-700">{completedReminders.length}</p>
            <p className="text-xs text-green-600">Completed</p>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-jade-cream rounded-lg p-4 border border-jade-light mb-6">
            <h3 className="text-lg font-semibold text-jade-purple mb-4">
              {editingId ? 'Edit Reminder' : 'New Reminder'}
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                placeholder="Enter reminder text (e.g., Send Steph gummies — apple and strawberry)"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-jade-light focus:ring-1 focus:ring-jade-light"
              />

              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: e.target.value as 'low' | 'normal' | 'high',
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-jade-light focus:ring-1 focus:ring-jade-light"
              >
                <option value="low">🔵 Low Priority</option>
                <option value="normal">⚪ Normal Priority</option>
                <option value="high">🔴 High Priority</option>
              </select>

              <div className="flex gap-2 justify-end">
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
                  onClick={handleAddReminder}
                  className="px-4 py-2 bg-jade-purple text-white rounded hover:bg-jade-purple/80 transition"
                >
                  {editingId ? 'Update' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sections */}
        {reminders.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle2 size={48} className="mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">No reminders yet. Add one to get started!</p>
          </div>
        ) : (
          <>
            {renderSection('📋 Pending (Not sent)', 'pending', pendingReminders, 'bg-red-100 text-red-800')}
            {renderSection('📤 Sent to John', 'sent', sentReminders, 'bg-blue-100 text-blue-800')}
            {renderSection('✅ Completed', 'completed', completedReminders, 'bg-green-100 text-green-800')}
          </>
        )}
      </div>
    </div>
  );
}
