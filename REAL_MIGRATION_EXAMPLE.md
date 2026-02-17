# Real Component Migration: QuickCaptureWidget

This document shows the exact changes needed to migrate the QuickCaptureWidget component from localStorage to Supabase.

## Original Component (localStorage)

Location: `/apps/mission-control/components/QuickCaptureWidget.tsx`

### Current Implementation
```typescript
'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowRight, Inbox, ChevronRight } from 'lucide-react';

interface CapturedItem {
  id: string;
  text: string;
  timestamp: Date;
  status: 'captured';
}

interface QuickCaptureWidgetProps {
  onNavigate?: (tab: string) => void;
}

export default function QuickCaptureWidget({ onNavigate }: QuickCaptureWidgetProps) {
  const [captures, setCaptures] = useState<CapturedItem[]>([]);
  const [newCapture, setNewCapture] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCaptures = localStorage.getItem('quickCaptures');
    if (savedCaptures) {
      try {
        const parsed = JSON.parse(savedCaptures);
        const withDates = parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }));
        setCaptures(withDates);
      } catch (error) {
        console.error('Failed to load captures:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage whenever captures change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('quickCaptures', JSON.stringify(captures));
    }
  }, [captures, isLoading]);

  const addCapture = () => {
    if (newCapture.trim()) {
      const newItem: CapturedItem = {
        id: `capture-${Date.now()}`,
        text: newCapture,
        timestamp: new Date(),
        status: 'captured',
      };
      setCaptures([newItem, ...captures]);
      setNewCapture('');
    }
  };

  const deleteCapture = (id: string) => {
    setCaptures(captures.filter(item => item.id !== id));
  };

  // ... rest of component
}
```

## Migration Steps

### Step 1: Update Interface to Match Database Schema

**Old interface:**
```typescript
interface CapturedItem {
  id: string;
  text: string;
  timestamp: Date;
  status: 'captured';
}
```

**New interface (matches Supabase schema):**
```typescript
interface CapturedItem {
  id: string;
  text: string;
  category?: string;
  created_at: string; // ISO string from database
  user_id: string;
}
```

### Step 2: Import useDatabase Hook

**Add import:**
```typescript
import { useDatabase } from '@/lib/useDatabase';
```

### Step 3: Replace useState + useEffect with useDatabase

**Replace this:**
```typescript
const [captures, setCaptures] = useState<CapturedItem[]>([]);
const [newCapture, setNewCapture] = useState('');
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const savedCaptures = localStorage.getItem('quickCaptures');
  if (savedCaptures) {
    try {
      const parsed = JSON.parse(savedCaptures);
      const withDates = parsed.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp),
      }));
      setCaptures(withDates);
    } catch (error) {
      console.error('Failed to load captures:', error);
    }
  }
  setIsLoading(false);
}, []);

useEffect(() => {
  if (!isLoading) {
    localStorage.setItem('quickCaptures', JSON.stringify(captures));
  }
}, [captures, isLoading]);
```

**With this:**
```typescript
const { data: captures, loading: isLoading, create, remove } = useDatabase<CapturedItem>({
  table: 'quick_captures',
});
const [newCapture, setNewCapture] = useState('');
```

That's it! The hook handles loading and saving automatically.

### Step 4: Replace addCapture Function

**Replace this:**
```typescript
const addCapture = () => {
  if (newCapture.trim()) {
    const newItem: CapturedItem = {
      id: `capture-${Date.now()}`,
      text: newCapture,
      timestamp: new Date(),
      status: 'captured',
    };
    setCaptures([newItem, ...captures]);
    setNewCapture('');
  }
};
```

**With this:**
```typescript
const addCapture = async () => {
  if (newCapture.trim()) {
    await create({
      text: newCapture,
      category: null, // optional
    });
    setNewCapture('');
  }
};
```

Note: The `id`, `created_at`, and `user_id` are added automatically by the database!

### Step 5: Replace deleteCapture Function

**Replace this:**
```typescript
const deleteCapture = (id: string) => {
  setCaptures(captures.filter(item => item.id !== id));
};
```

**With this:**
```typescript
const deleteCapture = async (id: string) => {
  await remove(id);
};
```

### Step 6: Update Date Formatting (if needed)

The database stores `created_at` as an ISO string. Update date formatting:

**Replace this:**
```typescript
const formatDate = (date: Date) => {
  const today = new Date();
  const dateToCheck = new Date(date);
  if (dateToCheck.toDateString() === today.toDateString()) {
    return 'Today';
  }
  return dateToCheck.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatTime = (date: Date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};
```

