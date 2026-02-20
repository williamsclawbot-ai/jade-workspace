# Meal Planning System - Feature Architecture

**System Overview:** Complete meal planning, shopping, and nutrition tracking system for Jade & Harvey

---

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        MEAL PLANNING SYSTEM                          │
│                     (Mission Control Tab)                            │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
            ┌───────▼────────┐        ┌────────▼────────┐
            │  JADE'S MEALS  │        │  HARVEY'S MEALS │
            │   (Adult)      │        │   (Baby/Toddler)│
            └───────┬────────┘        └────────┬────────┘
                    │                           │
        ┌───────────┼───────────┐     ┌────────┼─────────┐
        │           │           │     │        │         │
    ┌───▼───┐  ┌───▼───┐  ┌────▼─┐  │   ┌────▼────┐    │
    │Recipe │  │Recipe │  │Macro │  │   │Meal     │    │
    │Parser │  │Browser│  │ Mgmt │  │   │Picker   │    │
    └───┬───┘  └───┬───┘  └──────┘  │   │(Modal)  │    │
        │          │                 │   └────┬────┘    │
        │          │                 │        │         │
        └──────┬───┘                 │   ┌────▼────┐    │
               │                     │   │Variety  │    │
         ┌─────▼─────┐               │   │Tracking │    │
         │  RECIPE   │               │   └─────────┘    │
         │ DATABASE  │               │                  │
         └─────┬─────┘               │                  │
               │                     │                  │
               └─────────┬───────────┘                  │
                         │                              │
                    ┌────▼──────┐                       │
                    │ SHOPPING  │◄──────────────────────┘
                    │   LIST    │
                    └────┬──────┘
                         │
                  ┌──────┼──────┐
                  │      │      │
             ┌────▼─┐ ┌──▼───┐ │
             │Staples│ │Aggre-│ │
             │ Auto  │ │gation│ │
             │Restock│ └──────┘ │
             └───────┘          │
                                │
                         ┌──────▼──────┐
                         │  WOOLWORTHS │
                         │    CART     │
                         └─────────────┘
```

---

## 📦 Component Breakdown

### 1. Recipe Management Layer

#### RecipeInputModal
**Purpose:** Parse and save recipes from pasted text  
**Flow:** Paste → Parse → Review → Macros → Save → Assign  
**Features:**
- Regex ingredient parsing (qty, unit, name)
- Fraction/decimal/metric support
- Manual correction of unparsed items
- Macro entry (calories, protein, fats, carbs)
- Direct assignment to week
- "Create Another" workflow

**Data Flow:**
```
User pastes recipe text
    ↓
Parse each line with regex
    ↓
Show parsed ingredients for review
    ↓
User edits if needed
    ↓
Save to recipeDatabase
    ↓
Optionally assign to week
```

#### RecipeBrowserModal
**Purpose:** Browse and assign existing recipes  
**Features:**
- Search (name, notes, ingredients)
- Category filter
- Harvey's Options filter
- 2-column grid layout
- Macro preview on cards

**Data Flow:**
```
User clicks "Browse" on day card
    ↓
Load all recipes from recipeDatabase
    ↓
Apply search/filters
    ↓
User clicks recipe
    ↓
Auto-assign to selected day/meal
```

---

### 2. Macro Management Layer

#### MacroSettingsUI
**Purpose:** Edit daily macro targets  
**Storage:** `localStorage` → `macro-targets-v1`  
**Default Targets:**
```javascript
{
  calories: 1800,
  protein: 140,
  fats: 60,
  carbs: 180
}
```

**Features:**
- Display mode (compact)
- Edit mode (4 inputs)
- Reset to default button
- Real-time sync across tabs

**Data Flow:**
```
User clicks "Edit"
    ↓
Show 4 input fields
    ↓
User edits values
    ↓
Save to macroTargetsStore
    ↓
