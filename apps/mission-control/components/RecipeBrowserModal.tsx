'use client';

import { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { recipeDatabase, Recipe } from '../lib/recipeDatabase';

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

  useEffect(() => {
    if (isOpen) {
      loadRecipes();
    }
  }, [isOpen]);

  const loadRecipes = () => {
    const allRecipes = recipeDatabase.getAllRecipes();
    setRecipes(allRecipes);
  };

  if (!isOpen) return null;

  const categories = Array.from(new Set(recipes.map(r => r.category).filter(Boolean))) as string[];

  const getFilteredRecipes = () => {
    let filtered = recipes;
    
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
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={20} />
          </button>
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
    </div>
  );
}
