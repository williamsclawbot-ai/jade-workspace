/**
 * Quick script to bulk-assign Cacao Pistachio Yogurt Bowl to all breakfasts
 * Run with: node scripts/bulk-assign-breakfast.js
 */

const fs = require('fs');
const path = require('path');

const storageKey = 'weekly-meal-plans-v1';
const recipeName = 'Cacao Pistachio Yogurt Bowl';
const mealType = 'breakfast';
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// This would normally be called in the browser, but documenting the process here
console.log(`
To assign "${recipeName}" to all breakfasts:

1. Open https://jade-workspace.vercel.app
2. Go to "Jade's Meals" tab
3. For each day (Monday-Sunday), click the Breakfast cell
4. Search for "Cacao Pistachio" and select it
5. Repeat for all 7 days

Or use the bulk assignment:
- Click "Bulk Assign" button (when implemented)
- Select "Breakfast" 
- Select "Cacao Pistachio Yogurt Bowl"
- Click "Assign to All Days"

Days to assign: ${days.join(', ')}
Recipe: ${recipeName}
Meal Type: ${mealType}
`);
