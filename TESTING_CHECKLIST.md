# Meal Planning Features - Testing Checklist for Jade

**Welcome back! All requested features are already built and working.** 🎉

This checklist will help you verify everything works as expected.

---

## ✅ Feature 1: Recipe Paste-and-Parse System

**How to Test:**
1. Go to **Jade's Meals** tab
2. Click **"Add Recipe"** button (green, top right)
3. In the modal:
   - **Step 1: Paste** — Paste this test recipe:
     ```
     2 cups flour
     1.5 tbsp olive oil
     100g chicken breast
     1/2 cup milk
     2 eggs
     Salt to taste
     ```
   - Click **"Parse Ingredients"**
   - **Step 2: Review** — Verify parsed ingredients:
     - Flour → qty: 2, unit: cups ✅
     - Olive oil → qty: 1.5, unit: tbsp ✅
     - Chicken → qty: 100, unit: g ✅
     - Milk → qty: 1/2, unit: cup ✅ (handles fractions!)
     - Eggs → qty: 2, no unit ✅
     - Salt → flagged as unparsed (you can edit) ✅
   - Edit any ingredient if needed
   - Click **"Continue to Macros"**
   - **Step 3: Macros** — Enter:
     - Calories: 450
     - Protein: 35
     - Fats: 15
     - Carbs: 40
   - Give recipe a name: "Test Recipe"
   - Category: Lunch
   - Click **"Save Recipe"**
   - **Step 4: Assign** — Select a day and meal slot to assign
   - Click **"Assign Now"** or **"Skip for now"**

**Expected Result:**
- ✅ Recipe appears in Jade's meals for selected day
- ✅ Recipe appears in Recipe Browser
- ✅ Ingredients parse correctly (including fractions!)
- ✅ Can edit parsed ingredients before saving

---

## ✅ Feature 2: Staples Auto-Restock System

**How to Test:**
1. Go to **Shopping List** tab
2. Scroll to **"Staples Auto-Restock"** section (bottom)
3. Click **"Add Staple"**
4. Add a test staple:
   - Item: Milk
   - Qty: 2
   - Unit: L
   - Frequency: **Weekly** (green button)
   - Click **"Add Staple"**
5. Add another staple:
   - Item: Rice
   - Qty: 1
   - Unit: kg
   - Frequency: **Monthly** (purple button)
   - Click **"Add Staple"**
6. Now go back to **Jade's Meals** or **Harvey's Meals**
7. Assign at least one meal to a day
8. Go back to **Shopping List** tab
9. Look at the shopping list items

**Expected Result:**
- ✅ Milk (weekly staple) automatically appears in shopping list
- ✅ Rice (monthly staple) appears IF today is first Monday of month (1st-7th)
- ✅ Staples show frequency badge (green = weekly, purple = monthly)
- ✅ "Last added" timestamp updates when staple is added to list
- ✅ Staples persist after page reload

**Frequency Logic:**
- **Weekly:** Added every time you build shopping list
- **Bi-weekly:** Added if 14+ days since last add
- **Monthly:** Added on first Monday of month (if today isn't 1st-7th Monday, Rice won't appear yet)

---

## ✅ Feature 3: Harvey's Consolidated Meal Picker

**How to Test:**
1. Go to **Harvey's Meals** tab
2. Click **"Assign Meals"** button (pink, top right)
3. In the modal:
   - **Left sidebar:**
     - Select **Day:** Monday
     - Select **Meal Slot:** Breakfast 🥣
   - **Right panel:**
     - Search bar: Try searching "muffin"
     - Filter: Click **"👨‍👦 Harvey's Options"** to toggle Harvey-only meals
     - Category: Click **"🥣 Carb/Protein"** to filter by category
   - Click a meal (e.g., "ABC Muffins")
4. Verify:
   - Meal appears in "Current Assignment" (left sidebar)
   - Meal card shows **"Last had X days ago"**
   - Meals not had in 14+ days have **⭐** and **green background**
5. Click **"Done"** to close modal
6. Verify meal appears in Harvey's Meals table (Monday, Breakfast)