**With this:**
```typescript
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};
```

## Complete Migrated Component

```typescript
'use client';

import { useState } from 'react';
import { Plus, Trash2, ArrowRight, Inbox, ChevronRight } from 'lucide-react';
import { useDatabase } from '@/lib/useDatabase';

interface CapturedItem {
  id: string;
  text: string;
  category?: string;
  created_at: string;
  user_id: string;
}

interface QuickCaptureWidgetProps {
  onNavigate?: (tab: string) => void;
}

export default function QuickCaptureWidget({ onNavigate }: QuickCaptureWidgetProps) {
  const { data: captures, loading: isLoading, create, remove } = useDatabase<CapturedItem>({
    table: 'quick_captures',
  });
  const [newCapture, setNewCapture] = useState('');

  const addCapture = async () => {
    if (newCapture.trim()) {
      await create({
        text: newCapture,
        category: null,
      });
      setNewCapture('');
    }
  };

  const deleteCapture = async (id: string) => {
    await remove(id);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Show only last 3 captures in widget
  const displayCaptures = captures.slice(0, 3);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-jade-purple hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Inbox size={24} className="text-jade-purple" />
          <h3 className="text-lg font-semibold text-jade-purple">Quick Capture</h3>
          {captures.length > 0 && (
            <span className="ml-2 px-2 py-1 bg-jade-light rounded-full text-xs font-bold text-jade-purple">
              {captures.length}
            </span>
          )}
        </div>
        <button
          onClick={() => onNavigate?.('inbox')}
          className="text-jade-purple hover:bg-jade-light rounded-lg p-1 transition-colors"
          title="Open full Inbox"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Input Section */}
      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newCapture}
            onChange={(e) => setNewCapture(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCapture()}
            placeholder="What's on your mind?"
            className="flex-1 px-4 py-2 border border-jade-light rounded-lg focus:outline-none focus:ring-2 focus:ring-jade-purple"
          />
          <button
            onClick={addCapture}
            disabled={isLoading || !newCapture.trim()}
            className="bg-jade-purple hover:bg-jade-dark text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Captures List */}
      <div className="space-y-2 max-h-72 overflow-y-auto">
        {isLoading ? (
          <p className="text-gray-500 text-center py-4">Loading captures...</p>
        ) : displayCaptures.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No captures yet. Start capturing!</p>
        ) : (
          displayCaptures.map((capture) => (
            <div
              key={capture.id}
              className="group flex items-start justify-between p-3 rounded-lg hover:bg-jade-light transition-colors"
            >
              <div className="flex-1">
                <p className="text-gray-900 text-sm">{capture.text}</p>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs text-gray-500">
                    {formatDate(capture.created_at)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatTime(capture.created_at)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => deleteCapture(capture.id)}
                className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-all p-1"
                title="Delete capture"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* View All Button */}
      {captures.length > 3 && (
        <button
          onClick={() => onNavigate?.('inbox')}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2 text-jade-purple hover:bg-jade-light rounded-lg transition-colors text-sm font-semibold"
        >
          View all ({captures.length})
          <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
}
```

## Key Changes Summary

| What | Before | After |
|------|--------|-------|
| Data fetching | localStorage.getItem() | useDatabase({ table }) |
| Data saving | localStorage.setItem() | create(item) |
| Data deletion | array.filter() | remove(id) |
| Loading state | useState + useEffect | loading from hook |
| Date format | Date object | ISO string |
| ID generation | Date.now() | auto UUID |
| Error handling | manual try/catch | automatic in hook |

## Testing Checklist After Migration

- [ ] Opens without console errors
- [ ] Can add a capture
- [ ] Can delete a capture
- [ ] Captures persist after refresh
- [ ] Shows loading state while fetching
- [ ] Works with empty list
- [ ] Handles rapid adds/deletes
- [ ] Data appears on another device after refresh
- [ ] Edit on one device shows on other after refresh
- [ ] Works offline (uses localStorage fallback)
- [ ] Syncs when back online
- [ ] Delete on one device removes from other after refresh

## Rollback Plan

If something goes wrong, you can quickly revert:
1. Delete the useDatabase import
2. Bring back the old useState + useEffect for localStorage
3. Revert create/remove to setCaptures with localStorage.setItem
4. No data loss - Supabase data still exists, can re-migrate later
