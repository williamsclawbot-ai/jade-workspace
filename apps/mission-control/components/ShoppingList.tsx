'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { shoppingListStore, ShoppingListItem } from '@/lib/shoppingListStore';

interface AggregatedItem {
  normalizedName: string;
  displayName: string;
  totalQuantity: number;
  unit: string;
  originalItems: ShoppingListItem[];
  sources: Array<{ source: 'jade' | 'harvey'; mealName?: string; day?: string }>;
}

// Parse quantity string to number and unit
function parseQuantity(qty: string): { amount: number; unit: string } | null {
  if (!qty) return null;
  
  // Match patterns like "2 cups", "100g", "1.5 tbsp", etc.
  const match = qty.trim().match(/^([\d.\/]+)\s*([a-zA-Z]*)?$/);
  
  if (!match) return null;
  
  let amount = 0;
  const amountStr = match[1];
  const unit = (match[2] || '').toLowerCase();
  
  // Handle fractions like "1/2"
  if (amountStr.includes('/')) {
    const [num, denom] = amountStr.split('/').map(parseFloat);
    amount = num / denom;
  } else {
    amount = parseFloat(amountStr);
  }
  
  return { amount, unit };
}

// Normalize ingredient name for comparison
function normalizeIngredientName(name: string): string {
  let normalized = name.toLowerCase().trim();
  
  // Remove common plurals
  normalized = normalized.replace(/s$/, '');
  
  // Remove extra whitespace
  normalized = normalized.replace(/\s+/g, ' ');
  
  return normalized;
}

// Aggregate duplicate ingredients
function aggregateIngredients(items: ShoppingListItem[]): AggregatedItem[] {
  const aggregationMap = new Map<string, AggregatedItem>();
  
  for (const item of items) {
    const normalized = normalizeIngredientName(item.ingredient);
    const parsed = parseQuantity(item.quantity || '');
    
    if (!parsed) {
      // If we can't parse quantity, treat as separate item
      const key = `${normalized}-unparsed-${item.id}`;
      aggregationMap.set(key, {
        normalizedName: normalized,
        displayName: item.ingredient,
        totalQuantity: 0,
        unit: '',
        originalItems: [item],
        sources: [{
          source: item.source,
          mealName: item.sourceMetadata?.mealName,
          day: item.sourceMetadata?.day,
        }],
      });
      continue;
    }
    
    // Create key based on normalized name + unit
    const key = `${normalized}-${parsed.unit}`;
    
    const existing = aggregationMap.get(key);
    if (existing) {
      // Add to existing
      existing.totalQuantity += parsed.amount;
      existing.originalItems.push(item);
      existing.sources.push({
        source: item.source,
        mealName: item.sourceMetadata?.mealName,
        day: item.sourceMetadata?.day,
      });
    } else {
      // Create new entry
      aggregationMap.set(key, {
        normalizedName: normalized,
        displayName: item.ingredient,
        totalQuantity: parsed.amount,
        unit: parsed.unit,
        originalItems: [item],
        sources: [{
          source: item.source,
          mealName: item.sourceMetadata?.mealName,
          day: item.sourceMetadata?.day,
        }],
      });
    }
  }
  
  return Array.from(aggregationMap.values());
}

