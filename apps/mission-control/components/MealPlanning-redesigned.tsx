'use client';

import { useState, useEffect } from 'react';
import { UtensilsCrossed, Plus, Trash2, X, ShoppingCart } from 'lucide-react';

interface Staple {
  id: string;
  category: 'protein' | 'carb' | 'fruit' | 'vegetable' | 'dairy' | 'snacks' | 'other';
  name: string;
  active: boolean;
}

interface MealItem {
  stapleId: string;
  quantity: string;
}

interface WeeklyMeal {
  day: string;
  mealSlot: string;
  items: MealItem[];
}

interface ShoppingListItem {
  stapleId: string;
  name: string;
  quantity: string;
  category: string;
  checked: boolean;
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const mealSlots = ['Breakfast', '10:30am Meal', '2:30pm Meal', 'Dinner'];
const categories = [
  { id: 'protein', label: 'Proteins', color: 'bg-red-50 border-red-200' },
  { id: 'carb', label: 'Carbs', color: 'bg-yellow-50 border-yellow-200' },
  { id: 'fruit', label: 'Fruits', color: 'bg-pink-50 border-pink-200' },
  { id: 'vegetable', label: 'Vegetables', color: 'bg-green-50 border-green-200' },
  { id: 'dairy', label: 'Dairy', color: 'bg-blue-50 border-blue-200' },
  { id: 'snacks', label: 'Snacks', color: 'bg-orange-50 border-orange-200' },
  { id: 'other', label: 'Other', color: 'bg-purple-50 border-purple-200' },
];

export default function MealPlanning() {
  const [activeTab, setActiveTab] = useState<'staples' | 'weekly' | 'shopping'>('staples');
  const [staples, setStaples] = useState<Staple[]>([]);
  const [weeklyMeals, setWeeklyMeals] = useState<WeeklyMeal[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [newStapleName, setNewStapleName] = useState('');
  const [newStapleCategory, setNewStapleCategory] = useState<Staple['category']>('protein');
  const [selectedMealSlot, setSelectedMealSlot] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('harveyMealPlanningData');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setStaples(data.staples || []);
        setWeeklyMeals(data.weeklyMeals || []);
        setShoppingList(data.shoppingList || []);
      } catch (e) {
        console.log('No saved data');
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(
      'harveyMealPlanningData',
      JSON.stringify({
        staples,
        weeklyMeals,
        shoppingList,
      })
    );
  }, [staples, weeklyMeals, shoppingList]);

  // Add new staple
  const handleAddStaple = () => {
    if (!newStapleName.trim()) {
      alert('Please enter a staple name');
      return;
    }

    const newStaple: Staple = {
      id: Date.now().toString(),
      name: newStapleName,
      category: newStapleCategory,
      active: true,
    };

    setStaples([...staples, newStaple]);
    setNewStapleName('');
  };