Update all day cards with new targets
```

---

### 3. Harvey's Meal System

#### HarveysMealPickerModal
**Purpose:** Consolidated meal assignment for Harvey  
**Features:**
- Day selector (Monday-Sunday)
- Meal slot selector (Breakfast/Lunch/Snack/Dinner)
- Search + category filters
- Variety tracking display
- Click-to-assign workflow

**Layout:**
```
┌─────────────────────────────────────────┐
│  Left Sidebar  │  Right Panel           │
│                │                        │
│  Day Selector  │  Search Bar            │
│  ┌─────────┐   │  ┌──────────────────┐ │
│  │ Monday  │   │  │ 🔍 Search...     │ │
│  │ Tuesday │   │  └──────────────────┘ │
│  │ ...     │   │                        │
│  └─────────┘   │  Category Filters      │
│                │  ┌────┐ ┌────┐ ┌────┐ │
│  Meal Slot     │  │All │ │🥣  │ │🍎  │ │
│  ┌─────────┐   │  └────┘ └────┘ └────┘ │
│  │🥣Breakf.│   │                        │
│  │🍱Lunch  │   │  Meal Grid (2 cols)    │
│  │🍎Snack  │   │  ┌────────┐ ┌────────┐│
│  │🍽️Dinner │   │  │ABC     │ │Banana  ││
│  └─────────┘   │  │Muffins │ │Muffins ││
│                │  │⭐2 wks  │ │Had yest││
│  Current:      │  └────────┘ └────────┘│
│  ┌─────────┐   │  │        │ │        ││
│  │ABC Muff │   │  │        │ │        ││
│  └─────────┘   │  └────────┘ └────────┘│
└─────────────────────────────────────────┘
```

#### HarveysMealVarietyStore
**Purpose:** Track meal rotation and suggest variety  
**Storage:** `localStorage` → `harveys-meal-variety-v1`  
**Data Structure:**
```javascript
{
  "ABC Muffins": [1708543200000, 1708630000000],
  "Banana Muffins": [1708457600000],
  "Yogurt": [1708543200000, 1708629600000, 1708716000000]
}
```

**Logic:**
- `recordMeal(name)` → append timestamp
- `getDaysSinceLastHad(name)` → calculate from latest timestamp
- Display logic:
  - Never had → `null` → "Never had"
  - 0 days → "Had today"
  - 1 day → "Had yesterday"
  - 2-6 days → "X days ago"
  - 7-13 days → "1 week ago"
  - 14+ days → "X weeks ago" + ⭐ green background

---

### 4. Shopping List System

#### StaplesManager
**Purpose:** Manage recurring staple items with auto-restock  
**Storage:** `localStorage` → `staples-v1`  
**Frequency Modes:**
- **Weekly:** Add every time
- **Bi-weekly:** Add if 14+ days since `lastAdded`
- **Monthly:** Add on first Monday (1st-7th) if not added this month

**Staple Item Schema:**
```typescript
{
  id: string,
  name: string,
  qty: string,
  unit?: string,
  frequency: 'weekly' | 'bi-weekly' | 'monthly',
  lastAdded?: number, // timestamp
  createdAt: number
}
```

**Auto-Add Logic (in ShoppingListView):**
```javascript
const staplesToAdd = staplesStore.getStaplesToAdd();
staplesToAdd.forEach(staple => {
  if (!existingNames.has(staple.name.toLowerCase())) {
    newItems.push({
      ingredient: staple.name,
      qty: staple.qty,
      unit: staple.unit,
      source: 'jade'
    });
    staplesStore.markAsAdded(staple.id); // Update timestamp
  }
});
```

#### ShoppingListView (Aggregation Logic)
**Purpose:** Build shopping list from Jade's + Harvey's meals + Staples  
**Flow:**
```
1. Get staples to add (based on frequency)
   ↓
2. Extract Harvey's meal ingredients (from hardcoded data)
   ↓
3. Extract Jade's meal ingredients (from recipeDatabase)
   ↓
4. Aggregate duplicates (normalize name + unit)
   ↓
5. Display aggregated list
   ↓
6. Build Woolworths cart (if configured)
```

**Aggregation Example:**
```
Inputs:
- Recipe A: 2 cups flour
- Recipe B: 1 cup flour
- Staple: 1 loaf bread

Aggregated Output:
- Flour: 3 cups (from Recipe A + Recipe B)
- Bread: 1 loaf (from Staple)
```

**Normalization Rules:**
- Lowercase ingredient names
- Remove trailing 's' (plurals)
- Group by normalized name + unit
- Sum quantities if units match

---

### 5. Meal Copy/Template System

#### Copy Previous Week
**Purpose:** Duplicate last week's meals to current/next week  
**Flow:**
```
User clicks "Copy Previous Week"
    ↓
Get most recent archived week
    ↓
Clone week.jades.meals
    ↓
Clear dayOverrides (make editable)
    ↓
Update current/next week
    ↓
Show confirmation with date range
```

**Code:**
```typescript
const previousWeek = archivedWeeks[0]; // Most recent
const updated = { ...week };
updated.jades.meals = JSON.parse(JSON.stringify(previousWeek.jades.meals));
updated.jades.dayOverrides = {}; // Clear overrides
weeklyMealPlanStorage.updateWeek(week.weekId, updated);
```

**Future: Save as Template** (infrastructure exists)
- Save current week as named template
- Template picker to load saved templates
- UI pending (data structure supports it)

---

## 💾 Data Storage Architecture

### localStorage Keys:
```
weekly-meal-plans-v1     → All week data (current, next, archived)
recipe-database-v1       → All recipes with ingredients + macros
staples-v1               → Staple items with frequency + timestamps
macro-targets-v1         → User's daily macro targets
harveys-meal-variety-v1  → Meal rotation tracking
purchase-history-v1      → Shopping history (for future recommendations)
woolworths-mapping-v1    → Woolworths product mappings
```

### Weekly Meal Plan Schema:
```typescript
{
  weekId: string,
  weekStartDate: number,
  weekEndDate: number,
  status: 'planning' | 'locked',
  jades: {
    meals: {
      Monday: { Breakfast: string, Lunch: string, ... },
      Tuesday: { ... },
      ...
    },
    dayOverrides: { ... }
  },
  harveys: {
    meals: {
      Monday: { breakfast: string[], lunch: string[], ... },
      Tuesday: { ... },
      ...
    }
  },
  shoppingList: ShoppingItem[]
}
```

### Recipe Schema:
```typescript
{
  id: string,
  name: string,
  category: 'Breakfast' | 'Lunch' | 'Snack' | 'Dinner' | 'Dessert' | 'Harvey',
  ingredients: [
    { id: string, name: string, qty: string, unit: string }
  ],
  macros: {
    calories: number,
    protein: number,
    fats: number,
    carbs: number
  },
  instructions?: string,
  notes?: string,
  createdAt: number
}
```

---

## 🔄 State Management Flow

### Component State Updates:
```
User Action
    ↓
