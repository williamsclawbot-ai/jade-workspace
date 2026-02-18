'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { shoppingListStore, ShoppingListItem } from '@/lib/shoppingListStore';

export default function ShoppingList() {
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load items
    const unmovedItems = shoppingListStore.getUnmovedItems();
    setItems(unmovedItems);
    setLoading(false);

    // Listen for storage changes
    const handleStorageChange = () => {
      const updated = shoppingListStore.getUnmovedItems();
      setItems(updated);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleMoveToCart = (id: string) => {
    shoppingListStore.moveToCart(id);
    setItems(items.filter(item => item.id !== id));
  };

  const handleRemove = (id: string) => {
    shoppingListStore.remove(id);
    setItems(items.filter(item => item.id !== id));
  };

  const loadTestData = () => {
    const testItems = [
      { ingredient: 'Avocado', quantity: '30g', source: 'jade' as const, sourceMetadata: { mealName: 'Chicken Enchilada (GF)', day: 'Monday', mealType: 'dinner' as const } },
      { ingredient: 'Chicken Breast', quantity: '100g', source: 'jade' as const, sourceMetadata: { mealName: 'Chicken Enchilada (GF)', day: 'Monday', mealType: 'dinner' as const } },
      { ingredient: 'Light Mozzarella Cheese', quantity: '35g', source: 'jade' as const, sourceMetadata: { mealName: 'Chicken Enchilada (GF)', day: 'Monday', mealType: 'dinner' as const } },
      { ingredient: 'Mild Salsa', quantity: '35g', source: 'jade' as const, sourceMetadata: { mealName: 'Chicken Enchilada (GF)', day: 'Monday', mealType: 'dinner' as const } },
      { ingredient: 'Refried Beans', quantity: '60g', source: 'jade' as const, sourceMetadata: { mealName: 'Chicken Enchilada (GF)', day: 'Monday', mealType: 'dinner' as const } },
      { ingredient: 'Sour Cream Light', quantity: '30g', source: 'jade' as const, sourceMetadata: { mealName: 'Chicken Enchilada (GF)', day: 'Monday', mealType: 'dinner' as const } },
      { ingredient: 'Taco Spice Mix', quantity: '5g', source: 'jade' as const, sourceMetadata: { mealName: 'Chicken Enchilada (GF)', day: 'Monday', mealType: 'dinner' as const } },
      { ingredient: 'White Wraps - Gluten Free', quantity: '1', source: 'jade' as const, sourceMetadata: { mealName: 'Chicken Enchilada (GF)', day: 'Monday', mealType: 'dinner' as const } },
    ];
    
    shoppingListStore.addBulk(testItems);
    const updated = shoppingListStore.getUnmovedItems();
    setItems(updated);
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
              {items.length} item{items.length !== 1 ? 's' : ''} ready to add to Woolworths
            </p>
          </div>
        </div>
        {items.length === 0 && (
          <button
            onClick={loadTestData}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
          >
            Load Test Data (Enchilada)
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl p-8 border border-jade-light text-center">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-700 mb-2">Shopping list is empty</h3>
          <p className="text-sm text-gray-600">
            Send a meal photo to Felicia to add ingredients from your Jade's or Harvey's meal plan
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-jade-light p-4 flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">{item.ingredient}</h4>
                <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                  {item.source && (
                    <span className={`px-2 py-1 rounded-full ${
                      item.source === 'jade'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {item.source === 'jade' ? "Jade's meals" : "Harvey's meals"}
                    </span>
                  )}
                  {item.sourceMetadata?.mealName && (
                    <span>{item.sourceMetadata.mealName}</span>
                  )}
                  {item.sourceMetadata?.day && (
                    <span>{item.sourceMetadata.day}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleMoveToCart(item.id)}
                  className="px-4 py-2 bg-jade-purple text-white rounded-lg hover:bg-jade-dark transition-colors flex items-center space-x-2 text-sm font-medium"
                >
                  <span>Add to Shopping Cart</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleRemove(item.id)}
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
          <strong>💡 How it works:</strong> Click "Add to Shopping Cart" to move items to the Shopping Cart Manager. Then build your Woolworths cart with one command!
        </p>
      </div>
    </div>
  );
}
