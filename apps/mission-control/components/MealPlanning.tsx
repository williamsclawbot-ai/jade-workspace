'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, ShoppingCart, X } from 'lucide-react';
import { weeklyMealPlanStorage, WeeklyMealPlan, ShoppingItem } from '../lib/weeklyMealPlanStorage';
import { recipeDatabase } from '../lib/recipeDatabase';
import { 
  calculateDayMacros,
  getRecipeDetails,
  overrideMealForDay,
  removeMealFromDay,
} from '../lib/mealPlanningHelpers';
import { woolworthsMappings, getWoolworthsMapping, isItemFlagged } from '../lib/woolworthsMapping';
import { purchaseHistory } from '../lib/purchaseHistory';
import { getHarveysMealIngredients, flattenHarveysMeals } from '../lib/harveysMealData';
import { assignRecipeToAllDays } from '../lib/bulkMealHelper';
import { initializeOrRestoreHarveysMeals, saveHarveysMealsToStorage } from '../lib/harveysMealsRestore';
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

// Harvey's meal options (ORIGINAL - UNCHANGED)
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

// Initialize Harvey's assigned meals structure (ORIGINAL)
const initializeAssignedMeals = () => {
  const structure: Record<string, Record<string, string[]>> = {};
  days.forEach(day => {
    structure[day] = {
      breakfast: [],
      lunch: [],
      snack: [],
      dinner: [],
    };
  });
  return structure;
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

  // HARVEY'S STATE (WITH AUTO-RESTORE FALLBACK)
  const [harveysAssignedMeals, setHarveysAssignedMeals] = useState<Record<string, Record<string, string[]>>>(() => {
    return initializeOrRestoreHarveysMeals();
  });
  const [assignmentModal, setAssignmentModal] = useState({ isOpen: false, selectedItem: null as string | null, selectedDay: null as string | null, selectedMeal: null as string | null });

  // Shopping list state
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

    // Harvey's meals are initialized in state with auto-restore built in
    console.log('🍽️ Component mounted - Harvey\'s meals loaded from storage or restored from backup');

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'weekly-meal-plans-v1') {
        const current = weeklyMealPlanStorage.getCurrentWeek();
        const next = weeklyMealPlanStorage.getNextWeek();
        const archived = weeklyMealPlanStorage.getArchivedWeeks();
        setCurrentWeek(current);
        setNextWeek(next);
        setArchivedWeeks(archived);
      } else if (e.key === 'harveysAssignedMeals') {
        const saved = localStorage.getItem('harveysAssignedMeals');
        if (saved) {
          setHarveysAssignedMeals(JSON.parse(saved));
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save Harvey's state to localStorage
  useEffect(() => {
    localStorage.setItem('harveysAssignedMeals', JSON.stringify(harveysAssignedMeals));
  }, [harveysAssignedMeals]);

  const displayedWeek = activeWeekTab === 'this' ? currentWeek : activeWeekTab === 'next' ? nextWeek : archivedWeeks.find(w => w.weekId === selectedArchivedWeekId);
  const readOnly = activeWeekTab === 'archive' || displayedWeek?.status === 'locked';

  const openRecipeModal = (weekId: string, day: string, mealType: string, recipeName: string) => {
    setSelectedMealInfo({ weekId, day, mealType, recipeName });
    setRecipeModalOpen(true);
  };

  const handleRecipeModalSave = (ingredientOverrides: any[], macroOverrides: any) => {
    if (!selectedMealInfo) return;
    const result = overrideMealForDay(selectedMealInfo.weekId, selectedMealInfo.day, selectedMealInfo.mealType, ingredientOverrides, macroOverrides);
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

  // HARVEY'S HANDLERS (RESTORED ORIGINAL)
  const removeItemFromMeal = (day: string, mealType: string, item: string) => {
    setHarveysAssignedMeals(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: prev[day][mealType].filter(i => i !== item),
      },
    }));
  };

  const assignItemToMeal = () => {
    if (!assignmentModal.selectedItem || !assignmentModal.selectedDay || !assignmentModal.selectedMeal) return;

    const mealType = assignmentModal.selectedMeal.toLowerCase() as keyof typeof harveysAssignedMeals[string];
    setHarveysAssignedMeals(prev => ({
      ...prev,
      [assignmentModal.selectedDay!]: {
        ...prev[assignmentModal.selectedDay!],
        [mealType]: [...(prev[assignmentModal.selectedDay!][mealType] || []), assignmentModal.selectedItem!],
      },
    }));

    setAssignmentModal({ isOpen: false, selectedItem: null, selectedDay: null, selectedMeal: null });
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
            activeTab === 'jades-meals' ? 'border-jade-purple text-jade-purple' : 'border-transparent text-gray-600'
          }`}
        >
          👩 Jade's Meals
        </button>
        <button
          onClick={() => setActiveTab('harveys-meals')}
          className={`px-4 py-3 font-medium border-b-2 transition whitespace-nowrap ${
            activeTab === 'harveys-meals' ? 'border-jade-purple text-jade-purple' : 'border-transparent text-gray-600'
          }`}
        >
          👶 Harvey's Meals
        </button>
        <button
          onClick={() => setActiveTab('harveys-options')}
          className={`px-4 py-3 font-medium border-b-2 transition whitespace-nowrap ${
            activeTab === 'harveys-options' ? 'border-jade-purple text-jade-purple' : 'border-transparent text-gray-600'
          }`}
        >
          ✏️ Harvey's Options
        </button>
        <button
          onClick={() => setActiveTab('shopping')}
          className={`px-4 py-3 font-medium border-b-2 transition whitespace-nowrap ${
            activeTab === 'shopping' ? 'border-jade-purple text-jade-purple' : 'border-transparent text-gray-600'
          }`}
        >
          🛒 Shopping List
        </button>
      </div>

      {/* Week tabs */}
      {(activeTab === 'jades-meals' || activeTab === 'harveys-meals' || activeTab === 'shopping') && (
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => { setActiveWeekTab('this'); setSelectedArchivedWeekId(null); }}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${activeWeekTab === 'this' ? 'border-jade-purple text-jade-purple' : 'border-transparent text-gray-600'}`}
          >
            This Week {currentWeek?.status === 'locked' && '🔒'}
          </button>
          <button
            onClick={() => { setActiveWeekTab('next'); setSelectedArchivedWeekId(null); }}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${activeWeekTab === 'next' ? 'border-jade-purple text-jade-purple' : 'border-transparent text-gray-600'}`}
          >
            Next Week
          </button>
          <button
            onClick={() => { setActiveWeekTab('archive'); if (archivedWeeks.length > 0 && !selectedArchivedWeekId) setSelectedArchivedWeekId(archivedWeeks[0].weekId); }}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${activeWeekTab === 'archive' ? 'border-jade-purple text-jade-purple' : 'border-transparent text-gray-600'}`}
          >
            Archive ({archivedWeeks.length})
          </button>
        </div>
      )}

      {/* JADE'S MEALS */}
      {activeTab === 'jades-meals' && (
        <>
          {activeWeekTab === 'archive' ? (
            <ArchiveView archivedWeeks={archivedWeeks} selectedWeekId={selectedArchivedWeekId} onSelectWeek={setSelectedArchivedWeekId} />
          ) : (
            <JadesMealsView 
              week={displayedWeek} 
              readOnly={readOnly} 
              onOpenModal={openRecipeModal} 
              onRemove={handleRemoveMeal}
              onMealsUpdated={() => {
                // Force immediate refresh by re-reading from storage
                const current = weeklyMealPlanStorage.getCurrentWeek();
                const next = weeklyMealPlanStorage.getNextWeek();
                setCurrentWeek(current);
                setNextWeek(next);
              }}
            />
          )}
        </>
      )}

      {/* HARVEY'S MEALS */}
      {activeTab === 'harveys-meals' && (
        <HarveysMealsView harveysAssignedMeals={harveysAssignedMeals} onRemoveItem={removeItemFromMeal} />
      )}

      {/* HARVEY'S OPTIONS */}
      {activeTab === 'harveys-options' && (
        <HarveysOptionsView 
          harveysAssignedMeals={harveysAssignedMeals} 
          assignmentModal={assignmentModal} 
          setAssignmentModal={setAssignmentModal} 
          onAssign={assignItemToMeal}
          onMealsChanged={setHarveysAssignedMeals}
        />
      )}

      {/* SHOPPING LIST */}
      {activeTab === 'shopping' && (
        <>
          {activeWeekTab === 'archive' ? (
            <ArchiveView archivedWeeks={archivedWeeks} selectedWeekId={selectedArchivedWeekId} onSelectWeek={setSelectedArchivedWeekId} />
          ) : (
            <ShoppingListView week={displayedWeek} readOnly={readOnly} onBuildCart={handleBuildWoolworthsCart} buildingCart={buildingCart} cartResult={cartResult} harveysAssignedMeals={harveysAssignedMeals} />
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

// ==================== JADE'S MEALS VIEW ====================
function JadesMealsView({
  week,
  readOnly,
  onOpenModal,
  onRemove,
  onMealsUpdated,
}: {
  week: WeeklyMealPlan;
  readOnly: boolean;
  onOpenModal: (weekId: string, day: string, mealType: string, recipeName: string) => void;
  onRemove: (weekId: string, day: string, mealType: string) => void;
  onMealsUpdated?: () => void;
}) {
  const handleSetBreakfastToWeetbix = () => {
    const updated = assignRecipeToAllDays(week.weekId, 'Breakfast', 'PB & J Overnight Weet-Bix (GF)');
    if (updated) {
      // Immediately update parent state with the new week object
      onMealsUpdated?.();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-jade-light to-white border border-jade-light rounded-lg p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-jade-purple">Jade's Weekly Meal Plan + Macros</h2>
            <p className="text-sm text-gray-600 mt-1">
              {formatDateRange(week.weekStartDate, week.weekEndDate)} — {week.status === 'locked' ? '🔒 Locked' : '✏️ Planning'}
            </p>
          </div>
          {!readOnly && (
            <button
              onClick={handleSetBreakfastToWeetbix}
              className="bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-2 rounded text-sm font-medium transition whitespace-nowrap"
            >
              Set All Breakfasts to PB & J Overnight Weet-Bix
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {days.map(day => (
          <JadesDayCard key={day} week={week} day={day} readOnly={readOnly} onOpenModal={onOpenModal} onRemove={onRemove} onMealsUpdated={onMealsUpdated} />
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
  onMealsUpdated,
}: {
  week: WeeklyMealPlan;
  day: string;
  readOnly: boolean;
  onOpenModal: (weekId: string, day: string, mealType: string, recipeName: string) => void;
  onRemove: (weekId: string, day: string, mealType: string) => void;
  onMealsUpdated?: () => void;
}) {
  const dayMeals = week.jades.meals[day] || {};
  const dayMacros = calculateDayMacros(week.weekId, day);

  const handleQuickAddMeal = (mealType: string, recipeName: string) => {
    weeklyMealPlanStorage.addMealToWeek(week.weekId, day, mealType, recipeName);
    // Trigger parent re-render
    setTimeout(() => {
      onMealsUpdated?.();
    }, 50);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-lg font-bold text-jade-purple">{day}</h3>
        {!readOnly && day === 'Monday' && !dayMeals['dinner'] && (
          <button
            onClick={() => handleQuickAddMeal('Dinner', 'Asian Chicken Tacos (GF)')}
            className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded font-medium transition"
          >
            + Asian Tacos
          </button>
        )}
      </div>
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
                    <button onClick={() => onRemove(week.weekId, day, mealType)} className="text-red-500 hover:text-red-700 transition p-1">
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

// ==================== HARVEY'S MEALS VIEW (RESTORED ORIGINAL) ====================
function HarveysMealsView({
  harveysAssignedMeals,
  onRemoveItem,
}: {
  harveysAssignedMeals: Record<string, Record<string, string[]>>;
  onRemoveItem: (day: string, mealType: string, item: string) => void;
}) {
  const handleRestoreHarveys = () => {
    const restored = initializeOrRestoreHarveysMeals();
    saveHarveysMealsToStorage(restored);
    window.location.reload();
  };

  const isEmpty = days.every(day => 
    harveysMealTypes.every(meal => 
      !(harveysAssignedMeals[day]?.[meal.toLowerCase() as keyof typeof harveysAssignedMeals[string]]?.length > 0)
    )
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-pink-100 to-white border border-pink-200 rounded-lg p-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-pink-600">Harvey's Weekly Meal Plan</h2>
          {isEmpty && (
            <button
              onClick={handleRestoreHarveys}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm font-medium transition"
            >
              🔄 Restore Test Data
            </button>
          )}
        </div>
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
                <td className="bg-pink-50/30 font-semibold text-pink-600 p-3 border border-gray-300 w-24">{day}</td>
                {harveysMealTypes.map(meal => {
                  const mealKey = meal.toLowerCase() as keyof typeof harveysAssignedMeals[string];
                  const items = harveysAssignedMeals[day]?.[mealKey] || [];
                  return (
                    <td key={meal} className="p-3 border border-gray-300 bg-white">
                      {items.length === 0 ? (
                        <div className="text-gray-400 italic text-sm">Empty</div>
                      ) : (
                        <div className="space-y-1">
                          {items.map((item, idx) => (
                            <div key={idx} className="bg-pink-50 border border-pink-200 rounded px-2 py-1 flex items-center justify-between text-sm">
                              <span className="font-medium text-gray-800">{item}</span>
                              <button
                                onClick={() => onRemoveItem(day, mealKey, item)}
                                className="text-red-500 hover:text-red-700 ml-2"
                              >
                                <X size={14} />
                              </button>
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

// ==================== HARVEY'S OPTIONS VIEW (RESTORED ORIGINAL) ====================
function HarveysOptionsView({
  harveysAssignedMeals,
  assignmentModal,
  setAssignmentModal,
  onAssign,
  onMealsChanged,
}: {
  harveysAssignedMeals: Record<string, Record<string, string[]>>;
  assignmentModal: { isOpen: boolean; selectedItem: string | null; selectedDay: string | null; selectedMeal: string | null };
  setAssignmentModal: (state: any) => void;
  onAssign: () => void;
  onMealsChanged?: (updatedMeals: Record<string, Record<string, string[]>>) => void;
}) {
  const [localSelectedItem, setLocalSelectedItem] = useState<string | null>(null);
  const [localSelectedDay, setLocalSelectedDay] = useState<string | null>(null);
  const [localSelectedMeal, setLocalSelectedMeal] = useState<string | null>(null);

  const handleAssign = () => {
    if (localSelectedItem && localSelectedDay && localSelectedMeal) {
      const mealType = localSelectedMeal.toLowerCase() as keyof typeof harveysAssignedMeals[string];
      const updatedMeals = { ...harveysAssignedMeals };
      if (!updatedMeals[localSelectedDay]) updatedMeals[localSelectedDay] = {};
      updatedMeals[localSelectedDay][mealType] = [...(updatedMeals[localSelectedDay][mealType] || []), localSelectedItem];
      
      // Save to storage AND notify parent to update state
      localStorage.setItem('harveysAssignedMeals', JSON.stringify(updatedMeals));
      onMealsChanged?.(updatedMeals);
      
      // Reset
      setLocalSelectedItem(null);
      setLocalSelectedDay(null);
      setLocalSelectedMeal(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-200 rounded-lg p-4">
        <h2 className="text-xl font-bold text-blue-600">Harvey's Meal Options</h2>
        <p className="text-sm text-gray-600 mt-1">Click an item, select a day and meal slot, then assign it.</p>
      </div>

      {localSelectedItem && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
          <p className="font-semibold text-blue-900">
            Selected: <span className="text-blue-700">{localSelectedItem}</span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Day</label>
              <select
                value={localSelectedDay || ''}
                onChange={(e) => setLocalSelectedDay(e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="">Choose day...</option>
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Meal</label>
              <select
                value={localSelectedMeal || ''}
                onChange={(e) => setLocalSelectedMeal(e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="">Choose meal...</option>
                {harveysMealTypes.map(meal => (
                  <option key={meal} value={meal}>{meal}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleAssign}
            disabled={!localSelectedDay || !localSelectedMeal}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded font-semibold transition"
          >
            ✅ Assign to {localSelectedDay} {localSelectedMeal}
          </button>
        </div>
      )}

      <div className="grid gap-4">
        {Object.entries(harveysMealOptions).map(([category, items]) => (
          <div key={category} className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {items.map(item => (
                <button
                  key={item}
                  onClick={() => setLocalSelectedItem(localSelectedItem === item ? null : item)}
                  className={`p-2 rounded text-sm transition ${
                    localSelectedItem === item
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
    </div>
  );
}

// ==================== SHOPPING LIST VIEW ====================
function ShoppingListView({
  week,
  readOnly,
  onBuildCart,
  buildingCart,
  cartResult,
  harveysAssignedMeals,
}: {
  week: WeeklyMealPlan;
  readOnly: boolean;
  onBuildCart: () => void;
  buildingCart: boolean;
  cartResult: { success: boolean; message: string; items?: any[]; total?: number } | null;
  harveysAssignedMeals: Record<string, Record<string, string[]>>;
}) {
  const [manualItems, setManualItems] = useState<ShoppingItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('');

  // Auto-populate shopping list from Harvey's meals on mount or when Harvey's meals change
  useEffect(() => {
    // Get all assigned Harvey meals for the week
    const allMealNames: string[] = [];
    days.forEach(day => {
      ['breakfast', 'lunch', 'snack', 'dinner'].forEach(mealType => {
        const items = harveysAssignedMeals[day]?.[mealType] || [];
        allMealNames.push(...items);
      });
    });

    // Extract ingredients from all meals
    if (allMealNames.length > 0) {
      const flattenedIngredients = flattenHarveysMeals(allMealNames);
      
      // Merge with existing shopping list (don't duplicate)
      const existingItems = week.shoppingList || [];
      const existingNames = existingItems.map(i => i.ingredient.toLowerCase());
      
      const newItems: ShoppingItem[] = flattenedIngredients
        .filter(ing => !existingNames.includes(ing.name.toLowerCase()))
        .map(ing => ({
          id: `item-${Date.now()}-${Math.random()}`,
          ingredient: ing.name,
          quantity: ing.quantity,
          unit: ing.unit,
          source: 'harveys',
          addedAt: Date.now(),
        }));

      if (newItems.length > 0) {
        const merged = [...existingItems, ...newItems];
        setManualItems(merged);
        weeklyMealPlanStorage.updateShoppingListForWeek(week.weekId, merged);
      } else {
        setManualItems(existingItems);
      }
    } else {
      setManualItems(week.shoppingList || []);
    }
  }, [week, harveysAssignedMeals]);

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
    
    // Record this purchase in history
    purchaseHistory.recordPurchase(newItemName, '', newItemUnit || 'unit');
    
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
    const updated = manualItems.map(item => (item.id === id ? { ...item, [field]: value } : item));
    setManualItems(updated);
    weeklyMealPlanStorage.updateShoppingListForWeek(week.weekId, updated);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
        <p className="text-blue-800 font-semibold">📋 Shopping for: {formatDateRange(week.weekStartDate, week.weekEndDate)}</p>
        <p className="text-blue-700 text-sm mt-1">
          {week.status === 'locked' ? '🔒 This week is locked.' : 'Planning this week. Changes update the list.'}
        </p>
      </div>

      {!readOnly && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-jade-purple mb-3">Add Item</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <div className="md:col-span-1">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Item name"
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-jade-light w-full"
              />
              {newItemName.trim() && purchaseHistory.getSuggestion(newItemName) && (
                <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900">
                  💡 {purchaseHistory.getSuggestionString(newItemName)}
                </div>
              )}
            </div>
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
            <div key={item.id} className={`border rounded-lg p-3 ${item.source === 'harveys' ? 'bg-pink-50 border-pink-200' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800">{item.ingredient}</span>
                  {item.source === 'harveys' && (
                    <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded">👶 Harvey</span>
                  )}
                </div>
                {!readOnly && (
                  <button onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:text-red-700">
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
                cartResult.success ? 'bg-green-50 border-green-400 text-green-800' : 'bg-red-50 border-red-400 text-red-800'
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

// ==================== ARCHIVE VIEW ====================
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
