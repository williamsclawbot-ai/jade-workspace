/**
 * Unified Dashboard Store - Orchestrates all data from individual stores
 * This is the command center that pulls urgent items for the TODAY tab
 */

import { ContentItem } from './contentStore';
import { Meal } from './mealsStore';
import { CleaningTask } from './cleaningStore';
import { Appointment } from './appointmentsStore';
import { Reminder } from './remindersStore';
import { TodoItem } from './todoStore';
import { ShoppingItem } from './shoppingStore';
import { Task } from './tasksStore';
import { Note } from './notesStore';
import { Decision } from './decisionsStore';
import { QuickAction } from './quickActionsStore';

export interface UrgentItem {
  id: string;
  title: string;
  type: 'content' | 'meal' | 'cleaning' | 'appointment' | 'reminder' | 'todo' | 'shopping' | 'task' | 'note' | 'decision' | 'quick-action';
  section: 'BUSINESS' | 'HOME' | 'MANAGEMENT';
  priority: 'low' | 'medium' | 'high';
  action?: string; // Tab to navigate to
  actionButton?: {
    label: string;
    action: () => void;
  };
  timestamp?: string;
}

export interface DayProgress {
  percent: number;
  hours: number;
  minutes: number;
}

class UnifiedDashboardStore {
  private syncInterval: NodeJS.Timeout | null = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.startSync();
  }

  private startSync() {
    if (typeof window === 'undefined') return;

    // Poll every 1 second for changes
    this.syncInterval = setInterval(() => {
      this.notifyListeners();
    }, 1000);
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  getUrgentForToday(): UrgentItem[] {
    // This will be implemented by importing and calling each store's getUrgentForToday method
    // For now, we'll return a structured format
    const urgent: UrgentItem[] = [];

    // Will be populated by the component that uses this store
    return urgent;
  }

  getDayProgress(): DayProgress {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    const percent = Math.round((totalMinutes / 1440) * 100); // 1440 = 24 hours

    return {
      percent: Math.min(percent, 100),
      hours,
      minutes,
    };
  }

  getMetrics(): {
    contentDueForReview: number;
    appointmentsToday: number;
    urgentTodos: number;
    remindersUnsent: number;
    cleaningTasksRemaining: number;
    mealsToday: number;
  } {
    return {
      contentDueForReview: 0,
      appointmentsToday: 0,
      urgentTodos: 0,
      remindersUnsent: 0,
      cleaningTasksRemaining: 0,
      mealsToday: 0,
    };
  }

  cleanup() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
  }
}

export const unifiedDashboardStore = new UnifiedDashboardStore();
