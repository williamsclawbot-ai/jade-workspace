/**
 * Cleaning Store - Manages cleaning tasks
 */

export interface CleaningTask {
  id: string;
  title: string;
  day: string;
  dueDate?: string; // ISO date string
  completed: boolean;
  recurring?: boolean;
  recurrencePattern?: 'daily' | 'weekly' | 'monthly';
  priority?: 'low' | 'medium' | 'high';
  notes?: string;
  createdAt?: string;
}

const STORAGE_KEY = 'jade_cleaning_tasks';

const DEFAULT_TASKS: CleaningTask[] = [
  {
    id: '1',
    title: 'Vacuuming',
    day: 'Monday',
    completed: false,
    recurring: true,
    recurrencePattern: 'weekly',
    priority: 'high',
  },
  {
    id: '2',
    title: 'Kitchen cleaning',
    day: 'Monday',
    completed: false,
    recurring: true,
    recurrencePattern: 'weekly',
    priority: 'high',
  },
  {
    id: '3',
    title: 'Bathrooms',
    day: 'Wednesday',
    completed: false,
    recurring: true,
    recurrencePattern: 'weekly',
    priority: 'medium',
  },
  {
    id: '4',
    title: 'Bedrooms',
    day: 'Friday',
    completed: false,
    recurring: true,
    recurrencePattern: 'weekly',
    priority: 'medium',
  },
];

class CleaningStore {
  private tasks: CleaningTask[] = [];

  constructor() {
    this.load();
  }

  private load() {
    if (typeof window === 'undefined') {
      this.tasks = DEFAULT_TASKS;
      return;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    this.tasks = stored ? JSON.parse(stored) : DEFAULT_TASKS;
  }

  private save() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks));
  }

  getTasks(): CleaningTask[] {
    return this.tasks;
  }

  getTasksForDay(day: string): CleaningTask[] {
    return this.tasks.filter((t) => t.day === day);
  }

  getTodayTasks(): CleaningTask[] {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return this.getTasksForDay(today);
  }

  addTask(task: Omit<CleaningTask, 'id'>): CleaningTask {
    const newTask: CleaningTask = {
      ...task,
      id: Date.now().toString(),
      completed: false,
    };
    this.tasks.push(newTask);
    this.save();
    return newTask;
  }

  updateTask(id: string, updates: Partial<CleaningTask>): CleaningTask | null {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) return null;
    Object.assign(task, updates);
    this.save();
    return task;
  }

  deleteTask(id: string): boolean {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;
    this.tasks.splice(index, 1);
    this.save();
    return true;
  }

  toggleTask(id: string): CleaningTask | null {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) return null;
    task.completed = !task.completed;
    this.save();
    return task;
  }

  getUrgentForToday(): CleaningTask[] {
    return this.getTodayTasks().filter((t) => !t.completed);
  }
}

export const cleaningStore = new CleaningStore();
