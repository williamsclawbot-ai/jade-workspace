'use client';

import { useState, useEffect } from 'react';
import { X, Search, Plus } from 'lucide-react';
import { recipeDatabase, Recipe } from '../lib/recipeDatabase';
import AddRecipeModal from './AddRecipeModal';

// Harvey's meal options for filtering
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

interface RecipeBrowserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecipe: (recipeName: string) => void;
}

export default function RecipeBrowserModal({
  isOpen,
  onClose,
  onSelectRecipe,
}: RecipeBrowserModalProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filterHarveysOnly, setFilterHarveysOnly] = useState(false);
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);

  // Initialize new recipes on first load (guaranteed to run in browser)
  useEffect(() => {
    const STORAGE_KEY = 'jade-recipe-database-v1';
    const stored = localStorage.getItem(STORAGE_KEY);
    const data = stored ? JSON.parse(stored) : {};
    const existingNames = new Set(Object.values(data as any).map((r: any) => r.name));

    const newRecipes = [
      {
        name: 'Snacks',
        category: 'Snack',
        ingredients: [
          { id: '1', name: 'Harvest Pea Snaps (Original Salted) (18g) - Calbee', qty: '1', unit: 'pack' },
          { id: '2', name: 'Kiwifruit', qty: '100', unit: 'g' },
          { id: '3', name: 'Medium Coffee on Skim Milk', qty: '1', unit: 'serve' },
        ],
        macros: { calories: 264, protein: 16, fats: 4, carbs: 37 },
      },
      {
        name: 'Rice Cakes with Peanut Butter and Banana (Mid Meal)',
        category: 'Snack',
        ingredients: [
          { id: '1', name: 'Banana', qty: '50', unit: 'g' },
          { id: '2', name: 'Peanut Butter - Bega', qty: '15', unit: 'g' },
          { id: '3', name: 'Rice Cakes - Sunrise', qty: '2', unit: 'cakes' },
        ],
        macros: { calories: 186, protein: 5, fats: 8, carbs: 22 },
      },
      {
        name: 'Caramelized Pineapple Burger (GF)',
        category: 'Dinner',
        ingredients: [
          { id: '1', name: '50% Less Fat Cheese Slice - Bega', qty: '1', unit: 'slice' },
          { id: '2', name: 'Brioche Bun Gluten free - Woolworths', qty: '1', unit: 'bun' },
          { id: '3', name: 'Extra Lean Beef Mince (5 Star)', qty: '100', unit: 'g' },
          { id: '4', name: 'Lettuce', qty: '30', unit: 'g' },
          { id: '5', name: 'Natural Brown Sweetener - Natvia', qty: '10', unit: 'g' },
          { id: '6', name: 'Onion', qty: '20', unit: 'g' },
          { id: '7', name: 'Pineapple Canned - Golden Circle', qty: '50', unit: 'g' },
        ],
        macros: { calories: 424, protein: 33, fats: 11, carbs: 45 },
      },
      {
        name: 'Rice Cakes with Honey and Banana (Mid Meal)',
        category: 'Snack',
        ingredients: [
          { id: '1', name: 'Banana', qty: '100', unit: 'g' },
          { id: '2', name: 'Honey', qty: '5', unit: 'g' },
          { id: '3', name: 'Rice Cakes - Sunrise', qty: '2', unit: 'cakes' },
        ],
        macros: { calories: 153, protein: 2, fats: 1, carbs: 34 },
      },
      {
        name: 'Chicken Gyros (GF)',
        category: 'Dinner',
        ingredients: [
          { id: '1', name: 'Chicken Breast (Weighed Raw)', qty: '150', unit: 'g' },
          { id: '2', name: 'Garlic & Herb Seasoning - Mingle', qty: '20', unit: 'g' },
          { id: '3', name: 'Lettuce', qty: '20', unit: 'g' },
          { id: '4', name: 'Low Carb Potato - Carisma/Spud Lite', qty: '200', unit: 'g' },
          { id: '5', name: 'Onion', qty: '15', unit: 'g' },
          { id: '6', name: 'Oregano', qty: '1', unit: 'g' },
          { id: '7', name: 'Tomato', qty: '50', unit: 'g' },
          { id: '8', name: 'Tzatziki - Willow Farm', qty: '20', unit: 'g' },
          { id: '9', name: 'White Wraps Gluten Free - Woolworths', qty: '1', unit: 'wrap' },
        ],
        macros: { calories: 510, protein: 44, fats: 8, carbs: 64 },
      },
      {
        name: 'Cantonese Chicken (GF)',
        category: 'Dinner',
        ingredients: [
          { id: '1', name: 'Broccoli', qty: '100', unit: 'g' },
          { id: '2', name: 'Cantonese Beef Stir Fry Sauce - Passage to Asia', qty: '70', unit: 'g' },
          { id: '3', name: 'Chicken Breast (Weighed Raw)', qty: '120', unit: 'g' },
          { id: '4', name: 'Fresh Garlic', qty: '0.05', unit: 'clove' },
          { id: '5', name: 'Onion', qty: '30', unit: 'g' },
          { id: '6', name: 'Rice Raw', qty: '35', unit: 'g' },
          { id: '7', name: 'Zucchini', qty: '80', unit: 'g' },
        ],
        macros: { calories: 403, protein: 34, fats: 3, carbs: 60 },
      },
      {
        name: 'Cheezel Crumbed Chicken & Veggies (GF)',
        category: 'Dinner',
        ingredients: [
          { id: '1', name: 'Broccoli', qty: '80', unit: 'g' },
          { id: '2', name: 'Butter (Light)', qty: '8', unit: 'g' },
          { id: '3', name: 'Carrot', qty: '80', unit: 'g' },
          { id: '4', name: 'Cheezels', qty: '1', unit: 'pack' },
          { id: '5', name: 'Chicken Breast (Weighed Raw)', qty: '150', unit: 'g' },
          { id: '6', name: 'Egg White', qty: '60', unit: 'g' },
          { id: '7', name: 'Low Carb Potato - Carisma/Spud Lite', qty: '225', unit: 'g' },
        ],
        macros: { calories: 491, protein: 49, fats: 12, carbs: 42 },
      },
    ];

    let added = 0;
    newRecipes.forEach(recipe => {
      if (!existingNames.has(recipe.name)) {
        const id = `recipe-${Date.now()}-${Math.random().toString(36).substr(2,9)}`;
        data[id] = { ...recipe, id, createdAt: Date.now(), updatedAt: Date.now() };
        added++;
      }
    });

    if (added > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      recipeDatabase.reload();
      console.log(`✅ Added ${added} recipes to database. Total now: ${Object.keys(data).length}`);
    }
  }, []); // Run once on mount

  useEffect(() => {
    if (isOpen) {
      loadRecipes();
    }
  }, [isOpen]);

  const loadRecipes = () => {
    // Force reload from localStorage in case recipes were added externally
    recipeDatabase.reload();
    const allRecipes = recipeDatabase.getAllRecipes();
    setRecipes(allRecipes);
  };

  if (!isOpen) return null;

  const categories = Array.from(new Set(recipes.map(r => r.category).filter(Boolean))) as string[];

  const getFilteredRecipes = () => {
    let filtered = recipes;
    
    if (filterHarveysOnly) {
      const harveysOptions = getAllHarveysOptions();
      filtered = filtered.filter(r => harveysOptions.includes(r.name));
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(r => r.category === selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(query) ||
        r.notes?.toLowerCase().includes(query) ||
        r.ingredients.some(ing => ing.name.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  };

  const filteredRecipes = getFilteredRecipes();

  const handleSelectRecipe = (recipeName: string) => {
    onSelectRecipe(recipeName);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              📖 Recipe Browser
            </h2>
            <span className="text-sm text-gray-500">
              {filteredRecipes.length} recipes
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddRecipeModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition text-sm font-medium"
            >
              <Plus size={16} />
              Add
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Search + Category filter */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes by name, notes, or ingredients..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Harvey's & Category filters */}
          <div className="space-y-2">
            {/* Harvey's Filter */}
            <button
              onClick={() => setFilterHarveysOnly(!filterHarveysOnly)}
              className={`px-4 py-2 text-sm rounded-full transition font-medium ${
                filterHarveysOnly
                  ? 'bg-jade-purple text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              👨‍👦 Harvey's Options
            </button>

            {/* Category filter */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1 text-sm rounded-full transition ${
                  selectedCategory === null
                    ? 'bg-jade-purple text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 text-sm rounded-full transition ${
                    selectedCategory === cat
                      ? 'bg-jade-purple text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recipe list */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredRecipes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No recipes found</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                {searchQuery ? 'Try a different search term' : 'Add recipes to get started'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredRecipes.map(recipe => (
                <button
                  key={recipe.id}
                  onClick={() => handleSelectRecipe(recipe.name)}
                  className="text-left bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-jade-purple hover:bg-jade-light/10 dark:hover:bg-jade-purple/10 transition"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {recipe.name}
                    </h3>
                    {recipe.category && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                        {recipe.category}
                      </span>
                    )}
                  </div>
                  
                  {/* Macros */}
                  <div className="flex gap-3 text-xs text-gray-600 dark:text-gray-400 mb-2">
                    <span>⚡ {recipe.macros.calories} cal</span>
                    <span>💪 {recipe.macros.protein}g P</span>
                    <span>🥑 {recipe.macros.fats}g F</span>
                    <span>🍞 {recipe.macros.carbs}g C</span>
                  </div>
                  
                  {/* Ingredients count */}
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {recipe.ingredients.length} ingredients
                    {recipe.notes && (
                      <span className="ml-2 text-gray-400">• {recipe.notes}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Click a recipe to assign it to a meal slot
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Add Recipe Modal */}
      <AddRecipeModal
        isOpen={showAddRecipeModal}
        onClose={() => setShowAddRecipeModal(false)}
        onRecipeAdded={() => {
          loadRecipes();
          setShowAddRecipeModal(false);
        }}
      />
    </div>
  );
}
