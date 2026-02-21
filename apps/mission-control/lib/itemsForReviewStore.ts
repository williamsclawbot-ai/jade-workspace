/**
 * Items for Review Store
 * Stores overnight research reports, audits, and strategic recommendations
 * for Jade's morning review
 */

export interface ReviewItem {
  id: string;
  title: string; // e.g., "Trending Baby Sleep Topics Research"
  category: 'research' | 'audit' | 'strategy' | 'analysis' | 'recommendations';
  summary: string; // 2-3 line summary
  timestamp: number;
  markdown: string; // Full markdown content
  priority?: 'high' | 'normal' | 'low';
  status: 'unread' | 'read' | 'actioned';
}

class ItemsForReviewStore {
  private items: Map<string, ReviewItem> = new Map();
  private readonly STORAGE_KEY = 'items-for-review-v1';

  constructor() {
    this.load();
  }

  private load() {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.items = new Map(Object.entries(data));
      }
    } catch (e) {
      console.error('Error loading items for review:', e);
    }
  }

  private save() {
    if (typeof window === 'undefined') return;
    try {
      const data = Object.fromEntries(this.items);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new StorageEvent('storage', {
        key: this.STORAGE_KEY,
        newValue: JSON.stringify(data),
      }));
    } catch (e) {
      console.error('Error saving items for review:', e);
    }
  }

  /**
   * Add a new research report or analysis
   */
  addItem(item: Omit<ReviewItem, 'id' | 'timestamp' | 'status'> & { id?: string }): ReviewItem {
    const id = item.id || `review-${Date.now()}`;
    const newItem: ReviewItem = {
      id,
      title: item.title,
      category: item.category,
      summary: item.summary,
      markdown: item.markdown,
      priority: item.priority || 'normal',
      timestamp: Date.now(),
      status: 'unread',
    };
    this.items.set(id, newItem);
    this.save();
    console.log(`✅ Added to Items for Review: ${item.title}`);
    return newItem;
  }

  /**
   * Mark item as read
   */
  markRead(id: string) {
    const item = this.items.get(id);
    if (item) {
      item.status = 'read';
      this.save();
    }
  }

  /**
   * Mark item as actioned
   */
  markActioned(id: string) {
    const item = this.items.get(id);
    if (item) {
      item.status = 'actioned';
      this.save();
    }
  }

  /**
   * Get all items, sorted by priority then timestamp
   */
  getItems(filterStatus?: ReviewItem['status']): ReviewItem[] {
    let items = Array.from(this.items.values());
    if (filterStatus) items = items.filter(i => i.status === filterStatus);
    
    // Sort: high priority first, then by timestamp (newest first)
    return items.sort((a, b) => {
      const priorityOrder = { high: 0, normal: 1, low: 2 };
      const aPriority = priorityOrder[a.priority || 'normal'];
      const bPriority = priorityOrder[b.priority || 'normal'];
      if (aPriority !== bPriority) return aPriority - bPriority;
      return b.timestamp - a.timestamp;
    });
  }

  /**
   * Get item by ID
   */
  getItem(id: string): ReviewItem | undefined {
    return this.items.get(id);
  }

  /**
   * Get count by status
   */
  getCount(status?: ReviewItem['status']): number {
    if (!status) return this.items.size;
    return Array.from(this.items.values()).filter(i => i.status === status).length;
  }

  /**
   * Remove an item
   */
  removeItem(id: string) {
    const item = this.items.get(id);
    if (item) {
      this.items.delete(id);
      this.save();
      console.log(`✅ Removed from Items for Review: ${item.title}`);
    }
  }

  /**
   * Clear all items
   */
  clear() {
    this.items.clear();
    this.save();
    console.log('✅ Cleared all items for review');
  }
}

export const itemsForReviewStore = new ItemsForReviewStore();
