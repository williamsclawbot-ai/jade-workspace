'use client';

import { useState, useEffect } from 'react';
import { X, Search, Calendar, Utensils, Trash2, Clock } from 'lucide-react';
import { harveysMealVarietyStore } from '../lib/harveysMealVarietyStore';
import { recipeDatabase, Recipe } from '../lib/recipeDatabase';

interface HarveysMealPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  harveysAssignedMeals: Record<string, Record<string, string[]>>;
  onAssignMeal: (day: string, mealType: string, mealName: string) => void;
  onRemoveMeal: (day: string, mealType: string, mealName: string) => void;
  mealOptions: Record<string, string[]>;
  days: string[];
}

const mealTypes = ['breakfast', 'lunch', 'snack', 'dinner'];

export default function HarveysMealPickerModal({
  isOpen,
  onClose,
  harveysAssignedMeals,
  onAssignMeal,
  onRemoveMeal,
  mealOptions,
  days,
}: HarveysMealPickerModalProps) {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'snack' | 'dinner'>('breakfast');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filterHarveysOnly, setFilterHarveysOnly] = useState(false); // Default to showing ALL recipes
  const [mealVariety, setMealVariety] = useState<Record<string, number | null>>({});
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);

  // Harvey's Options (from original mealOptions)
  const harveysMealOptions: Record<string, string[]> = {
    '🥣 Carb/Protein': [
      'ABC Muffins', 'Banana Muffins', 'Muesli Bar', 'Carmans Oat Bar',
      'Rice Bubble Bars (homemade)', 'Ham & Cheese Scroll', 'Pizza Scroll',
      'Cheese & Vegemite (+backup)', 'Ham & Cheese Sandwich', 'Nut Butter & Honey (+backup)',
      'Pasta & Boiled Egg (+backup)', 'Avo & Cream Cheese (+backup)', 'Sweet Potato & Chicken',
      'Choc Chip Muffins', 'Weekly New Muffin', 'Weekly New Bar',
    ],
    '🍎 Fruit': [
      'Apple (introduce)', 'Pear', 'Oranges', 'Banana', 'Grapes',
      'Strawberries', 'Raspberries', 'Blueberries', 'Kiwi Fruit', 'Plum', 'Nectarine',
    ],
    '🥦 Vegetable': [
      'Mixed Frozen Veg ⭐ LOVES', 'Cucumber (keep trying)', 'Tomato (keep trying)',
      'Capsicum', 'Broccoli (new)', 'Green Beans (new)', 'Roasted Sweet Potato (new)',
    ],
    '🍪 Crunch': [
      'Star Crackers', 'Rice Cakes', 'Pikelets/Pancakes', 'Veggie Chips',
      'Soft Pretzels', 'Cheese Crackers', 'Breadsticks/Grissini',
    ],
    '🥤 Afternoon Snacks': [
      'Smoothie (banana, berries, yogurt, milk)', 'Yogurt + Fruit',
      'Crackers + Cheese', 'Toast + Nut Butter', 'Fruit Salad', 'Rice Cakes + Honey',
    ],
    '✅ Everyday': ['Yogurt (every lunch)'],
  };

  const getAllHarveysOptions = () => {
    return Object.values(harveysMealOptions).flat();
  };

  // Load recipes from database
  useEffect(() => {
    if (isOpen) {
      recipeDatabase.reload();
      const recipes = recipeDatabase.getAllRecipes();
      setAllRecipes(recipes);
      
      // Load variety for all recipes
      const variety: Record<string, number | null> = {};
      recipes.forEach(recipe => {
        variety[recipe.name] = harveysMealVarietyStore.getDaysSinceLastHad(recipe.name);
      });
      
      // Also load for Harvey's Options
      getAllHarveysOptions().forEach(meal => {
        if (!variety[meal]) {
          variety[meal] = harveysMealVarietyStore.getDaysSinceLastHad(meal);
        }
      });
      
      setMealVariety(variety);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentMeals = harveysAssignedMeals[selectedDay]?.[selectedMealType] || [];
  const recipeCategories = Array.from(new Set(allRecipes.map(r => r.category).filter(Boolean))) as string[];

  const getFilteredItems = () => {
    if (filterHarveysOnly) {
      // When Harvey's Options is active, show ALL his curated items PLUS any matching recipes
      const harveysList = getAllHarveysOptions();
      
      // Start with ALL Harvey's items as "virtual recipes"
      const harveyItems = harveysList.map((item, idx) => ({
        id: `harvey-${idx}`,
        name: item,
        category: 'Harvey\'s Options' as any,
        ingredients: [],
        macros: { calories: 0, protein: 0, fats: 0, carbs: 0 },
      }));
      
      // Get recipes from database that are ALSO in Harvey's Options
      const matchingRecipes = allRecipes.filter(r => harveysList.includes(r.name));
      
      // Combine: Harvey items first, then add any db recipes not already in the list
      const combined = [
        ...harveyItems,
        ...matchingRecipes.filter(r => !harveysList.includes(r.name))
      ];
      
      // Apply search to both Harvey items AND recipes
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return combined.filter(r => r.name.toLowerCase().includes(query));
      }
      
      return combined;
    } else {
      // Show all recipes from database
      let recipes = [...allRecipes];
      
      // Apply category filter
      if (selectedCategory && selectedCategory !== 'All') {
        recipes = recipes.filter(r => r.category === selectedCategory);
      }
      
      // Apply search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        recipes = recipes.filter(r => 
          r.name.toLowerCase().includes(query) ||
          r.notes?.toLowerCase().includes(query) ||
          r.ingredients.some(ing => ing.name.toLowerCase().includes(query))
        );
      }
      
      return recipes;
    }
  };

  const filteredRecipes = getFilteredItems();

  const handleAssignRecipe = (recipeName: string) => {
    onAssignMeal(selectedDay, selectedMealType, recipeName);
    // Record that Harvey is having this meal
    harveysMealVarietyStore.recordMeal(recipeName);
    // Update local state
    setMealVariety(prev => ({ ...prev, [recipeName]: 0 }));
  };

  const handleRemoveMeal = (mealName: string) => {
    onRemoveMeal(selectedDay, selectedMealType, mealName);
  };

  const getMealTypeIcon = (type: string) => {
    switch (type) {
      case 'breakfast':
        return '🥣';
      case 'lunch':
        return '🍱';
      case 'snack':
        return '🍎';
      case 'dinner':
        return '🍽️';
      default:
        return '🍴';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              👶 Harvey's Meal Picker
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden flex">
          {/* Left sidebar: Day + Meal Type selector */}
          <div className="w-64 border-r border-gray-200 dark:border-gray-700 overflow-y-auto p-4 space-y-4">
            {/* Day selector */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                <Calendar size={16} />
                Day
              </h3>
              <div className="space-y-1">
                {days.map(day => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                      selectedDay === day
                        ? 'bg-pink-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Meal Type selector */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                <Utensils size={16} />
                Meal Slot
              </h3>
              <div className="space-y-1">
                {mealTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedMealType(type as any)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center gap-2 ${
                      selectedMealType === type
                        ? 'bg-pink-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <span>{getMealTypeIcon(type)}</span>
                    <span className="capitalize">{type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Current assignments */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Current Assignment
              </h3>
              {currentMeals.length === 0 ? (
                <p className="text-xs text-gray-500 dark:text-gray-400 italic">No meals assigned</p>
              ) : (
                <div className="space-y-1">
                  {currentMeals.map((meal, idx) => (
                    <div
                      key={idx}
                      className="bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded px-2 py-1.5 text-xs text-pink-900 dark:text-pink-200 flex items-center justify-between gap-1"
                    >
                      <span className="flex-1 truncate">{meal}</span>
                      <button
                        onClick={() => handleRemoveMeal(meal)}
                        className="text-pink-600 hover:text-pink-800 dark:text-pink-400 dark:hover:text-pink-300 flex-shrink-0"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right panel: Browse and assign meals */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Search + Filter */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search meals..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Harvey's Filter */}
              <button
                onClick={() => setFilterHarveysOnly(!filterHarveysOnly)}
                className={`w-full px-4 py-2 text-sm rounded-full transition font-medium ${
                  filterHarveysOnly
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                👨‍👦 Harvey's Options
              </button>

              {/* Category filter - only show when Harvey's Options is OFF */}
              {!filterHarveysOnly && (
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-3 py-1 text-sm rounded-full transition ${
                      selectedCategory === null
                        ? 'bg-pink-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    All
                  </button>
                  {recipeCategories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 text-sm rounded-full transition ${
                        selectedCategory === cat
                          ? 'bg-pink-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Recipe list */}
            {filteredRecipes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No recipes found</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  {searchQuery ? 'Try a different search term' : 'Select a different category'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {filteredRecipes.map((recipe) => {
                  const isAssigned = currentMeals.includes(recipe.name);
                  const daysSince = mealVariety[recipe.name];
                  const notHadRecently = daysSince === null || daysSince >= 14;
                  
                  return (
                    <button
                      key={recipe.id}
                      onClick={() => !isAssigned && handleAssignRecipe(recipe.name)}
                      disabled={isAssigned}
                      className={`text-left px-3 py-2 rounded-lg border transition ${
                        isAssigned
                          ? 'bg-pink-100 border-pink-300 text-pink-800 cursor-not-allowed'
                          : notHadRecently
                            ? 'bg-green-50 dark:bg-green-900/10 border-green-300 dark:border-green-700 text-gray-900 dark:text-white hover:border-green-600'
                            : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white hover:border-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/20'
                      }`}
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-1">
                            {isAssigned && <span className="text-xs">✓</span>}
                            {notHadRecently && !isAssigned && <span className="text-xs">⭐</span>}
                            <span className="text-sm flex-1 font-medium">{recipe.name}</span>
                          </div>
                          {recipe.category && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                              {recipe.category}
                            </span>
                          )}
                        </div>
                        
                        {/* Macros - only show if available */}
                        {recipe.macros.calories > 0 && (
                          <div className="flex gap-2 text-xs text-gray-600 dark:text-gray-400 flex-wrap">
                            <span>⚡ {recipe.macros.calories} cal</span>
                            <span>💪 {recipe.macros.protein}g</span>
                            <span>🥑 {recipe.macros.fats}g</span>
                            <span>🍞 {recipe.macros.carbs}g</span>
                          </div>
                        )}
                        
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Clock size={12} />
                          <span>
                            {daysSince === null && 'Never had'}
                            {daysSince === 0 && 'Had today'}
                            {daysSince === 1 && 'Had yesterday'}
                            {daysSince !== null && daysSince >= 2 && daysSince < 7 && `${daysSince} days ago`}
                            {daysSince !== null && daysSince >= 7 && daysSince < 14 && `${Math.floor(daysSince / 7)} week ago`}
                            {daysSince !== null && daysSince >= 14 && `${Math.floor(daysSince / 7)} weeks ago`}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <strong>{selectedDay}</strong> — <span className="capitalize">{selectedMealType}</span>: {currentMeals.length} item{currentMeals.length !== 1 ? 's' : ''} assigned
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
