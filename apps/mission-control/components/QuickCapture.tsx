'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowRight, Inbox, CheckSquare, Lightbulb, GitBranch } from 'lucide-react';

interface CapturedItem {
  id: string;
  text: string;
  timestamp: Date;
  status: 'captured';
}

interface QuickCaptureProps {
  onNavigate?: (tab: string) => void;
  onMoveToTasks?: (item: CapturedItem) => void;
  onMoveToIdeas?: (item: CapturedItem) => void;
  onMoveToDecisions?: (item: CapturedItem) => void;
}

export default function QuickCapture({
  onNavigate,
  onMoveToTasks,
  onMoveToIdeas,
  onMoveToDecisions,
}: QuickCaptureProps) {
  const [captures, setCaptures] = useState<CapturedItem[]>([]);
  const [newCapture, setNewCapture] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCaptures = localStorage.getItem('quickCaptures');
    if (savedCaptures) {
      try {
        const parsed = JSON.parse(savedCaptures);
        const withDates = parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }));
        setCaptures(withDates);
      } catch (error) {
        console.error('Failed to load captures:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage whenever captures change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('quickCaptures', JSON.stringify(captures));
    }
  }, [captures, isLoading]);

  const addCapture = () => {
    if (newCapture.trim()) {
      const newItem: CapturedItem = {
        id: `capture-${Date.now()}`,
        text: newCapture,
        timestamp: new Date(),
        status: 'captured',
      };
      setCaptures([newItem, ...captures]);
      setNewCapture('');
    }
  };

  const deleteCapture = (id: string) => {
    setCaptures(captures.filter(item => item.id !== id));
  };

  const handleMoveToTasks = (item: CapturedItem) => {
    if (onMoveToTasks) {
      onMoveToTasks(item);
    }
    deleteCapture(item.id);
  };

  const handleMoveToIdeas = (item: CapturedItem) => {
    if (onMoveToIdeas) {
      onMoveToIdeas(item);
    }
    deleteCapture(item.id);
  };

  const handleMoveToDecisions = (item: CapturedItem) => {
    if (onMoveToDecisions) {
      onMoveToDecisions(item);
    }
    deleteCapture(item.id);
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dateToCheck = new Date(date);
    if (dateToCheck.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (dateToCheck.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return dateToCheck.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

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
              <Inbox size={32} />
              <h1 className="text-3xl font-bold">Quick Capture</h1>
            </div>
            <p className="text-jade-cream opacity-90">
              Capture your thoughts, ideas, and reminders. Sort them later.
            </p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold">{captures.length}</p>
            <p className="text-jade-cream opacity-90">Captured items</p>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-lg shadow-md p-6 border-2 border-jade-light">
        <label className="block text-sm font-semibold text-jade-purple mb-3">
          📝 What's on your mind?
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a quick thought, reminder, or idea..."
            value={newCapture}
            onChange={(e) => setNewCapture(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addCapture();
              }
            }}
            className="flex-1 px-4 py-3 border border-jade-light rounded-lg focus:outline-none focus:ring-2 focus:ring-jade-purple transition-all"
          />
          <button
            onClick={addCapture}
            disabled={!newCapture.trim()}
            className="flex items-center gap-2 px-6 py-3 bg-jade-purple text-white rounded-lg font-semibold hover:bg-jade-purple/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
          >
            <Plus size={20} />
            <span>Capture</span>
          </button>
        </div>
      </div>

      {/* Captures List */}
      {captures.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center border-2 border-dashed border-jade-light">
          <Inbox size={48} className="text-jade-light mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-2">No captures yet</p>
          <p className="text-gray-500">Start capturing your thoughts above!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {captures.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md p-6 border-l-4 border-jade-purple hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-gray-900 text-lg mb-2">{item.text}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(item.timestamp)} at {formatTime(item.timestamp)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 flex-wrap pt-4 border-t border-jade-light">
                <button
                  onClick={() => handleMoveToTasks(item)}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium border border-blue-200"
                  title="Move to Tasks"
                >
                  <CheckSquare size={16} />
                  <span>Task</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  onClick={() => handleMoveToIdeas(item)}
                  className="flex items-center gap-2 px-3 py-2 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors text-sm font-medium border border-amber-200"
                  title="Move to Ideas"
                >
                  <Lightbulb size={16} />
                  <span>Idea</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  onClick={() => handleMoveToDecisions(item)}
                  className="flex items-center gap-2 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium border border-purple-200"
                  title="Move to Decisions"
                >
                  <GitBranch size={16} />
                  <span>Decision</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  onClick={() => deleteCapture(item.id)}
                  className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium border border-red-200 ml-auto"
                  title="Delete"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
