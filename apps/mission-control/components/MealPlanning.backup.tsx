'use client';

import { useState, useEffect } from 'react';
import { UtensilsCrossed, Plus, Trash2, ShoppingCart, X, ChevronDown, ChevronUp } from 'lucide-react';
import { weeklyMealPlanStorage, WeeklyMealPlan, ShoppingItem } from '../lib/weeklyMealPlanStorage';
import { recipeDatabase } from '../lib/recipeDatabase';
import { 
  calculateDayMacros,
  getRecipeDetails,
  overrideMealForDay,
  removeMealFromDay,
} from '../lib/mealPlanningHelpers';
import { woolworthsMappings, getWoolworthsMapping, isItemFlagged } from '../lib/woolworthsMapping';
import RecipeModal from './RecipeModal';
import MacrosDisplay from './MacrosDisplay';
import NotesButton from './NotesButton';

const JADE_TARGETS = {
  calories: 1550,
  protein: 120,
  fats: 45,
  carbs: 166,
};

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const jadesMealTypes = ['Breakfast', 'Lunch', 'Snack', 'Dinner', 'Dessert'];
const harveysMealTypes = ['Breakfast', 'Lunch', 'Snack', 'Dinner'];

// Harvey's meal options (unchanged from original)
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

export default function MealPlanning() {
  const [activeTab, setActiveTab] = useState<'jades-meals' | 'harveys-meals' | 'shopping' | 'harveys-options'>('jades-meals');
  const [activeWeekTab, setActiveWeekTab] = useState<'this' | 'next' | 'archive'>('this');
  const [selectedArchivedWeekId, setSelectedArchivedWeekId] = useState<string | null>(null);

  const [currentWeek, setCurrentWeek] = useState<WeeklyMealPlan | null>(null);
  const [nextWeek, setNextWeek] = useState<WeeklyMealPlan | null>(null);
  const [archivedWeeks, setArchivedWeeks] = useState<WeeklyMealPlan[]>([]);

  const [recipeModalOpen, setRecipeModalOpen] = useState(false);
  const [selectedMealInfo, setSelectedMealInfo] = useState<{ weekId: string; day: string; mealType: string; recipeName: string } | null>(null);

  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('');
  const [buildingCart, setBuildingCart] = useState(false);
  const [cartResult, setCartResult] = useState<{ success: boolean; message: string; items?: any[]; total?: number } | null>(null);

  // Load weeks on mount
  useEffect(() => {
    const current = weeklyMealPlanStorage.getCurrentWeek();
    const next = weeklyMealPlanStorage.getNextWeek();
    const archived = weeklyMealPlanStorage.getArchivedWeeks();
    setCurrentWeek(current);
    setNextWeek(next);
    setArchivedWeeks(archived);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'weekly-meal-plans-v1') {
        const current = weeklyMealPlanStorage.getCurrentWeek();
        const next = weeklyMealPlanStorage.getNextWeek();
        const archived = weeklyMealPlanStorage.getArchivedWeeks();
        setCurrentWeek(current);
        setNextWeek(next);
        setArchivedWeeks(archived);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const displayedWeek =
    activeWeekTab === 'this'
      ? currentWeek
      : activeWeekTab === 'next'
      ? nextWeek
      : archivedWeeks.find(w => w.weekId === selectedArchivedWeekId);

  const readOnly = activeWeekTab === 'archive' || displayedWeek?.status === 'locked';

  const openRecipeModal = (weekId: string, day: string, mealType: string, recipeName: string) => {
    setSelectedMealInfo({ weekId, day, mealType, recipeName });
    setRecipeModalOpen(true);
  };

  const handleRecipeModalSave = (ingredientOverrides: any[], macroOverrides: any) => {
    if (!selectedMealInfo) return;
    const result = overrideMealForDay(
      selectedMealInfo.weekId,
      selectedMealInfo.day,
      selectedMealInfo.mealType,
      ingredientOverrides,
      macroOverrides
    );
    if (result.success) {
      const current = weeklyMealPlanStorage.getCurrentWeek();
      const next = weeklyMealPlanStorage.getNextWeek();
      setCurrentWeek(current);
      setNextWeek(next);
    }
  };

  const handleRemoveMeal = (weekId: string, day: string, mealType: string) => {
    const result = removeMealFromDay(weekId, day, mealType);
    if (result.success) {
      const current = weeklyMealPlanStorage.getCurrentWeek();
      const next = weeklyMealPlanStorage.getNextWeek();
      setCurrentWeek(current);
      setNextWeek(next);
    }
  };

  const handleBuildWoolworthsCart = async () => {
    if (!displayedWeek) return;
    setBuildingCart(true);
    setCartResult(null);
    try {
      const response = await fetch('/api/woolworths/build-cart', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        setCartResult({
          success: true,
          message: `✅ Cart built! ${data.items.length} items. Total: $${data.total.toFixed(2)}`,
          items: data.items,
          total: data.total,
        });
        weeklyMealPlanStorage.lockWeek(displayedWeek.weekId);
        const current = weeklyMealPlanStorage.getCurrentWeek();
        const next = weeklyMealPlanStorage.getNextWeek();
        const archived = weeklyMealPlanStorage.getArchivedWeeks();
        setCurrentWeek(current);
        setNextWeek(next);
        setArchivedWeeks(archived);
      } else {
        setCartResult({ success: false, message: `❌ Error: ${data.error}` });
      }
    } catch (error) {
      setCartResult({ success: false, message: `❌ Failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
    } finally {
      setBuildingCart(false);
    }
  };

  if (!displayedWeek) return <div className="text-center py-8">Loading meal plans...</div>;

  return (
    <div className="space-y-6">
      {/* Main tabs */}
      <div className="flex gap-4 border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('jades-meals')}
          className={`px-4 py-3 font-medium border-b-2 transition whitespace-nowrap ${
            activeTab === 'jades-meals'
              ? 'border-jade-purple text-jade-purple'
              : 'border-transparent text-gray-600'
          }`}
        >
          👩 Jade's Meals
        </button>
        <button
          onClick={() => setActiveTab('harveys-meals')}
          className={`px-4 py-3 font-medium border-b-2 transition whitespace-nowrap ${
            activeTab === 'harveys-meals'
              ? 'border-jade-purple text-jade-purple'
              : 'border-transparent text-gray-600'
          }`}
        >
          👶 Harvey's Meals
        </button>
        <button
          onClick={() => setActiveTab('harveys-options')}
          className={`px-4 py-3 font-medium border-b-2 transition whitespace-nowrap ${
            activeTab === 'harveys-options'
              ? 'border-jade-purple text-jade-purple'
              : 'border-transparent text-gray-600'
          }`}
        >
          ✏️ Harvey's Options
        </button>
        <button
          onClick={() => setActiveTab('shopping')}
          className={`px-4 py-3 font-medium border-b-2 transition whitespace-nowrap ${
            activeTab === 'shopping'
              ? 'border-jade-purple text-jade-purple'
              : 'border-transparent text-gray-600'
          }`}
        >
          🛒 Shopping List
        </button>
      </div>

      {/* Week tabs (shown for Jade's, Harvey's, and Shopping) */}
      {(activeTab === 'jades-meals' || activeTab === 'harveys-meals' || activeTab === 'shopping') && (
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => {
              setActiveWeekTab('this');
              setSelectedArchivedWeekId(null);
            }}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
              activeWeekTab === 'this'
                ? 'border-jade-purple text-jade-purple'
                : 'border-transparent text-gray-600'
            }`}
          >
            This Week {currentWeek?.status === 'locked' && '🔒'}
          </button>
          <button
            onClick={() => {
              setActiveWeekTab('next');
              setSelectedArchivedWeekId(null);
            }}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
              activeWeekTab === 'next'
                ? 'border-jade-purple text-jade-purple'
                : 'border-transparent text-gray-600'
            }`}
          >
            Next Week
          </button>
          <button
            onClick={() => {
              setActiveWeekTab('archive');
              if (archivedWeeks.length > 0 && !selectedArchivedWeekId) {
                setSelectedArchivedWeekId(archivedWeeks[0].weekId);
              }
            }}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
              activeWeekTab === 'archive'
                ? 'border-jade-purple text-jade-purple'
                : 'border-transparent text-gray-600'
            }`}
          >
            Archive ({archivedWeeks.length})
          </button>
        </div>
      )}

      {/* Content */}
      {activeTab === 'jades-meals' && (
        <>
          {activeWeekTab === 'archive' ? (
            <ArchiveView archivedWeeks={archivedWeeks} selectedWeekId={selectedArchivedWeekId} onSelectWeek={setSelectedArchivedWeekId} />
          ) : (
            <JadesMealsView week={displayedWeek} readOnly={readOnly} onOpenModal={openRecipeModal} onRemove={handleRemoveMeal} />
          )}
        </>
      )}

      {activeTab === 'harveys-meals' && (
        <>
          {activeWeekTab === 'archive' ? (
            <ArchiveView archivedWeeks={archivedWeeks} selectedWeekId={selectedArchivedWeekId} onSelectWeek={setSelectedArchivedWeekId} />
          ) : (
            <HarveysMealsView week={displayedWeek} readOnly={readOnly} />
          )}
        </>
      )}

      {activeTab === 'harveys-options' && (
        <HarveysOptionsView week={displayedWeek} />
      )}

      {activeTab === 'shopping' && (
        <>
          {activeWeekTab === 'archive' ? (
            <ArchiveView archivedWeeks={archivedWeeks} selectedWeekId={selectedArchivedWeekId} onSelectWeek={setSelectedArchivedWeekId} />
          ) : (
            <ShoppingListView week={displayedWeek} readOnly={readOnly} onBuildCart={handleBuildWoolworthsCart} buildingCart={buildingCart} cartResult={cartResult} />
          )}
        </>
      )}

      {/* Recipe modal */}
      {selectedMealInfo && (
        <RecipeModal
          isOpen={recipeModalOpen}
          recipe={getRecipeDetails(selectedMealInfo.recipeName)}
          onClose={() => setRecipeModalOpen(false)}
          onSave={handleRecipeModalSave}
          readOnly={readOnly}
        />
      )}
    </div>
  );
}

