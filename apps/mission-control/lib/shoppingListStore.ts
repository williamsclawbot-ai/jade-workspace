/**
 * Shopping List Store
 * Manages items extracted from meals
 * Items can be moved to Woolworths Shopping Cart
 */

export interface ShoppingListItem {
  id: string;
  ingredient: string;
  quantity?: string;
  price?: number;
  source: 'jade' | 'harvey'; // Which meal plan it came from
  sourceMetadata?: {
    mealName?: string;
    day?: string;
    mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  };
  addedAt: number;
  addedToCart?: boolean; // Moved to Woolworths?
}

class ShoppingListStoreClass {
  private KEY = 'shopping-list-items';

  getAll(): ShoppingListItem[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(this.KEY);
    return stored ? JSON.parse(stored) : [];
  }

  add(item: Omit<ShoppingListItem, 'id' | 'addedAt'>): ShoppingListItem {
    const newItem: ShoppingListItem = {
      ...item,
      id: `item-${Date.now()}-${Math.random()}`,
      addedAt: Date.now(),
    };
    
    const items = this.getAll();
    items.push(newItem);
    this.save(items);
    return newItem;
  }

  addBulk(items: Omit<ShoppingListItem, 'id' | 'addedAt'>[]): ShoppingListItem[] {
    const newItems = items.map(item => ({
      ...item,
      id: `item-${Date.now()}-${Math.random()}`,
      addedAt: Date.now(),
    }));
    
    const current = this.getAll();
    const merged = [...current, ...newItems];
    this.save(merged);
    return newItems;
  }

  remove(id: string): void {
    const items = this.getAll().filter(item => item.id !== id);
    this.save(items);
  }

  update(id: string, updates: Partial<ShoppingListItem>): void {
    const items = this.getAll();
    const item = items.find(i => i.id === id);
    if (item) {
      Object.assign(item, updates);
      this.save(items);
    }
  }

  moveToCart(id: string): void {
    const items = this.getAll();
    const item = items.find(i => i.id === id);
    if (item) {
      item.addedToCart = true;
      this.save(items);
    }
  }

  getUnmovedItems(): ShoppingListItem[] {
    return this.getAll().filter(item => !item.addedToCart);
  }

  getMovedItems(): ShoppingListItem[] {
    return this.getAll().filter(item => item.addedToCart);
  }

  clear(): void {
    this.save([]);
  }

  private save(items: ShoppingListItem[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.KEY, JSON.stringify(items));
      // Trigger storage event for real-time sync
      window.dispatchEvent(new StorageEvent('storage', {
        key: this.KEY,
        newValue: JSON.stringify(items),
      }));
    }
  }
}

export const shoppingListStore = new ShoppingListStoreClass();
