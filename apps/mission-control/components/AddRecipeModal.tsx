'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { recipeDatabase } from '../lib/recipeDatabase';

interface AddRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecipeAdded: () => void; // Callback to refresh recipe list
}

export default function AddRecipeModal({
  isOpen,
  onClose,
  onRecipeAdded,
}: AddRecipeModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Dinner',
    calories: '',
    protein: '',
    fats: '',
    carbs: '',
    ingredients: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Recipe name is required');
      return;
    }

    // Parse ingredients (one per line)
    const ingredientLines = formData.ingredients
      .split('\n')
      .filter((line) => line.trim());
    const ingredients = ingredientLines.map((line, idx) => ({
      id: `ing-${idx}`,
      name: line.trim(),
      qty: '',
      unit: '',
    }));

    // Create recipe
    const newRecipe = recipeDatabase.addRecipe({
      name: formData.name.trim(),
      category: formData.category,
      ingredients,
      macros: {
        calories: parseInt(formData.calories) || 0,
        protein: parseInt(formData.protein) || 0,
        fats: parseInt(formData.fats) || 0,
        carbs: parseInt(formData.carbs) || 0,
      },
      notes: formData.notes.trim(),
    });

    console.log('✅ Recipe added:', newRecipe.name);

    // Reset form
    setFormData({
      name: '',
      category: 'Dinner',
      calories: '',
      protein: '',
      fats: '',
      carbs: '',
      ingredients: '',
      notes: '',
    });

    onRecipeAdded();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Add New Recipe</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Recipe Name */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Recipe Name *
            </label>
            <input
              type="text"
              placeholder="e.g., Cheezel Crumbed Chicken"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Snack">Snack</option>
              <option value="Dessert">Dessert</option>
            </select>
          </div>

          {/* Macros */}
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Calories
              </label>
              <input
                type="number"
                placeholder="0"
                value={formData.calories}
                onChange={(e) =>
                  setFormData({ ...formData, calories: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Protein (g)
              </label>
              <input
                type="number"
                placeholder="0"
                value={formData.protein}
                onChange={(e) =>
                  setFormData({ ...formData, protein: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Fat (g)
              </label>
              <input
                type="number"
                placeholder="0"
                value={formData.fats}
                onChange={(e) =>
                  setFormData({ ...formData, fats: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Carbs (g)
              </label>
              <input
                type="number"
                placeholder="0"
                value={formData.carbs}
                onChange={(e) =>
                  setFormData({ ...formData, carbs: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Ingredients (one per line)
            </label>
            <textarea
              placeholder={`Broccoli - 80g\nButterfly - 8g\nChicken Breast - 150g`}
              value={formData.ingredients}
              onChange={(e) =>
                setFormData({ ...formData, ingredients: e.target.value })
              }
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Notes (optional)
            </label>
            <textarea
              placeholder="GF option, cook rice per package instructions..."
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition font-medium flex items-center gap-2"
            >
              <Plus size={18} />
              Add Recipe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
