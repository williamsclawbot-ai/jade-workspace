/**
 * Shopping Store - Manages shopping list items
 */

export interface ShoppingItem {
  id: string;
  title: string;
  completed: boolean;
  quantity?: string;
  category?: string;
  notes?: string;
  createdAt?: string;
}

const STORAGE_KEY = 'jade_shopping';

const DEFAULT_ITEMS: ShoppingItem[] = [
  {
    id: '1',
    title: 'Milk',
    completed: false,
    category: 'groceries',
  },
  {
    id: '2',
    title: 'Eggs',
    completed: false,
    category: 'groceries',
  },
  {
    id: '3',
    title: 'Bread',
    completed: false,
    category: 'groceries',
  },
];

class ShoppingStore {
  private items: ShoppingItem[] = [];

  constructor() {
    this.load();
  }

  private load() {
    if (typeof window === 'undefined') {
      this.items = DEFAULT_ITEMS;
      return;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    this.items = stored ? JSON.parse(stored) : DEFAULT_ITEMS;
  }

  private save() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
  }

  getItems(): ShoppingItem[] {
    return this.items;
  }

  getIncompleted(): ShoppingItem[] {
    return this.items.filter((i) => !i.completed);
  }

  getByCategory(category: string): ShoppingItem[] {
    return this.items.filter((i) => i.category === category);
  }

  addItem(item: Omit<ShoppingItem, 'id'>): ShoppingItem {
    const newItem: ShoppingItem = {
      ...item,
      id: Date.now().toString(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    this.items.push(newItem);
    this.save();
    return newItem;
  }

  updateItem(id: string, updates: Partial<ShoppingItem>): ShoppingItem | null {
    const item = this.items.find((i) => i.id === id);
    if (!item) return null;
    Object.assign(item, updates);
    this.save();
    return item;
  }

  deleteItem(id: string): boolean {
    const index = this.items.findIndex((i) => i.id === id);
    if (index === -1) return false;
    this.items.splice(index, 1);
    this.save();
    return true;
  }

  toggleItem(id: string): ShoppingItem | null {
    const item = this.items.find((i) => i.id === id);
    if (!item) return null;
    item.completed = !item.completed;
    this.save();
    return item;
  }

  getUrgentForToday(): ShoppingItem[] {
    return this.getIncompleted();
  }
}

export const shoppingStore = new ShoppingStore();
