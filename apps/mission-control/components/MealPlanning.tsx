'use client';

import { useState, useEffect } from 'react';
import { UtensilsCrossed, Plus, Trash2, Search, ShoppingCart } from 'lucide-react';

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
  shopping: ShoppingItem[];
  staples: Staple[];
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

  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('');
  const [newStapleName, setNewStapleName] = useState('');
  const [newStapleBrand, setNewStapleBrand] = useState('');

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('jadesMealData');
    if (saved) {
      try {
        setMeals(JSON.parse(saved));
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
        <p className="text-gray-600">Plan Harvey's meals for the week.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {days.map((day) => (
          <div key={day} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="font-semibold text-jade-purple text-lg mb-3 pb-2 border-b-2 border-jade-light">
              {day}
            </div>
            {harveysMealTypes.map((mealType) => {
              const key = `${day}-${mealType}`;
              return (
                <div key={mealType} className="mb-2">
                  <label className="text-xs font-semibold text-gray-700 block mb-1">{mealType}</label>
                  <input
                    type="text"
                    value={meals.harveys[key] || ''}
                    onChange={(e) => updateMeal(key, 'harveys', e.target.value)}
                    placeholder="Meal name"
                    className="w-full px-2 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-jade-light focus:ring-1 focus:ring-jade-light"
                  />
                </div>
              );
            })}
          </div>
        ))}
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
  const ShoppingListTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-jade-purple mb-2">Shopping List</h2>
        <p className="text-gray-600 mb-4">Items extracted from your meal plans. Add more manually as needed.</p>

        {/* Add Item Form */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-jade-purple mb-3">Add Item Manually</h3>
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
        {meals.shopping.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600">No items yet. Add meals or items manually above.</p>
          </div>
        ) : (
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
        )}

        <div className="text-center mt-6">
          <button
            onClick={clearShoppingList}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Clear Shopping List
          </button>
        </div>
      </div>
    </div>
  );

  // Woolworths Tab
  const WoolworthsTab = () => (
    <div className="space-y-6">
      {/* Staples Section */}
      <div>
        <h2 className="text-2xl font-bold text-jade-purple mb-2">🛞 Household Staples (Always There)</h2>
        <p className="text-gray-600 mb-4">Your recurring household items with preferred brands. Check off as you shop.</p>

        {/* Add Staple Form */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
          <h3 className="text-lg font-semibold text-jade-purple mb-3">Add New Staple</h3>
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
                      className="bg-jade-light text-jade-purple px-3 py-1 rounded text-sm font-semibold hover:bg-jade-light/80 transition"
                    >
                      Search
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

      {/* Meal Items Section */}
      <div>
        <h2 className="text-2xl font-bold text-jade-purple mb-2">🛒 This Week's Meal Items</h2>
        <p className="text-gray-600 mb-4">Ingredients from your meals. Clear after checkout.</p>

        {meals.shopping.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600">No items in shopping list yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {meals.shopping.map((item) => {
              const searchUrl = `https://www.woolworths.com.au/shop/search/products?searchTerm=${encodeURIComponent(item.name)}`;
              return (
                <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-3 flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-gray-800">{item.name}</div>
                    <div className="text-sm text-gray-600">
                      {item.qty} {item.unit}
                    </div>
                  </div>
                  <a
                    href={searchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-jade-light text-jade-purple px-3 py-1 rounded text-sm font-semibold hover:bg-jade-light/80 transition flex items-center gap-1"
                  >
                    <Search size={14} /> Search
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-yellow-50 border-l-4 border-jade-light rounded-lg p-4">
        <h3 className="font-semibold text-jade-purple mb-2">How This Works</h3>
        <ol className="list-decimal list-inside text-gray-700 space-y-1 text-sm">
          <li><strong>Staples:</strong> Check off items you pick up each week. They stay forever.</li>
          <li><strong>Weekly Items:</strong> Search and add meal ingredients to your cart.</li>
          <li>Click "Search Woolworths" to open each item on Woolworths.com.au</li>
          <li>Click the product → Add to cart</li>
          <li>Once done, come back and clear the weekly list (staples stay!)</li>
        </ol>
      </div>
    </div>
  );

  // Harvey's Options Tab
  const HarveysOptionsTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-jade-purple mb-2">Harvey's Meal Options</h2>
        <p className="text-gray-600 mb-4">All meal options organized by category. Check what works, note what needs changes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            category: '🥣 Carb/Protein Options',
            items: [
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
              '✨ Weekly New Muffin',
              '✨ Weekly New Bar',
            ],
          },
          {
            category: '🍎 Fruit Options',
            items: [
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
          },
          {
            category: '🥦 Vegetable Options',
            items: [
              '⭐ Mixed Frozen Veg ⭐ LOVES',
              'Cucumber (keep trying)',
              'Tomato (keep trying)',
              'Capsicum',
              'Broccoli (new)',
              'Green Beans (new)',
              'Roasted Sweet Potato (new)',
            ],
          },
          {
            category: '🍪 Crunch Options',
            items: [
              'Star Crackers',
              'Rice Cakes',
              'Pikelets/Pancakes',
              'Veggie Chips',
              'Soft Pretzels',
              'Cheese Crackers',
              'Breadsticks/Grissini',
            ],
          },
          {
            category: '🥤 Afternoon Snacks (2:30pm)',
            items: [
              'Smoothie (banana, berries, yogurt, milk)',
              'Yogurt + Fruit',
              'Crackers + Cheese',
              'Toast + Nut Butter',
              'Fruit Salad',
              'Rice Cakes + Honey',
            ],
          },
          {
            category: '✅ Everyday Item',
            items: ['🥄 Yogurt (every lunch)'],
          },
        ].map((section) => (
          <div key={section.category} className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-jade-purple mb-3">{section.category}</h3>
            <div className="space-y-2">
              {section.items.map((item) => (
                <label key={item} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input type="checkbox" className="w-4 h-4 accent-jade-purple" />
                  <span className="text-sm text-gray-700">{item}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-yellow-50 border-l-4 border-jade-light rounded-lg p-4">
        <p className="font-semibold text-jade-purple mb-2">📝 How to Use This:</p>
        <p className="text-gray-700 text-sm">
          Check the boxes for options you're using. Items marked (+backup) = pair with a backup option until Harvey is ready to eat it solo. Once you've checked what works, I'll build the weekly lunch rotation.
        </p>
      </div>
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
