/**
 * Purchase History Storage
 * Tracks frequently purchased items with brand/type preferences
 * Allows smart suggestions when adding new items to shopping list
 */

export interface PurchasedItem {
  itemName: string; // Normalized name (lowercase, no extra spaces)
  brand?: string;
  type?: string;
  lastBought: string; // ISO date
  timesAdded: number;
}

export interface PurchaseHistoryStorage {
  [itemName: string]: PurchasedItem;
}

class PurchaseHistoryManager {
  private storageKey = 'purchase-history-v1';

  /**
   * Get all purchase history
   */
  getHistory(): PurchaseHistoryStorage {
    if (typeof window === 'undefined') return {};
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : {};
  }

  /**
   * Save an item to history
   * Called when user adds item to shopping list
   */
  recordPurchase(itemName: string, brand?: string, type?: string): void {
    const normalized = this.normalize(itemName);
    const history = this.getHistory();

    if (history[normalized]) {
      // Update existing
      history[normalized].lastBought = new Date().toISOString().split('T')[0];
      history[normalized].timesAdded += 1;
      if (brand) history[normalized].brand = brand;
      if (type) history[normalized].type = type;
    } else {
      // Create new entry
      history[normalized] = {
        itemName: normalized,
        brand,
        type,
        lastBought: new Date().toISOString().split('T')[0],
        timesAdded: 1,
      };
    }

    localStorage.setItem(this.storageKey, JSON.stringify(history));
  }

  /**
   * Search history for a given item
   * Returns suggestion if found
   * Example: itemName="yogurt" → returns { brand: "Jalna", type: "Greek", lastBought: "2026-02-19" }
   */
  getSuggestion(itemName: string): { brand?: string; type?: string; lastBought?: string } | null {
    const normalized = this.normalize(itemName);
    const history = this.getHistory();
    const match = history[normalized];

    if (match) {
      return {
        brand: match.brand,
        type: match.type,
        lastBought: match.lastBought,
      };
    }
    return null;
  }

  /**
   * Get formatted suggestion string
   * Example: "Jalna Greek yogurt (last bought Feb 19)"
   */
  getSuggestionString(itemName: string): string | null {
    const suggestion = this.getSuggestion(itemName);
    if (!suggestion) return null;

    const parts: string[] = [];
    if (suggestion.brand) parts.push(suggestion.brand);
    if (suggestion.type) parts.push(suggestion.type);

    const fullName = parts.length > 0 ? `${parts.join(' ')} ${itemName}` : itemName;
    const lastBought = suggestion.lastBought ? ` (last bought ${this.formatDate(suggestion.lastBought)})` : '';

    return fullName + lastBought;
  }

  /**
   * Clear entire history
   */
  clearHistory(): void {
    localStorage.removeItem(this.storageKey);
  }

  /**
   * Get top N frequently purchased items
   */
  getTopItems(limit: number = 10): PurchasedItem[] {
    const history = this.getHistory();
    return Object.values(history)
      .sort((a, b) => b.timesAdded - a.timesAdded)
      .slice(0, limit);
  }

  // ========== PRIVATE HELPERS ==========

  private normalize(itemName: string): string {
    return itemName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ');
  }

  private formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: '2-digit' });
  }
}

export const purchaseHistory = new PurchaseHistoryManager();
