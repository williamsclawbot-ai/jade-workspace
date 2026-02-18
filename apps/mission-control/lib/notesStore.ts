/**
 * Notes Store - Manages notes by section/tab
 */

export interface SectionNote {
  id: string;
  section: string; // e.g., 'Content', 'Meals', 'Cleaning', 'Newsletter', etc.
  text: string;
  timestamp: number; // Unix timestamp
  date: string; // ISO date string
}

const STORAGE_KEY = 'mission-control-section-notes';

class SectionNotesStore {
  private notes: SectionNote[] = [];
  private listeners: (() => void)[] = [];

  constructor() {
    this.load();
    this.setupStorageListener();
  }

  private load() {
    if (typeof window === 'undefined') {
      return;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        this.notes = JSON.parse(stored);
      } catch (e) {
        console.error('Failed to load section notes:', e);
        this.notes = [];
      }
    }
  }

  private save() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.notes));
    this.notifyListeners();
  }

  private setupStorageListener() {
    if (typeof window === 'undefined') return;
    
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) {
        this.load();
        this.notifyListeners();
      }
    });
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  // Get all notes
  getNotes(): SectionNote[] {
    return [...this.notes].sort((a, b) => b.timestamp - a.timestamp);
  }

  // Get notes for a specific section
  getBySection(section: string): SectionNote[] {
    return this.notes
      .filter(n => n.section === section)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  // Get unique sections with note counts
  getSections(): Array<{ section: string; count: number }> {
    const sections = new Map<string, number>();
    this.notes.forEach(note => {
      sections.set(note.section, (sections.get(note.section) || 0) + 1);
    });
    return Array.from(sections.entries())
      .map(([section, count]) => ({ section, count }))
      .sort((a, b) => a.section.localeCompare(b.section));
  }

  // Add a new note
  addNote(section: string, text: string): SectionNote {
    const now = new Date();
    const newNote: SectionNote = {
      id: Date.now().toString(),
      section,
      text,
      timestamp: now.getTime(),
      date: now.toISOString(),
    };
    this.notes.push(newNote);
    this.save();
    return newNote;
  }

  // Delete a note
  deleteNote(id: string): boolean {
    const index = this.notes.findIndex(n => n.id === id);
    if (index === -1) return false;
    this.notes.splice(index, 1);
    this.save();
    return true;
  }

  // Search notes by text
  searchNotes(query: string): SectionNote[] {
    const q = query.toLowerCase();
    return this.notes
      .filter(n => n.text.toLowerCase().includes(q) || n.section.toLowerCase().includes(q))
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  // Get all notes for display in management tab
  getAllNotes(): SectionNote[] {
    return this.getNotes();
  }

  // Clear all notes (use with caution)
  clearAll(): void {
    this.notes = [];
    this.save();
  }
}

export const sectionNotesStore = new SectionNotesStore();
