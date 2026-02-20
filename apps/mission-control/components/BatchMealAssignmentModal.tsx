'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface BatchMealAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipeName: string;
  weekId: string;
  onAssign: (selectedDays: string[], mealType: string) => void;
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const mealTypes = ['Breakfast', 'Lunch', 'Snack', 'Dinner', 'Dessert'];

export default function BatchMealAssignmentModal({
  isOpen,
  onClose,
  recipeName,
  weekId,
  onAssign,
}: BatchMealAssignmentModalProps) {
  const [selectedDays, setSelectedDays] = useState<Set<string>>(new Set());
  const [selectedMealType, setSelectedMealType] = useState<string>('Breakfast');

  if (!isOpen) return null;

  const toggleDay = (day: string) => {
    const newSelected = new Set(selectedDays);
    if (newSelected.has(day)) {
      newSelected.delete(day);
    } else {
      newSelected.add(day);
    }
    setSelectedDays(newSelected);
  };

  const selectAll = () => {
    setSelectedDays(new Set(days));
  };

  const deselectAll = () => {
    setSelectedDays(new Set());
  };

  const handleApply = () => {
    if (selectedDays.size === 0) {
      alert('Please select at least one day');
      return;
    }
    onAssign(Array.from(selectedDays), selectedMealType);
    onClose();
    // Reset state
    setSelectedDays(new Set());
    setSelectedMealType('Breakfast');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-jade-light to-white border-b border-jade-light p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-jade-purple">Assign to Multiple Days</h2>
            <p className="text-sm text-gray-600 mt-1">
              Recipe: <span className="font-semibold">{recipeName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Meal Type Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Which meal type?
            </label>
            <div className="grid grid-cols-5 gap-2">
              {mealTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedMealType(type)}
                  className={`h-12 px-3 py-2 rounded-lg font-medium transition text-sm ${
                    selectedMealType === type
                      ? 'bg-jade-purple text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Day Selector */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-700">
                Which days? ({selectedDays.size} selected)
              </label>
              <div className="flex gap-2">
                <button
                  onClick={selectAll}
                  className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded font-medium transition"
                >
                  Select All
                </button>
                <button
                  onClick={deselectAll}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded font-medium transition"
                >
                  Deselect All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {days.map(day => {
                const isSelected = selectedDays.has(day);
                return (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`h-12 px-4 py-2 rounded-lg font-medium transition border-2 ${
                      isSelected
                        ? 'bg-jade-light border-jade-purple text-jade-purple shadow-md'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-jade-light hover:bg-gray-50'
                    }`}
                  >
                    {isSelected && <span className="mr-1">✓</span>}
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          {selectedDays.size > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Summary:</span> Will assign{' '}
                <span className="font-semibold">{recipeName}</span> to{' '}
                <span className="font-semibold">{selectedMealType}</span> for{' '}
                <span className="font-semibold">
                  {Array.from(selectedDays).join(', ')}
                </span>
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleApply}
              disabled={selectedDays.size === 0}
              className="flex-1 bg-jade-purple hover:bg-jade-purple/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition h-12"
            >
              Apply to {selectedDays.size} {selectedDays.size === 1 ? 'day' : 'days'}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition h-12"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
