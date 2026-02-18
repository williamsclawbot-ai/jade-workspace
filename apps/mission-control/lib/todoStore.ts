/**
 * To-Do Store - Manages general to-do items
 */

export interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string; // ISO date string
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  notes?: string;
  createdAt?: string;
}

const STORAGE_KEY = 'jade_todos';

const DEFAULT_TODOS: TodoItem[] = [
  {
    id: '1',
    title: 'Meal plan for Sunday',
    completed: false,
    priority: 'medium',
    category: 'household',
  },
  {
    id: '2',
    title: 'Review content for next week',
    completed: false,
    priority: 'high',
    category: 'business',
  },
];

class TodoStore {
  private todos: TodoItem[] = [];

  constructor() {
    this.load();
  }

  private load() {
    if (typeof window === 'undefined') {
      this.todos = DEFAULT_TODOS;
      return;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    this.todos = stored ? JSON.parse(stored) : DEFAULT_TODOS;
  }

  private save() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos));
  }

  getTodos(): TodoItem[] {
    return this.todos;
  }

  getIncompleted(): TodoItem[] {
    return this.todos.filter((t) => !t.completed);
  }

  getTodayTodos(): TodoItem[] {
    const today = new Date().toISOString().split('T')[0];
    return this.todos.filter(
      (t) => !t.completed && (!t.dueDate || t.dueDate <= today)
    );
  }

  getByCategory(category: string): TodoItem[] {
    return this.todos.filter((t) => t.category === category);
  }

  addTodo(todo: Omit<TodoItem, 'id'>): TodoItem {
    const newTodo: TodoItem = {
      ...todo,
      id: Date.now().toString(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    this.todos.push(newTodo);
    this.save();
    return newTodo;
  }

  updateTodo(id: string, updates: Partial<TodoItem>): TodoItem | null {
    const todo = this.todos.find((t) => t.id === id);
    if (!todo) return null;
    Object.assign(todo, updates);
    this.save();
    return todo;
  }

  deleteTodo(id: string): boolean {
    const index = this.todos.findIndex((t) => t.id === id);
    if (index === -1) return false;
    this.todos.splice(index, 1);
    this.save();
    return true;
  }

  toggleTodo(id: string): TodoItem | null {
    const todo = this.todos.find((t) => t.id === id);
    if (!todo) return null;
    todo.completed = !todo.completed;
    this.save();
    return todo;
  }

  getUrgentForToday(): TodoItem[] {
    return this.getTodayTodos();
  }
}

export const todoStore = new TodoStore();
