'use client';

import { useState, useEffect } from 'react';
import { Settings, Check, X, RotateCcw } from 'lucide-react';
import { macroTargetsStore, MacroTargets } from '../lib/macroTargetsStore';

export default function MacroSettingsUI() {
  const [targets, setTargets] = useState<MacroTargets>(macroTargetsStore.get());
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<MacroTargets>(targets);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'macro-targets-v1') {
        setTargets(macroTargetsStore.get());
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleStartEdit = () => {
    setEditValues(targets);
    setIsEditing(true);
  };

  const handleSave = () => {
    macroTargetsStore.set(editValues);
    setTargets(editValues);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValues(targets);
    setIsEditing(false);
  };

  const handleReset = () => {
    macroTargetsStore.reset();
    const defaults = macroTargetsStore.get();
    setTargets(defaults);
    setEditValues(defaults);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm">
          <span className="font-semibold text-gray-700">Daily Targets:</span>
          <span>⚡ {targets.calories} cal</span>
          <span>💪 {targets.protein}g P</span>
          <span>🥑 {targets.fats}g F</span>
          <span>🍞 {targets.carbs}g C</span>
        </div>
        <button
          onClick={handleStartEdit}
          className="text-gray-600 hover:text-jade-purple transition flex items-center gap-1 text-sm"
        >
          <Settings size={16} />
          Edit
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-jade-purple rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-900">Edit Macro Targets</h4>
        <button
          onClick={handleReset}
          className="text-gray-600 hover:text-amber-600 transition flex items-center gap-1 text-xs"
        >
          <RotateCcw size={14} />
          Reset to Default
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Calories</label>
          <input
            type="number"
            value={editValues.calories}
            onChange={(e) => setEditValues({ ...editValues, calories: parseInt(e.target.value) || 0 })}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-jade-purple"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Protein (g)</label>
          <input
            type="number"
            value={editValues.protein}
            onChange={(e) => setEditValues({ ...editValues, protein: parseInt(e.target.value) || 0 })}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-jade-purple"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Fats (g)</label>
          <input
            type="number"
            value={editValues.fats}
            onChange={(e) => setEditValues({ ...editValues, fats: parseInt(e.target.value) || 0 })}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-jade-purple"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Carbs (g)</label>
          <input
            type="number"
            value={editValues.carbs}
            onChange={(e) => setEditValues({ ...editValues, carbs: parseInt(e.target.value) || 0 })}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-jade-purple"
          />
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <button
          onClick={handleCancel}
          className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded transition flex items-center gap-1"
        >
          <X size={14} />
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-3 py-1.5 text-sm bg-jade-purple text-white rounded hover:bg-jade-purple/90 transition flex items-center gap-1"
        >
          <Check size={14} />
          Save
        </button>
      </div>
    </div>
  );
}
