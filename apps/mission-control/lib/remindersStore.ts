/**
 * Reminders Store - Manages reminders to send to John
 */

export interface Reminder {
  id: string;
  text: string;
  dueTime?: string; // HH:MM format
  dueDate?: string; // ISO date string
  sent: boolean;
  sentAt?: string; // ISO timestamp
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  createdAt?: string;
}

const STORAGE_KEY = 'jade_reminders';

const DEFAULT_REMINDERS: Reminder[] = [
  {
    id: '1',
    text: 'Take out bins',
    dueTime: '09:00',
    dueDate: new Date().toISOString().split('T')[0],
    sent: false,
    priority: 'high',
    category: 'household',
  },
  {
    id: '2',
    text: 'Grocery shopping',
    dueTime: '17:00',
    sent: false,
    priority: 'medium',
  },
];

class RemindersStore {
  private reminders: Reminder[] = [];

  constructor() {
    this.load();
  }

  private load() {
    if (typeof window === 'undefined') {
      this.reminders = DEFAULT_REMINDERS;
      return;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    this.reminders = stored ? JSON.parse(stored) : DEFAULT_REMINDERS;
  }

  private save() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.reminders));
  }

  getReminders(): Reminder[] {
    return this.reminders;
  }

  getTodayReminders(): Reminder[] {
    const today = new Date().toISOString().split('T')[0];
    return this.reminders.filter((r) => r.dueDate === today || !r.dueDate);
  }

  getUnsentReminders(): Reminder[] {
    return this.reminders.filter((r) => !r.sent);
  }

  addReminder(reminder: Omit<Reminder, 'id'>): Reminder {
    const newReminder: Reminder = {
      ...reminder,
      id: Date.now().toString(),
      sent: false,
      createdAt: new Date().toISOString(),
    };
    this.reminders.push(newReminder);
    this.save();
    return newReminder;
  }

  updateReminder(id: string, updates: Partial<Reminder>): Reminder | null {
    const reminder = this.reminders.find((r) => r.id === id);
    if (!reminder) return null;
    Object.assign(reminder, updates);
    this.save();
    return reminder;
  }

  deleteReminder(id: string): boolean {
    const index = this.reminders.findIndex((r) => r.id === id);
    if (index === -1) return false;
    this.reminders.splice(index, 1);
    this.save();
    return true;
  }

  sendReminder(id: string): Reminder | null {
    const reminder = this.reminders.find((r) => r.id === id);
    if (!reminder) return null;
    reminder.sent = true;
    reminder.sentAt = new Date().toISOString();
    this.save();
    return reminder;
  }

  getUrgentForToday(): Reminder[] {
    return this.getUnsentReminders().filter((r) => {
      const today = new Date().toISOString().split('T')[0];
      return r.dueDate === today || !r.dueDate;
    });
  }
}

export const remindersStore = new RemindersStore();
