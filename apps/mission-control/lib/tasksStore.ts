/**
 * Tasks Store - Manages management/business tasks
 */

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  dueDate?: string; // ISO date string
  priority?: 'low' | 'medium' | 'high';
  owner?: string;
  category?: string;
  createdAt?: string;
}

const STORAGE_KEY = 'jade_tasks';

const DEFAULT_TASKS: Task[] = [
  {
    id: '1',
    title: 'Review content calendar',
    status: 'todo',
    priority: 'high',
    category: 'content',
  },
  {
    id: '2',
    title: 'Update metrics dashboard',
    status: 'in-progress',
    priority: 'medium',
    category: 'metrics',
  },
];

class TasksStore {
  private tasks: Task[] = [];

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

  getTasks(): Task[] {
    return this.tasks;
  }

  getByStatus(status: Task['status']): Task[] {
    return this.tasks.filter((t) => t.status === status);
  }

  getTodayTasks(): Task[] {
    const today = new Date().toISOString().split('T')[0];
    return this.tasks.filter(
      (t) => t.status !== 'done' && (!t.dueDate || t.dueDate <= today)
    );
  }

  getByCategory(category: string): Task[] {
    return this.tasks.filter((t) => t.category === category);
  }

  addTask(task: Omit<Task, 'id'>): Task {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    this.tasks.push(newTask);
    this.save();
    return newTask;
  }

  updateTask(id: string, updates: Partial<Task>): Task | null {
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

  updateStatus(id: string, status: Task['status']): Task | null {
    return this.updateTask(id, { status });
  }

  getUrgentForToday(): Task[] {
    return this.getTodayTasks().filter((t) => t.priority === 'high' || t.status === 'in-progress');
  }
}

export const tasksStore = new TasksStore();
