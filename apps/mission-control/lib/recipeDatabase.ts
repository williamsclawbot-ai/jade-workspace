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
      {
        name: 'Asian Chicken Tacos (GF & DF)',
        category: 'Dinner',
        ingredients: [
          { id: 'ing-38', name: 'Carrot', qty: '60', unit: 'g' },
          { id: 'ing-39', name: 'Chicken Breast (Weighed Raw)', qty: '150', unit: 'g' },
          { id: 'ing-40', name: 'Fried Shallots - Doree', qty: '5', unit: 'g' },
          { id: 'ing-41', name: 'Honey', qty: '10', unit: 'g' },
          { id: 'ing-42', name: 'Lettuce', qty: '40', unit: 'g' },
          { id: 'ing-43', name: 'Light Soy Sauce - Ayam', qty: '20', unit: 'g' },
          { id: 'ing-44', name: 'Minced Garlic - Woolworths', qty: '10', unit: 'g' },
          { id: 'ing-45', name: 'Onion', qty: '20', unit: 'g' },
          { id: 'ing-46', name: 'Taco Shell (13g) - Old El Paso', qty: '3', unit: 'shells' },
          { id: 'ing-47', name: 'Vegan Aioli - Praise', qty: '15', unit: 'g' },
        ],
        macros: { calories: 531, protein: 38, fats: 19, carbs: 42 },
        instructions: '1. Heat a large pan over medium-high heat. 2. Stir-fry chicken with minced garlic and onion until cooked through. 3. Add carrot and cook until tender-crisp. 4. Season with honey and soy sauce. 5. Warm taco shells and assemble with lettuce, chicken mixture, fried shallots, and vegan aioli. 6. Serve with lemon wedge.',
        notes: 'Gluten-free and dairy-free friendly. Vegan aioli version.',
      },
      {
        name: 'One Container Pesto Chicken Bake',
        category: 'Dinner',
        ingredients: [
          { id: 'ing-48', name: '50% Less Fat Cheese Shredded - Bega/Woolworths/Coles', qty: '25', unit: 'g' },
          { id: 'ing-49', name: 'Basil Pecorino & Pine Nuts Pesto - Providore', qty: '20', unit: 'g' },
          { id: 'ing-50', name: 'Chicken Breast (Weighed Raw)', qty: '100', unit: 'g' },
          { id: 'ing-51', name: 'Chicken Stock (Generic)', qty: '60', unit: 'ml' },
          { id: 'ing-52', name: 'Fresh Garlic', qty: '5', unit: 'g' },
          { id: 'ing-53', name: 'Light Plain Greek Yogurt - Chobani', qty: '30', unit: 'g' },
          { id: 'ing-54', name: 'Mushroom', qty: '50', unit: 'g' },
          { id: 'ing-55', name: 'Rice Raw (Any)', qty: '40', unit: 'g' },
          { id: 'ing-56', name: 'Tomato', qty: '50', unit: 'g' },
        ],
        macros: { calories: 456, protein: 38, fats: 16, carbs: 40 },
        instructions: '1. Preheat oven to 180 degrees celsius. 2. In a baking container, combine rice, chicken stock, and diced vegetables (mushroom, tomato, garlic). 3. Season chicken breast and place on top of rice mixture. 4. Mix pesto with Greek yogurt and spread over chicken. 5. Top with shredded cheese. 6. Bake covered for 25-30 minutes until chicken is cooked through and rice is tender. 7. Serve directly from the container.',
        notes: 'One-container meal. Easy preparation and cleanup.',
      },
      {
        name: 'Cacao Pistachio Yogurt Bowl',
        category: 'Breakfast',
        ingredients: [
          { id: 'ing-57', name: 'Cacao Nibs (Generic)', qty: '5', unit: 'g' },
          { id: 'ing-58', name: 'Frozen Raspberries', qty: '40', unit: 'g' },
          { id: 'ing-59', name: 'Honey', qty: '8', unit: 'g' },
          { id: 'ing-60', name: 'Salted Caramel High Protein Yoghurt - YoPro', qty: '150', unit: 'g' },
          { id: 'ing-61', name: 'Pistachios - Woolworths', qty: '10', unit: 'g' },
        ],
        macros: { calories: 218, protein: 21, fats: 9, carbs: 20 },
        instructions: '1. Add YoPro yoghurt to a bowl. 2. Top with frozen raspberries, cacao nibs, and pistachios. 3. Drizzle with honey. 4. Stir together and enjoy immediately, or let sit for 2-3 minutes for a softer texture.',
        notes: 'Quick, high-protein breakfast bowl. Great for busy mornings.',
      },
      {
        name: 'Skim Milk & Popcorn Snack',
        category: 'Snack',
        ingredients: [
          { id: 'ing-62', name: 'Skim Milk', qty: '350', unit: 'ml' },
          { id: 'ing-63', name: 'Popcorn (Lightly Salted & Slightly Sweet) - Cobs', qty: '14', unit: 'g' },
        ],
        macros: { calories: 197, protein: 15, fats: 3, carbs: 27 },
        instructions: '1. Pour 350ml of skim milk into a glass. 2. Serve with 14g of Cobs popcorn on the side. 3. Enjoy together as a light, crunchy snack.',
        notes: 'Perfect afternoon snack. High protein, satisfying combo of milk and popcorn.',
      },
      {
        name: 'Caramello Koala - Cadbury',
        category: 'Dessert',
        ingredients: [
          { id: 'ing-64', name: 'Caramello Koala - Cadbury (15g)', qty: '1', unit: 'whole' },
        ],
        macros: { calories: 75, protein: 1, fats: 3, carbs: 11 },
        instructions: '1. Unwrap the Caramello Koala chocolate. 2. Enjoy as is or break into pieces. 3. Perfect after-meal treat.',
        notes: 'Single chocolate treat. Sweet dessert fix.',
      },
      {
        name: 'Chocolate Carrot Muffins (Toddlers & Beyond)',
        category: 'Breakfast',
        ingredients: [
          { id: 'ing-65', name: 'Sunflower seeds', qty: '60', unit: 'g' },
          { id: 'ing-66', name: 'Carrots (peeled, cut into pieces)', qty: '200', unit: 'g' },
          { id: 'ing-67', name: 'Pitted Medjool dates', qty: '100', unit: 'g' },
          { id: 'ing-68', name: 'Eggs', qty: '2', unit: 'whole' },
          { id: 'ing-69', name: 'Milk (of choice)', qty: '60', unit: 'g' },
          { id: 'ing-70', name: 'Raw sugar', qty: '2', unit: 'tbsp' },
          { id: 'ing-71', name: 'Extra virgin olive oil', qty: '120', unit: 'g' },
          { id: 'ing-72', name: 'Wholemeal spelt flour', qty: '170', unit: 'g' },
          { id: 'ing-73', name: 'Raw cacao powder', qty: '20', unit: 'g' },
          { id: 'ing-74', name: 'Baking powder', qty: '2', unit: 'tsp' },
          { id: 'ing-75', name: 'Dark chocolate chips', qty: '70', unit: 'g' },
        ],
        macros: { calories: 213, protein: 4, fats: 16, carbs: 13 },
        instructions: '1. Preheat oven to 180°C. 2. Pulse sunflower seeds, carrots, and dates in food processor until roughly chopped. 3. Mix in eggs, milk, sugar, and olive oil. 4. In a separate bowl, combine wholemeal spelt flour, cacao powder, and baking powder. 5. Fold wet ingredients into dry ingredients until just combined. 6. Stir in dark chocolate chips. 7. Divide batter into muffin cups and bake 20-25 minutes until a skewer comes out clean. 8. Cool in tin for 5 minutes, then transfer to wire rack.',
        notes: 'Healthy muffins made with wholemeal spelt flour, dates for natural sweetness, and carrots. Great for toddlers and the whole family. Recipe from Cookidoo®.',
      },
      {
        name: 'ABC Muffins',
        category: 'Breakfast',
        ingredients: [
          { id: 'ing-76', name: 'Carrot (cut into pieces)', qty: '120', unit: 'g' },
          { id: 'ing-77', name: 'Gala apple (cored, cut into pieces)', qty: '150', unit: 'g' },
          { id: 'ing-78', name: 'Ripe banana (cut into pieces)', qty: '120', unit: 'g' },
          { id: 'ing-79', name: 'Self-raising flour', qty: '170', unit: 'g' },
          { id: 'ing-80', name: 'Rolled oats', qty: '50', unit: 'g' },
          { id: 'ing-81', name: 'Eggs', qty: '2', unit: 'whole' },
          { id: 'ing-82', name: 'Pure maple syrup', qty: '100', unit: 'g' },
          { id: 'ing-83', name: 'Greek-style natural yoghurt', qty: '100', unit: 'g' },
          { id: 'ing-84', name: 'Extra virgin olive oil', qty: '50', unit: 'g' },
          { id: 'ing-85', name: 'Natural vanilla extract', qty: '1', unit: 'tsp' },
          { id: 'ing-86', name: 'Granola (or muesli of choice, nut-free)', qty: '100', unit: 'g' },
        ],
        macros: { calories: 204, protein: 5, fats: 10, carbs: 28 },
        instructions: '1. Preheat oven to 180°C and line a muffin tin with paper cases. 2. In a food processor, blend carrot, apple, and banana until roughly chopped. 3. In a large bowl, combine self-raising flour and rolled oats. 4. In another bowl, whisk together eggs, maple syrup, yoghurt, olive oil, and vanilla extract. 5. Fold the fruit mixture into the wet ingredients. 6. Gently fold in the flour and oats until just combined. 7. Divide batter into muffin cases. 8. Top with granola. 9. Bake for 20-25 minutes until golden and a skewer comes out clean. 10. Cool in tin for 5 minutes, then transfer to wire rack.',
        notes: 'ABC Muffins = Apple, Banana, Carrot! Perfect toddler-friendly breakfast. Make-ahead friendly, store in airtight container up to 4 days.',
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
    {
      name: 'Asian Chicken Tacos (GF & DF)',
      category: 'Dinner',
      ingredients: [
        { id: 'ing-38', name: 'Carrot', qty: '60', unit: 'g' },
        { id: 'ing-39', name: 'Chicken Breast (Weighed Raw)', qty: '150', unit: 'g' },
        { id: 'ing-40', name: 'Fried Shallots - Doree', qty: '5', unit: 'g' },
        { id: 'ing-41', name: 'Honey', qty: '10', unit: 'g' },
        { id: 'ing-42', name: 'Lettuce', qty: '40', unit: 'g' },
        { id: 'ing-43', name: 'Light Soy Sauce - Ayam', qty: '20', unit: 'g' },
        { id: 'ing-44', name: 'Minced Garlic - Woolworths', qty: '10', unit: 'g' },
        { id: 'ing-45', name: 'Onion', qty: '20', unit: 'g' },
        { id: 'ing-46', name: 'Taco Shell (13g) - Old El Paso', qty: '3', unit: 'shells' },
        { id: 'ing-47', name: 'Vegan Aioli - Praise', qty: '15', unit: 'g' },
      ],
      macros: { calories: 531, protein: 38, fats: 19, carbs: 42 },
      instructions: '1. Heat a large pan over medium-high heat. 2. Stir-fry chicken with minced garlic and onion until cooked through. 3. Add carrot and cook until tender-crisp. 4. Season with honey and soy sauce. 5. Warm taco shells and assemble with lettuce, chicken mixture, fried shallots, and vegan aioli. 6. Serve with lemon wedge.',
      notes: 'Gluten-free and dairy-free friendly. Vegan aioli version.',
    },
    {
      name: 'One Container Pesto Chicken Bake',
      category: 'Dinner',
      ingredients: [
        { id: 'ing-48', name: '50% Less Fat Cheese Shredded - Bega/Woolworths/Coles', qty: '25', unit: 'g' },
        { id: 'ing-49', name: 'Basil Pecorino & Pine Nuts Pesto - Providore', qty: '20', unit: 'g' },
        { id: 'ing-50', name: 'Chicken Breast (Weighed Raw)', qty: '100', unit: 'g' },
        { id: 'ing-51', name: 'Chicken Stock (Generic)', qty: '60', unit: 'ml' },
        { id: 'ing-52', name: 'Fresh Garlic', qty: '5', unit: 'g' },
        { id: 'ing-53', name: 'Light Plain Greek Yogurt - Chobani', qty: '30', unit: 'g' },
        { id: 'ing-54', name: 'Mushroom', qty: '50', unit: 'g' },
        { id: 'ing-55', name: 'Rice Raw (Any)', qty: '40', unit: 'g' },
        { id: 'ing-56', name: 'Tomato', qty: '50', unit: 'g' },
      ],
      macros: { calories: 456, protein: 38, fats: 16, carbs: 40 },
      instructions: '1. Preheat oven to 180 degrees celsius. 2. In a baking container, combine rice, chicken stock, and diced vegetables (mushroom, tomato, garlic). 3. Season chicken breast and place on top of rice mixture. 4. Mix pesto with Greek yogurt and spread over chicken. 5. Top with shredded cheese. 6. Bake covered for 25-30 minutes until chicken is cooked through and rice is tender. 7. Serve directly from the container.',
      notes: 'One-container meal. Easy preparation and cleanup.',
    },
    {
      name: 'Cacao Pistachio Yogurt Bowl',
      category: 'Breakfast',
      ingredients: [
        { id: 'ing-57', name: 'Cacao Nibs (Generic)', qty: '5', unit: 'g' },
        { id: 'ing-58', name: 'Frozen Raspberries', qty: '40', unit: 'g' },
        { id: 'ing-59', name: 'Honey', qty: '8', unit: 'g' },
        { id: 'ing-60', name: 'Salted Caramel High Protein Yoghurt - YoPro', qty: '150', unit: 'g' },
        { id: 'ing-61', name: 'Pistachios - Woolworths', qty: '10', unit: 'g' },
      ],
      macros: { calories: 218, protein: 21, fats: 9, carbs: 20 },
      instructions: '1. Add YoPro yoghurt to a bowl. 2. Top with frozen raspberries, cacao nibs, and pistachios. 3. Drizzle with honey. 4. Stir together and enjoy immediately, or let sit for 2-3 minutes for a softer texture.',
      notes: 'Quick, high-protein breakfast bowl. Great for busy mornings.',
    },
    {
      name: 'Skim Milk & Popcorn Snack',
      category: 'Snack',
      ingredients: [
        { id: 'ing-62', name: 'Skim Milk', qty: '350', unit: 'ml' },
        { id: 'ing-63', name: 'Popcorn (Lightly Salted & Slightly Sweet) - Cobs', qty: '14', unit: 'g' },
      ],
      macros: { calories: 197, protein: 15, fats: 3, carbs: 27 },
      instructions: '1. Pour 350ml of skim milk into a glass. 2. Serve with 14g of Cobs popcorn on the side. 3. Enjoy together as a light, crunchy snack.',
      notes: 'Perfect afternoon snack. High protein, satisfying combo of milk and popcorn.',
    },
    {
      name: 'Caramello Koala - Cadbury',
      category: 'Dessert',
      ingredients: [
        { id: 'ing-64', name: 'Caramello Koala - Cadbury (15g)', qty: '1', unit: 'whole' },
      ],
      macros: { calories: 75, protein: 1, fats: 3, carbs: 11 },
      instructions: '1. Unwrap the Caramello Koala chocolate. 2. Enjoy as is or break into pieces. 3. Perfect after-meal treat.',
      notes: 'Single chocolate treat. Sweet dessert fix.',
    },
    {
      name: 'Chocolate Carrot Muffins (Toddlers & Beyond)',
      category: 'Breakfast',
      ingredients: [
        { id: 'ing-65', name: 'Sunflower seeds', qty: '60', unit: 'g' },
        { id: 'ing-66', name: 'Carrots (peeled, cut into pieces)', qty: '200', unit: 'g' },
        { id: 'ing-67', name: 'Pitted Medjool dates', qty: '100', unit: 'g' },
        { id: 'ing-68', name: 'Eggs', qty: '2', unit: 'whole' },
        { id: 'ing-69', name: 'Milk (of choice)', qty: '60', unit: 'g' },
        { id: 'ing-70', name: 'Raw sugar', qty: '2', unit: 'tbsp' },
        { id: 'ing-71', name: 'Extra virgin olive oil', qty: '120', unit: 'g' },
        { id: 'ing-72', name: 'Wholemeal spelt flour', qty: '170', unit: 'g' },
        { id: 'ing-73', name: 'Raw cacao powder', qty: '20', unit: 'g' },
        { id: 'ing-74', name: 'Baking powder', qty: '2', unit: 'tsp' },
        { id: 'ing-75', name: 'Dark chocolate chips', qty: '70', unit: 'g' },
      ],
      macros: { calories: 213, protein: 4, fats: 16, carbs: 13 },
      instructions: '1. Preheat oven to 180°C. 2. Pulse sunflower seeds, carrots, and dates in food processor until roughly chopped. 3. Mix in eggs, milk, sugar, and olive oil. 4. In a separate bowl, combine wholemeal spelt flour, cacao powder, and baking powder. 5. Fold wet ingredients into dry ingredients until just combined. 6. Stir in dark chocolate chips. 7. Divide batter into muffin cups and bake 20-25 minutes until a skewer comes out clean. 8. Cool in tin for 5 minutes, then transfer to wire rack.',
      notes: 'Healthy muffins made with wholemeal spelt flour, dates for natural sweetness, and carrots. Great for toddlers and the whole family. Recipe from Cookidoo®.',
    },
    {
      name: 'ABC Muffins',
      category: 'Breakfast',
      ingredients: [
        { id: 'ing-76', name: 'Carrot (cut into pieces)', qty: '120', unit: 'g' },
        { id: 'ing-77', name: 'Gala apple (cored, cut into pieces)', qty: '150', unit: 'g' },
        { id: 'ing-78', name: 'Ripe banana (cut into pieces)', qty: '120', unit: 'g' },
        { id: 'ing-79', name: 'Self-raising flour', qty: '170', unit: 'g' },
        { id: 'ing-80', name: 'Rolled oats', qty: '50', unit: 'g' },
        { id: 'ing-81', name: 'Eggs', qty: '2', unit: 'whole' },
        { id: 'ing-82', name: 'Pure maple syrup', qty: '100', unit: 'g' },
        { id: 'ing-83', name: 'Greek-style natural yoghurt', qty: '100', unit: 'g' },
        { id: 'ing-84', name: 'Extra virgin olive oil', qty: '50', unit: 'g' },
        { id: 'ing-85', name: 'Natural vanilla extract', qty: '1', unit: 'tsp' },
        { id: 'ing-86', name: 'Granola (or muesli of choice, nut-free)', qty: '100', unit: 'g' },
      ],
      macros: { calories: 204, protein: 5, fats: 10, carbs: 28 },
      instructions: '1. Preheat oven to 180°C and line a muffin tin with paper cases. 2. In a food processor, blend carrot, apple, and banana until roughly chopped. 3. In a large bowl, combine self-raising flour and rolled oats. 4. In another bowl, whisk together eggs, maple syrup, yoghurt, olive oil, and vanilla extract. 5. Fold the fruit mixture into the wet ingredients. 6. Gently fold in the flour and oats until just combined. 7. Divide batter into muffin cases. 8. Top with granola. 9. Bake for 20-25 minutes until golden and a skewer comes out clean. 10. Cool in tin for 5 minutes, then transfer to wire rack.',
      notes: 'ABC Muffins = Apple, Banana, Carrot! Perfect toddler-friendly breakfast. Make-ahead friendly, store in airtight container up to 4 days.',
    },
  ];
  
  requiredRecipes.forEach(recipe => {
    if (!recipeDatabase.getRecipeByName(recipe.name)) {
      recipeDatabase.addRecipe(recipe);
      console.log(`✅ Added ${recipe.name} to recipe database`);
    }
  });
}
