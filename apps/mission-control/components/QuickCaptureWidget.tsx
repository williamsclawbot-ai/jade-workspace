'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowRight, Inbox, ChevronRight } from 'lucide-react';

interface CapturedItem {
  id: string;
  text: string;
  timestamp: Date;
  status: 'captured';
}

interface QuickCaptureWidgetProps {
  onNavigate?: (tab: string) => void;
}

export default function QuickCaptureWidget({ onNavigate }: QuickCaptureWidgetProps) {
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

  const formatDate = (date: Date) => {
    const today = new Date();
    const dateToCheck = new Date(date);
    if (dateToCheck.toDateString() === today.toDateString()) {
      return 'Today';
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

  // Show only last 3 captures in widget
  const displayCaptures = captures.slice(0, 3);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-jade-purple hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Inbox size={24} className="text-jade-purple" />
          <h3 className="text-lg font-semibold text-jade-purple">Quick Capture</h3>
          {captures.length > 0 && (
            <span className="ml-2 px-2 py-1 bg-jade-light rounded-full text-xs font-bold text-jade-purple">
              {captures.length}
            </span>
          )}
        </div>
        <button
          onClick={() => onNavigate?.('inbox')}
          className="text-jade-purple hover:bg-jade-light rounded-lg p-1 transition-colors"
          title="Open full Inbox"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Input Section */}
      <div className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Quick thought..."
            value={newCapture}
            onChange={(e) => setNewCapture(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addCapture();
              }
            }}
            className="flex-1 px-3 py-2 border border-jade-light rounded-lg focus:outline-none focus:ring-2 focus:ring-jade-purple transition-all text-sm"
          />
          <button
            onClick={addCapture}
            disabled={!newCapture.trim()}
            className="flex items-center gap-1 px-3 py-2 bg-jade-purple text-white rounded-lg hover:bg-jade-purple/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Recent Captures */}
      {displayCaptures.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm">No captures yet</p>
        </div>
      ) : (
        <div className="space-y-2 mb-3">
          {displayCaptures.map((item) => (
            <div
              key={item.id}
              className="bg-jade-cream rounded-lg p-3 border border-jade-light hover:border-jade-purple transition-colors group"
            >
              <p className="text-gray-900 text-sm line-clamp-2 mb-1">{item.text}</p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  {formatDate(item.timestamp)} {formatTime(item.timestamp)}
                </p>
                <button
                  onClick={() => deleteCapture(item.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View All Button */}
      {captures.length > 3 && (
        <button
          onClick={() => onNavigate?.('inbox')}
          className="w-full text-center py-2 text-jade-purple hover:bg-jade-cream rounded-lg transition-colors text-sm font-medium border border-jade-light"
        >
          View All {captures.length} Captures →
        </button>
      )}

      {captures.length > 0 && captures.length <= 3 && (
        <button
          onClick={() => onNavigate?.('inbox')}
          className="w-full text-center py-2 text-jade-purple hover:bg-jade-cream rounded-lg transition-colors text-sm font-medium border border-jade-light"
        >
          Open Full Inbox →
        </button>
      )}
    </div>
  );
}