  // Toggle staple active status
  const toggleStapleActive = (id: string) => {
    setStaples(
      staples.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  // Remove staple
  const removeStaple = (id: string) => {
    setStaples(staples.filter((s) => s.id !== id));
    setWeeklyMeals(
      weeklyMeals.map((m) => ({
        ...m,
        items: m.items.filter((i) => i.stapleId !== id),
      }))
    );
  };

  // Add item to meal
  const addItemToMeal = (day: string, mealSlot: string, stapleId: string, quantity: string = '1 serving') => {
    const key = `${day}-${mealSlot}`;
    let mealExists = weeklyMeals.find((m) => m.day === day && m.mealSlot === mealSlot);

    if (mealExists) {
      if (!mealExists.items.find((i) => i.stapleId === stapleId)) {
        mealExists.items.push({ stapleId, quantity });
        setWeeklyMeals([...weeklyMeals]);
      }
    } else {
      const newMeal: WeeklyMeal = {
        day,
        mealSlot,
        items: [{ stapleId, quantity }],
      };
      setWeeklyMeals([...weeklyMeals, newMeal]);
    }
  };

  // Remove item from meal
  const removeItemFromMeal = (day: string, mealSlot: string, stapleId: string) => {
    setWeeklyMeals(
      weeklyMeals
        .map((m) =>
          m.day === day && m.mealSlot === mealSlot
            ? { ...m, items: m.items.filter((i) => i.stapleId !== stapleId) }
            : m
        )
        .filter((m) => m.items.length > 0)
    );
  };

  // Generate shopping list
  const generateShoppingList = () => {
    const newList: ShoppingListItem[] = [];
    const addedIds = new Set<string>();

    weeklyMeals.forEach((meal) => {
      meal.items.forEach((item) => {
        if (!addedIds.has(item.stapleId)) {
          const staple = staples.find((s) => s.id === item.stapleId);
          if (staple) {
            newList.push({
              stapleId: staple.id,
              name: staple.name,
              quantity: item.quantity,
              category: staple.category,
              checked: false,
            });
            addedIds.add(item.stapleId);
          }
        }
      });
    });

    setShoppingList(newList);
  };

  // Toggle shopping item
  const toggleShoppingItem = (index: number) => {
    const newList = [...shoppingList];
    newList[index].checked = !newList[index].checked;
    setShoppingList(newList);
  };

  // Get meal for display
  const getMealItems = (day: string, mealSlot: string) => {
    const meal = weeklyMeals.find((m) => m.day === day && m.mealSlot === mealSlot);
    return meal ? meal.items : [];
  };

  const getStapleName = (stapleId: string) => {
    return staples.find((s) => s.id === stapleId)?.name || 'Unknown';
  };

  const getCategoryColor = (category: string) => {
    return categories.find((c) => c.id === category)?.color || 'bg-gray-50 border-gray-200';
  };

  // Staples Tab
  const StaplesTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-jade-purple mb-2">Harvey's Staples</h2>
        <p className="text-gray-600 mb-4">Items organized by category. Check to mark active/inactive for meal planning.</p>
      </div>

      {/* Add New Staple */}
      <div className="bg-jade-cream rounded-lg p-4 border border-jade-light">
        <h3 className="text-lg font-semibold text-jade-purple mb-3">Add New Staple</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            value={newStapleName}
            onChange={(e) => setNewStapleName(e.target.value)}
            placeholder="Item name (e.g., Chicken Breast)"
            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-jade-light focus:ring-1 focus:ring-jade-light"
          />

          <select
            value={newStapleCategory}
            onChange={(e) => setNewStapleCategory(e.target.value as Staple['category'])}
            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-jade-light focus:ring-1 focus:ring-jade-light"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>

          <button
            onClick={handleAddStaple}
            className="bg-jade-purple text-white px-4 py-2 rounded hover:bg-jade-purple/80 transition flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Add
          </button>
        </div>
      </div>

      {/* Staples by Category */}
      <div className="space-y-4">
        {categories.map((category) => {
          const categoryStaples = staples.filter((s) => s.category === category.id);
          return (
            <div key={category.id}>
              <h3 className="text-lg font-semibold text-jade-purple mb-2">
                {category.label} ({categoryStaples.length})
              </h3>
              {categoryStaples.length === 0 ? (
                <p className="text-gray-500 text-sm py-2">No staples yet</p>
              ) : (
                <div className={`rounded-lg border p-3 space-y-2 ${category.color}`}>
                  {categoryStaples.map((staple) => (
                    <div
                      key={staple.id}
                      className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <input
                          type="checkbox"
                          checked={staple.active}
                          onChange={() => toggleStapleActive(staple.id)}
                          className="w-5 h-5 rounded accent-jade-purple cursor-pointer"
                        />
                        <span
                          className={`font-semibold ${
                            staple.active ? 'text-gray-800' : 'line-through text-gray-500'
                          }`}
                        >
                          {staple.name}
                        </span>
                      </div>
                      <button
                        onClick={() => removeStaple(staple.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  // Weekly Meal Planner Tab
  const WeeklyPlannerTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-jade-purple mb-2">Weekly Meal Planner</h2>
        <p className="text-gray-600 mb-4">Click on a meal slot to add items. Items appear from your active staples.</p>
      </div>

      {/* Weekly Grid */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="bg-jade-purple text-white p-3 text-left font-semibold border">Meal Slot</th>
              {days.map((day) => (
                <th
                  key={day}
                  className="bg-jade-purple text-white p-3 text-center font-semibold border min-w-[200px]"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mealSlots.map((slot) => (
              <tr key={slot}>
                <td className="bg-jade-light font-semibold p-3 border min-w-[150px]">
                  {slot}
                </td>
                {days.map((day) => {
                  const items = getMealItems(day, slot);
                  return (
                    <td
                      key={`${day}-${slot}`}
                      className="border p-2 bg-white hover:bg-jade-cream cursor-pointer transition"
                      onClick={() => {
                        setSelectedDay(day);
                        setSelectedMealSlot(slot);
                      }}
                    >
                      {items.length > 0 ? (
                        <div className="space-y-1">
                          {items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between items-center bg-jade-light rounded px-2 py-1 text-sm group"
                            >
                              <span>{getStapleName(item.stapleId)}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeItemFromMeal(day, slot, item.stapleId);
                                }}
                                className="opacity-0 group-hover:opacity-100 text-red-600 transition"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400 text-xs py-2">Click to add</p>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Item Selection Modal */}
      {selectedDay && selectedMealSlot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-jade-purple text-white p-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold">
                Add items to {selectedDay} - {selectedMealSlot}
              </h3>
              <button
                onClick={() => {
                  setSelectedDay(null);
                  setSelectedMealSlot(null);
                }}
                className="p-1 hover:bg-jade-purple/80 rounded transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {categories.map((category) => {
                const categoryStaples = staples.filter(
                  (s) => s.category === category.id && s.active
                );
                return (
                  <div key={category.id}>
                    <h4 className="font-semibold text-jade-purple mb-2">
                      {category.label}
                    </h4>
                    {categoryStaples.length === 0 ? (
                      <p className="text-gray-500 text-sm">No active items</p>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {categoryStaples.map((staple) => (
                          <button
                            key={staple.id}
                            onClick={() => {
                              addItemToMeal(selectedDay, selectedMealSlot, staple.id);
                              setSelectedDay(null);
                              setSelectedMealSlot(null);
                            }}
                            className={`p-3 rounded-lg border-2 text-left font-medium hover:bg-opacity-80 transition ${category.color}`}
                          >
                            + {staple.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Shopping List Tab
  const ShoppingListTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-jade-purple mb-2">Shopping List</h2>
        <p className="text-gray-600 mb-4">Auto-generated from your weekly meal plan. Excludes staples (assumes you have them).</p>
      </div>

      <button
        onClick={generateShoppingList}
        className="bg-jade-purple text-white px-6 py-3 rounded-lg hover:bg-jade-purple/80 transition flex items-center gap-2 font-semibold"
      >
        <ShoppingCart size={18} /> Generate Shopping List
      </button>

      {shoppingList.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-600">No items yet. Create your weekly meal plan first, then generate the list.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((category) => {
            const categoryItems = shoppingList.filter((i) => i.category === category.id);
            return categoryItems.length > 0 ? (
              <div key={category.id}>
                <h3 className="font-semibold text-jade-purple mb-2">
                  {category.label} ({categoryItems.length})
                </h3>
                <div className={`rounded-lg border p-3 space-y-2 ${category.color}`}>
                  {categoryItems.map((item, idx) => (
                    <label
                      key={idx}
                      className="flex items-center gap-3 p-2 rounded hover:bg-white/50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => toggleShoppingItem(idx)}
                        className="w-5 h-5 rounded accent-jade-purple"
                      />
                      <div className="flex-1 min-w-0">
                        <span
                          className={`font-medium ${
                            item.checked ? 'line-through text-gray-500' : 'text-gray-800'
                          }`}
                        >
                          {item.name}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600 whitespace-nowrap">
                        {item.quantity}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ) : null;
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-3">
          <UtensilsCrossed size={32} className="text-jade-purple" />
          <div>
            <h2 className="text-2xl font-bold text-jade-purple">Harvey's Meal Planning</h2>
            <p className="text-sm text-gray-600">Staples, weekly planner, and shopping list</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 px-6 py-3 flex gap-2 bg-gray-50">
        {[
          { id: 'staples' as const, label: '📋 Staples' },
          { id: 'weekly' as const, label: '📅 Weekly Planner' },
          { id: 'shopping' as const, label: '🛒 Shopping List' },
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
        {activeTab === 'staples' && <StaplesTab />}
        {activeTab === 'weekly' && <WeeklyPlannerTab />}
        {activeTab === 'shopping' && <ShoppingListTab />}
      </div>
    </div>
  );
}
