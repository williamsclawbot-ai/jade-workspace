/**
 * Notes Store - Manages notes and ideas
 */

export interface Note {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  category?: string;
  pinned?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const STORAGE_KEY = 'jade_notes';

const DEFAULT_NOTES: Note[] = [
  {
    id: '1',
    title: 'Video ideas for next month',
    content: 'Sleep schedules, nap transitions, bedtime routines',
    tags: ['content', 'ideas'],
    category: 'content',
    pinned: true,
  },
  {
    id: '2',
    title: 'Product features to explore',
    content: 'Better analytics, customer segmentation, automation',
    tags: ['product', 'future'],
    category: 'business',
  },
];

class NotesStore {
  private notes: Note[] = [];

  constructor() {
    this.load();
  }

  private load() {
    if (typeof window === 'undefined') {
      this.notes = DEFAULT_NOTES;
      return;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    this.notes = stored ? JSON.parse(stored) : DEFAULT_NOTES;
  }

  private save() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.notes));
  }

  getNotes(): Note[] {
    return this.notes.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return (b.updatedAt || b.createdAt || '').localeCompare(a.updatedAt || a.createdAt || '');
    });
  }

  searchNotes(query: string): Note[] {
    const q = query.toLowerCase();
    return this.notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        (n.tags || []).some((tag) => tag.toLowerCase().includes(q))
    );
  }

  getByCategory(category: string): Note[] {
    return this.notes.filter((n) => n.category === category);
  }

  getPinned(): Note[] {
    return this.notes.filter((n) => n.pinned);
  }

  addNote(note: Omit<Note, 'id'>): Note {
    const newNote: Note = {
      ...note,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.notes.push(newNote);
    this.save();
    return newNote;
  }

  updateNote(id: string, updates: Partial<Note>): Note | null {
    const note = this.notes.find((n) => n.id === id);
    if (!note) return null;
    Object.assign(note, updates, { updatedAt: new Date().toISOString() });
    this.save();
    return note;
  }

  deleteNote(id: string): boolean {
    const index = this.notes.findIndex((n) => n.id === id);
    if (index === -1) return false;
    this.notes.splice(index, 1);
    this.save();
    return true;
  }

  togglePin(id: string): Note | null {
    const note = this.notes.find((n) => n.id === id);
    if (!note) return null;
    note.pinned = !note.pinned;
    this.save();
    return note;
  }

  getUrgentForToday(): Note[] {
    return this.getPinned();
  }
}

export const notesStore = new NotesStore();
