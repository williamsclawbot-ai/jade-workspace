/**
 * Pantry Store
 * Manages pantry inventory with stock levels and expiry tracking
 */

export type PantryCategory = 'pantry' | 'fridge' | 'freezer';
export type StockLevel = 'full' | 'low' | 'out';

export interface PantryItem {
  id: string;
  name: string;
  category: PantryCategory;
  quantity: number;
  unit: string;
  expiryDate?: string; // ISO date string YYYY-MM-DD
  stockLevel: StockLevel;
  isStaple: boolean;
  notes?: string;
  addedAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'pantry-items-v1';

class PantryStoreClass {
  private items: PantryItem[] = [];

  constructor() {
    this.load();
  }

  private load() {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.items = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading pantry items:', e);
    }
  }

  private save() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
      // Trigger storage event for real-time sync
      window.dispatchEvent(new StorageEvent('storage', {
        key: STORAGE_KEY,
        newValue: JSON.stringify(this.items),
      }));
    } catch (e) {
      console.error('Error saving pantry items:', e);
    }
  }

  // Get all items
  getAll(): PantryItem[] {
    return this.items;
  }

  // Get items by category
  getByCategory(category: PantryCategory): PantryItem[] {
    return this.items.filter(item => item.category === category);
  }

  // Add new item
  addItem(item: Omit<PantryItem, 'id' | 'addedAt' | 'updatedAt'>): PantryItem {
    const newItem: PantryItem = {
      ...item,
      id: `pantry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      addedAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.items.push(newItem);
    this.save();
    return newItem;
  }

  // Update item
  updateItem(id: string, updates: Partial<Omit<PantryItem, 'id' | 'addedAt'>>): void {
    const index = this.items.findIndex(item => item.id === id);
    if (index !== -1) {
      this.items[index] = { 
        ...this.items[index], 
        ...updates, 
        updatedAt: Date.now() 
      };
      this.save();
    }
  }

  // Update stock level specifically
  updateStock(id: string, stockLevel: StockLevel, quantity?: number): void {
    const updates: Partial<PantryItem> = { stockLevel };
    if (quantity !== undefined) {
      updates.quantity = quantity;
    }
    this.updateItem(id, updates);
  }

  // Remove item
  removeItem(id: string): void {
    this.items = this.items.filter(item => item.id !== id);
    this.save();
  }

  // Get low stock items (for shopping list integration)
  getLowStock(): PantryItem[] {
    return this.items.filter(item => 
      item.stockLevel === 'low' || item.stockLevel === 'out'
    );
  }

  // Get items expiring soon (within 7 days)
  getExpiringSoon(days: number = 7): PantryItem[] {
    const now = new Date();
    const cutoffDate = new Date(now);
    cutoffDate.setDate(cutoffDate.getDate() + days);

    return this.items.filter(item => {
      if (!item.expiryDate) return false;
      const expiry = new Date(item.expiryDate);
      return expiry <= cutoffDate && expiry >= now;
    });
  }

  // Get expired items
  getExpired(): PantryItem[] {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    return this.items.filter(item => {
      if (!item.expiryDate) return false;
      const expiry = new Date(item.expiryDate);
      return expiry < now;
    });
  }

  // Get staples that are low or out
  getStaplesNeedingRestock(): PantryItem[] {
    return this.items.filter(item => 
      item.isStaple && (item.stockLevel === 'low' || item.stockLevel === 'out')
    );
  }

  // Search items
  search(query: string): PantryItem[] {
    const lowerQuery = query.toLowerCase();
    return this.items.filter(item => 
      item.name.toLowerCase().includes(lowerQuery) ||
      item.notes?.toLowerCase().includes(lowerQuery)
    );
  }

  // Get counts for metrics
  getCounts() {
    return {
      total: this.items.length,
      pantry: this.items.filter(i => i.category === 'pantry').length,
      fridge: this.items.filter(i => i.category === 'fridge').length,
      freezer: this.items.filter(i => i.category === 'freezer').length,
      lowStock: this.items.filter(i => i.stockLevel === 'low').length,
      outOfStock: this.items.filter(i => i.stockLevel === 'out').length,
      expiringSoon: this.getExpiringSoon(7).length,
      expired: this.getExpired().length,
      staples: this.items.filter(i => i.isStaple).length,
    };
  }

  // Initialize with sample data for testing
  initializeSampleData(): void {
    if (this.items.length > 0) return;

    const now = new Date();
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const lastWeek = new Date(now);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const samples: Omit<PantryItem, 'id' | 'addedAt' | 'updatedAt'>[] = [
      // Pantry items
      { name: 'Rice', category: 'pantry', quantity: 2, unit: 'kg', stockLevel: 'full', isStaple: true },
      { name: 'Pasta', category: 'pantry', quantity: 500, unit: 'g', stockLevel: 'low', isStaple: true },
      { name: 'Olive Oil', category: 'pantry', quantity: 250, unit: 'ml', stockLevel: 'full', isStaple: true },
      { name: 'Canned Tomatoes', category: 'pantry', quantity: 3, unit: 'cans', stockLevel: 'full', isStaple: false },
      { name: 'Cereal', category: 'pantry', quantity: 0, unit: 'box', stockLevel: 'out', isStaple: true },
      
      // Fridge items
      { name: 'Milk', category: 'fridge', quantity: 1, unit: 'L', expiryDate: nextWeek.toISOString().split('T')[0], stockLevel: 'low', isStaple: true },
      { name: 'Eggs', category: 'fridge', quantity: 6, unit: 'eggs', expiryDate: nextWeek.toISOString().split('T')[0], stockLevel: 'low', isStaple: true },
      { name: 'Cheese', category: 'fridge', quantity: 200, unit: 'g', expiryDate: now.toISOString().split('T')[0], stockLevel: 'full', isStaple: false },
      { name: 'Yogurt', category: 'fridge', quantity: 4, unit: 'tubs', expiryDate: nextWeek.toISOString().split('T')[0], stockLevel: 'full', isStaple: true },
      { name: 'Butter', category: 'fridge', quantity: 100, unit: 'g', expiryDate: lastWeek.toISOString().split('T')[0], stockLevel: 'low', isStaple: true },
      
      // Freezer items
      { name: 'Chicken Breast', category: 'freezer', quantity: 500, unit: 'g', stockLevel: 'full', isStaple: true },
      { name: 'Frozen Veggies', category: 'freezer', quantity: 1, unit: 'bag', stockLevel: 'full', isStaple: true },
      { name: 'Ice Cream', category: 'freezer', quantity: 0, unit: 'tub', stockLevel: 'out', isStaple: false },
      { name: 'Bread', category: 'freezer', quantity: 1, unit: 'loaf', stockLevel: 'full', isStaple: true },
    ];

    samples.forEach(item => this.addItem(item));
  }

  // Clear all items
  clear(): void {
    this.items = [];
    this.save();
  }
}

export const pantryStore = new PantryStoreClass();