**Expected Result:**
- ✅ Single consolidated modal (no more 3-tab workflow!)
- ✅ Click meal → instantly assigns to selected day/slot
- ✅ Variety tracking shows "Last had" info
- ✅ Green ⭐ highlights meals not had recently (good for rotation)
- ✅ Assignments persist after reload

**Variety Tracking:**
- First time assigning a meal → "Never had"
- After assigning → "Had today"
- Days later → "2 days ago", "1 week ago", etc.
- After 14+ days → Green ⭐ suggests rotation

---

## ✅ Feature 4: Meal Copy/Template System

**How to Test:**
1. First, create an archived week:
   - Go to **Jade's Meals** → **This Week**
   - Assign meals to a few days
   - Wait for the week to auto-archive (or manually archive if that feature exists)
   - OR: For testing, just verify the button appears
2. Go to **Jade's Meals** → **Next Week** (or **This Week**)
3. Click **"📋 Copy Previous Week"** button (blue, top right)

**Expected Result:**
- ✅ If archived weeks exist: Meals copy from most recent archived week
- ✅ Confirmation alert shows date range of copied week
- ✅ All meals are editable after copy (not locked)
- ✅ If no archived weeks: Alert says "No previous weeks found to copy from"

**Future Enhancement (infrastructure exists):**
- "Save as Template" button → save current week as named template
- Template selector → load saved template
- (UI pending, but data structure supports it)

---

## ✅ Feature 5: Recipe Browser for Jade

**How to Test:**
1. Go to **Jade's Meals** tab
2. On any day card, click the **"Browse"** or **"📖"** button
3. In the Recipe Browser modal:
   - See all your recipes in a 2-column grid
   - Search bar: Type "chicken" (or any ingredient/recipe name)
   - Category filter: Click **"Lunch"** to filter by meal type
   - Harvey's filter: Toggle **"👨‍👦 Harvey's Options"** to show Harvey-compatible recipes
4. Click a recipe card

**Expected Result:**
- ✅ Recipe auto-assigns to the day/meal slot you were browsing from
- ✅ Modal closes and recipe appears in Jade's Meals
- ✅ Search works across recipe names, notes, and ingredients
- ✅ Category filter narrows results
- ✅ Recipe cards show:
  - Recipe name
  - Category badge (Breakfast/Lunch/etc.)
  - Macros (⚡ calories, 💪 protein, 🥑 fats, 🍞 carbs)
  - Ingredient count

---

## ✅ Feature 6: Editable Macro Targets

**How to Test:**
1. Go to **Jade's Meals** tab
2. Look for **"Daily Targets"** section (top, below week info)
3. Default targets should show:
   - ⚡ 1800 cal
   - 💪 140g P
   - 🥑 60g F
   - 🍞 180g C
4. Click **"⚙️ Edit"** button
5. In edit mode:
   - Change Calories to: 2000
   - Change Protein to: 150
   - Click **"Save"** (green checkmark)
6. Verify new targets appear
7. Go to a day card and check if macros compare against new targets
8. Click **"🔄 Reset to Default"** to restore original targets

**Expected Result:**
- ✅ Targets persist after page reload
- ✅ Day cards use updated targets for macro progress bars
- ✅ "Reset to Default" restores hardcoded defaults
- ✅ Edit/Cancel workflow works smoothly

---

## ✅ Feature 7: Meal Variety Tracking for Harvey

**How to Test:**
1. Go to **Harvey's Meals** → Click **"Assign Meals"**
2. Assign the same meal (e.g., "ABC Muffins") to multiple days:
   - Monday Breakfast → ABC Muffins
   - Tuesday Breakfast → ABC Muffins
   - Wednesday Breakfast → ABC Muffins
3. Close modal and reopen it
4. Select **Thursday Breakfast**
5. Look at "ABC Muffins" card in the meal grid

**Expected Result:**
- ✅ Shows "Last had yesterday" (or "2 days ago" depending on today)
- ✅ If not had in 14+ days → Green background + ⭐
- ✅ If never had → "Never had"
- ✅ Variety tracking persists across page reloads

**Rotation Feature:**
- Helps you avoid repeating meals too often
- Suggests trying meals you haven't had in 2+ weeks
- Great for meal variety without manual tracking!

---

