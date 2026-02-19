/**
 * Macro Targets Store
 * Manages editable macro targets for Jade
 */

export interface MacroTargets {
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
}

const STORAGE_KEY = 'macro-targets-v1';

const DEFAULT_TARGETS: MacroTargets = {
  calories: 1550,
  protein: 120,
  fats: 45,
  carbs: 166,
};

class MacroTargetsStoreClass {
  private targets: MacroTargets = DEFAULT_TARGETS;

  constructor() {
    this.load();
  }

  private load() {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.targets = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading macro targets:', e);
    }
  }

  private save() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.targets));
      // Trigger storage event for real-time sync
      window.dispatchEvent(new StorageEvent('storage', {
        key: STORAGE_KEY,
        newValue: JSON.stringify(this.targets),
      }));
    } catch (e) {
      console.error('Error saving macro targets:', e);
    }
  }

  get(): MacroTargets {
    return { ...this.targets };
  }

  set(targets: MacroTargets): void {
    this.targets = targets;
    this.save();
  }

  reset(): void {
    this.targets = DEFAULT_TARGETS;
    this.save();
  }
}

export const macroTargetsStore = new MacroTargetsStoreClass();