// JADE'S MEALS VIEW
function JadesMealsView({
  week,
  readOnly,
  onOpenModal,
  onRemove,
}: {
  week: WeeklyMealPlan;
  readOnly: boolean;
  onOpenModal: (weekId: string, day: string, mealType: string, recipeName: string) => void;
  onRemove: (weekId: string, day: string, mealType: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-jade-light to-white border border-jade-light rounded-lg p-4">
        <h2 className="text-xl font-bold text-jade-purple">
          Jade's Weekly Meal Plan + Macros
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {formatDateRange(week.weekStartDate, week.weekEndDate)} — {week.status === 'locked' ? '🔒 Locked' : '✏️ Planning'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {days.map(day => (
          <JadesDayCard
            key={day}
            week={week}
            day={day}
            readOnly={readOnly}
            onOpenModal={onOpenModal}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  );
}

function JadesDayCard({
  week,
  day,
  readOnly,
  onOpenModal,
  onRemove,
}: {
  week: WeeklyMealPlan;
  day: string;
  readOnly: boolean;
  onOpenModal: (weekId: string, day: string, mealType: string, recipeName: string) => void;
  onRemove: (weekId: string, day: string, mealType: string) => void;
}) {
  const dayMeals = week.jades.meals[day] || {};
  const dayMacros = calculateDayMacros(week.weekId, day);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      <h3 className="text-lg font-bold text-jade-purple">{day}</h3>
      <MacrosDisplay actual={dayMacros} target={JADE_TARGETS} showRemaining={true} />
      <div className="space-y-2">
        {jadesMealTypes.map(mealType => {
          const recipeKey = mealType.toLowerCase() as keyof typeof dayMeals;
          const recipeName = dayMeals[recipeKey];
          const dayOverride = week.jades.dayOverrides[day]?.[mealType.toLowerCase()];

          return (
            <div key={mealType} className="flex items-center gap-2">
              <label className="text-sm font-semibold text-gray-700 w-20">{mealType}</label>
              {!recipeName ? (
                <div className="flex-1 text-gray-400 italic text-sm py-2 px-3">Empty</div>
              ) : (
                <>
                  <div
                    onClick={() => onOpenModal(week.weekId, day, mealType, recipeName)}
                    className="flex-1 px-3 py-2 bg-jade-light/30 rounded hover:bg-jade-light/50 cursor-pointer transition"
                  >
                    <span className="font-medium text-gray-800">{recipeName}</span>
                    {dayOverride && <span className="text-xs text-amber-600 ml-2">(modified)</span>}
                  </div>
                  {!readOnly && (
                    <button
                      onClick={() => onRemove(week.weekId, day, mealType)}
                      className="text-red-500 hover:text-red-700 transition p-1"
                    >
                      <X size={18} />
                    </button>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// HARVEY'S MEALS VIEW
function HarveysMealsView({ week, readOnly }: { week: WeeklyMealPlan; readOnly: boolean }) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-pink-light to-white border border-pink-200 rounded-lg p-4">
        <h2 className="text-xl font-bold text-pink-600">Harvey's Weekly Meal Plan</h2>
        <p className="text-sm text-gray-600 mt-1">
          {formatDateRange(week.weekStartDate, week.weekEndDate)}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="bg-pink-50 text-pink-600 font-bold p-3 text-left border border-gray-300">Day</th>
              {harveysMealTypes.map(meal => (
                <th key={meal} className="bg-pink-50 text-pink-600 font-bold p-3 text-left border border-gray-300">
                  {meal}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map(day => (
              <tr key={day}>
                <td className="bg-pink-50/30 font-semibold text-pink-600 p-3 border border-gray-300 w-24">
                  {day}
                </td>
                {harveysMealTypes.map(meal => {
                  const mealKey = meal.toLowerCase() as keyof typeof week.harveys.meals[string];
                  const items = week.harveys.meals[day]?.[mealKey] ? [week.harveys.meals[day][mealKey]] : [];
                  return (
                    <td key={meal} className="p-3 border border-gray-300 bg-white">
                      {items.length === 0 ? (
                        <div className="text-gray-400 italic text-sm">Empty</div>
                      ) : (
                        <div className="space-y-1">
                          {items.map((item, idx) => (
                            <div
                              key={idx}
                              className="bg-pink-50 border border-pink-200 rounded px-2 py-1 text-sm font-medium text-gray-800"
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// HARVEY'S OPTIONS VIEW
function HarveysOptionsView({ week }: { week: WeeklyMealPlan }) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);

  const handleAssign = () => {
    if (!selectedItem || !selectedDay || !selectedMeal) return;

    const mealKey = selectedMeal.toLowerCase() as keyof typeof week.harveys.meals[string];
    weeklyMealPlanStorage.addMealToWeek(week.weekId, selectedDay, selectedMeal, selectedItem);

    setSelectedItem(null);
    setSelectedDay(null);
    setSelectedMeal(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-200 rounded-lg p-4">
        <h2 className="text-xl font-bold text-blue-600">Harvey's Meal Options</h2>
        <p className="text-sm text-gray-600 mt-1">Click an item, select a day and meal slot, then assign it.</p>
      </div>

      <div className="grid gap-4">
        {Object.entries(harveysMealOptions).map(([category, items]) => (
          <div key={category} className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {items.map(item => (
                <button
                  key={item}
                  onClick={() => setSelectedItem(selectedItem === item ? null : item)}
                  className={`p-2 rounded text-sm transition ${
                    selectedItem === item
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
          <p className="font-semibold text-blue-900">
            Selected: <span className="text-blue-700">{selectedItem}</span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Day</label>
              <select
                value={selectedDay || ''}
                onChange={(e) => setSelectedDay(e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="">Choose day...</option>
                {days.map(day => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Meal</label>
              <select
                value={selectedMeal || ''}
                onChange={(e) => setSelectedMeal(e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="">Choose meal...</option>
                {harveysMealTypes.map(meal => (
                  <option key={meal} value={meal}>
                    {meal}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleAssign}
            disabled={!selectedDay || !selectedMeal}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded font-semibold transition"
          >
            ✅ Assign to {selectedDay} {selectedMeal}
          </button>
        </div>
      )}
    </div>
  );
}

// SHOPPING LIST VIEW
function ShoppingListView({
  week,
  readOnly,
  onBuildCart,
  buildingCart,
  cartResult,
}: {
  week: WeeklyMealPlan;
  readOnly: boolean;
  onBuildCart: () => void;
  buildingCart: boolean;
  cartResult: { success: boolean; message: string; items?: any[]; total?: number } | null;
}) {
  const [manualItems, setManualItems] = useState<ShoppingItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('');

  useEffect(() => {
    setManualItems(week.shoppingList || []);
  }, [week]);

  const handleAddItem = () => {
    if (!newItemName.trim()) return;
    const newItem: ShoppingItem = {
      id: `item-${Date.now()}`,
      ingredient: newItemName,
      quantity: newItemQty || '1',
      unit: newItemUnit || 'unit',
      source: 'jade',
      addedAt: Date.now(),
    };
    const updated = [...manualItems, newItem];
    setManualItems(updated);
    weeklyMealPlanStorage.updateShoppingListForWeek(week.weekId, updated);
    setNewItemName('');
    setNewItemQty('');
    setNewItemUnit('');
  };

  const handleRemoveItem = (id: string) => {
    const updated = manualItems.filter(item => item.id !== id);
    setManualItems(updated);
    weeklyMealPlanStorage.updateShoppingListForWeek(week.weekId, updated);
  };

  const handleUpdateItem = (id: string, field: 'quantity' | 'unit', value: string) => {
    const updated = manualItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setManualItems(updated);
    weeklyMealPlanStorage.updateShoppingListForWeek(week.weekId, updated);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
        <p className="text-blue-800 font-semibold">
          📋 Shopping for: {formatDateRange(week.weekStartDate, week.weekEndDate)}
        </p>
        <p className="text-blue-700 text-sm mt-1">
          {week.status === 'locked' ? '🔒 This week is locked.' : 'Planning this week. Changes update the list.'}
        </p>
      </div>

      {!readOnly && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-jade-purple mb-3">Add Item</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Item name"
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-jade-light"
            />
            <input
              type="text"
              value={newItemQty}
              onChange={(e) => setNewItemQty(e.target.value)}
              placeholder="Qty"
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-jade-light"
            />
            <input
              type="text"
              value={newItemUnit}
              onChange={(e) => setNewItemUnit(e.target.value)}
              placeholder="Unit"
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-jade-light"
            />
            <button
              onClick={handleAddItem}
              className="bg-jade-purple text-white px-4 py-2 rounded hover:bg-jade-purple/90 transition flex items-center justify-center gap-1"
            >
              <Plus size={16} /> Add
            </button>
          </div>
        </div>
      )}

      {manualItems.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-600">No items yet. Add items manually or they'll appear from your meal plan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {manualItems.map(item => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-800">{item.ingredient}</span>
                {!readOnly && (
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              {!readOnly ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={item.quantity || ''}
                    onChange={(e) => handleUpdateItem(item.id, 'quantity', e.target.value)}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="Qty"
                  />
                  <input
                    type="text"
                    value={item.unit || ''}
                    onChange={(e) => handleUpdateItem(item.id, 'unit', e.target.value)}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="Unit"
                  />
                </div>
              ) : (
                <p className="text-sm text-gray-600">{item.quantity} {item.unit}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {!readOnly && (
        <>
          <button
            onClick={onBuildCart}
            disabled={buildingCart || manualItems.length === 0}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
          >
            <ShoppingCart size={20} />
            {buildingCart ? 'Building cart...' : 'Build Woolworths Cart & Lock Week'}
          </button>

          {cartResult && (
            <div
              className={`border-l-4 rounded p-4 ${
                cartResult.success
                  ? 'bg-green-50 border-green-400 text-green-800'
                  : 'bg-red-50 border-red-400 text-red-800'
              }`}
            >
              <p className="font-semibold">{cartResult.message}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ARCHIVE VIEW
function ArchiveView({
  archivedWeeks,
  selectedWeekId,
  onSelectWeek,
}: {
  archivedWeeks: WeeklyMealPlan[];
  selectedWeekId: string | null;
  onSelectWeek: (id: string) => void;
}) {
  const selectedWeek = archivedWeeks.find(w => w.weekId === selectedWeekId);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-jade-purple">Locked & Archived Weeks</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {archivedWeeks.map(week => (
          <div
            key={week.weekId}
            onClick={() => onSelectWeek(week.weekId)}
            className={`border rounded-lg p-4 cursor-pointer transition ${
              selectedWeekId === week.weekId
                ? 'bg-jade-light border-jade-purple'
                : 'bg-white border-gray-200 hover:border-jade-light'
            }`}
          >
            <p className="font-semibold text-gray-800">{formatDateRange(week.weekStartDate, week.weekEndDate)}</p>
            <p className="text-xs text-gray-600 mt-1">🔒 Locked {formatDate(week.lockedAt)}</p>
            <p className="text-sm text-gray-600 mt-2">📋 {week.shoppingList.length} items</p>
          </div>
        ))}
      </div>

      {selectedWeek && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-jade-purple">
            {formatDateRange(selectedWeek.weekStartDate, selectedWeek.weekEndDate)}
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {days.map(day => (
              <JadesDayCard
                key={day}
                week={selectedWeek}
                day={day}
                readOnly={true}
                onOpenModal={() => {}}
                onRemove={() => {}}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate).toLocaleDateString('en-AU', { month: 'short', day: 'numeric' });
  const end = new Date(endDate).toLocaleDateString('en-AU', { month: 'short', day: 'numeric' });
  return `${start} - ${end}`;
}

function formatDate(date?: number): string {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-AU', { month: 'short', day: 'numeric', year: '2-digit' });
}
