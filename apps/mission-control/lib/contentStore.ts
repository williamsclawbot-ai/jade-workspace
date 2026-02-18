// Simple content store - complex version has syntax issues
// This is a temporary fix to get the build working

import { useEffect, useState } from 'react';

export interface ContentItem {
  id: string;
  day: string;
  title: string;
  type: 'Reel' | 'Carousel' | 'Static' | 'Newsletter' | 'Email';
  description: string;
  status: string;
  lastUpdated?: string;
  feedback?: string;
  feedbackDate?: string;
  details?: string;
  waitingOn?: string;
  duration?: string;
  setting?: string;
  reviewStatus?: string;
  reviewDueDate?: string;
  createdAt?: string;
  script?: string;
  caption?: string;
  onScreenText?: string;
  postTime?: string;
  [key: string]: any; // Allow any other properties
}

const DEFAULT_ITEMS: ContentItem[] = [
  {
    id: '1',
    day: 'Monday',
    title: 'The 4-Month Sleep Regression',
    type: 'Reel',
    description: 'Understanding the 4-month sleep regression and what parents can do',
    status: 'Due for Review',
    details: 'Educational content about developmental milestones and sleep'
  },
  {
    id: '2',
    day: 'Tuesday',
    title: '5 Signs You\'re More Exhausted Than You\'re Admitting',
    type: 'Carousel',
    description: 'Identifying hidden signs of parental exhaustion that go beyond tired',
    status: 'Due for Review',
    details: 'Recognition and validation content for exhausted parents'
  }
];

class ContentStoreClass {
  private items: ContentItem[] = [];

  constructor() {
    this.load();
  }

  private load() {
    if (typeof window === 'undefined') {
      this.items = DEFAULT_ITEMS;
      return;
    }
    const stored = localStorage.getItem('contentStore');
    this.items = stored ? JSON.parse(stored) : DEFAULT_ITEMS;
  }

  private save() {
    if (typeof window === 'undefined') return;
    localStorage.setItem('contentStore', JSON.stringify(this.items));
  }

  getAll(): ContentItem[] {
    return this.items;
  }

  get(id: string): ContentItem | undefined {
    return this.items.find(item => item.id === id);
  }

  add(item: Omit<ContentItem, 'id'>): ContentItem {
    const newItem: ContentItem = { ...item, id: Date.now().toString() } as ContentItem;
    this.items.push(newItem);
    this.save();
    return newItem;
  }

  create(item: Omit<ContentItem, 'id'>): ContentItem {
    return this.add(item);
  }

  update(id: string, updates: Partial<ContentItem>): ContentItem | null {
    const index = this.items.findIndex(item => item.id === id);
    if (index !== -1) {
      this.items[index] = { ...this.items[index], ...updates, lastUpdated: new Date().toISOString() };
      this.save();
      return this.items[index];
    }
    return null;
  }

  delete(id: string) {
    this.items = this.items.filter(item => item.id !== id);
    this.save();
  }
}

const ContentStore = new ContentStoreClass();
export default ContentStore;
