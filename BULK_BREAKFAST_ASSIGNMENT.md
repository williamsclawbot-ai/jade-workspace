# Bulk Breakfast Assignment

## Quick Assign: Cacao Pistachio Yogurt Bowl to All Days

### Option 1: Automatic (Console Script)

1. **Open the app** → https://jade-workspace.vercel.app
2. **Open Developer Tools** → Press `F12` (or `Cmd+Option+I` on Mac)
3. **Click the "Console" tab**
4. **Paste this script** and press Enter:

```javascript
(function() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const recipeName = 'Cacao Pistachio Yogurt Bowl';
  
  // Get current week from localStorage
  const plans = JSON.parse(localStorage.getItem('weekly-meal-plans-v1') || '{}');
  
  if (Object.keys(plans).length === 0) {
    console.log('❌ No meal plans found. Make sure you\'re on the Jade\'s Meals tab first!');
    return;
  }
  
  // Get the first (current) week
  const weekId = Object.keys(plans)[0];
  const plan = plans[weekId];
  
  if (!plan) {
    console.log('❌ Could not find current week');
    return;
  }
  
  console.log('📝 Assigning Cacao Pistachio Yogurt Bowl to:', days);
  
  // Assign recipe to all days
  days.forEach(day => {
    if (!plan.jades.meals) plan.jades.meals = {};
    if (!plan.jades.meals[day]) plan.jades.meals[day] = {};
    plan.jades.meals[day].breakfast = recipeName;
  });
  
  // Save back to localStorage
  localStorage.setItem('weekly-meal-plans-v1', JSON.stringify(plans));
  
  // Trigger storage event to sync UI
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'weekly-meal-plans-v1',
    newValue: JSON.stringify(plans),
  }));
  
  console.log('✅ Success! Cacao Pistachio Yogurt Bowl assigned to all 7 breakfasts');
  console.log('💡 Tip: Refresh the page or click another tab to see the changes immediately');
})();
```

5. **Check the console** → You should see ✅ Success message
6. **Refresh the page** (Cmd+R or Ctrl+R) to see all breakfasts populated
7. **Check shopping list** → All ingredients auto-populate!

### Option 2: Manual (Click each day)

If you prefer clicking:
1. For each day (Monday-Sunday)
2. Click the **Breakfast** cell
3. Search "Cacao Pistachio"
4. Select it
5. Repeat for all 7 days (takes ~30 seconds)

---

## What Happens After

✅ **All 7 breakfast slots filled** with Cacao Pistachio Yogurt Bowl
✅ **Shopping list auto-updates** with all ingredients:
- Cacao Nibs (5g × 7 days = 35g)
- Frozen Raspberries (40g × 7 days = 280g)
- Honey (8g × 7 days = 56g)
- YoPro Yogurt (150g × 7 days = 1050g)
- Pistachios (10g × 7 days = 70g)

✅ **Daily macros calculated** (218 cal × 7 = 1,526 cal for all breakfasts)

---

## Troubleshooting

**Console script didn't work?**
- Make sure you're on the "Jade's Meals" tab first
- Make sure you've opened the meal planner at least once (to initialize data)
- Try refreshing the page and running again

**Changes not showing?**
- Refresh the page (Cmd+R or Ctrl+R)
- Or click back to the Dashboard and back to Meal Planning tab

**Need to undo?**
- Manually delete each breakfast, or
- Run a similar script to assign a different recipe

---

*Last updated: Feb 20, 2026*
