'use client';

import { useState, useEffect } from 'react';
import { UtensilsCrossed, Plus, Trash2, ShoppingCart, X, ChevronRight, Lock, Archive } from 'lucide-react';
import { weeklyMealPlanStorage, WeeklyMealPlan, ShoppingItem } from '../lib/weeklyMealPlanStorage';
import { recipeDatabase, Recipe } from '../lib/recipeDatabase';
import { 
  addMealToDay, 
  addMealToMultipleDays, 
  removeMealFromDay, 
  overrideMealForDay,
  calculateDayMacros,
  getRecipeDetails,
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
const mealTypes = ['Breakfast', 'Lunch', 'Snack', 'Dinner', 'Dessert'];

export default function MealPlanningRefactored() {
  const [activeTab, setActiveTab] = useState<'this' | 'next' | 'archive'>('this');
  const [selectedArchivedWeekId, setSelectedArchivedWeekId] = useState<string | null>(null);
  
  const [currentWeek, setCurrentWeek] = useState<WeeklyMealPlan | null>(null);
  const [nextWeek, setNextWeek] = useState<WeeklyMealPlan | null>(null);
  const [archivedWeeks, setArchivedWeeks] = useState<WeeklyMealPlan[]>([]);
  
  const [recipeModalOpen, setRecipeModalOpen] = useState(false);
  const [selectedMealInfo, setSelectedMealInfo] = useState<{
    weekId: string;
    day: string;
    mealType: string;
    recipeName: string;
  } | null>(null);
  
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('');
  const [buildingCart, setBuildingCart] = useState(false);
  const [cartResult, setCartResult] = useState<{ success: boolean; message: string; items?: any[]; total?: number } | null>(null);

  // Load all weeks on mount
  useEffect(() => {
    const current = weeklyMealPlanStorage.getCurrentWeek();
    const next = weeklyMealPlanStorage.getNextWeek();
    const archived = weeklyMealPlanStorage.getArchivedWeeks();
    
    setCurrentWeek(current);
    setNextWeek(next);
    setArchivedWeeks(archived);

    // Listen for storage changes
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
    activeTab === 'this'
      ? currentWeek
      : activeTab === 'next'
      ? nextWeek
      : archivedWeeks.find(w => w.weekId === selectedArchivedWeekId);

  const readOnly = activeTab === 'archive' || displayedWeek?.status === 'locked';

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
      // Reload weeks
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

  const handleLockWeek = async () => {
    if (!currentWeek) return;
    weeklyMealPlanStorage.lockWeek(currentWeek.weekId);
    const current = weeklyMealPlanStorage.getCurrentWeek();
    const next = weeklyMealPlanStorage.getNextWeek();
    const archived = weeklyMealPlanStorage.getArchivedWeeks();
    setCurrentWeek(current);
    setNextWeek(next);
    setArchivedWeeks(archived);
  };

  const handleBuildWoolworthsCart = async () => {
    if (!displayedWeek) return;
    
    setBuildingCart(true);
    setCartResult(null);
    try {
      const response = await fetch('/api/woolworths/build-cart', {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        setCartResult({
          success: true,
          message: `✅ Cart built! ${data.items.length} items added. Total: $${data.total.toFixed(2)}`,
          items: data.items,
          total: data.total,
        });
        // Lock the week after building cart
        handleLockWeek();
      } else {
        setCartResult({
          success: false,
          message: `❌ Error: ${data.error}`,
        });
      }
    } catch (error) {
      setCartResult({
        success: false,
        message: `❌ Failed to build cart: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } finally {
      setBuildingCart(false);
    }
  };

  if (!displayedWeek) {
    return <div className="text-center py-8">Loading meal plans...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => {
            setActiveTab('this');
            setSelectedArchivedWeekId(null);
          }}
          className={`px-4 py-3 font-medium border-b-2 transition ${
            activeTab === 'this'
              ? 'border-jade-purple text-jade-purple'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          This Week
          {currentWeek?.status === 'locked' && ' 🔒'}
        </button>
        <button
          onClick={() => {
            setActiveTab('next');
            setSelectedArchivedWeekId(null);
          }}
          className={`px-4 py-3 font-medium border-b-2 transition ${
            activeTab === 'next'
              ? 'border-jade-purple text-jade-purple'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Next Week
        </button>
        <button
          onClick={() => {
            setActiveTab('archive');
            if (archivedWeeks.length > 0 && !selectedArchivedWeekId) {
              setSelectedArchivedWeekId(archivedWeeks[0].weekId);
            }
          }}
          className={`px-4 py-3 font-medium border-b-2 transition ${
            activeTab === 'archive'
              ? 'border-jade-purple text-jade-purple'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Archive ({archivedWeeks.length})
        </button>
      </div>

      {/* Archive view */}
      {activeTab === 'archive' ? (
        <ArchiveView
          archivedWeeks={archivedWeeks}
          selectedWeekId={selectedArchivedWeekId}
          onSelectWeek={setSelectedArchivedWeekId}
        />
      ) : (
        <>
          {/* Week header */}
          <div className="bg-gradient-to-r from-jade-light to-white border border-jade-light rounded-lg p-4">
            <h2 className="text-xl font-bold text-jade-purple mb-1">
              {activeTab === 'this' ? 'This Week' : 'Next Week'}: {formatDateRange(displayedWeek.weekStartDate, displayedWeek.weekEndDate)}
            </h2>
            <p className="text-sm text-gray-600">
              Status: {displayedWeek.status === 'locked' ? '🔒 Locked - View only' : '✏️ Planning'}
            </p>
          </div>

          {/* Weekly meal grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {days.map(day => (
              <DayCard
                key={day}
                week={displayedWeek}
                day={day}
                readOnly={readOnly}
                onMealClick={(mealType, recipeName) =>
                  openRecipeModal(displayedWeek.weekId, day, mealType, recipeName)
                }
                onRemove={(mealType) => handleRemoveMeal(displayedWeek.weekId, day, mealType)}
              />
            ))}
          </div>

          {/* Shopping list and cart */}
          {!readOnly && (
            <div className="space-y-6">
              <ShoppingListSection
                week={displayedWeek}
                onBuildCart={handleBuildWoolworthsCart}
                buildingCart={buildingCart}
                cartResult={cartResult}
              />
            </div>
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

function DayCard({
  week,
  day,
  readOnly,
  onMealClick,
  onRemove,
}: {
  week: WeeklyMealPlan;
  day: string;
  readOnly: boolean;
  onMealClick: (mealType: string, recipeName: string) => void;
  onRemove: (mealType: string) => void;
}) {
  const dayMeals = week.jades.meals[day] || {};
  const dayMacros = calculateDayMacros(week.weekId, day);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      <h3 className="text-lg font-bold text-jade-purple">{day}</h3>

      {/* Macros */}
      <MacrosDisplay actual={dayMacros} target={JADE_TARGETS} showRemaining={true} />

      {/* Meals */}
      <div className="space-y-2">
        {mealTypes.map(mealType => {
          const recipeKey = mealType.toLowerCase() as keyof typeof dayMeals;
          const recipeName = dayMeals[recipeKey];
          const dayOverride = week.jades.dayOverrides[day]?.[mealType.toLowerCase()];

          return (
            <MealSlot
              key={mealType}
              mealType={mealType}
              recipeName={recipeName || null}
              hasOverride={!!dayOverride}
              readOnly={readOnly}
              onMealClick={() => recipeName && onMealClick(mealType, recipeName)}
              onRemove={() => onRemove(mealType)}
            />
          );
        })}
      </div>
    </div>
  );
}

function MealSlot({
  mealType,
  recipeName,
  hasOverride,
  readOnly,
  onMealClick,
  onRemove,
}: {
  mealType: string;
  recipeName: string | null;
  hasOverride: boolean;
  readOnly: boolean;
  onMealClick: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-semibold text-gray-700 w-20">{mealType}</label>
      {!recipeName ? (
        <div className="flex-1 text-gray-400 italic text-sm py-2 px-3">Empty</div>
      ) : (
        <>
          <div
            onClick={onMealClick}
            className="flex-1 px-3 py-2 bg-jade-light/30 rounded hover:bg-jade-light/50 cursor-pointer transition"
          >
            <span className="font-medium text-gray-800">{recipeName}</span>
            {hasOverride && <span className="text-xs text-amber-600 ml-2">(modified)</span>}
          </div>
          {!readOnly && (
            <button
              onClick={onRemove}
              className="text-red-500 hover:text-red-700 transition p-1"
            >
              <X size={18} />
            </button>
          )}
        </>
      )}
    </div>
  );
}

function ShoppingListSection({
  week,
  onBuildCart,
  buildingCart,
  cartResult,
}: {
  week: WeeklyMealPlan;
  onBuildCart: () => void;
  buildingCart: boolean;
  cartResult: { success: boolean; message: string; items?: any[]; total?: number } | null;
}) {
  const [manualItems, setManualItems] = useState<ShoppingItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('');

  // Load manual items from week's shopping list
  useEffect(() => {
    const allItems = week.shoppingList || [];
    setManualItems(allItems);
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
      </div>

      {/* Add item form */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-jade-purple mb-3">Add Item to Shopping List</h3>
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
            className="bg-jade-purple text-white px-4 py-2 rounded hover:bg-jade-purple/90 transition"
          >
            <Plus size={16} className="inline mr-1" /> Add
          </button>
        </div>
      </div>

      {/* Shopping list items */}
      {manualItems.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-600">No items yet. Add items above or meals will auto-populate from your meal plan.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <h4 className="font-semibold text-jade-purple">Items ({manualItems.length})</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {manualItems.map(item => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-800">{item.ingredient}</span>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
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
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Build cart button */}
      <button
        onClick={onBuildCart}
        disabled={buildingCart || manualItems.length === 0}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
      >
        <ShoppingCart size={20} />
        {buildingCart ? 'Building cart...' : 'Build Woolworths Cart & Lock Week'}
      </button>

      {/* Cart result */}
      {cartResult && (
        <div
          className={`border-l-4 rounded p-4 ${
            cartResult.success
              ? 'bg-green-50 border-green-400 text-green-800'
              : 'bg-red-50 border-red-400 text-red-800'
          }`}
        >
          <p className="font-semibold">{cartResult.message}</p>
          {cartResult.items && cartResult.items.length > 0 && (
            <p className="text-sm mt-2">
              Items: {cartResult.items.map(i => i.name).join(', ')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

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
            <p className="text-xs text-gray-600 mt-1">
              🔒 Locked {formatDate(week.lockedAt)}
            </p>
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
              <DayCard
                key={day}
                week={selectedWeek}
                day={day}
                readOnly={true}
                onMealClick={() => {}}
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
