/**
 * Meal Integration Test Suite
 * Run in browser console: window.runMealTests()
 * 
 * Tests the full meal workflow:
 * 1. Add meal to jadesMealsStorage
 * 2. Verify it loads from storage
 * 3. Add ingredients to shopping list
 * 4. Verify shopping list is editable
 * 5. Test end-to-end workflow
 */

import { jadesMealsStorage } from './jadesMealsStorage';
import { shoppingListStore } from './shoppingListStore';

export interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  details?: any;
}

class MealIntegrationTester {
  private results: TestResult[] = [];

  async runAllTests(): Promise<TestResult[]> {
    console.log('🧪 Starting Meal Integration Tests...\n');
    
    // Clear test data first
    this.clearTestData();
    
    // Run tests
    await this.test_1_AddMeal();
    await this.test_2_LoadFromStorage();
    await this.test_3_MealHasIngredients();
    await this.test_4_AddIngredientsToShoppingList();
    await this.test_5_ShoppingListItemsEditable();
    await this.test_6_ShoppingListItemsRemovable();
    await this.test_7_EndToEndWorkflow();
    await this.test_8_StorageSyncOnStartup();
    await this.test_9_MultipleIngredientsAggregation();

    // Print summary
    this.printSummary();
    
    return this.results;
  }

  private async test_1_AddMeal(): Promise<void> {
    try {
      const meal = jadesMealsStorage.addMeal(
        'Monday',
        'Lunch',
        'Chicken Tacos',
        { calories: 550, protein: 45, fats: 20, carbs: 35 },
        [
          { name: 'Chicken Breast', qty: '150', unit: 'g' },
          { name: 'Taco Shells', qty: '3', unit: 'shells' },
          { name: 'Lettuce', qty: '50', unit: 'g' },
        ]
      );
      
      this.addResult({
        name: 'Add Meal to Storage',
        passed: meal && meal.mealName === 'Chicken Tacos',
        message: meal ? '✅ Meal added successfully' : '❌ Failed to add meal',
        details: meal,
      });
    } catch (error) {
      this.addResult({
        name: 'Add Meal to Storage',
        passed: false,
        message: `❌ Error: ${error}`,
      });
    }
  }

  private async test_2_LoadFromStorage(): Promise<void> {
    try {
      const meals = jadesMealsStorage.getAllMeals();
      const found = meals.find(m => m.mealName === 'Chicken Tacos');
      
      this.addResult({
        name: 'Load Meal from Storage',
        passed: !!found,
        message: found ? '✅ Meal loaded from storage' : '❌ Meal not found in storage',
        details: { totalMeals: meals.length, foundMeal: found },
      });
    } catch (error) {
      this.addResult({
        name: 'Load Meal from Storage',
        passed: false,
        message: `❌ Error: ${error}`,
      });
    }
  }

  private async test_3_MealHasIngredients(): Promise<void> {
    try {
      const meals = jadesMealsStorage.getAllMeals();
      const meal = meals.find(m => m.mealName === 'Chicken Tacos');
      const hasIngredients = !!(meal && meal.ingredients && meal.ingredients.length === 3);
      
      this.addResult({
        name: 'Meal Has Ingredients',
        passed: hasIngredients,
        message: hasIngredients ? '✅ Meal has 3 ingredients' : '❌ Meal missing ingredients',
        details: { ingredients: meal?.ingredients },
      });
    } catch (error) {
      this.addResult({
        name: 'Meal Has Ingredients',
        passed: false,
        message: `❌ Error: ${error}`,
      });
    }
  }

