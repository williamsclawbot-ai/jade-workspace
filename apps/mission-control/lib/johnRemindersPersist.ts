/**
 * John Reminders Persistence
 * Server-side file storage so cron jobs can access reminders
 * Syncs with localStorage automatically
 */

import fs from 'fs';
import path from 'path';

export interface JohnReminder {
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

const REMINDERS_FILE = path.join(process.cwd(), 'data', 'john-reminders.json');

// Ensure data directory exists
function ensureDataDir() {
  const dir = path.dirname(REMINDERS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadRemindersFromFile(): JohnReminder[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(REMINDERS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(REMINDERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading reminders file:', error);
    return [];
  }
}

function saveRemindersToFile(reminders: JohnReminder[]) {
  try {
    ensureDataDir();
    fs.writeFileSync(REMINDERS_FILE, JSON.stringify(reminders, null, 2));
  } catch (error) {
    console.error('Error saving reminders file:', error);
  }
}

export function getUnsentReminders(): JohnReminder[] {
  const reminders = loadRemindersFromFile();
  return reminders.filter((r) => !r.sent);
}

export function getOutstandingReminders(): JohnReminder[] {
  const reminders = loadRemindersFromFile();
  // Outstanding = unsent OR sent but not yet marked as completed
  return reminders.filter((r) => !r.sent);
}

export function markReminderSent(id: string): JohnReminder | null {
  const reminders = loadRemindersFromFile();
  const reminder = reminders.find((r) => r.id === id);
  if (!reminder) return null;

  reminder.sent = true;
  reminder.sentAt = new Date().toISOString();
  saveRemindersToFile(reminders);
  return reminder;
}

export function addReminder(text: string, options?: Partial<JohnReminder>): JohnReminder {
  const reminders = loadRemindersFromFile();
  const newReminder: JohnReminder = {
    id: Date.now().toString(),
    text,
    sent: false,
    createdAt: new Date().toISOString(),
    ...options,
  };
  reminders.push(newReminder);
  saveRemindersToFile(reminders);
  return newReminder;
}

export function updateReminder(id: string, updates: Partial<JohnReminder>): JohnReminder | null {
  const reminders = loadRemindersFromFile();
  const reminder = reminders.find((r) => r.id === id);
  if (!reminder) return null;

  Object.assign(reminder, updates);
  saveRemindersToFile(reminders);
  return reminder;
}

export function getAllReminders(): JohnReminder[] {
  return loadRemindersFromFile();
}
