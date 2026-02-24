'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, AlertTriangle, Package, ShoppingCart } from 'lucide-react';
import MetricCard from './MetricCard';

interface PantryItem {
  id: string;
  name: string;
  category: 'pantry' | 'fridge' | 'freezer';
  quantity: string;
  unit: string;
  expiryDate?: string;
  stockLevel: 'full' | 'low' | 'out';
  isStaple: boolean;
  addedAt: number;
}

const STORAGE_KEY = 'jade-pantry-v1';

export default function PantryTracker() {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<'pantry' | 'fridge' | 'freezer'>('pantry');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState<Partial<PantryItem>>({
    name: '',
    quantity: '',
    unit: '',
    stockLevel: 'full',
    isStaple: false,
  });

  // Load items from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setItems(JSON.parse(stored));
    }
  }, []);

  // Save items to localStorage
  const saveItems = (updatedItems: PantryItem[]) => {
    setItems(updatedItems);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
  };

  const addItem = () => {
    if (!newItem.name?.trim()) return;
    
    const item: PantryItem = {
      id: `pantry-${Date.now()}`,
      name: newItem.name,
      category: activeCategory,
      quantity: newItem.quantity || '1',
      unit: newItem.unit || 'item',
      expiryDate: newItem.expiryDate,
      stockLevel: newItem.stockLevel || 'full',
      isStaple: newItem.isStaple || false,
      addedAt: Date.now(),
    };
    
    saveItems([...items, item]);
    setNewItem({ name: '', quantity: '', unit: '', stockLevel: 'full', isStaple: false });
    setShowAddForm(false);
  };

  const updateStockLevel = (id: string, level: 'full' | 'low' | 'out') => {
    const updated = items.map(item => 
      item.id === id ? { ...item, stockLevel: level } : item
    );
    saveItems(updated);
  };

  const removeItem = (id: string) => {
    saveItems(items.filter(item => item.id !== id));
  };

  const addToShopping = (item: PantryItem) => {
    // Dispatch event for shopping list
    window.dispatchEvent(new CustomEvent('add-to-shopping', { 
      detail: { 
        ingredient: item.name, 
        quantity: item.quantity, 
        unit: item.unit,
        source: 'pantry' 
      } 
    }));
    alert(`Added ${item.name} to shopping list!`);
  };

  const filteredItems = items.filter(item => item.category === activeCategory);
  const totalItems = items.length;
  const lowStock = items.filter(i => i.stockLevel === 'low').length;
  const outOfStock = items.filter(i => i.stockLevel === 'out').length;
  const expiringSoon = items.filter(i => {
    if (!i.expiryDate) return false;
    const days = Math.ceil((new Date(i.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days <= 3 && days >= 0;
  }).length;

  const getStockColor = (level: string) => {
    switch (level) {
      case 'full': return 'bg-green-500';
      case 'low': return 'bg-amber-500';
      case 'out': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#fbecdb] to-white border border-[#e5ccc6] rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#563f57]">Pantry Tracker</h2>
            <p className="text-sm text-gray-600">Track stock levels and expiry dates</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-[#563f57] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#563f57]/90 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Total Items"
          value={totalItems}
          icon={Package}
          color="plum"
        />
        <MetricCard
          label="Low Stock"
          value={lowStock}
          icon={AlertTriangle}
          color="orange"
          trend={lowStock > 0 ? 'up' : 'neutral'}
          trendValue={lowStock > 0 ? 'Restock soon' : 'Good'}
        />
        <MetricCard
          label="Out of Stock"
          value={outOfStock}
          icon={Package}
          color="red"
        />
        <MetricCard
          label="Expiring Soon"
          value={expiringSoon}
          icon={AlertTriangle}
          color="green"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {(['pantry', 'fridge', 'freezer'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 font-medium capitalize transition ${
              activeCategory === cat
                ? 'text-[#563f57] border-b-2 border-[#563f57]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
          <h3 className="font-semibold text-gray-900">Add New Item</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Item name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#563f57]"
            />
            <input
              type="text"
              placeholder="Qty"
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#563f57]"
            />
            <input
              type="text"
              placeholder="Unit"
              value={newItem.unit}
              onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#563f57]"
            />
            <input
              type="date"
              placeholder="Expiry (optional)"
              value={newItem.expiryDate || ''}
              onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#563f57]"
            />
          </div>
          <div className="flex gap-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newItem.isStaple}
                onChange={(e) => setNewItem({ ...newItem, isStaple: e.target.checked })}
                className="rounded border-gray-300 text-[#563f57] focus:ring-[#563f57]"
              />
              <span className="text-sm text-gray-600">Staple item</span>
            </label>
            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={addItem}
                className="px-4 py-2 bg-[#563f57] text-white rounded-lg hover:bg-[#563f57]/90 transition"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No items in {activeCategory}</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="text-[#563f57] font-medium hover:underline mt-2"
          >
            Add your first item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    {item.isStaple && (
                      <span className="text-xs bg-[#563f57]/10 text-[#563f57] px-2 py-0.5 rounded-full">
                        Staple
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {item.quantity} {item.unit}
                  </p>
                  {item.expiryDate && (
                    <p className={`text-xs mt-1 ${
                      new Date(item.expiryDate) < new Date() 
                        ? 'text-red-600' 
                        : new Date(item.expiryDate).getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000
                        ? 'text-amber-600'
                        : 'text-gray-400'
                    }`}>
                      Expires: {new Date(item.expiryDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-gray-400 hover:text-red-500 transition p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Stock Level Controls */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {(['full', 'low', 'out'] as const).map(level => (
                      <button
                        key={level}
                        onClick={() => updateStockLevel(item.id, level)}
                        className={`px-3 py-1 text-xs font-medium rounded-lg capitalize transition ${
                          item.stockLevel === level
                            ? level === 'full'
                              ? 'bg-green-100 text-green-700'
                              : level === 'low'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                  {item.stockLevel !== 'full' && (
                    <button
                      onClick={() => addToShopping(item)}
                      className="text-xs text-[#563f57] hover:underline flex items-center gap-1"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      Add to list
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
