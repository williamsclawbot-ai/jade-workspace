/**
 * Recipe Database
 * Persistent storage for all of Jade's recipes
 * Each recipe is a reusable template with ingredients and macros
 */

export interface Ingredient {
  id: string;
  name: string;
  qty: string | number; // "2" or "1.5"
  unit: string; // "cups", "g", "tbsp", etc.
}

export interface Recipe {
  id: string;
  name: string; // "PB & J Overnight Weet-Bix"
  category?: string; // "Breakfast", "Lunch", etc.
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
      console.error('Error loading recipe database:', e);
    }
  }

  private save() {
    if (typeof window === 'undefined') return;

    try {
      const data = Object.fromEntries(this.recipes);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      // Trigger storage event for real-time sync
      window.dispatchEvent(new StorageEvent('storage', {
        key: STORAGE_KEY,
        newValue: JSON.stringify(data),
      }));
    } catch (e) {
      console.error('Error saving recipe database:', e);
    }
  }

  getAllRecipes(): Recipe[] {
    return Array.from(this.recipes.values());
  }

  getRecipeByName(name: string): Recipe | null {
    const recipes = Array.from(this.recipes.values());
    return recipes.find(r => r.name === name) || null;
  }

  getRecipeById(id: string): Recipe | null {
    return this.recipes.get(id) || null;
  }

  addRecipe(recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>): Recipe {
    const id = `recipe-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();

    const newRecipe: Recipe = {
      ...recipe,
      id,
      createdAt: now,
      updatedAt: now,
    };

    this.recipes.set(id, newRecipe);
    this.save();
    return newRecipe;
  }

  updateRecipe(id: string, updates: Partial<Recipe>): Recipe {
    const recipe = this.recipes.get(id);
    if (!recipe) throw new Error(`Recipe ${id} not found`);

    const updated: Recipe = {
      ...recipe,
      ...updates,
      id: recipe.id, // Never change ID
      createdAt: recipe.createdAt, // Never change creation date
      updatedAt: Date.now(),
    };

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
      r => r.name.toLowerCase().includes(lower)
    );
  }

  // Initialize with default recipes if database is empty
  initializeDefaults() {
    if (this.recipes.size > 0) return; // Already has recipes

    const defaults: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        name: 'Chicken Enchilada (GF)',
        category: 'Lunch',
        ingredients: [
          { id: 'ing-1', name: 'Avocado', qty: '30', unit: 'g' },
          { id: 'ing-2', name: 'Chicken Breast (Weighed Raw)', qty: '100', unit: 'g' },
          { id: 'ing-3', name: 'Light Mozzarella Cheese (Coles) OR Bega 50% light Shredded Cheese (Woolworths)', qty: '35', unit: 'g' },
          { id: 'ing-4', name: 'Mild Salsa - Old El Paso', qty: '35', unit: 'g' },
          { id: 'ing-5', name: 'Refried Beans - Old El Paso', qty: '60', unit: 'g' },
          { id: 'ing-6', name: 'Sour Cream Light', qty: '30', unit: 'g' },
          { id: 'ing-7', name: 'Taco Spice Mix (Old El Paso) - Gluten free', qty: '5', unit: 'g' },
          { id: 'ing-8', name: 'White Wraps (50g) - Free From Gluten (Woolworths Only)', qty: '1', unit: 'wrap' },
        ],
        macros: { calories: 543, protein: 42, fats: 21, carbs: 44 },
        instructions: 'Warm tortilla, add beans and chicken, top with cheese and salsa, roll and enjoy.',
        notes: 'Gluten-free friendly',
      },
      {
        name: 'Asian Chicken Tacos (GF)',
        category: 'Lunch',
        ingredients: [
          { id: 'ing-9', name: 'Carrot', qty: '60', unit: 'g' },
          { id: 'ing-10', name: 'Chicken Breast (Weighed Raw)', qty: '150', unit: 'g' },
          { id: 'ing-11', name: 'Fried Shallots - Doree', qty: '5', unit: 'g' },
          { id: 'ing-12', name: 'Garlic Aioli - Coles Brand / Woolworths Brand', qty: '15', unit: 'g' },
          { id: 'ing-13', name: 'Honey', qty: '10', unit: 'g' },
          { id: 'ing-14', name: 'Lettuce', qty: '40', unit: 'g' },
          { id: 'ing-15', name: 'Light Soy Sauce - Ayam', qty: '20', unit: 'g' },
          { id: 'ing-16', name: 'Minced Garlic - Woolworths', qty: '10', unit: 'g' },
          { id: 'ing-17', name: 'Onion', qty: '20', unit: 'g' },
          { id: 'ing-18', name: 'Taco Shell (13g) - Old El Paso', qty: '3', unit: 'shells' },
        ],
        macros: { calories: 556, protein: 39, fats: 22, carbs: 42 },
        instructions: 'Stir-fry chicken with garlic, onion, and carrot. Season with soy and honey. Serve in taco shells with lettuce and aioli.',
        notes: 'Gluten-free friendly',
      },
      {
        name: 'Beef San Choy Bao (GF, DF)',
        category: 'Lunch',
        ingredients: [
          { id: 'ing-19', name: 'Capsicum', qty: '30', unit: 'g' },
          { id: 'ing-20', name: 'Carrot', qty: '30', unit: 'g' },
          { id: 'ing-21', name: 'Extra Lean Beef Mince (5 Star) (Weighed Raw)', qty: '100', unit: 'g' },
          { id: 'ing-22', name: 'Green Beans', qty: '30', unit: 'g' },
          { id: 'ing-23', name: 'Lettuce', qty: '100', unit: 'g' },
          { id: 'ing-24', name: 'Onion', qty: '25', unit: 'g' },
          { id: 'ing-25', name: 'San Choy Bow Meal Kit (97g) - Marions Kitchen', qty: '1', unit: 'kit' },
        ],
        macros: { calories: 342, protein: 27, fats: 12, carbs: 32 },
        instructions: 'Brown beef mince, add vegetables and sauce from kit, serve in lettuce leaves.',
        notes: 'Gluten-free and dairy-free friendly',
      },
      {
        name: 'PB & J Overnight Weet-Bix (GF)',
        category: 'Breakfast',
        ingredients: [
          { id: 'ing-26', name: 'Weet-bix Gluten free (15g) - Sanitarium', qty: '2', unit: 'biscuits' },
          { id: 'ing-27', name: 'High Protein Almond milk - So Good', qty: '100', unit: 'ml' },
          { id: 'ing-28', name: 'Greek Yogurt Vanilla - Chobani', qty: '100', unit: 'g' },
          { id: 'ing-29', name: 'Peanut Butter - Bega', qty: '15', unit: 'g' },
          { id: 'ing-30', name: 'Jam - Natvia (Woolworths Only)', qty: '20', unit: 'g' },
          { id: 'ing-31', name: 'Protein Powder - WPI (Any)', qty: '15', unit: 'g' },
          { id: 'ing-32', name: 'Maple Syrup', qty: '10', unit: 'g' },
        ],
        macros: { calories: 427, protein: 30, fats: 12, carbs: 46 },
        instructions: '1. In a bowl, combine weet-bix, protein powder, milk and sweetener. Press mixture down firmly into bowl to create base. 2. In another bowl, mix together yogurt and peanut butter until batter is smooth. Spread over weet-bix base and drizzle with jam and maple syrup.',
        notes: 'Gluten-free friendly overnight breakfast',
      },
      {
        name: 'Beef Chow Mein (GF,DF)',
        category: 'Dinner',
        ingredients: [
          { id: 'ing-33', name: 'Extra Lean Beef Strips (Weighed Raw)', qty: '150', unit: 'g' },
          { id: 'ing-34', name: 'Light Soy Sauce - Ayam', qty: '10', unit: 'g' },
          { id: 'ing-35', name: 'San Choy Bow Meal Kit (97g) - Marion\'s Kitchen', qty: '0.5', unit: 'kit' },
          { id: 'ing-36', name: 'Stir Fry Vegetables (generic)', qty: '175', unit: 'g' },
          { id: 'ing-37', name: 'Vermicelli Rice Noodle - Chang\'s', qty: '60', unit: 'g' },
        ],
        macros: { calories: 565, protein: 47, fats: 8, carbs: 71 },
        instructions: '1. Cook the vermicelli noodles according to package directions, drain and set aside. 2. Heat a wok or large pan over medium-high heat. Stir-fry beef strips until cooked through. 3. Add stir fry vegetables and cook until tender-crisp. 4. Add cooked noodles, San Choy Bow sauce, and soy sauce. Toss everything together until well combined. 5. Serve hot.',
        notes: 'Gluten-free and dairy-free friendly. High protein, low fat option.',
      },
    ];

    defaults.forEach(recipe => this.addRecipe(recipe));
  }
}

export const recipeDatabase = new RecipeDatabase();

// Initialize with defaults on first load
if (typeof window !== 'undefined') {
  recipeDatabase.initializeDefaults();
  
  // Ensure all required recipes exist (add if missing)
  const requiredRecipes = [
    {
      name: 'PB & J Overnight Weet-Bix (GF)',
      category: 'Breakfast',
      ingredients: [
        { id: 'ing-26', name: 'Weet-bix Gluten free (15g) - Sanitarium', qty: '2', unit: 'biscuits' },
        { id: 'ing-27', name: 'High Protein Almond milk - So Good', qty: '100', unit: 'ml' },
        { id: 'ing-28', name: 'Greek Yogurt Vanilla - Chobani', qty: '100', unit: 'g' },
        { id: 'ing-29', name: 'Peanut Butter - Bega', qty: '15', unit: 'g' },
        { id: 'ing-30', name: 'Jam - Natvia (Woolworths Only)', qty: '20', unit: 'g' },
        { id: 'ing-31', name: 'Protein Powder - WPI (Any)', qty: '15', unit: 'g' },
        { id: 'ing-32', name: 'Maple Syrup', qty: '10', unit: 'g' },
      ],
      macros: { calories: 427, protein: 30, fats: 12, carbs: 46 },
      instructions: '1. In a bowl, combine weet-bix, protein powder, milk and sweetener. Press mixture down firmly into bowl to create base. 2. In another bowl, mix together yogurt and peanut butter until batter is smooth. Spread over weet-bix base and drizzle with jam and maple syrup.',
      notes: 'Gluten-free friendly overnight breakfast',
    },
    {
      name: 'Beef Chow Mein (GF,DF)',
      category: 'Dinner',
      ingredients: [
        { id: 'ing-33', name: 'Extra Lean Beef Strips (Weighed Raw)', qty: '150', unit: 'g' },
        { id: 'ing-34', name: 'Light Soy Sauce - Ayam', qty: '10', unit: 'g' },
        { id: 'ing-35', name: 'San Choy Bow Meal Kit (97g) - Marion\'s Kitchen', qty: '0.5', unit: 'kit' },
        { id: 'ing-36', name: 'Stir Fry Vegetables (generic)', qty: '175', unit: 'g' },
        { id: 'ing-37', name: 'Vermicelli Rice Noodle - Chang\'s', qty: '60', unit: 'g' },
      ],
      macros: { calories: 565, protein: 47, fats: 8, carbs: 71 },
      instructions: '1. Cook the vermicelli noodles according to package directions, drain and set aside. 2. Heat a wok or large pan over medium-high heat. Stir-fry beef strips until cooked through. 3. Add stir fry vegetables and cook until tender-crisp. 4. Add cooked noodles, San Choy Bow sauce, and soy sauce. Toss everything together until well combined. 5. Serve hot.',
      notes: 'Gluten-free and dairy-free friendly. High protein, low fat option.',
    },
  ];
  
  requiredRecipes.forEach(recipe => {
    if (!recipeDatabase.getRecipeByName(recipe.name)) {
      recipeDatabase.addRecipe(recipe);
      console.log(`✅ Added ${recipe.name} to recipe database`);
    }
  });
}
