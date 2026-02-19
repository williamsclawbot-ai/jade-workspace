/**
 * Staples Store
 * Manages recurring staple items that auto-add to shopping lists
 */

export interface StapleItem {
  id: string;
  name: string;
  qty: string;
  unit?: string;
  frequency: 'weekly' | 'bi-weekly' | 'monthly';
  lastAdded?: number; // Timestamp of last time added to shopping list
  createdAt: number;
}

const STORAGE_KEY = 'staples-v1';

class StaplesStoreClass {
  private staples: StapleItem[] = [];

  constructor() {
    this.load();
  }

  private load() {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.staples = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading staples:', e);
    }
  }

  private save() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.staples));
      // Trigger storage event for real-time sync
      window.dispatchEvent(new StorageEvent('storage', {
        key: STORAGE_KEY,
        newValue: JSON.stringify(this.staples),
      }));
    } catch (e) {
      console.error('Error saving staples:', e);
    }
  }

  getAll(): StapleItem[] {
    return this.staples;
  }

  add(item: Omit<StapleItem, 'id' | 'createdAt'>): StapleItem {
    const newItem: StapleItem = {
      ...item,
      id: `staple-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
    };
    this.staples.push(newItem);
    this.save();
    return newItem;
  }

  update(id: string, updates: Partial<StapleItem>): void {
    const index = this.staples.findIndex(s => s.id === id);
    if (index !== -1) {
      this.staples[index] = { ...this.staples[index], ...updates };
      this.save();
    }
  }

  remove(id: string): void {
    this.staples = this.staples.filter(s => s.id !== id);
    this.save();
  }

  markAsAdded(id: string): void {
    const index = this.staples.findIndex(s => s.id === id);
    if (index !== -1) {
      this.staples[index].lastAdded = Date.now();
      this.save();
    }
  }

  /**
   * Get staples that should be added to shopping list based on frequency
   */
  getStaplesToAdd(): StapleItem[] {
    const now = Date.now();
    const today = new Date();
    
    return this.staples.filter(staple => {
      // Weekly: Add every time
      if (staple.frequency === 'weekly') {
        return true;
      }
      
      // Bi-weekly: Add if 14+ days since last add (or never added)
      if (staple.frequency === 'bi-weekly') {
        if (!staple.lastAdded) return true;
        const daysSinceAdded = (now - staple.lastAdded) / (1000 * 60 * 60 * 24);
        return daysSinceAdded >= 14;
      }
      
      // Monthly: Add if first Monday of month (or never added)
      if (staple.frequency === 'monthly') {
        if (!staple.lastAdded) return true;
        
        // Check if today is first Monday of the month
        const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ...
        const dateOfMonth = today.getDate();
        
        // First Monday must be between 1-7th of month
        const isFirstMonday = dayOfWeek === 1 && dateOfMonth <= 7;
        
        if (!isFirstMonday) return false;
        
        // Check if we already added this month
        const lastAddedDate = new Date(staple.lastAdded);
        const isSameMonth = lastAddedDate.getMonth() === today.getMonth() && 
                           lastAddedDate.getFullYear() === today.getFullYear();
        
        return !isSameMonth;
      }
      
      return false;
    });
  }

  /**
   * Initialize with common staple items if empty
   */
  initializeDefaults(): void {
    if (this.staples.length > 0) return; // Already has staples
    
    const defaults: Omit<StapleItem, 'id' | 'createdAt'>[] = [
      { name: 'Milk', qty: '2', unit: 'L', frequency: 'weekly' },
      { name: 'Bread', qty: '2', unit: 'loaves', frequency: 'weekly' },
      { name: 'Eggs', qty: '12', unit: 'pack', frequency: 'weekly' },
      { name: 'Butter', qty: '250', unit: 'g', frequency: 'bi-weekly' },
      { name: 'Rice', qty: '1', unit: 'kg', frequency: 'monthly' },
      { name: 'Pasta', qty: '500', unit: 'g', frequency: 'monthly' },
    ];
    
    defaults.forEach(item => this.add(item));
  }
}

export const staplesStore = new StaplesStoreClass();

// Initialize with defaults on first load
if (typeof window !== 'undefined') {
  staplesStore.initializeDefaults();
}
