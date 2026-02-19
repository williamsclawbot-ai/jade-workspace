'use client';

import { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { Recipe } from '../lib/recipeDatabase';
import { Ingredient } from '../lib/weeklyMealPlanStorage';

interface RecipeModalProps {
  isOpen: boolean;
  recipe: Recipe | null;
  onClose: () => void;
  onSave: (ingredientOverrides: Ingredient[], macroOverrides: { calories?: number; protein?: number; fats?: number; carbs?: number }) => void;
  readOnly?: boolean;
}

const JADE_TARGETS = {
  calories: 1550,
  protein: 120,
  fats: 45,
  carbs: 166,
};

export default function RecipeModal({ isOpen, recipe, onClose, onSave, readOnly = false }: RecipeModalProps) {
  const [ingredientEdits, setIngredientEdits] = useState<Ingredient[]>([]);
  const [macroEdits, setMacroEdits] = useState({ calories: 0, protein: 0, fats: 0, carbs: 0 });
  const [hasChanges, setHasChanges] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    ingredients: true,
    macros: true,
    instructions: true,
  });

  useEffect(() => {
    if (recipe) {
      setIngredientEdits([...recipe.ingredients]);
      setMacroEdits({ calories: 0, protein: 0, fats: 0, carbs: 0 });
      setHasChanges(false);
    }
  }, [recipe, isOpen]);

  if (!isOpen || !recipe) return null;

  const handleIngredientChange = (id: string, field: 'qty' | 'unit', value: string) => {
    setIngredientEdits(prev =>
      prev.map(ing =>
        ing.id === id ? { ...ing, [field]: value } : ing
      )
    );
    setHasChanges(true);
  };

  const handleMacroChange = (field: keyof typeof macroEdits, value: string) => {
    const num = parseFloat(value) || 0;
    setMacroEdits(prev => ({ ...prev, [field]: num }));
    setHasChanges(true);
  };

  const calculateDisplayMacros = () => {
    return {
      calories: recipe.macros.calories + macroEdits.calories,
      protein: recipe.macros.protein + macroEdits.protein,
      fats: recipe.macros.fats + macroEdits.fats,
      carbs: recipe.macros.carbs + macroEdits.carbs,
    };
  };

  const displayMacros = calculateDisplayMacros();
  const hasIngredientChanges = ingredientEdits.some((ing, idx) =>
    ing.qty !== recipe.ingredients[idx]?.qty || ing.unit !== recipe.ingredients[idx]?.unit
  );

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-jade-light to-jade-purple/10 p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-jade-purple">{recipe.name}</h2>
            {recipe.category && <p className="text-sm text-gray-600 mt-1">{recipe.category}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Macros Section */}
          <div>
            <button
              onClick={() => toggleSection('macros')}
              className="w-full flex items-center justify-between mb-3 text-lg font-semibold text-jade-purple hover:text-jade-purple/80"
            >
              <span>📊 Macros</span>
              {expandedSections.macros ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {expandedSections.macros && (
              <div className="bg-gradient-to-r from-jade-light to-white p-4 rounded-lg border border-jade-light space-y-4">
                {/* Base macros */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">Recipe Base</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500">Calories</p>
                      <p className="text-xl font-bold text-jade-purple">{recipe.macros.calories}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Protein</p>
                      <p className="text-xl font-bold text-jade-purple">{recipe.macros.protein}g</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Fat</p>
                      <p className="text-xl font-bold text-jade-purple">{recipe.macros.fats}g</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Carbs</p>
                      <p className="text-xl font-bold text-jade-purple">{recipe.macros.carbs}g</p>
                    </div>
                  </div>
                </div>

                {!readOnly && (
                  <>
                    {/* Adjustments */}
                    <div className="border-t border-jade-light pt-4">
                      <p className="text-sm text-gray-600 mb-2">Adjust for Today</p>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="number"
                          placeholder="Cal adjust"
                          value={macroEdits.calories}
                          onChange={(e) => handleMacroChange('calories', e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Protein adjust (g)"
                          value={macroEdits.protein}
                          onChange={(e) => handleMacroChange('protein', e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Fat adjust (g)"
                          value={macroEdits.fats}
                          onChange={(e) => handleMacroChange('fats', e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Carbs adjust (g)"
                          value={macroEdits.carbs}
                          onChange={(e) => handleMacroChange('carbs', e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Adjustments only affect today's plan</p>
                    </div>

                    {/* Total */}
                    <div className="border-t border-jade-light pt-4">
                      <p className="text-sm text-gray-600 mb-2">Today's Total</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-green-50 p-2 rounded">
                          <p className="text-xs text-green-700">{displayMacros.calories}</p>
                        </div>
                        <div className="bg-green-50 p-2 rounded">
                          <p className="text-xs text-green-700">{displayMacros.protein}g</p>
                        </div>
                        <div className="bg-green-50 p-2 rounded">
                          <p className="text-xs text-green-700">{displayMacros.fats}g</p>
                        </div>
                        <div className="bg-green-50 p-2 rounded">
                          <p className="text-xs text-green-700">{displayMacros.carbs}g</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Ingredients Section */}
          <div>
            <button
              onClick={() => toggleSection('ingredients')}
              className="w-full flex items-center justify-between mb-3 text-lg font-semibold text-jade-purple hover:text-jade-purple/80"
            >
              <span>🥘 Ingredients ({ingredientEdits.length})</span>
              {expandedSections.ingredients ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {expandedSections.ingredients && (
              <div className="space-y-2">
                {ingredientEdits.map((ing, idx) => (
                  <div key={ing.id} className="bg-gray-50 p-3 rounded flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-800 flex-1">{ing.name}</span>
                    {readOnly ? (
                      <span className="text-sm text-gray-600">{ing.qty} {ing.unit}</span>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={ing.qty}
                          onChange={(e) => handleIngredientChange(ing.id, 'qty', e.target.value)}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                          placeholder="Qty"
                        />
                        <input
                          type="text"
                          value={ing.unit}
                          onChange={(e) => handleIngredientChange(ing.id, 'unit', e.target.value)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                          placeholder="Unit"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instructions */}
          {recipe.instructions && (
            <div>
              <button
                onClick={() => toggleSection('instructions')}
                className="w-full flex items-center justify-between mb-3 text-lg font-semibold text-jade-purple hover:text-jade-purple/80"
              >
                <span>📝 Instructions</span>
                {expandedSections.instructions ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              {expandedSections.instructions && (
                <div className="bg-gray-50 p-4 rounded text-sm text-gray-700 leading-relaxed">
                  {recipe.instructions}
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          {recipe.notes && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">💡 Notes:</span> {recipe.notes}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium"
          >
            Close
          </button>
          {!readOnly && hasChanges && (
            <button
              onClick={() => {
                onSave(ingredientEdits, {
                  calories: macroEdits.calories !== 0 ? macroEdits.calories : undefined,
                  protein: macroEdits.protein !== 0 ? macroEdits.protein : undefined,
                  fats: macroEdits.fats !== 0 ? macroEdits.fats : undefined,
                  carbs: macroEdits.carbs !== 0 ? macroEdits.carbs : undefined,
                });
                onClose();
              }}
              className="flex-1 px-4 py-2 bg-jade-purple text-white rounded-lg hover:bg-jade-purple/90 transition font-medium"
            >
              💾 Save Changes for Today
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