export default function ShoppingList() {
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [aggregatedItems, setAggregatedItems] = useState<AggregatedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load items
    const unmovedItems = shoppingListStore.getUnmovedItems();
    setItems(unmovedItems);
    setAggregatedItems(aggregateIngredients(unmovedItems));
    setLoading(false);

    // Listen for storage changes
    const handleStorageChange = () => {
      const updated = shoppingListStore.getUnmovedItems();
      setItems(updated);
      setAggregatedItems(aggregateIngredients(updated));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleMoveToCart = (aggregated: AggregatedItem) => {
    // Move all original items to cart
    aggregated.originalItems.forEach(item => {
      shoppingListStore.moveToCart(item.id);
    });
    
    const updated = items.filter(item => 
      !aggregated.originalItems.find(orig => orig.id === item.id)
    );
    setItems(updated);
    setAggregatedItems(aggregateIngredients(updated));
  };

  const handleRemove = (aggregated: AggregatedItem) => {
    // Remove all original items
    aggregated.originalItems.forEach(item => {
      shoppingListStore.remove(item.id);
    });
    
    const updated = items.filter(item => 
      !aggregated.originalItems.find(orig => orig.id === item.id)
    );
    setItems(updated);
    setAggregatedItems(aggregateIngredients(updated));
  };

  const loadTestData = () => {
    const testItems = [
      { ingredient: 'Milk', quantity: '2 cups', source: 'jade' as const, sourceMetadata: { mealName: 'Breakfast Bowl', day: 'Monday', mealType: 'breakfast' as const } },
      { ingredient: 'Milk', quantity: '1 cup', source: 'harvey' as const, sourceMetadata: { mealName: 'Cereal', day: 'Tuesday', mealType: 'breakfast' as const } },
      { ingredient: 'Eggs', quantity: '3', source: 'jade' as const, sourceMetadata: { mealName: 'Scrambled Eggs', day: 'Monday', mealType: 'breakfast' as const } },
      { ingredient: 'Egg', quantity: '2', source: 'harvey' as const, sourceMetadata: { mealName: 'French Toast', day: 'Tuesday', mealType: 'breakfast' as const } },
      { ingredient: 'Chicken Breast', quantity: '200g', source: 'jade' as const, sourceMetadata: { mealName: 'Chicken Dinner', day: 'Monday', mealType: 'dinner' as const } },
      { ingredient: 'Chicken breast', quantity: '150g', source: 'jade' as const, sourceMetadata: { mealName: 'Chicken Salad', day: 'Wednesday', mealType: 'lunch' as const } },
      { ingredient: 'Avocado', quantity: '30g', source: 'jade' as const, sourceMetadata: { mealName: 'Chicken Enchilada (GF)', day: 'Monday', mealType: 'dinner' as const } },
      { ingredient: 'Light Mozzarella Cheese', quantity: '35g', source: 'jade' as const, sourceMetadata: { mealName: 'Chicken Enchilada (GF)', day: 'Monday', mealType: 'dinner' as const } },
      { ingredient: 'Cheese', quantity: '50g', source: 'harvey' as const, sourceMetadata: { mealName: 'Grilled Cheese', day: 'Thursday', mealType: 'lunch' as const } },
    ];
    
    shoppingListStore.addBulk(testItems);
    const updated = shoppingListStore.getUnmovedItems();
    setItems(updated);
    setAggregatedItems(aggregateIngredients(updated));
  };

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Loading shopping list...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <ShoppingBag className="w-8 h-8 text-jade-purple" />
          <div>
            <h1 className="text-2xl font-bold text-jade-purple">Shopping List</h1>
            <p className="text-sm text-gray-600">
              {aggregatedItems.length} ingredient{aggregatedItems.length !== 1 ? 's' : ''} ready
              {items.length !== aggregatedItems.length && (
                <span className="text-jade-purple ml-1">
                  (combined from {items.length} meal{items.length !== 1 ? 's' : ''})
                </span>
              )}
            </p>
          </div>
        </div>
        {items.length === 0 && (
          <button
            onClick={loadTestData}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
          >
            Load Test Data (with duplicates)
          </button>
        )}
      </div>

      {aggregatedItems.length === 0 ? (
        <div className="bg-white rounded-xl p-8 border border-jade-light text-center">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-700 mb-2">Shopping list is empty</h3>
          <p className="text-sm text-gray-600">
            Send a meal photo to Felicia to add ingredients from your Jade's or Harvey's meal plan
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {aggregatedItems.map((aggregated, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg border border-jade-light p-4 flex items-start justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-semibold text-gray-800">{aggregated.displayName}</h4>
                  {aggregated.totalQuantity > 0 && (
                    <span className="px-2 py-1 bg-jade-purple text-white text-xs font-bold rounded-full">
                      {aggregated.totalQuantity}{aggregated.unit}
                    </span>
                  )}
                  {aggregated.originalItems.length > 1 && (
                    <span className="text-xs text-jade-purple font-medium">
                      (from {aggregated.originalItems.length} meals)
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {aggregated.sources.map((src, srcIdx) => (
                    <span
                      key={srcIdx}
                      className={`text-xs px-2 py-1 rounded-full ${
                        src.source === 'jade'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {src.mealName && src.day ? `${src.mealName} (${src.day})` : 
                       src.mealName || (src.source === 'jade' ? "Jade's meals" : "Harvey's meals")}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => handleMoveToCart(aggregated)}
                  className="px-4 py-2 bg-jade-purple text-white rounded-lg hover:bg-jade-dark transition-colors flex items-center space-x-2 text-sm font-medium whitespace-nowrap"
                >
                  <span>Add to Cart</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleRemove(aggregated)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="mt-8 bg-blue-50 rounded-lg p-4 border border-blue-200">
        <p className="text-sm text-blue-900">
          <strong>💡 Smart Aggregation:</strong> Duplicate ingredients are automatically combined. For example, "Milk 2 cups" from Monday and "Milk 1 cup" from Tuesday become "Milk 3 cups" in your shopping list!
        </p>
      </div>
    </div>
  );
}