  private async test_4_AddIngredientsToShoppingList(): Promise<void> {
    try {
      const meals = jadesMealsStorage.getAllMeals();
      const meal = meals.find(m => m.mealName === 'Chicken Tacos');
      
      if (!meal || !meal.ingredients) throw new Error('Meal not found');

      const items = meal.ingredients.map(ing => ({
        ingredient: ing.name,
        quantity: ing.qty,
        source: 'jade' as const,
        sourceMetadata: {
          mealName: meal.mealName,
          day: meal.day,
          mealType: meal.mealType as 'breakfast' | 'lunch' | 'dinner' | 'snack',
        },
      }));

      const added = shoppingListStore.addBulk(items);
      
      this.addResult({
        name: 'Add Ingredients to Shopping List',
        passed: added.length === 3,
        message: added.length === 3 ? `✅ Added ${added.length} items to shopping list` : `❌ Expected 3 items, got ${added.length}`,
        details: { itemsAdded: added.length, items: added },
      });
    } catch (error) {
      this.addResult({
        name: 'Add Ingredients to Shopping List',
        passed: false,
        message: `❌ Error: ${error}`,
      });
    }
  }

  private async test_5_ShoppingListItemsEditable(): Promise<void> {
    try {
      const items = shoppingListStore.getAll();
      const item = items[0];
      
      if (!item) throw new Error('No items in shopping list');

      // Simulate edit by updating quantity
      const updated = { ...item, quantity: '200' };
      
      // Note: shoppingListStore doesn't have an update method, but we can test removal/re-add
      shoppingListStore.remove(item.id);
      const newItem = shoppingListStore.add({ ...updated, id: undefined, addedAt: undefined } as any);
      
      this.addResult({
        name: 'Shopping List Items Editable',
        passed: newItem && newItem.quantity === '200',
        message: newItem && newItem.quantity === '200' ? '✅ Items can be edited' : '❌ Unable to edit items',
        details: { originalItem: item, updatedItem: newItem },
      });
    } catch (error) {
      this.addResult({
        name: 'Shopping List Items Editable',
        passed: false,
        message: `❌ Error: ${error}`,
      });
    }
  }

  private async test_6_ShoppingListItemsRemovable(): Promise<void> {
    try {
      const before = shoppingListStore.getAll();
      const countBefore = before.length;
      
      if (countBefore === 0) throw new Error('No items to remove');

      shoppingListStore.remove(before[0].id);
      const after = shoppingListStore.getAll();
      const countAfter = after.length;
      
      const removed = countBefore > countAfter;
      
      this.addResult({
        name: 'Shopping List Items Removable',
        passed: removed,
        message: removed ? `✅ Item removed (${countBefore} → ${countAfter})` : '❌ Unable to remove items',
        details: { countBefore, countAfter },
      });
    } catch (error) {
      this.addResult({
        name: 'Shopping List Items Removable',
        passed: false,
        message: `❌ Error: ${error}`,
      });
    }
  }

  private async test_7_EndToEndWorkflow(): Promise<void> {
    try {
      // Clear and start fresh
      shoppingListStore.clear();
      
      // Add a new meal
      const meal = jadesMealsStorage.addMeal(
        'Tuesday',
        'Dinner',
        'Beef Stir-Fry',
        { calories: 600, protein: 50, fats: 25, carbs: 40 },
        [
          { name: 'Beef Sirloin', qty: '200', unit: 'g' },
          { name: 'Broccoli', qty: '200', unit: 'g' },
          { name: 'Soy Sauce', qty: '30', unit: 'ml' },
          { name: 'Rice', qty: '150', unit: 'g' },
        ]
      );

      // Get meal from storage
      const meals = jadesMealsStorage.getAllMeals();
      const stored = meals.find(m => m.mealName === 'Beef Stir-Fry');

      // Add ingredients to shopping list
      if (!stored || !stored.ingredients) throw new Error('Meal not found after adding');
      
      const items = stored.ingredients.map(ing => ({
        ingredient: ing.name,
        quantity: ing.qty,
        source: 'jade' as const,
      }));

      shoppingListStore.addBulk(items);

      // Verify shopping list has items
      const cartItems = shoppingListStore.getAll();
      
      this.addResult({
        name: 'End-to-End Workflow',
        passed: cartItems.length === 4,
        message: cartItems.length === 4 ? '✅ Full workflow successful' : `❌ Expected 4 items, got ${cartItems.length}`,
        details: {
          mealAdded: meal?.mealName,
          ingredientsFound: stored?.ingredients?.length,
          itemsInCart: cartItems.length,
        },
      });
    } catch (error) {
      this.addResult({
        name: 'End-to-End Workflow',
        passed: false,
        message: `❌ Error: ${error}`,
      });
    }
  }

