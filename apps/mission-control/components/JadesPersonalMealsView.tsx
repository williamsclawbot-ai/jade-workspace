'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, ShoppingCart } from 'lucide-react';
import { jadesMealsStorage, JadeMeal, populateWeeklyLunches } from '../lib/jadesMealsStorage';
import { shoppingListStore } from '../lib/shoppingListStore';

/**
 * Jade's Personal Meals View
 * Displays and manages meals from jadesMealsStorage
 * Meals auto-flow to the shopping list with ingredients
 */
export default function JadesPersonalMealsView() {
  const [meals, setMeals] = useState<JadeMeal[]>([]);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [newMealName, setNewMealName] = useState('');
  const [newMealType, setNewMealType] = useState('Lunch');
  const [addingToCart, setAddingToCart] = useState(false);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = ['Breakfast', 'Lunch', 'Snack', 'Dinner', 'Dessert'];

  // Load meals from storage on mount
  useEffect(() => {
    const storedMeals = jadesMealsStorage.getAllMeals();
    setMeals(storedMeals);
    console.log('✅ Jade\'s personal meals loaded:', storedMeals.length, 'meals');

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'jades-meals-storage-v1') {
        const updated = jadesMealsStorage.getAllMeals();
        setMeals(updated);
        console.log('📝 Jade\'s meals updated from storage:', updated.length, 'meals');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Get meals for selected day
  const dayMeals = jadesMealsStorage.getMealsForDay(selectedDay);

  const handleAddMeal = () => {
    if (!newMealName.trim()) {
      alert('Please enter a meal name');
      return;
    }

    const meal = jadesMealsStorage.addMeal(
      selectedDay,
      newMealType,
      newMealName,
      {} // Empty macros for now
    );

    console.log(`✅ Added meal: ${newMealName} to ${selectedDay} ${newMealType}`);
    
    // Refresh local state
    const updated = jadesMealsStorage.getAllMeals();
    setMeals(updated);
    setNewMealName('');
  };

  const handleRemoveMeal = (day: string, mealType: string) => {
    jadesMealsStorage.removeMeal(day, mealType);
    console.log(`❌ Removed meal: ${day} ${mealType}`);
    
    // Refresh local state
    const updated = jadesMealsStorage.getAllMeals();
    setMeals(updated);
  };

  const handleAddToShoppingList = (meal: JadeMeal) => {
    if (!meal.ingredients || meal.ingredients.length === 0) {
      alert('This meal has no ingredients recorded');
      return;
    }

    const items = meal.ingredients.map(ing => ({
      ingredient: ing.name,
      quantity: ing.qty,
      source: 'jade' as const,
      sourceMetadata: {
        mealName: meal.mealName,
        day: meal.day,
        mealType: meal.mealType as 'breakfast' | 'lunch' | 'dinner' | 'snack',
      },
    }));

    shoppingListStore.addBulk(items);
    alert(`✅ Added ${items.length} ingredients from "${meal.mealName}" to shopping list`);
  };

  const handlePopulateTestData = () => {
    if (confirm('This will add test meals for next week (Mon-Fri lunches). Continue?')) {
      populateWeeklyLunches();
      const updated = jadesMealsStorage.getAllMeals();
      setMeals(updated);
      alert('✅ Test meals loaded!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-jade-light to-white border border-jade-light rounded-lg p-4">
        <h2 className="text-xl font-bold text-jade-purple">Jade's Personal Meals 👩</h2>
        <p className="text-sm text-gray-600 mt-1">Add meals here. They'll auto-populate the shopping list with ingredients.</p>
      </div>

      {/* Add Test Data Button */}
      {meals.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <button
            onClick={handlePopulateTestData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition"
          >
            🔄 Load Test Meals (Mon-Fri Lunches)
          </button>
        </div>
      )}

      {/* Day Selector */}
      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
        {days.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-6 py-3 font-medium border-b-2 transition whitespace-nowrap min-h-[48px] ${
              selectedDay === day
                ? 'border-jade-purple text-jade-purple'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Meals for Selected Day */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">{selectedDay}'s Meals</h3>
        
        {/* Existing meals */}
        <div className="grid grid-cols-1 gap-4">
          {mealTypes.map(mealType => {
            const meal = dayMeals[mealType.toLowerCase() as keyof typeof dayMeals];
            
            return (
              <div
                key={mealType}
                className="border border-gray-200 rounded-lg p-4 bg-white"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <label className="text-sm font-semibold text-gray-700 block mb-1">
                      {mealType}
                    </label>
                    {meal ? (
                      <div className="space-y-2">
                        <p className="text-lg font-medium text-gray-900">{meal.mealName}</p>
                        {meal.calories && (
                          <div className="text-xs text-gray-600 space-y-1">
                            <p>📊 {meal.calories} cal | {meal.protein}g protein | {meal.fats}g fat | {meal.carbs}g carbs</p>
                            {meal.ingredients && meal.ingredients.length > 0 && (
                              <p>🥘 {meal.ingredients.length} ingredients</p>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No {mealType.toLowerCase()} planned</p>
                    )}
                  </div>
                  {meal && (
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleAddToShoppingList(meal)}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1"
                        title="Add ingredients to shopping list"
                      >
                        <ShoppingCart size={16} />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleRemoveMeal(meal.day, meal.mealType)}
                        className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg text-sm font-medium transition"
                        title="Remove this meal"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Ingredients list (if meal exists) */}
                {meal && meal.ingredients && meal.ingredients.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Ingredients:</p>
                    <ul className="text-xs text-gray-700 space-y-1">
                      {meal.ingredients.map((ing, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span>{ing.name}</span>
                          <span className="text-gray-500">{ing.qty} {ing.unit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Add New Meal Form */}
        <div className="border-2 border-dashed border-jade-light rounded-lg p-4 bg-jade-light/5 space-y-3">
          <p className="text-sm font-semibold text-gray-700">Add a New Meal for {selectedDay}</p>
          <div className="flex gap-2">
            <select
              value={newMealType}
              onChange={(e) => setNewMealType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-jade-light"
            >
              {mealTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <input
              type="text"
              value={newMealName}
              onChange={(e) => setNewMealName(e.target.value)}
              placeholder="Meal name (e.g., Chicken Tacos)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-jade-light"
              onKeyPress={(e) => e.key === 'Enter' && handleAddMeal()}
            />
            <button
              onClick={handleAddMeal}
              className="bg-jade-purple hover:bg-jade-purple/90 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-1"
            >
              <Plus size={16} />
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      {meals.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-white border border-green-200 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wide">Total Meals</p>
              <p className="text-2xl font-bold text-green-600">{meals.length}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wide">Days Planned</p>
              <p className="text-2xl font-bold text-green-600">{new Set(meals.map(m => m.day)).size}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wide">Ingredients</p>
              <p className="text-2xl font-bold text-green-600">
                {meals.reduce((sum, m) => sum + (m.ingredients?.length || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
