'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, RefreshCw } from 'lucide-react';
import { staplesStore, StapleItem } from '../lib/staplesStore';

export default function StaplesManager() {
  const [staples, setStaples] = useState<StapleItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('');
  const [newItemFrequency, setNewItemFrequency] = useState<'weekly' | 'bi-weekly' | 'monthly'>('weekly');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    loadStaples();
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'staples-v1') {
        loadStaples();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loadStaples = () => {
    setStaples(staplesStore.getAll());
  };

  const handleAdd = () => {
    if (!newItemName.trim()) return;
    
    staplesStore.add({
      name: newItemName.trim(),
      qty: newItemQty || '1',
      unit: newItemUnit || '',
      frequency: newItemFrequency,
    });
    
    setNewItemName('');
    setNewItemQty('');
    setNewItemUnit('');
    setNewItemFrequency('weekly');
    setIsAdding(false);
    loadStaples();
  };

  const handleRemove = (id: string) => {
    staplesStore.remove(id);
    loadStaples();
  };

  const getFrequencyBadgeColor = (frequency: string) => {
    switch (frequency) {
      case 'weekly':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'bi-weekly':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'monthly':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getFrequencyIcon = () => {
    switch (newItemFrequency) {
      case 'weekly':
        return '📅';
      case 'bi-weekly':
        return '🗓️';
      case 'monthly':
        return '📆';
      default:
        return '📅';
    }
  };

  const formatLastAdded = (timestamp?: number) => {
    if (!timestamp) return 'Never added';
    const daysAgo = Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24));
    if (daysAgo === 0) return 'Added today';
    if (daysAgo === 1) return 'Added yesterday';
    return `Added ${daysAgo} days ago`;
  };

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-green-50 to-white border border-green-200 rounded-lg p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Staples Auto-Restock</h3>
            <p className="text-sm text-gray-600 mt-1">
              Recurring items that auto-add to your shopping list based on frequency.
            </p>
          </div>
          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-medium transition whitespace-nowrap flex items-center gap-1"
            >
              <Plus size={16} />
              Add Staple
            </button>
          )}
        </div>
      </div>

      {/* Add staple form */}
      {isAdding && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-900">Add New Staple Item</h4>
            <button
              onClick={() => setIsAdding(false)}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Item Name *</label>
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="e.g., Milk, Bread, Eggs"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Quantity *</label>
              <input
                type="text"
                value={newItemQty}
                onChange={(e) => setNewItemQty(e.target.value)}
                placeholder="2"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Unit</label>
              <input
                type="text"
                value={newItemUnit}
                onChange={(e) => setNewItemUnit(e.target.value)}
                placeholder="L, kg, pack"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Frequency {getFrequencyIcon()}
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setNewItemFrequency('weekly')}
                className={`flex-1 px-3 py-2 text-sm rounded-lg border transition ${
                  newItemFrequency === 'weekly'
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-green-600'
                }`}
              >
                📅 Weekly
              </button>
              <button
                onClick={() => setNewItemFrequency('bi-weekly')}
                className={`flex-1 px-3 py-2 text-sm rounded-lg border transition ${
                  newItemFrequency === 'bi-weekly'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
                }`}
              >
                🗓️ Bi-weekly
              </button>
              <button
                onClick={() => setNewItemFrequency('monthly')}
                className={`flex-1 px-3 py-2 text-sm rounded-lg border transition ${
                  newItemFrequency === 'monthly'
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-purple-600'
                }`}
              >
                📆 Monthly
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {newItemFrequency === 'weekly' && 'Added to every shopping list'}
              {newItemFrequency === 'bi-weekly' && 'Added if 14+ days since last add'}
              {newItemFrequency === 'monthly' && 'Added on first Monday of each month'}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={!newItemName.trim()}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              Add Staple
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Staples list */}
      {staples.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <RefreshCw className="mx-auto text-gray-400 mb-3" size={32} />
          <p className="text-gray-600 mb-2">No staple items yet</p>
          <p className="text-sm text-gray-500">Add recurring items like milk, bread, or eggs to auto-restock your shopping list.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {staples.map(staple => (
            <div
              key={staple.id}
              className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between gap-4 hover:border-gray-300 transition"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900">{staple.name}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${getFrequencyBadgeColor(staple.frequency)}`}>
                    {staple.frequency}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>
                    <strong>Qty:</strong> {staple.qty}{staple.unit ? ` ${staple.unit}` : ''}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatLastAdded(staple.lastAdded)}
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => handleRemove(staple.id)}
                className="text-red-500 hover:text-red-700 transition"
                title="Remove staple"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-900">
          <strong>How it works:</strong> When you build your shopping list, staples are automatically added based on their frequency. 
          Weekly items are added every time. Bi-weekly items are added if it's been 14+ days. Monthly items are added on the first Monday of each month.
        </p>
      </div>
    </div>
  );
}
