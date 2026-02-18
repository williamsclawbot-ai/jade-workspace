'use client';

import { useState, useEffect } from 'react';
import { UtensilsCrossed, Plus, Trash2, Search, ShoppingCart, X, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { woolworthsMappings, getWoolworthsMapping, getUnmappedItems, isItemFlagged } from '../lib/woolworthsMapping';
import NotesButton from './NotesButton';

interface MealDatabaseEntry {
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
  ingredients: Array<{ name: string; qty: string; unit: string }>;
}

interface ShoppingItem {
  id: number;
  name: string;
  qty: string;
  unit: string;
  woolworthsUrl?: string;
  woolworthsProductName?: string;
  hasMapping?: boolean;
  isFlagged?: boolean;
}

interface Staple {
  id: number;
  name: string;
  brand: string;
  checked: boolean;
}

interface MealsState {
  jades: Record<string, string>;
  harveys: Record<string, string>;
  harveysAssignedMeals: Record<string, Record<string, string[]>>;
  shopping: ShoppingItem[];
  staples: Staple[];
}

interface AssignmentModalState {
  isOpen: boolean;
  selectedItem: string | null;
  selectedDay: string | null;
  selectedMeal: string | null;
}

const JADE_TARGETS = {
  calories: 1550,
  protein: 120,
  fats: 45,
  carbs: 166,
};

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const jadesMealTypes = ['Breakfast', 'Lunch', 'Snack', 'Dinner', 'Dessert'];
const harveysMealTypes = ['Breakfast', 'Lunch', 'Snack', 'Dinner'];

// Initialize empty assigned meals structure
const initializeAssignedMeals = () => {
  const structure: Record<string, Record<string, string[]>> = {};
  days.forEach((day) => {
    structure[day] = {
      breakfast: [],
      lunch: [],
      snack: [],
      dinner: [],
    };
  });
  return structure;
};

const mealDatabase: Record<string, MealDatabaseEntry> = {
  'Double Cheeseburger': {
    calories: 507,
    protein: 49,
    fats: 22,
    carbs: 29,
    ingredients: [
      { name: 'Extra Lean Beef Mince (5 Star)', qty: '180', unit: 'g' },
      { name: '50% Less Fat Cheese Slice - Bega', qty: '1', unit: 'slice' },
      { name: 'Brioche Bun - Bakery Du Jour', qty: '1', unit: 'bun' },
      { name: 'Lettuce', qty: '10', unit: 'g' },
      { name: 'Onion', qty: '15', unit: 'g' },
      { name: 'Special Burger Pickles - Coles', qty: '5', unit: 'g' },
      { name: 'Special Burger Sauce - Coles Brand', qty: '10', unit: 'ml' },
      { name: 'Tomato', qty: '15', unit: 'g' },
    ],
  },
};

export default function MealPlanning() {
  const [activeTab, setActiveTab] = useState<'jades-meals' | 'harveys-meals' | 'shopping' | 'woolworths' | 'harveys-options'>('jades-meals');
  const [meals, setMeals] = useState<MealsState>({
    jades: { 'Friday-Dinner': 'Double Cheeseburger' },
    harveys: {},
    harveysAssignedMeals: initializeAssignedMeals(),
    shopping: [
      { id: 1, name: 'Extra Lean Beef Mince (5 Star)', qty: '180', unit: 'g' },
      { id: 2, name: '50% Less Fat Cheese Slice - Bega', qty: '1', unit: 'slice' },
      { id: 3, name: 'Brioche Bun - Bakery Du Jour', qty: '1', unit: 'bun' },
      { id: 4, name: 'Lettuce', qty: '10', unit: 'g' },
      { id: 5, name: 'Onion', qty: '15', unit: 'g' },
      { id: 6, name: 'Special Burger Pickles - Coles', qty: '5', unit: 'g' },
      { id: 7, name: 'Special Burger Sauce - Coles Brand', qty: '10', unit: 'ml' },
      { id: 8, name: 'Tomato', qty: '15', unit: 'g' },
    ],
    staples: [],
  });

  const [assignmentModal, setAssignmentModal] = useState<AssignmentModalState>({
    isOpen: false,
    selectedItem: null,
    selectedDay: null,
    selectedMeal: null,
  });

  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('');
  const [newStapleName, setNewStapleName] = useState('');
  const [newStapleBrand, setNewStapleBrand] = useState('');

  // All Harvey's meal options (organized by category)
  const harveysMealOptions: Record<string, string[]> = {
    '🥣 Carb/Protein': [
      'ABC Muffins',
      'Banana Muffins',
      'Muesli Bar',
      'Carmans Oat Bar',
      'Rice Bubble Bars (homemade)',
      'Ham & Cheese Scroll',
      'Pizza Scroll',
      'Cheese & Vegemite (+backup)',
      'Ham & Cheese Sandwich',
      'Nut Butter & Honey (+backup)',
      'Pasta & Boiled Egg (+backup)',
      'Avo & Cream Cheese (+backup)',
      'Sweet Potato & Chicken',
      'Choc Chip Muffins',
      'Weekly New Muffin',
      'Weekly New Bar',
    ],
    '🍎 Fruit': [
      'Apple (introduce)',
      'Pear',
      'Oranges',
      'Banana',
      'Grapes',
      'Strawberries',
      'Raspberries',
      'Blueberries',
      'Kiwi Fruit',
      'Plum',
      'Nectarine',
    ],
    '🥦 Vegetable': [
      'Mixed Frozen Veg ⭐ LOVES',
      'Cucumber (keep trying)',
      'Tomato (keep trying)',
      'Capsicum',
      'Broccoli (new)',
      'Green Beans (new)',
      'Roasted Sweet Potato (new)',
    ],
    '🍪 Crunch': [
      'Star Crackers',
      'Rice Cakes',
      'Pikelets/Pancakes',
      'Veggie Chips',
      'Soft Pretzels',
      'Cheese Crackers',
      'Breadsticks/Grissini',
    ],
    '🥤 Afternoon Snacks': [
      'Smoothie (banana, berries, yogurt, milk)',
      'Yogurt + Fruit',
      'Crackers + Cheese',
      'Toast + Nut Butter',
      'Fruit Salad',
      'Rice Cakes + Honey',
    ],
    '✅ Everyday': ['Yogurt (every lunch)'],
  };

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('jadesMealData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure harveysAssignedMeals structure exists
        if (!parsed.harveysAssignedMeals) {
          parsed.harveysAssignedMeals = initializeAssignedMeals();
        }
        setMeals(parsed);
      } catch (e) {
        console.log('No saved data');
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('jadesMealData', JSON.stringify(meals));
  }, [meals]);

  const calculateDayMacros = (day: string) => {
    let totals = { calories: 0, protein: 0, fats: 0, carbs: 0 };
    jadesMealTypes.forEach((mealType) => {
      const key = `${day}-${mealType}`;
      const mealName = meals.jades[key];
      if (mealName && mealDatabase[mealName]) {
        const meal = mealDatabase[mealName];
        totals.calories += meal.calories;
        totals.protein += meal.protein;
        totals.fats += meal.fats;
        totals.carbs += meal.carbs;
      }
    });
    return totals;
  };

  const updateMeal = (key: string, type: 'jades' | 'harveys', value: string) => {
    setMeals((prev) => ({
      ...prev,
      [type]: { ...prev[type], [key]: value },
    }));
  };

  const clearJadesMeals = () => {
    if (confirm("Clear all of Jade's meals? This cannot be undone.")) {
      setMeals((prev) => ({ ...prev, jades: {} }));
    }
  };

  const clearHarveysMeals = () => {
    if (confirm("Clear all of Harvey's meals? This cannot be undone.")) {
      setMeals((prev) => ({ ...prev, harveys: {} }));
    }
  };

  const addShoppingItem = () => {
    if (!newItemName.trim()) {
      alert('Please enter an item name');
      return;
    }
    const item: ShoppingItem = {
      id: Date.now(),
      name: newItemName,
      qty: newItemQty || '1',
      unit: newItemUnit || 'unit',
    };
    setMeals((prev) => ({ ...prev, shopping: [...prev.shopping, item] }));
    setNewItemName('');
    setNewItemQty('');
    setNewItemUnit('');
  };

  const removeShoppingItem = (id: number) => {
    setMeals((prev) => ({
      ...prev,
      shopping: prev.shopping.filter((item) => item.id !== id),
    }));
  };

  const addStaple = () => {
    if (!newStapleName.trim()) {
      alert('Please enter an item name');
      return;
    }
    const staple: Staple = {
      id: Date.now(),
      name: newStapleName,
      brand: newStapleBrand || 'Any brand',
      checked: false,
    };
    setMeals((prev) => ({ ...prev, staples: [...prev.staples, staple] }));
    setNewStapleName('');
    setNewStapleBrand('');
  };

  const toggleStaple = (id: number) => {
    setMeals((prev) => ({
      ...prev,
      staples: prev.staples.map((s) => (s.id === id ? { ...s, checked: !s.checked } : s)),
    }));
  };

  const removeStaple = (id: number) => {
    setMeals((prev) => ({
      ...prev,
      staples: prev.staples.filter((s) => s.id !== id),
    }));
  };

  const clearShoppingList = () => {
    if (confirm('Clear entire shopping list?')) {
      setMeals((prev) => ({ ...prev, shopping: [] }));
    }
  };

  // Modal functions
  const openAssignmentModal = (item: string) => {
    setAssignmentModal({
      isOpen: true,
      selectedItem: item,
      selectedDay: days[0],
      selectedMeal: 'breakfast',
    });
  };

  const closeAssignmentModal = () => {
    setAssignmentModal({
      isOpen: false,
      selectedItem: null,
      selectedDay: null,
      selectedMeal: null,
    });
  };

  const addItemToMeal = () => {
    const { selectedItem, selectedDay, selectedMeal } = assignmentModal;
    if (selectedItem && selectedDay && selectedMeal) {
      setMeals((prev) => {
        const updated = { ...prev };
        const mealList = updated.harveysAssignedMeals[selectedDay][selectedMeal as keyof typeof updated.harveysAssignedMeals[string]];
        if (!mealList.includes(selectedItem)) {
          mealList.push(selectedItem);
        }
        return updated;
      });
      closeAssignmentModal();
    }
  };

  const removeItemFromMeal = (day: string, mealSlot: string, item: string) => {
    setMeals((prev) => {
      const updated = { ...prev };
      updated.harveysAssignedMeals[day][mealSlot as keyof typeof updated.harveysAssignedMeals[string]] = 
        updated.harveysAssignedMeals[day][mealSlot as keyof typeof updated.harveysAssignedMeals[string]].filter((i) => i !== item);
      return updated;
    });
  };

  // Auto-generate shopping list from assigned meals
  const generateShoppingListFromAssignments = () => {
    const itemMap: Record<string, { qty: number; category: string }> = {};
    
    Object.values(meals.harveysAssignedMeals).forEach((dayMeals) => {
      Object.values(dayMeals).forEach((items) => {
        items.forEach((item) => {
          if (!itemMap[item]) {
            // Determine category from the options
            let category = 'Other';
            for (const [cat, opts] of Object.entries(harveysMealOptions)) {
              if (opts.includes(item)) {
                category = cat;
                break;
              }
            }
            itemMap[item] = { qty: 1, category };
          } else {
            itemMap[item].qty += 1;
          }
        });
      });
    });

    return Object.entries(itemMap).map(([name, data]) => {
      const mapping = getWoolworthsMapping(name);
      return {
        id: Date.now() + Math.random(),
        name,
        qty: data.qty.toString(),
        unit: 'unit',
        category: data.category,
        woolworthsUrl: mapping?.woolworthsUrl,
        woolworthsProductName: mapping?.woolworthsProductName,
        hasMapping: !!mapping,
        isFlagged: mapping ? isItemFlagged(name) : false,
      };
    });
  };

  // Jade's Meals Tab
  const JadesMealsTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-jade-purple mb-2">Jade's Weekly Meal Plan + Macros</h2>
        <p className="text-gray-600">Plan your meals for the week. See your daily macro balance as you add meals.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {days.map((day) => {
          const dayMacros = calculateDayMacros(day);
          const remaining = {
            calories: Math.max(0, JADE_TARGETS.calories - dayMacros.calories),
            protein: Math.max(0, JADE_TARGETS.protein - dayMacros.protein),
            fats: Math.max(0, JADE_TARGETS.fats - dayMacros.fats),
            carbs: Math.max(0, JADE_TARGETS.carbs - dayMacros.carbs),
          };
          const pctCal = Math.min(100, (dayMacros.calories / JADE_TARGETS.calories) * 100);
          const pctPro = Math.min(100, (dayMacros.protein / JADE_TARGETS.protein) * 100);
          const pctFat = Math.min(100, (dayMacros.fats / JADE_TARGETS.fats) * 100);
          const pctCarb = Math.min(100, (dayMacros.carbs / JADE_TARGETS.carbs) * 100);
          return (
            <div key={day} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="font-semibold text-jade-purple text-lg mb-3 pb-2 border-b-2 border-jade-light">
                {day}
              </div>

              {/* Macro Tracker */}
              <div className="bg-gradient-to-r from-jade-light to-white p-3 rounded-lg mb-3 border border-jade-light">
                {[
                  { label: 'Cal', value: dayMacros.calories, target: JADE_TARGETS.calories, remaining: remaining.calories, suffix: '' },
                  { label: 'Pro', value: dayMacros.protein, target: JADE_TARGETS.protein, remaining: remaining.protein, suffix: 'g' },
                  { label: 'Fat', value: dayMacros.fats, target: JADE_TARGETS.fats, remaining: remaining.fats, suffix: 'g' },
                  { label: 'Carb', value: dayMacros.carbs, target: JADE_TARGETS.carbs, remaining: remaining.carbs, suffix: 'g' },
                ].map((macro) => {
                  const pct = Math.min(100, (macro.value / macro.target) * 100);
                  return (
                    <div key={macro.label} className="grid grid-cols-3 gap-2 mb-2 text-sm">
                      <div className="font-semibold text-jade-purple">{macro.label}</div>
                      <div className="flex items-center">
                        <div className="flex-1 h-1.5 bg-gray-300 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-jade-light to-jade-purple rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className={`text-right font-medium ${macro.remaining < 20 ? 'text-red-600' : 'text-gray-600'}`}>
                        {macro.remaining}{macro.suffix}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Meals */}
              {jadesMealTypes.map((mealType) => {
                const key = `${day}-${mealType}`;
                return (
                  <div key={mealType} className="mb-2">
                    <label className="text-xs font-semibold text-gray-700 block mb-1">{mealType}</label>
                    <input
                      type="text"
                      value={meals.jades[key] || ''}
                      onChange={(e) => updateMeal(key, 'jades', e.target.value)}
                      placeholder="Meal name"
                      className="w-full px-2 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-jade-light focus:ring-1 focus:ring-jade-light"
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="text-center pt-4">
        <button
          onClick={clearJadesMeals}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Clear All Meals
        </button>
      </div>
    </div>
  );

  // Harvey's Meals Tab
  const HarveysMealsTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-jade-purple mb-2">Harvey's Weekly Meal Plan</h2>
        <p className="text-gray-600 mb-4">Assigned items from Options page. Remove items here if needed.</p>
      </div>

      {/* Weekly Grid */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="bg-jade-light text-jade-purple font-bold p-3 text-left border border-gray-300">Day</th>
              {harveysMealTypes.map((meal) => (
                <th key={meal} className="bg-jade-light text-jade-purple font-bold p-3 text-left border border-gray-300">
                  {meal}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr key={day}>
                <td className="bg-jade-light/30 font-semibold text-jade-purple p-3 border border-gray-300 w-24">
                  {day}
                </td>
                {harveysMealTypes.map((meal) => {
                  const mealKey = meal.toLowerCase() as keyof typeof meals.harveysAssignedMeals[string];
                  const items = meals.harveysAssignedMeals[day]?.[mealKey] || [];
                  return (
                    <td key={meal} className="p-3 border border-gray-300 bg-white">
                      {items.length === 0 ? (
                        <div className="text-gray-400 italic text-sm">Empty</div>
                      ) : (
                        <div className="space-y-2">
                          {items.map((item) => (
                            <div
                              key={item}
                              className="bg-jade-light/20 border border-jade-light rounded px-2 py-1 flex items-center justify-between text-sm"
                            >
                              <span className="text-gray-800 font-medium">{item}</span>
                              <button
                                onClick={() => removeItemFromMeal(day, mealKey, item)}
                                className="text-red-500 hover:text-red-700 transition ml-2"
                              >
                                <X size={16} />
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

      <div className="bg-green-50 border-l-4 border-green-400 rounded-lg p-4">
        <p className="text-green-800 font-semibold">✅ Workflow Connected!</p>
        <p className="text-green-700 text-sm mt-1">
          Items assigned from Options tab appear here automatically. They also auto-populate your Shopping List below.
        </p>
      </div>

      <div className="text-center pt-4">
        <button
          onClick={clearHarveysMeals}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Clear All Meals
        </button>
      </div>
    </div>
  );

  // Shopping List Tab
  const ShoppingListTab = () => {
    const autoGeneratedItems = generateShoppingListFromAssignments();
    const combinedList = [...autoGeneratedItems, ...meals.shopping];

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-jade-purple mb-2">Shopping List</h2>
          <p className="text-gray-600 mb-4">Auto-generated from your assigned meals with Woolworths links, plus manually added items.</p>
        </div>

        {/* Add Item Form */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="text-lg font-semibold text-jade-purple mb-3">Add Additional Item</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Item name (e.g., Chicken breast)"
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-jade-light"
            />
            <input
              type="number"
              value={newItemQty}
              onChange={(e) => setNewItemQty(e.target.value)}
              placeholder="Qty"
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-jade-light"
            />
            <input
              type="text"
              value={newItemUnit}
              onChange={(e) => setNewItemUnit(e.target.value)}
              placeholder="Unit (e.g., kg)"
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-jade-light"
            />
            <button
              onClick={addShoppingItem}
              className="bg-jade-purple text-white px-4 py-2 rounded hover:bg-jade-purple/80 transition flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Add
            </button>
          </div>
        </div>

        {/* Shopping List */}
        {combinedList.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600">No items yet. Assign meals in the Options tab to auto-populate.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Auto-generated items */}
            {autoGeneratedItems.length > 0 && (
              <div>
                <h4 className="font-semibold text-jade-purple mb-2 text-sm flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" /> FROM ASSIGNED MEALS (Auto-Generated)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {autoGeneratedItems.map((item) => (
                    <div key={item.id} className={`border rounded-lg p-3 ${
                      item.isFlagged ? 'bg-amber-50 border-amber-200' : item.hasMapping ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="font-semibold text-gray-800">{item.name}</div>
                      <div className="flex justify-between items-center mt-1 mb-2">
                        <div className="text-sm text-gray-600">
                          {item.qty} {item.unit}
                        </div>
                        <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {item.category}
                        </div>
                      </div>
                      {item.hasMapping && (
                        <div className="text-xs text-gray-700 mb-2 flex items-center gap-1">
                          {item.isFlagged ? (
                            <>
                              <AlertCircle size={12} /> Multiple options on Woolworths
                            </>
                          ) : (
                            <>
                              <CheckCircle size={12} /> {item.woolworthsProductName}
                            </>
                          )}
                        </div>
                      )}
                      {item.woolworthsUrl && (
                        <a
                          href={item.woolworthsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded transition ${
                            item.isFlagged 
                              ? 'bg-amber-600 text-white hover:bg-amber-700' 
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          <ExternalLink size={12} /> Woolworths
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Manually added items */}
            {meals.shopping.length > 0 && (
              <div>
                <h4 className="font-semibold text-jade-purple mb-2 text-sm">ADDITIONAL ITEMS (Manually Added)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {meals.shopping.map((item) => (
                    <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-3 flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-gray-800">{item.name}</div>
                        <div className="text-sm text-gray-600">
                          {item.qty} {item.unit}
                        </div>
                      </div>
                      <button
                        onClick={() => removeShoppingItem(item.id)}
                        className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="bg-green-50 border-l-4 border-green-400 rounded-lg p-4">
          <p className="text-green-800 font-semibold">🔗 Connected to Meal Plan + Woolworths!</p>
          <p className="text-green-700 text-sm mt-1">
            This list auto-updates whenever you assign items to meals. Click "Woolworths" to open product pages directly. Check the Woolworths tab for detailed product links and status.
          </p>
        </div>

        {combinedList.length > 0 && (
          <div className="text-center pt-4">
            <button
              onClick={clearShoppingList}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Clear Shopping List
            </button>
          </div>
        )}
      </div>
    );
  };

  // Woolworths Tab
  const WoolworthsTab = () => {
    const autoGeneratedItems = generateShoppingListFromAssignments();
    const verifiedItems = autoGeneratedItems.filter((item) => item.hasMapping && !item.isFlagged);
    const flaggedItems = autoGeneratedItems.filter((item) => item.isFlagged);
    const unmappedItems = autoGeneratedItems.filter((item) => !item.hasMapping);

    return (
      <div className="space-y-6">
        {/* FROM MEAL PLAN Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle size={24} className="text-green-600" />
            <h2 className="text-2xl font-bold text-jade-purple">🛒 FROM MEAL PLAN (Auto-Linked)</h2>
          </div>
          <p className="text-gray-600 mb-4">Items from Harvey's meals with verified Woolworths product links. Click "Add to Cart" to open directly on Woolworths.</p>

          {verifiedItems.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-600">No verified items yet. Assign meals to populate this list.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {verifiedItems.map((item) => (
                <div key={item.id} className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-gray-800">{item.name}</div>
                      <div className="text-sm text-gray-600">
                        Qty: {item.qty} {item.unit}
                      </div>
                      {item.woolworthsProductName && (
                        <div className="text-xs text-green-700 mt-1 font-medium">
                          ✓ {item.woolworthsProductName}
                        </div>
                      )}
                    </div>
                    <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
                  </div>
                  <a
                    href={item.woolworthsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-green-700 transition inline-flex items-center gap-2 w-full justify-center"
                  >
                    <ShoppingCart size={16} /> Add to Cart
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FLAGGED ITEMS Section */}
        {flaggedItems.length > 0 && (
          <div className="border-t-2 border-yellow-200 pt-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle size={24} className="text-amber-600" />
              <h3 className="text-2xl font-bold text-jade-purple">⚠️ NEEDS VERIFICATION (Multiple Options)</h3>
            </div>
            <p className="text-gray-600 mb-4">These items have multiple options on Woolworths. Please choose the right product and I'll save your preference.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {flaggedItems.map((item) => (
                <div key={item.id} className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-gray-800">{item.name}</div>
                      <div className="text-sm text-gray-600">
                        Qty: {item.qty} {item.unit}
                      </div>
                      <div className="text-xs text-amber-700 mt-1 font-medium">
                        Multiple options available - search and choose
                      </div>
                    </div>
                    <AlertCircle size={20} className="text-amber-600 flex-shrink-0" />
                  </div>
                  <a
                    href={item.woolworthsUrl || `https://www.woolworths.com.au/shop/search/products?searchTerm=${encodeURIComponent(item.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-amber-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-amber-700 transition inline-flex items-center gap-2 w-full justify-center"
                  >
                    <Search size={16} /> Search & Choose
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* UNMAPPED ITEMS Section */}
        {unmappedItems.length > 0 && (
          <div className="border-t-2 border-red-200 pt-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle size={24} className="text-red-600" />
              <h3 className="text-2xl font-bold text-jade-purple">❓ NOT IN DATABASE</h3>
            </div>
            <p className="text-gray-600 mb-4">These items aren't in our Woolworths mapping yet. Search for them and let me know the product link!</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {unmappedItems.map((item) => (
                <div key={item.id} className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-gray-800">{item.name}</div>
                      <div className="text-sm text-gray-600">
                        Qty: {item.qty} {item.unit}
                      </div>
                      <div className="text-xs text-red-700 mt-1 font-medium">
                        Help us add this to our database!
                      </div>
                    </div>
                  </div>
                  <a
                    href={`https://www.woolworths.com.au/shop/search/products?searchTerm=${encodeURIComponent(item.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-red-700 transition inline-flex items-center gap-2 w-full justify-center mb-2"
                  >
                    <Search size={16} /> Find on Woolworths
                  </a>
                  <p className="text-xs text-red-700 text-center">
                    📧 Once you find it, send me the link and product name
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Staples Section */}
        <div className="border-t-2 border-gray-200 pt-6">
          <h3 className="text-2xl font-bold text-jade-purple mb-2">🛞 Household Staples (Always There)</h3>
          <p className="text-gray-600 mb-4">Your recurring household items with preferred brands. Check off as you shop.</p>

          {/* Add Staple Form */}
          <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
            <h4 className="text-lg font-semibold text-jade-purple mb-3">Add New Staple</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <input
                type="text"
                value={newStapleName}
                onChange={(e) => setNewStapleName(e.target.value)}
                placeholder="Item (e.g., Toilet Paper)"
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-jade-light"
              />
              <input
                type="text"
                value={newStapleBrand}
                onChange={(e) => setNewStapleBrand(e.target.value)}
                placeholder="Brand (e.g., Kleenex)"
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-jade-light"
              />
              <button
                onClick={addStaple}
                className="bg-jade-purple text-white px-4 py-2 rounded hover:bg-jade-purple/80 transition"
              >
                Add Staple
              </button>
            </div>
          </div>

          {/* Staples List */}
          {meals.staples.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-600">No staples yet. Add your go-to household items above.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {meals.staples.map((staple) => {
                const searchUrl = `https://www.woolworths.com.au/shop/search/products?searchTerm=${encodeURIComponent(staple.name + ' ' + staple.brand)}`;
                return (
                  <div
                    key={staple.id}
                    className={`p-3 rounded-lg border flex items-center gap-3 ${
                      staple.checked ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={staple.checked}
                      onChange={() => toggleStaple(staple.id)}
                      className="w-5 h-5 rounded accent-jade-purple cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className={`font-semibold ${staple.checked ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {staple.name}
                      </div>
                      <div className="text-sm text-gray-600">{staple.brand}</div>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={searchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-jade-light text-jade-purple px-3 py-1 rounded text-sm font-semibold hover:bg-jade-light/80 transition inline-flex items-center gap-1"
                      >
                        <Search size={14} /> Search
                      </a>
                      <button
                        onClick={() => removeStaple(staple.id)}
                        className="bg-red-100 text-red-600 px-3 py-1 rounded text-sm font-semibold hover:bg-red-200 transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border-l-4 border-jade-light rounded-lg p-4">
          <h3 className="font-semibold text-jade-purple mb-2">✨ Woolworths Integration</h3>
          <ol className="list-decimal list-inside text-gray-700 space-y-1 text-sm">
            <li><strong>From Meal Plan:</strong> Items with ✓ have direct Woolworths links - click "Add to Cart"</li>
            <li><strong>Needs Verification:</strong> Items with ⚠️ - search Woolworths and choose the right product</li>
            <li><strong>Not in Database:</strong> Items with ❓ - help us add them by finding the product link</li>
            <li><strong>Staples:</strong> Check off recurring household items as you shop</li>
          </ol>
        </div>
      </div>
    );
  };

  // Harvey's Options Tab
  const HarveysOptionsTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-jade-purple mb-2">Harvey's Meal Options</h2>
        <p className="text-gray-600 mb-4">Click any item to assign it to a day and meal slot. It will automatically appear in Harvey's Meals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(harveysMealOptions).map(([category, items]) => (
          <div key={category} className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-jade-purple mb-3">{category}</h3>
            <div className="space-y-2">
              {items.map((item) => (
                <button
                  key={item}
                  onClick={() => openAssignmentModal(item)}
                  className="w-full text-left px-3 py-2 rounded hover:bg-jade-light/30 transition border border-transparent hover:border-jade-light font-medium text-gray-700 hover:text-jade-purple"
                >
                  + {item}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border-l-4 border-jade-light rounded-lg p-4">
        <p className="font-semibold text-jade-purple mb-2">✨ How to Use This:</p>
        <p className="text-gray-700 text-sm">
          Click any item to assign it to a specific day and meal (Breakfast, Lunch, Snack, Dinner). Once assigned, it will appear in your weekly meal plan and automatically add to the shopping list.
        </p>
      </div>

      {/* Assignment Modal */}
      {assignmentModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-jade-purple">Assign to Meal Plan</h3>
              <button
                onClick={closeAssignmentModal}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Item</label>
                <div className="bg-jade-light/20 px-3 py-2 rounded border border-jade-light text-gray-800 font-medium">
                  {assignmentModal.selectedItem}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Day</label>
                <select
                  value={assignmentModal.selectedDay || ''}
                  onChange={(e) =>
                    setAssignmentModal((prev) => ({
                      ...prev,
                      selectedDay: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-jade-light focus:ring-1 focus:ring-jade-light"
                >
                  {days.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Meal Slot</label>
                <select
                  value={assignmentModal.selectedMeal || ''}
                  onChange={(e) =>
                    setAssignmentModal((prev) => ({
                      ...prev,
                      selectedMeal: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-jade-light focus:ring-1 focus:ring-jade-light"
                >
                  {harveysMealTypes.map((meal) => (
                    <option key={meal} value={meal.toLowerCase()}>
                      {meal}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={closeAssignmentModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition font-medium text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={addItemToMeal}
                  className="flex-1 px-4 py-2 bg-jade-purple text-white rounded hover:bg-jade-purple/80 transition font-medium"
                >
                  Add to Meal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <UtensilsCrossed size={32} className="text-jade-purple" />
            <div>
              <h2 className="text-2xl font-bold text-jade-purple">Meal Planning</h2>
              <p className="text-sm text-gray-600">Track meals, macros, and shopping</p>
            </div>
          </div>
          <NotesButton section="Meals" />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 px-6 py-3 flex flex-wrap gap-2 bg-gray-50">
        {[
          { id: 'jades-meals' as const, label: '👩 Jade\'s Meals' },
          { id: 'harveys-meals' as const, label: '👶 Harvey\'s Meals' },
          { id: 'shopping' as const, label: '🛒 Shopping List' },
          { id: 'woolworths' as const, label: '🛞 Woolworths' },
          { id: 'harveys-options' as const, label: '👶 Options' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === tab.id
                ? 'bg-jade-purple text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {activeTab === 'jades-meals' && <JadesMealsTab />}
        {activeTab === 'harveys-meals' && <HarveysMealsTab />}
        {activeTab === 'shopping' && <ShoppingListTab />}
        {activeTab === 'woolworths' && <WoolworthsTab />}
        {activeTab === 'harveys-options' && <HarveysOptionsTab />}
      </div>
    </div>
  );
}
