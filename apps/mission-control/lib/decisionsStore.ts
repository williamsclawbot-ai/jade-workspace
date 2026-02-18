/**
 * Decisions Store - Manages decisions and their reasoning
 */

export interface Decision {
  id: string;
  title: string;
  description?: string;
  reasoning?: string;
  status: 'pending' | 'made' | 'implemented' | 'archived';
  date?: string; // ISO date string when decision was made
  category?: string;
  tags?: string[];
  outcome?: string;
  createdAt?: string;
}

const STORAGE_KEY = 'jade_decisions';

const DEFAULT_DECISIONS: Decision[] = [
  {
    id: '1',
    title: 'Switch to daily content uploads',
    status: 'made',
    reasoning: 'Increased engagement metrics, better algorithm reach',
    category: 'content-strategy',
  },
  {
    id: '2',
    title: 'Expand to TikTok',
    status: 'pending',
    reasoning: 'Reach younger audience, test platform performance',
    category: 'growth',
  },
];

class DecisionsStore {
  private decisions: Decision[] = [];

  constructor() {
    this.load();
  }

  private load() {
    if (typeof window === 'undefined') {
      this.decisions = DEFAULT_DECISIONS;
      return;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    this.decisions = stored ? JSON.parse(stored) : DEFAULT_DECISIONS;
  }

  private save() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.decisions));
  }

  getDecisions(): Decision[] {
    return this.decisions;
  }

  getByStatus(status: Decision['status']): Decision[] {
    return this.decisions.filter((d) => d.status === status);
  }

  getPending(): Decision[] {
    return this.getByStatus('pending');
  }

  getRecent(days: number = 30): Decision[] {
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    return this.decisions.filter((d) => (d.date || d.createdAt || '') >= cutoff);
  }

  getByCategory(category: string): Decision[] {
    return this.decisions.filter((d) => d.category === category);
  }

  addDecision(decision: Omit<Decision, 'id'>): Decision {
    const newDecision: Decision = {
      ...decision,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    this.decisions.push(newDecision);
    this.save();
    return newDecision;
  }

  updateDecision(id: string, updates: Partial<Decision>): Decision | null {
    const decision = this.decisions.find((d) => d.id === id);
    if (!decision) return null;
    Object.assign(decision, updates);
    this.save();
    return decision;
  }

  deleteDecision(id: string): boolean {
    const index = this.decisions.findIndex((d) => d.id === id);
    if (index === -1) return false;
    this.decisions.splice(index, 1);
    this.save();
    return true;
  }

  updateStatus(id: string, status: Decision['status']): Decision | null {
    return this.updateDecision(id, { status });
  }

  getUrgentForToday(): Decision[] {
    return this.getPending();
  }
}

export const decisionsStore = new DecisionsStore();
