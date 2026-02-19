/**
 * Overnight Review Store
 * Tracks work completed while Jade is away (background tasks, cron jobs, night builds)
 * Organized for quick morning scan
 */

export interface OvernightWorkItem {
  id: string;
  completedAt: number; // ISO timestamp
  taskName: string; // What she asked me to do (e.g., "Generate newsletter content")
  summary: string; // Concise findings/output (1-3 sentences, NOT a wall of text)
  linkLabel?: string; // Text for link to full detail
  linkPath?: string; // Where to find it (e.g., "#content", "NEWSLETTER_API_FIX.md")
  status: 'done' | 'needs-review' | 'needs-decision'; // Clear status
  statusDetail?: string; // Additional context if needed
  category?: string; // 'bug-fix', 'content', 'automation', 'analysis', 'build', etc.
  createdBy?: string; // Default: 'Felicia'
}

class OvernightReviewStore {
  private items: Map<string, OvernightWorkItem> = new Map();
  private readonly STORAGE_KEY = 'overnight-review-items-v1';
  private readonly MAX_DAYS_STORED = 7; // Keep last 7 days

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
      console.error('Error loading overnight review items:', e);
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
      console.error('Error saving overnight review items:', e);
    }
  }

  /**
   * Clean up old items (older than MAX_DAYS_STORED)
   */
  private cleanup() {
    const now = Date.now();
    const maxAge = this.MAX_DAYS_STORED * 24 * 60 * 60 * 1000;
    const toRemove: string[] = [];

    this.items.forEach((item, id) => {
      if (now - item.completedAt > maxAge) {
        toRemove.push(id);
      }
    });

    toRemove.forEach(id => this.items.delete(id));
    if (toRemove.length > 0) this.save();
  }

  /**
   * Log completed work
   * Call this whenever you finish a background task
   */
  logWork(work: Omit<OvernightWorkItem, 'id' | 'completedAt' | 'createdBy'> & { 
    completedAt?: number;
    id?: string;
  }): OvernightWorkItem {
    const id = work.id || `overnight-${Date.now()}`;
    const newItem: OvernightWorkItem = {
      id,
      completedAt: work.completedAt || Date.now(),
      taskName: work.taskName,
      summary: work.summary,
      linkLabel: work.linkLabel,
      linkPath: work.linkPath,
      status: work.status,
      statusDetail: work.statusDetail,
      category: work.category,
      createdBy: 'Felicia',
    };
    this.items.set(id, newItem);
    this.save();
    this.cleanup(); // Remove old entries
    console.log(`✅ Logged overnight work: ${work.taskName}`);
    return newItem;
  }

  /**
   * Get all items grouped by date for morning view
   * Format: { "2026-02-20": [...items], "2026-02-19": [...items], ... }
   */
  getItemsByDate(): Record<string, OvernightWorkItem[]> {
    const byDate: Record<string, OvernightWorkItem[]> = {};
    const now = new Date();

    Array.from(this.items.values()).forEach(item => {
      const itemDate = new Date(item.completedAt);
      const dateStr = itemDate.toISOString().split('T')[0]; // YYYY-MM-DD

      if (!byDate[dateStr]) byDate[dateStr] = [];
      byDate[dateStr].push(item);
    });

    // Sort dates descending (most recent first)
    const sorted: Record<string, OvernightWorkItem[]> = {};
    Object.keys(byDate)
      .sort()
      .reverse()
      .forEach(date => {
        sorted[date] = byDate[date];
      });

    return sorted;
  }

  /**
   * Get items needing review/decision for this morning
   */
  getItemsNeedingAttention(): OvernightWorkItem[] {
    return Array.from(this.items.values())
      .filter(i => i.status !== 'done')
      .sort((a, b) => b.completedAt - a.completedAt);
  }

  /**
   * Format work item for display (concise)
   */
  formatForDisplay(item: OvernightWorkItem): string {
    const time = new Date(item.completedAt).toLocaleTimeString('en-AU', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    return `${time} — ${item.taskName}`;
  }

  /**
   * Clear items older than a certain date
   */
  clearBefore(dateStr: string) {
    const cutoff = new Date(dateStr).getTime();
    const toRemove: string[] = [];

    this.items.forEach((item, id) => {
      if (item.completedAt < cutoff) {
        toRemove.push(id);
      }
    });

    toRemove.forEach(id => this.items.delete(id));
    if (toRemove.length > 0) this.save();
    console.log(`✅ Cleared overnight review items before ${dateStr}`);
  }

  /**
   * Clear all
   */
  clear() {
    this.items.clear();
    this.save();
    console.log('✅ Cleared all overnight review items');
  }
}

export const overnightReviewStore = new OvernightReviewStore();
