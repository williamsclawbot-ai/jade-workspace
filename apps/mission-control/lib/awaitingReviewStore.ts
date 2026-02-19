/**
 * Awaiting Review Store
 * Tracks items that need Jade's approval, review, or decision
 * Clean, scannable overview - no detail dumps
 */

export interface AwaitingReviewItem {
  id: string;
  itemName: string; // What is this about? (e.g., "Blog post title", "Product launch strategy")
  topic: string; // Category (e.g., "Content", "Product", "Decision")
  description?: string; // Optional brief context (1-2 lines max)
  linkLabel?: string; // Text for the link (e.g., "View draft in Content tab")
  linkPath?: string; // Where to find full detail (e.g., "#content", "https://...")
  status: 'ready-for-review' | 'feedback-given' | 'approved' | 'pending-decision';
  statusLabel?: string; // Custom status display
  addedAt: number;
  addedBy?: string; // Who added it (default: 'Felicia')
  dueDate?: string; // ISO date if time-sensitive
  priority?: 'high' | 'normal' | 'low'; // Visual indicator
}

class AwaitingReviewStore {
  private items: Map<string, AwaitingReviewItem> = new Map();
  private readonly STORAGE_KEY = 'awaiting-review-items-v1';

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
      console.error('Error loading awaiting review items:', e);
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
      console.error('Error saving awaiting review items:', e);
    }
  }

  /**
   * Add an item awaiting review
   * Auto-generates ID if not provided
   */
  addItem(item: Omit<AwaitingReviewItem, 'id' | 'addedAt'> & { id?: string }): AwaitingReviewItem {
    const id = item.id || `review-${Date.now()}`;
    const newItem: AwaitingReviewItem = {
      id,
      itemName: item.itemName,
      topic: item.topic,
      description: item.description,
      linkLabel: item.linkLabel,
      linkPath: item.linkPath,
      status: item.status,
      statusLabel: item.statusLabel,
      addedAt: Date.now(),
      addedBy: item.addedBy || 'Felicia',
      dueDate: item.dueDate,
      priority: item.priority || 'normal',
    };
    this.items.set(id, newItem);
    this.save();
    console.log(`✅ Added to Awaiting Review: ${item.itemName}`);
    return newItem;
  }

  /**
   * Update an item's status (most common operation)
   */
  updateStatus(id: string, status: AwaitingReviewItem['status'], statusLabel?: string) {
    const item = this.items.get(id);
    if (item) {
      item.status = status;
      if (statusLabel) item.statusLabel = statusLabel;
      this.save();
      console.log(`✅ Updated review item: ${item.itemName} → ${status}`);
    }
  }

  /**
   * Mark as approved (removes from awaiting)
   */
  approve(id: string) {
    this.updateStatus(id, 'approved');
  }

  /**
   * Get all items, optionally filtered by status or topic
   */
  getItems(filterStatus?: AwaitingReviewItem['status'], filterTopic?: string): AwaitingReviewItem[] {
    let items = Array.from(this.items.values());
    if (filterStatus) items = items.filter(i => i.status === filterStatus);
    if (filterTopic) items = items.filter(i => i.topic === filterTopic);
    // Sort: high priority first, then by date added (newest first)
    return items.sort((a, b) => {
      const priorityOrder = { high: 0, normal: 1, low: 2 };
      const aPriority = priorityOrder[a.priority || 'normal'];
      const bPriority = priorityOrder[b.priority || 'normal'];
      if (aPriority !== bPriority) return aPriority - bPriority;
      return b.addedAt - a.addedAt;
    });
  }

  /**
   * Get count by status
   */
  getCountByStatus(status: AwaitingReviewItem['status']): number {
    return Array.from(this.items.values()).filter(i => i.status === status).length;
  }

  /**
   * Remove an item (after approved or dismissed)
   */
  removeItem(id: string) {
    const item = this.items.get(id);
    if (item) {
      this.items.delete(id);
      this.save();
      console.log(`✅ Removed from Awaiting Review: ${item.itemName}`);
    }
  }

  /**
   * Clear all items (caution)
   */
  clear() {
    this.items.clear();
    this.save();
    console.log('✅ Cleared all awaiting review items');
  }
}

export const awaitingReviewStore = new AwaitingReviewStore();
