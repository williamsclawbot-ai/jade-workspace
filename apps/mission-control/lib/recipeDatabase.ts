/**
 * Recipe Database
 * Clean, simple persistent storage for recipes using localStorage
 */

export interface Ingredient {
  id: string;
  name: string;
  qty: string | number;
  unit: string;
}

export interface Recipe {
  id: string;
  name: string;
  category?: string;
  ingredients: Ingredient[];
  macros: {
    calories: number;
    protein: number;
    fats: number;
    carbs: number;
  };
  instructions?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'jade-recipe-database-v1';

class RecipeDatabase {
  private recipes: Map<string, Recipe> = new Map();

  constructor() {
    this.load();
  }

  private load() {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.recipes = new Map(Object.entries(data));
      }
    } catch (e) {
      console.error('Error loading recipes:', e);
    }
  }

  private save() {
    if (typeof window === 'undefined') return;
    try {
      const data = Object.fromEntries(this.recipes);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY, newValue: JSON.stringify(data) }));
    } catch (e) {
      console.error('Error saving recipes:', e);
    }
  }

  reload() {
    this.recipes.clear();
    this.load();
  }

  getAllRecipes(): Recipe[] {
    return Array.from(this.recipes.values());
  }

  getRecipeByName(name: string): Recipe | null {
    return Array.from(this.recipes.values()).find(r => r.name === name) || null;
  }

  getRecipeById(id: string): Recipe | null {
    return this.recipes.get(id) || null;
  }

  addRecipe(recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>): Recipe {
    const id = `recipe-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();
    const newRecipe: Recipe = { ...recipe, id, createdAt: now, updatedAt: now };
    this.recipes.set(id, newRecipe);
    this.save();
    return newRecipe;
  }

  updateRecipe(id: string, updates: Partial<Recipe>): Recipe {
    const recipe = this.recipes.get(id);
    if (!recipe) throw new Error(`Recipe ${id} not found`);
    const updated: Recipe = { ...recipe, ...updates, id: recipe.id, createdAt: recipe.createdAt, updatedAt: Date.now() };
    this.recipes.set(id, updated);
    this.save();
    return updated;
  }

  deleteRecipe(id: string): void {
    this.recipes.delete(id);
    this.save();
  }

  searchRecipes(query: string): Recipe[] {
    const lower = query.toLowerCase();
    return Array.from(this.recipes.values()).filter(
      r => r.name.toLowerCase().includes(lower) || 
           r.notes?.toLowerCase().includes(lower) ||
           r.ingredients.some(ing => ing.name.toLowerCase().includes(lower))
    );
  }
}

export const recipeDatabase = new RecipeDatabase();

// ======================
// RECIPE DATABASE STARTS EMPTY
// Jade will populate via Discord submissions
// ======================
// No seed recipes - recipe library starts fresh
// Use recipeDatabase.addRecipe() to add new recipes
