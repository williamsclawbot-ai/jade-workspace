/**
 * Quick Actions Store - Manages quick action shortcuts
 */

export interface QuickAction {
  id: string;
  label: string;
  description?: string;
  action: string; // Tab name or URL
  icon?: string;
  color?: string;
  position?: number;
  createdAt?: string;
}

const STORAGE_KEY = 'jade_quick_actions';

const DEFAULT_ACTIONS: QuickAction[] = [
  {
    id: '1',
    label: 'New Content',
    action: 'content',
    icon: '✏️',
    color: 'bg-blue-100',
    position: 1,
  },
  {
    id: '2',
    label: 'Check Newsletter',
    action: 'weekly-newsletter',
    icon: '📧',
    color: 'bg-purple-100',
    position: 2,
  },
  {
    id: '3',
    label: 'Add Task',
    action: 'tasks',
    icon: '✅',
    color: 'bg-green-100',
    position: 3,
  },
  {
    id: '4',
    label: 'Meal Plan',
    action: 'meal-planning',
    icon: '🍽️',
    color: 'bg-orange-100',
    position: 4,
  },
];

class QuickActionsStore {
  private actions: QuickAction[] = [];

  constructor() {
    this.load();
  }

  private load() {
    if (typeof window === 'undefined') {
      this.actions = DEFAULT_ACTIONS;
      return;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    this.actions = stored ? JSON.parse(stored) : DEFAULT_ACTIONS;
  }

  private save() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.actions));
  }

  getActions(): QuickAction[] {
    return this.actions.sort((a, b) => (a.position || 0) - (b.position || 0));
  }

  addAction(action: Omit<QuickAction, 'id'>): QuickAction {
    const newAction: QuickAction = {
      ...action,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    this.actions.push(newAction);
    this.save();
    return newAction;
  }

  updateAction(id: string, updates: Partial<QuickAction>): QuickAction | null {
    const action = this.actions.find((a) => a.id === id);
    if (!action) return null;
    Object.assign(action, updates);
    this.save();
    return action;
  }

  deleteAction(id: string): boolean {
    const index = this.actions.findIndex((a) => a.id === id);
    if (index === -1) return false;
    this.actions.splice(index, 1);
    this.save();
    return true;
  }

  reorderAction(id: string, newPosition: number): QuickAction | null {
    const action = this.actions.find((a) => a.id === id);
    if (!action) return null;
    action.position = newPosition;
    this.save();
    return action;
  }

  getUrgentForToday(): QuickAction[] {
    return this.getActions();
  }
}

export const quickActionsStore = new QuickActionsStore();
