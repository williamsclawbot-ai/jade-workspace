'use client';

import { useState } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';
import { Ingredient } from '../lib/recipeDatabase';

interface ParsedIngredient {
  qty: string | number;
  unit: string;
  name: string;
  original: string; // Keep original text for reference
  parsed: boolean; // Successfully parsed?
}

interface RecipeInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (recipe: {
    name: string;
    category: string;
    ingredients: Ingredient[];
    macros: { calories: number; protein: number; fats: number; carbs: number };
    instructions?: string;
    notes?: string;
  }) => void;
  defaultCategory?: 'Breakfast' | 'Lunch' | 'Snack' | 'Dinner' | 'Dessert' | 'Harvey';
  weekId?: string;
  onAssignToDay?: (recipeName: string, day: string, mealType: string) => void;
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const mealTypes = ['Breakfast', 'Lunch', 'Snack', 'Dinner', 'Dessert'];

export default function RecipeInputModal({ isOpen, onClose, onSave, defaultCategory, weekId, onAssignToDay }: RecipeInputModalProps) {
  const [step, setStep] = useState<'paste' | 'review' | 'macros' | 'assign'>('paste');
  const [recipeName, setRecipeName] = useState('');
  const [recipeCategory, setRecipeCategory] = useState(defaultCategory || 'Lunch');
  const [pastedText, setPastedText] = useState('');
  const [parsedIngredients, setParsedIngredients] = useState<ParsedIngredient[]>([]);
  const [instructions, setInstructions] = useState('');
  const [notes, setNotes] = useState('');
  
  // Macro inputs
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [fats, setFats] = useState('');
  const [carbs, setCarbs] = useState('');

  // Assignment state
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<string>(recipeCategory);

  if (!isOpen) return null;

  const parseIngredient = (line: string): ParsedIngredient => {
    const original = line.trim();
    
    // Common patterns to match:
    // "2 cups flour"
    // "1.5 tbsp olive oil"
    // "100g chicken breast"
    // "1 medium onion"
    // "2-3 cloves garlic"
    // "1/2 cup milk"
    
    // Pattern 1: Quantity + Unit + Name (most common)
    // Matches: "2 cups flour", "1.5 tbsp oil", "100g chicken"
    const pattern1 = /^([\d.\/\-]+)\s*([a-zA-Z]+)\s+(.+)$/;
    const match1 = original.match(pattern1);
    
    if (match1) {
      return {
        qty: match1[1].trim(),
        unit: match1[2].trim(),
        name: match1[3].trim(),
        original,
        parsed: true,
      };
    }
    
    // Pattern 2: Quantity + Name (no unit)
    // Matches: "2 eggs", "1 onion", "3 tomatoes"
    const pattern2 = /^([\d.\/\-]+)\s+(.+)$/;
    const match2 = original.match(pattern2);
    
    if (match2) {
      return {
        qty: match2[1].trim(),
        unit: '', // No unit specified
        name: match2[2].trim(),
        original,
        parsed: true,
      };
    }
    
    // Pattern 3: Just ingredient name (no quantity/unit)
    // Matches: "Salt to taste", "Pepper", "Cinnamon"
    return {
      qty: '',
      unit: '',
      name: original,
      original,
      parsed: false, // Flag as unparsed for user review
    };
  };

  const handleParse = () => {
    const lines = pastedText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && !line.startsWith('#') && !line.startsWith('//'));
    
    const parsed = lines.map(parseIngredient);
    setParsedIngredients(parsed);
    setStep('review');
  };

  const updateParsedIngredient = (index: number, field: 'qty' | 'unit' | 'name', value: string) => {
    const updated = [...parsedIngredients];
    updated[index] = {
      ...updated[index],
      [field]: value,
      parsed: true, // Mark as reviewed
    };
    setParsedIngredients(updated);
  };

  const removeParsedIngredient = (index: number) => {
    setParsedIngredients(parsedIngredients.filter((_, i) => i !== index));
  };

  const handleSaveRecipe = () => {
    // Convert parsed ingredients to Ingredient format
    const ingredients: Ingredient[] = parsedIngredients.map((ing, idx) => ({
      id: `ing-${Date.now()}-${idx}`,
      name: ing.name,
      qty: ing.qty || '1',
      unit: ing.unit || '',
    }));
    
    const macros = {
      calories: parseInt(calories) || 0,
      protein: parseInt(protein) || 0,
      fats: parseInt(fats) || 0,
      carbs: parseInt(carbs) || 0,
    };
    
    onSave({
      name: recipeName,
      category: recipeCategory,
      ingredients,
      macros,
      instructions: instructions || undefined,
      notes: notes || undefined,
    });
    
    // Move to assignment step instead of closing
    if (weekId && onAssignToDay) {
      setSelectedMealType(recipeCategory);
      setStep('assign');
    } else {
      // No assignment callback, just close
      handleClose();
    }
  };

  const handleClose = () => {
    // Reset state
    setStep('paste');
    setRecipeName('');
    setPastedText('');
    setParsedIngredients([]);
    setInstructions('');
    setNotes('');
    setCalories('');
    setProtein('');
    setFats('');
    setCarbs('');
    setSelectedDay(null);
    setSelectedMealType(defaultCategory || 'Lunch');
    onClose();
  };

  const handleAssignNow = () => {
    if (selectedDay && onAssignToDay) {
      onAssignToDay(recipeName, selectedDay, selectedMealType);
      handleClose();
    }
  };

  const handleAssignLater = () => {
    handleClose();
  };

  const handleCreateAnother = () => {
    // Reset to paste step but keep modal open
    setStep('paste');
    setRecipeName('');
    setPastedText('');
    setParsedIngredients([]);
    setInstructions('');
    setNotes('');
    setCalories('');
    setProtein('');
    setFats('');
    setCarbs('');
    setSelectedDay(null);
    setSelectedMealType(recipeCategory);
  };

  const handleBack = () => {
    if (step === 'review') setStep('paste');
    else if (step === 'macros') setStep('review');
    else if (step === 'assign') setStep('macros');
  };

  const handleAdvanceToMacros = () => {
    console.log('handleAdvanceToMacros called, parsedIngredients:', parsedIngredients.length);
    if (parsedIngredients.length > 0) {
      setStep('macros');
    }
  };

  const handleNext = () => {
    if (step === 'paste' && recipeName && pastedText) {
      handleParse();
    } else if (step === 'review') {
      handleAdvanceToMacros();
    } else if (step === 'macros' && calories && protein && fats && carbs) {
      handleSaveRecipe();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Add New Recipe
            </h2>
            <span className="text-sm text-gray-500">
              {step === 'paste' && 'Step 1: Paste Ingredients'}
              {step === 'review' && 'Step 2: Review & Edit'}
              {step === 'macros' && 'Step 3: Add Macros'}
              {step === 'assign' && 'Step 4: Assign to Day'}
            </span>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'paste' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Recipe Name *
                </label>
                <input
                  type="text"
                  value={recipeName}
                  onChange={(e) => setRecipeName(e.target.value)}
                  placeholder="e.g., Chicken Enchilada (GF)"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category *
                </label>
                <select
                  value={recipeCategory}
                  onChange={(e) => setRecipeCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Snack">Snack</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Harvey">Harvey</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ingredient List * (one per line)
                </label>
                <textarea
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste ingredients here, one per line:&#10;2 cups flour&#10;1.5 tbsp olive oil&#10;100g chicken breast&#10;1 medium onion"
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Examples: &quot;2 cups flour&quot;, &quot;100g chicken&quot;, &quot;1 onion&quot;
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Instructions (optional)
                </label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="How to prepare this recipe..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes (optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., Gluten-free friendly, Kid-approved"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {step === 'review' && (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" size={18} />
                  <div className="text-sm text-blue-900 dark:text-blue-200">
                    <p className="font-medium mb-1">Review parsed ingredients</p>
                    <p className="text-blue-700 dark:text-blue-300">
                      Items marked with ⚠️ need your attention. Edit quantities, units, or names as needed.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {parsedIngredients.map((ing, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border ${
                      !ing.parsed
                        ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700'
                        : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {!ing.parsed && <span className="text-yellow-600 dark:text-yellow-400">⚠️</span>}
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-mono flex-1">
                        {ing.original}
                      </span>
                      <button
                        onClick={() => removeParsedIngredient(idx)}
                        className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Quantity</label>
                        <input
                          type="text"
                          value={ing.qty}
                          onChange={(e) => updateParsedIngredient(idx, 'qty', e.target.value)}
                          placeholder="1.5"
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Unit</label>
                        <input
                          type="text"
                          value={ing.unit}
                          onChange={(e) => updateParsedIngredient(idx, 'unit', e.target.value)}
                          placeholder="cups, g, tbsp"
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Ingredient Name</label>
                        <input
                          type="text"
                          value={ing.name}
                          onChange={(e) => updateParsedIngredient(idx, 'name', e.target.value)}
                          placeholder="flour"
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {parsedIngredients.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No ingredients parsed. Go back and paste ingredient text.
                </div>
              )}
            </div>
          )}

          {step === 'macros' && (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Check className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" size={18} />
                  <div className="text-sm text-green-900 dark:text-green-200">
                    <p className="font-medium mb-1">Ingredients parsed successfully!</p>
                    <p className="text-green-700 dark:text-green-300">
                      {parsedIngredients.length} ingredients ready. Now add macro information.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Calories *
                  </label>
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    placeholder="543"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Protein (g) *
                  </label>
                  <input
                    type="number"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    placeholder="42"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Fats (g) *
                  </label>
                  <input
                    type="number"
                    value={fats}
                    onChange={(e) => setFats(e.target.value)}
                    placeholder="21"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Carbs (g) *
                  </label>
                  <input
                    type="number"
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                    placeholder="44"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Recipe Summary</h3>
                <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  <p><strong>Name:</strong> {recipeName}</p>
                  <p><strong>Category:</strong> {recipeCategory}</p>
                  <p><strong>Ingredients:</strong> {parsedIngredients.length} items</p>
                  {instructions && <p><strong>Instructions:</strong> Yes</p>}
                  {notes && <p><strong>Notes:</strong> {notes}</p>}
                </div>
              </div>
            </div>
          )}

          {step === 'assign' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:bg-gradient-to-r dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
                <div className="text-4xl mb-3">🎉</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Recipe Saved!
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Where should I add <span className="font-semibold text-jade-purple">{recipeName}</span>?
                </p>
              </div>

              {/* Meal Type Selector */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Meal Type
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {mealTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedMealType(type)}
                      className={`h-12 px-3 py-2 rounded-lg font-medium transition text-sm ${
                        selectedMealType === type
                          ? 'bg-jade-purple text-white shadow-md'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Day Selector */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Which Day?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {days.map(day => {
                    const isSelected = selectedDay === day;
                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`h-12 px-4 py-2 rounded-lg font-medium transition border-2 ${
                          isSelected
                            ? 'bg-jade-light border-jade-purple text-jade-purple shadow-md'
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-jade-light hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {isSelected && <span className="mr-1">✓</span>}
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Summary */}
              {selectedDay && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-sm text-blue-900 dark:text-blue-200">
                    <span className="font-semibold">Will assign:</span> {recipeName} to{' '}
                    <span className="font-semibold">{selectedMealType}</span> on{' '}
                    <span className="font-semibold">{selectedDay}</span>
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={handleAssignNow}
                  disabled={!selectedDay}
                  className="h-12 bg-jade-purple hover:bg-jade-purple/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                  Assign Now
                </button>
                <button
                  onClick={handleAssignLater}
                  className="h-12 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium transition"
                >
                  Assign Later
                </button>
                <button
                  onClick={handleCreateAnother}
                  className="h-12 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 px-4 py-2 rounded-lg font-medium transition"
                >
                  Create Another
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step !== 'assign' && (
          <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={step === 'paste' ? handleClose : handleBack}
              className="h-12 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {step === 'paste' ? 'Cancel' : 'Back'}
            </button>
            <button
              onClick={handleNext}
              disabled={
                (step === 'paste' && (!recipeName || !pastedText)) ||
                (step === 'review' && parsedIngredients.length === 0) ||
                (step === 'macros' && (!calories || !protein || !fats || !carbs))
              }
              className="h-12 px-6 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {step === 'paste' && 'Parse Ingredients'}
              {step === 'review' && 'Add Macros'}
              {step === 'macros' && 'Save Recipe'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
