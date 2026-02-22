'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, ShoppingCart, X } from 'lucide-react';
import { jadesMealsStorage, JadeMeal, populateWeeklyLunches } from '../lib/jadesMealsStorage';
import { shoppingListStore, ShoppingListItem } from '../lib/shoppingListStore';

/**
 * Jade's Personal Meals View
 * Displays and manages meals from jadesMealsStorage
 * Meals auto-flow to the shopping list with ingredients
 */
export default function JadesPersonalMealsView() {
  const [meals, setMeals] = useState<JadeMeal[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [newMealName, setNewMealName] = useState('');
  const [newMealType, setNewMealType] = useState('Lunch');
  const [editingMealModal, setEditingMealModal] = useState<{ open: boolean; meal?: JadeMeal }>({ open: false });
  const [ingredients, setIngredients] = useState<Array<{ name: string; qty: string; unit: string }>>([]);
  const [newIngredient, setNewIngredient] = useState({ name: '', qty: '', unit: '' });
  const [macros, setMacros] = useState({ calories: 0, protein: 0, fats: 0, carbs: 0 });
  const [addingToCart, setAddingToCart] = useState(false);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = ['Breakfast', 'Lunch', 'Snack', 'Dinner', 'Dessert'];

  // Load meals and shopping list from storage on mount
  useEffect(() => {
    const storedMeals = jadesMealsStorage.getAllMeals();
    setMeals(storedMeals);
    const storedShoppingList = shoppingListStore.getAll();
    setShoppingList(storedShoppingList);
    console.log('✅ Jade\'s personal meals loaded:', storedMeals.length, 'meals');
    console.log('📝 Shopping list loaded:', storedShoppingList.length, 'items');

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'jades-meals-storage-v1') {
        const updated = jadesMealsStorage.getAllMeals();
        setMeals(updated);
        console.log('📝 Jade\'s meals updated from storage:', updated.length, 'meals');
      }
      if (e.key === 'shopping-list-items') {
        const updated = shoppingListStore.getAll();
        setShoppingList(updated);
        console.log('🛒 Shopping list updated from storage:', updated.length, 'items');
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

    // Show modal to add ingredients
    setEditingMealModal({ 
      open: true, 
      meal: undefined 
    });
  };

  const handleSaveMeal = () => {
    if (!newMealName.trim()) {
      alert('Please enter a meal name');
      return;
    }

    const meal = jadesMealsStorage.addMeal(
      selectedDay,
      newMealType,
      newMealName,
      macros,
      ingredients.length > 0 ? ingredients : undefined
    );

    console.log(`✅ Added meal: ${newMealName} to ${selectedDay} ${newMealType} with ${ingredients.length} ingredients`);
    
    // Auto-add ingredients to shopping list
    if (ingredients.length > 0) {
      const shoppingItems = ingredients.map(ing => ({
        ingredient: ing.name,
        // Combine qty + unit for proper parsing (e.g., "2 cups", "100g")
        quantity: `${ing.qty}${ing.unit ? (ing.unit.match(/^[a-zA-Z]/) ? ` ${ing.unit}` : ing.unit) : ''}`,
        source: 'jade' as const,
        sourceMetadata: {
          mealName: newMealName,
          day: selectedDay,
          mealType: newMealType.toLowerCase() as 'breakfast' | 'lunch' | 'dinner' | 'snack',
        },
      }));
      
      shoppingListStore.addBulk(shoppingItems);
      console.log(`✅ Added ${ingredients.length} ingredients to shopping list`);
    }
    
    // Refresh local state
    const updated = jadesMealsStorage.getAllMeals();
    const updatedShoppingList = shoppingListStore.getAll();
    setMeals(updated);
    setShoppingList(updatedShoppingList);
    setNewMealName('');
    setIngredients([]);
    setMacros({ calories: 0, protein: 0, fats: 0, carbs: 0 });
    setNewIngredient({ name: '', qty: '', unit: '' });
    setEditingMealModal({ open: false });
  };

  const handleAddIngredient = () => {
    if (!newIngredient.name.trim()) {
      alert('Please enter ingredient name');
      return;
    }
    
    setIngredients([...ingredients, {
      name: newIngredient.name,
      qty: newIngredient.qty || '1',
      unit: newIngredient.unit || 'unit',
    }]);
    
    setNewIngredient({ name: '', qty: '', unit: '' });
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
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
      // Combine qty + unit for proper parsing (e.g., "2 cups", "100g")
      quantity: `${ing.qty}${ing.unit ? (ing.unit.match(/^[a-zA-Z]/) ? ` ${ing.unit}` : ing.unit) : ''}`,
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

        {/* Shopping List Summary */}
        {shoppingList.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">🛒 Shopping List ({shoppingList.length} items)</h3>
            <div className="space-y-2">
              {shoppingList.map((item) => (
                <div key={item.id} className="bg-white p-3 rounded border border-blue-100">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{item.ingredient}</p>
                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          value={item.quantity || ''}
                          onChange={(e) => {
                            shoppingListStore.update(item.id, { quantity: e.target.value });
                            const updated = shoppingListStore.getAll();
                            setShoppingList(updated);
                          }}
                          className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                          placeholder="Qty"
                        />
                        <input
                          type="text"
                          value={item.unit || ''}
                          onChange={(e) => {
                            shoppingListStore.update(item.id, { unit: e.target.value });
                            const updated = shoppingListStore.getAll();
                            setShoppingList(updated);
                          }}
                          className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                          placeholder="Unit (g, ml, etc)"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        shoppingListStore.remove(item.id);
                        const updated = shoppingListStore.getAll();
                        setShoppingList(updated);
                      }}
                      className="text-red-500 hover:text-red-700 flex-shrink-0"
                      title="Remove from shopping list"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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

      {/* Meal Detail Modal */}
      {editingMealModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-jade-purple">Add Meal Details</h2>
              <button
                onClick={() => {
                  setEditingMealModal({ open: false });
                  setNewMealName('');
                  setIngredients([]);
                  setMacros({ calories: 0, protein: 0, fats: 0, carbs: 0 });
                  setNewIngredient({ name: '', qty: '', unit: '' });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Meal info summary */}
              <div className="bg-jade-light/20 rounded-lg p-4 border border-jade-light">
                <p className="text-sm text-gray-600">Creating meal</p>
                <p className="font-bold text-lg text-jade-purple">{newMealName}</p>
                <p className="text-sm text-gray-600">{selectedDay} • {newMealType}</p>
              </div>

              {/* Macros input */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">📊 Macros (Optional)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Calories</label>
                    <input
                      type="number"
                      value={macros.calories}
                      onChange={(e) => setMacros({ ...macros, calories: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-jade-light"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Protein (g)</label>
                    <input
                      type="number"
                      value={macros.protein}
                      onChange={(e) => setMacros({ ...macros, protein: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-jade-light"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Fats (g)</label>
                    <input
                      type="number"
                      value={macros.fats}
                      onChange={(e) => setMacros({ ...macros, fats: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-jade-light"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Carbs (g)</label>
                    <input
                      type="number"
                      value={macros.carbs}
                      onChange={(e) => setMacros({ ...macros, carbs: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-jade-light"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Ingredients input */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">🥘 Ingredients</h3>
                
                {/* Add ingredient form */}
                <div className="border border-gray-200 rounded-lg p-3 space-y-2 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={newIngredient.name}
                      onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                      placeholder="Ingredient name"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-jade-light"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddIngredient()}
                    />
                    <input
                      type="text"
                      value={newIngredient.qty}
                      onChange={(e) => setNewIngredient({ ...newIngredient, qty: e.target.value })}
                      placeholder="Quantity"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-jade-light"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newIngredient.unit}
                        onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
                        placeholder="Unit (g, ml, etc)"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-jade-light"
                      />
                      <button
                        onClick={handleAddIngredient}
                        className="bg-jade-purple hover:bg-jade-purple/90 text-white px-3 py-2 rounded-lg font-medium transition flex items-center gap-1 min-w-fit"
                      >
                        <Plus size={16} />
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Ingredients list */}
                {ingredients.length > 0 && (
                  <div className="space-y-2">
                    {ingredients.map((ing, idx) => (
                      <div key={idx} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{ing.name}</p>
                          <p className="text-xs text-gray-600">{ing.qty} {ing.unit}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveIngredient(idx)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {ingredients.length === 0 && (
                  <p className="text-sm text-gray-500 italic">No ingredients added yet</p>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex gap-3">
              <button
                onClick={() => {
                  setEditingMealModal({ open: false });
                  setNewMealName('');
                  setIngredients([]);
                  setMacros({ calories: 0, protein: 0, fats: 0, carbs: 0 });
                  setNewIngredient({ name: '', qty: '', unit: '' });
                }}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMeal}
                className="flex-1 bg-jade-purple hover:bg-jade-purple/90 text-white px-4 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                Save Meal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
