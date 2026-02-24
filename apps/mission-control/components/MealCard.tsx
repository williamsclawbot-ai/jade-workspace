'use client';

import { Clock, Flame, Dumbbell, Wheat, Droplets, X, Plus } from 'lucide-react';

interface MealCardProps {
  slot: string;
  name?: string;
  emoji?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  prepTime?: number;
  cookTime?: number;
  isModified?: boolean;
  source?: 'jade' | 'harvey';
  onView?: () => void;
  onAdd?: () => void;
  onRemove?: () => void;
  onBatchAssign?: () => void;
  readOnly?: boolean;
}

const slotEmojis: Record<string, string> = {
  'Breakfast': '🌅',
  'Lunch': '🌞',
  'Snack': '🍿',
  'Dinner': '🌙',
  'Dessert': '🍨',
  'breakfast': '🌅',
  'lunch': '🌞',
  'snack': '🍿',
  'dinner': '🌙',
  'dessert': '🍨',
  'Morning Tea': '🍎',
  'Afternoon Tea': '🥨',
};

const slotColors: Record<string, string> = {
  'Breakfast': 'bg-amber-50 text-amber-700 border-amber-100',
  'Lunch': 'bg-green-50 text-green-700 border-green-100',
  'Snack': 'bg-blue-50 text-blue-700 border-blue-100',
  'Dinner': 'bg-purple-50 text-purple-700 border-purple-100',
  'Dessert': 'bg-pink-50 text-pink-700 border-pink-100',
  'breakfast': 'bg-amber-50 text-amber-700 border-amber-100',
  'lunch': 'bg-green-50 text-green-700 border-green-100',
  'snack': 'bg-blue-50 text-blue-700 border-blue-100',
  'dinner': 'bg-purple-50 text-purple-700 border-purple-100',
  'dessert': 'bg-pink-50 text-pink-700 border-pink-100',
};

export default function MealCard({
  slot,
  name,
  emoji,
  calories,
  protein,
  carbs,
  fats,
  prepTime,
  cookTime,
  isModified,
  source = 'jade',
  onView,
  onAdd,
  onRemove,
  onBatchAssign,
  readOnly = false,
}: MealCardProps) {
  const displayEmoji = emoji || slotEmojis[slot] || '🍽️';
  const hasMeal = !!name;
  const totalTime = (prepTime || 0) + (cookTime || 0);
  const slotColorClass = slotColors[slot] || 'bg-gray-50 text-gray-600 border-gray-100';

  return (
    <div className={`bg-white rounded-xl border border-[#fbecdb] p-3 sm:p-4 shadow-sm hover:shadow-md transition-all ${hasMeal ? '' : 'border-dashed'}`}>
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Emoji icon */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#fbecdb] rounded-xl flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
          {displayEmoji}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Meal type label */}
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border mb-1.5 ${slotColorClass}`}>
            {slot}
          </span>
          
          {hasMeal ? (
            <>
              <h3 className="font-semibold text-gray-900 text-base sm:text-lg leading-tight mb-1 truncate">
                {name}
              </h3>
              {isModified && (
                <span className="text-xs text-amber-600 font-medium">(modified)</span>
              )}
              
              {/* Macros */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 mt-2">
                {calories !== undefined && (
                  <span className="flex items-center gap-1 bg-orange-50 px-2 py-0.5 rounded-full">
                    <Flame className="w-3 h-3 text-orange-400" />
                    {calories}
                  </span>
                )}
                {protein !== undefined && (
                  <span className="flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-full">
                    <Dumbbell className="w-3 h-3 text-blue-400" />
                    {protein}g
                  </span>
                )}
                {carbs !== undefined && (
                  <span className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-full">
                    <Wheat className="w-3 h-3 text-yellow-500" />
                    {carbs}g
                  </span>
                )}
                {fats !== undefined && (
                  <span className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-full">
                    <Droplets className="w-3 h-3 text-gray-400" />
                    {fats}g
                  </span>
                )}
                {totalTime > 0 && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    {totalTime}m
                  </span>
                )}
              </div>
            </>
          ) : (
            <p className="text-gray-400 italic text-sm py-1">Tap to add meal</p>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="flex flex-col gap-1 flex-shrink-0">
          {hasMeal ? (
            <>
              <button
                onClick={onView}
                className="px-3 py-1.5 text-xs sm:text-sm font-medium text-[#563f57] bg-[#563f57]/5 hover:bg-[#563f57]/10 rounded-lg transition-colors whitespace-nowrap"
              >
                View
              </button>
              {!readOnly && (
                <>
                  {onBatchAssign && (
                    <button
                      onClick={onBatchAssign}
                      className="px-3 py-1.5 text-xs sm:text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors whitespace-nowrap"
                      title="Assign to multiple days"
                    >
                      📋
                    </button>
                  )}
                  {onRemove && (
                    <button
                      onClick={onRemove}
                      className="px-3 py-1.5 text-xs sm:text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </>
              )}
            </>
          ) : (
            <button
              onClick={onAdd}
              className="px-3 py-1.5 text-xs sm:text-sm font-medium text-[#563f57] bg-[#fbecdb] hover:bg-[#f5e0c5] rounded-lg transition-colors flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
