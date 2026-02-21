'use client';

import { useState, useEffect } from 'react';
import { itemsForReviewStore, ReviewItem } from '../lib/itemsForReviewStore';

export default function ItemsForReview() {
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ReviewItem | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    loadItems();
    
    // Listen for storage changes
    const handleStorageChange = () => loadItems();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [filter]);

  const loadItems = () => {
    const filterStatus = filter === 'all' ? undefined : filter;
    setItems(itemsForReviewStore.getItems(filterStatus));
  };

  const handleMarkRead = (id: string) => {
    itemsForReviewStore.markRead(id);
    loadItems();
  };

  const handleMarkActioned = (id: string) => {
    itemsForReviewStore.markActioned(id);
    loadItems();
  };

  const handleRemove = (id: string) => {
    if (confirm('Remove this report from review items?')) {
      itemsForReviewStore.removeItem(id);
      setSelectedItem(null);
      loadItems();
    }
  };

  const unreadCount = itemsForReviewStore.getCount('unread');
  const readCount = itemsForReviewStore.getCount('read');

  const getCategoryColor = (category: ReviewItem['category']) => {
    switch (category) {
      case 'research': return 'bg-blue-100 text-blue-800';
      case 'audit': return 'bg-orange-100 text-orange-800';
      case 'analysis': return 'bg-purple-100 text-purple-800';
      case 'strategy': return 'bg-green-100 text-green-800';
      case 'recommendations': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 font-bold';
      case 'low': return 'text-gray-400';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Items for Review</h1>
            <p className="text-sm text-gray-600 mt-1">
              Overnight research, audits, and strategic recommendations
            </p>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {unreadCount} unread
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
              {readCount} read
            </span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All ({itemsForReviewStore.getCount()})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'unread'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'read'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Read ({readCount})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No items to review</p>
            <p className="text-gray-400 text-sm mt-2">
              {filter !== 'all' && 'Try changing the filter above'}
            </p>
          </div>
        ) : selectedItem ? (
          /* Detail View */
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
            <button
              onClick={() => setSelectedItem(null)}
              className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
            >
              ← Back to list
            </button>
            
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {selectedItem.title}
                </h2>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedItem.category)}`}>
                    {selectedItem.category}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(selectedItem.timestamp).toLocaleString('en-AU', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {selectedItem.status === 'unread' && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                      NEW
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mb-6 pb-6 border-b">
              {selectedItem.status === 'unread' && (
                <button
                  onClick={() => handleMarkRead(selectedItem.id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Mark as Read
                </button>
              )}
              {selectedItem.status !== 'actioned' && (
                <button
                  onClick={() => handleMarkActioned(selectedItem.id)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Mark as Actioned
                </button>
              )}
              <button
                onClick={() => handleRemove(selectedItem.id)}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                Remove
              </button>
            </div>

            {/* Markdown Content */}
            <div className="prose prose-blue max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {selectedItem.markdown}
              </pre>
            </div>
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedItem(item);
                  if (item.status === 'unread') {
                    handleMarkRead(item.id);
                  }
                }}
                className={`bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 ${
                  item.status === 'unread' ? 'border-blue-500' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className={`text-xl font-bold mb-2 ${getPriorityColor(item.priority)}`}>
                      {item.title}
                      {item.status === 'unread' && (
                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                          NEW
                        </span>
                      )}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.summary}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(item.timestamp).toLocaleDateString('en-AU', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedItem(item);
                      if (item.status === 'unread') {
                        handleMarkRead(item.id);
                      }
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Read full report →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