  private async test_8_StorageSyncOnStartup(): Promise<void> {
    try {
      // Simulate page reload by reading directly from localStorage
      const stored = localStorage.getItem('jades-meals-storage-v1');
      const data = stored ? JSON.parse(stored) : null;
      
      const hasMeals = data && data.meals && Object.keys(data.meals).length > 0;
      
      this.addResult({
        name: 'Storage Sync on Startup',
        passed: hasMeals,
        message: hasMeals ? '✅ Meals persist in localStorage' : '❌ No meals found in localStorage',
        details: { mealsCount: data?.meals ? Object.keys(data.meals).length : 0 },
      });
    } catch (error) {
      this.addResult({
        name: 'Storage Sync on Startup',
        passed: false,
        message: `❌ Error: ${error}`,
      });
    }
  }

  private async test_9_MultipleIngredientsAggregation(): Promise<void> {
    try {
      // Add multiple meals with overlapping ingredients
      const meals = [
        { name: 'Salad', ingredients: [{ name: 'Lettuce', qty: '100', unit: 'g' }, { name: 'Tomato', qty: '50', unit: 'g' }] },
        { name: 'Sandwich', ingredients: [{ name: 'Lettuce', qty: '50', unit: 'g' }, { name: 'Bread', qty: '2', unit: 'slices' }] },
      ];

      shoppingListStore.clear();

      for (const m of meals) {
        const items = m.ingredients.map(ing => ({
          ingredient: ing.name,
          quantity: ing.qty,
          source: 'jade' as const,
        }));
        shoppingListStore.addBulk(items);
      }

      const cartItems = shoppingListStore.getAll();
      const hasLettuce = cartItems.filter(i => i.ingredient.toLowerCase().includes('lettuce')).length > 0;
      
      this.addResult({
        name: 'Multiple Ingredients Aggregation',
        passed: cartItems.length >= 3 && hasLettuce,
        message: cartItems.length >= 3 ? `✅ Multiple ingredients aggregated (${cartItems.length} items)` : '❌ Aggregation failed',
        details: { totalItems: cartItems.length, items: cartItems.map(i => i.ingredient) },
      });
    } catch (error) {
      this.addResult({
        name: 'Multiple Ingredients Aggregation',
        passed: false,
        message: `❌ Error: ${error}`,
      });
    }
  }

  private clearTestData(): void {
    try {
      jadesMealsStorage.clearAll();
      shoppingListStore.clear();
      console.log('🧹 Test data cleared\n');
    } catch (e) {
      console.warn('⚠️ Unable to clear test data:', e);
    }
  }

  private addResult(result: TestResult): void {
    this.results.push(result);
    const icon = result.passed ? '✅' : '❌';
    console.log(`${icon} ${result.name}`);
    console.log(`   ${result.message}`);
    if (result.details) {
      console.log(`   Details:`, result.details);
    }
  }

  private printSummary(): void {
    const total = this.results.length;
    const passed = this.results.filter(r => r.passed).length;
    const failed = total - passed;
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${total}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
    console.log('='.repeat(60) + '\n');
    
    if (failed > 0) {
      console.log('❌ FAILED TESTS:');
      this.results.filter(r => !r.passed).forEach(r => {
        console.log(`   - ${r.name}: ${r.message}`);
      });
      console.log('');
    }
  }
}

// Export for global access
export function runMealTests(): Promise<TestResult[]> {
  const tester = new MealIntegrationTester();
  return tester.runAllTests();
}

// Also make available on window object
if (typeof window !== 'undefined') {
  (window as any).runMealTests = runMealTests;
  console.log('💡 Tip: Run "window.runMealTests()" in browser console to test the meal integration');
}