## 🛒 Bonus: Shopping List Integration

**How to Test (End-to-End):**
1. **Jade's Meals:** Assign recipes with ingredients to 2-3 days
2. **Harvey's Meals:** Assign meals to 2-3 days
3. **Staples:** Add 2-3 staples (weekly frequency)
4. Go to **Shopping List** tab
5. Verify:
   - ✅ All recipe ingredients from Jade's meals appear
   - ✅ All Harvey's meal ingredients appear (from hardcoded Harvey's data)
   - ✅ Staples auto-add (weekly items always add)
   - ✅ Ingredients aggregate (e.g., "2 cups flour" from Recipe A + "1 cup flour" from Recipe B = "3 cups flour")
6. Click **"Build Woolworths Cart"** (if configured)

**Expected Result:**
- ✅ Complete shopping list with all ingredients
- ✅ No duplicates (aggregated by name + unit)
- ✅ Staples auto-added based on frequency
- ✅ Can manually add/remove items
- ✅ Shopping list persists after reload

---

## 🐛 Bug Testing

**Edge Cases to Test:**

### Recipe Parser:
- ✅ Paste recipe with fractions (`1/2 cup`)
- ✅ Paste recipe with decimals (`1.5 tbsp`)
- ✅ Paste recipe with metric units (`100g`, `250ml`)
- ✅ Paste recipe with no quantities (`Salt to taste`)
- ✅ Paste recipe with comments (`# This is a comment`)

### Staples:
- ✅ Add staple, reload page → still there
- ✅ Add weekly staple → appears in every shopping list build
- ✅ Add bi-weekly staple → appears if 14+ days since last add
- ✅ Add monthly staple → appears on first Monday (1st-7th)

### Harvey's Picker:
- ✅ Assign meal, close modal, reopen → meal still assigned
- ✅ Assign same meal to multiple days → variety tracking updates
- ✅ Search for meal → only matching meals show
- ✅ Filter by category → only category meals show

### Meal Copy:
- ✅ Copy previous week when no archive → error message
- ✅ Copy previous week when archive exists → meals copy correctly
- ✅ Copied meals are editable (not locked)

### Macro Targets:
- ✅ Edit targets, reload page → targets persist
- ✅ Reset to default → restores hardcoded defaults
- ✅ Day cards use updated targets for progress bars

---

## 📊 Performance Check

**Things to Verify:**
- ✅ All modals open/close smoothly (no lag)
- ✅ Shopping list builds quickly (<2 seconds)
- ✅ Page loads quickly after reload
- ✅ No console errors (F12 → Console tab)
- ✅ Dark mode works (if enabled)
- ✅ Mobile responsive (if testing on mobile)

---

## 🎉 Success Criteria

**All features working if:**
- ✅ Recipe parser handles all test cases
- ✅ Staples auto-add based on frequency
- ✅ Harvey's picker assigns meals smoothly
- ✅ Variety tracking shows "Last had" info
- ✅ Copy Previous Week works (if archive exists)
- ✅ Recipe Browser shows all recipes with search/filter
- ✅ Macro targets editable and persist
- ✅ Shopping list aggregates ingredients correctly
- ✅ No console errors or crashes

---

## 🚀 Next Steps (If Everything Works)

1. **Use it for real!** Start planning this week's meals
2. **Add your real recipes** using the Recipe Input Modal
3. **Set up your staples** (Milk, Bread, Eggs, etc.)
4. **Assign Harvey's meals** for the week
5. **Build shopping list** and verify everything aggregates
6. **Export to Woolworths** (if configured)

---

## 📝 Feedback for Future Improvements

**If you find any bugs or have feature requests:**
1. Note the bug/request
2. Tell Felicia (me!) about it
3. I'll add it to the backlog for future sprints

**Potential Future Enhancements:**
- Template save/load UI (infrastructure exists)
- Recipe duplication (quick copy with edits)
- Meal notes/comments per day
- Nutrition goal tracking over time
- Email/export shopping list
- Multi-week planning view

---

**Testing Completed:** [  ] Yes, all features work!  
**Bugs Found:** [  ] None | [  ] List below:

---

**Happy meal planning! 🍽️**