Update localStorage (via store)
    ↓
Trigger storage event
    ↓
All components listening re-render
    ↓
UI updates across tabs/windows
```

### Real-Time Sync Example:
```javascript
// Component A updates recipe
recipeDatabase.addRecipe(newRecipe);

// Triggers storage event
window.dispatchEvent(new StorageEvent('storage', {
  key: 'recipe-database-v1',
  newValue: JSON.stringify(recipes)
}));

// Component B listens
useEffect(() => {
  const handleStorageChange = (e) => {
    if (e.key === 'recipe-database-v1') {
      loadRecipes(); // Re-render
    }
  };
  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
}, []);
```

---

## 🎯 Integration Points

### 1. Recipe → Shopping List
```
Recipe "Chicken Pasta" assigned to Monday Lunch
    ↓
ShoppingListView extracts ingredients:
- 200g chicken breast
- 300g pasta
- 1 cup tomato sauce
    ↓
Add to shopping list
```

### 2. Staples → Shopping List
```
Weekly staple "Milk" (2L)
    ↓
StaplesStore.getStaplesToAdd() checks frequency
    ↓
Weekly → Always add
    ↓
Add "Milk 2L" to shopping list
    ↓
Mark staple.lastAdded = Date.now()
```

### 3. Harvey's Meals → Shopping List
```
Harvey assigned "ABC Muffins" for Tuesday Breakfast
    ↓
ShoppingListView calls flattenHarveysMeals(['ABC Muffins'])
    ↓
Returns hardcoded ingredients:
- 2 eggs
- 1 cup flour
- 1 banana
    ↓
Add to shopping list
```

### 4. Variety Tracking → Meal Picker
```
User assigns "ABC Muffins" to Monday
    ↓
HarveysMealVarietyStore.recordMeal('ABC Muffins')
    ↓
Store timestamp: 1708543200000
    ↓
Next time picker opens:
HarveysMealVarietyStore.getDaysSinceLastHad('ABC Muffins')
    ↓
Calculate: (now - lastTimestamp) / (1000*60*60*24) = 2 days
    ↓
Display: "Last had 2 days ago"
```

---

## 🚀 Performance Optimizations

### 1. Aggregation Logic
- Single-pass normalization
- Map-based deduplication
- O(n) complexity for n ingredients

### 2. Storage Events
- Debounced updates (avoid rapid re-renders)
- Selective key listening (only relevant keys)
- Lazy loading (load data only when tab active)

### 3. Component Rendering
- React.memo for expensive components
- useCallback for event handlers
- useMemo for computed values

---

## 🧪 Testing Strategy

### Unit Tests (Future):
- Recipe parsing logic (all regex patterns)
- Staples frequency calculation (weekly/bi-weekly/monthly)
- Variety tracking (days since last had)
- Shopping list aggregation (normalization + deduplication)

### Integration Tests (Future):
- Recipe → Shopping List flow
- Staples → Shopping List flow
- Harvey's Meals → Shopping List flow
- Copy Previous Week → Meal assignment

### Manual Testing (Current):
- See `TESTING_CHECKLIST.md` for comprehensive manual tests

---

## 📈 Future Enhancements

### Short-term:
- [ ] Template save/load UI
- [ ] Recipe duplication feature
- [ ] Meal notes per day
- [ ] Email/export shopping list
- [ ] Nutrition tracking over time

### Medium-term:
- [ ] Multi-week planning view
- [ ] Meal photo uploads
- [ ] Ingredient substitution suggestions
- [ ] Cost tracking per recipe

### Long-term:
- [ ] Backend sync (multi-device)
- [ ] AI meal suggestions based on past preferences
- [ ] Automated recipe scraping from URLs
- [ ] Grocery delivery integration

---

## 🏆 System Strengths

1. **Modularity:** Each feature is self-contained
2. **Scalability:** localStorage → backend migration path clear
3. **UX:** Smooth workflows, minimal friction
4. **Reliability:** Graceful error handling, data persistence
5. **Extensibility:** Easy to add new features (template system infrastructure ready)

---

**Last Updated:** February 21, 2026  
**Maintained By:** Felicia (OpenClaw Assistant)
