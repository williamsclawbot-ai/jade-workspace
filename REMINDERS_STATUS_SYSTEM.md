# Reminders for John - Status Tracking System

## Overview

The **RemindersForJohn** component now includes a complete status tracking system for managing reminders with three distinct states: pending, sent, and completed.

## Status States

### 1. **Not sent to John** 🔴
- Initial state when a reminder is created
- Red badge indicating it hasn't been sent yet
- **Actions available:**
  - "Mark sent" button (📤 icon) → Changes to "Sent to John [date]"
  - "Mark completed" button (✅ icon) → Skips to completed
  - Delete button (🗑️ icon)

### 2. **Sent to John [date]** 🔵
- Reminder has been sent to John in a morning message
- Blue badge showing the exact date it was sent
- **Actions available:**
  - "Mark completed" button (✅ icon) → John finished the task
  - Delete button (🗑️ icon)

### 3. **Completed** ✅
- John has confirmed the task is finished
- Green badge, slightly dimmed UI
- **Actions available:**
  - Delete button (🗑️ icon) only

## Data Structure

```typescript
interface Reminder {
  id: string;                           // Unique identifier (UUID)
  text: string;                         // Reminder text
  status: 'not-sent' | 'sent' | 'completed';
  sentDate: string | null;              // Date format: "2026-02-17"
  createdDate: string;                  // Date format: "2026-02-17"
  priority: 'low' | 'normal' | 'high';  // Priority level
}
```

## UI Organization

The component is organized into three collapsible sections:

```
┌─────────────────────────────────────────┐
│ 📋 Pending (Not sent)        [Count: 3] │
├─────────────────────────────────────────┤
│ • Send Steph gummies          [Mark sent]
│ • Fix the fence                [Mark sent]
│ • Call Mom                     [Mark sent]
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 📤 Sent to John              [Count: 2] │
├─────────────────────────────────────────┤
│ • Get groceries (sent 2026-02-17) [Done]
│ • Pay electric bill (sent 2026-02-16) [Done]
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ ✅ Completed                 [Count: 5] │
├─────────────────────────────────────────┤
│ • Buy dog food (completed)
│ • Wash the car (completed)
│ • ... (other completed tasks)
└─────────────────────────────────────────┘
```

Each section is **collapsible** for better organization.

## Features

### ✅ Color-Coded Status Badges
- **Red** → Not sent (⚠️ pending action)
- **Blue** → Sent (ℹ️ with date stamp)
- **Green** → Completed (✓ dimmed appearance)

### 🎯 Priority Levels
- **🔴 High** - Urgent tasks
- **⚪ Normal** - Standard reminders
- **🔵 Low** - When you get a chance

### 📊 Stats Dashboard
Quick overview at the top:
- Total "Not Sent" count
- Total "Sent" count
- Total "Completed" count

### 💾 Data Persistence
- All reminders are saved to **localStorage**
- Automatically persists when you add, edit, or change status
- Data survives page refreshes

## Cron Job Integration

### Setup (9 AM Daily)

A cron job should run every morning at 9:00 AM to:

1. **Fetch** all reminders where `status !== "completed"`
2. **Send** them to John via Discord/email
3. **Update** each reminder:
   - `status` → `"sent"`
   - `sentDate` → today's date (format: `"2026-02-17"`)

### Implementation

See `apps/mission-control/lib/remindersCronJob.ts` for the handler function.

**To integrate with your cron system:**

```bash
# OpenClaw cron example (9 AM Brisbane time)
openclaw cron add --schedule "0 9 * * *" --command "node sendRemindersToJohn.js"
```

Or integrate with your backend/serverless system (AWS Lambda, Vercel Cron, etc.):

```javascript
// Example: sendRemindersToJohn.ts
import { sendRemindersToJohn } from '@/lib/remindersCronJob';

export default async function handler(req, res) {
  const result = await sendRemindersToJohn();
  res.json(result);
}
```

## Usage Flow

### Adding a Reminder
1. Click **"+ Add Reminder"**
2. Enter reminder text (e.g., "Send Steph gummies — apple and strawberry")
3. (Optional) Set priority level
4. Click **"Add"**
5. Reminder appears in **"Pending (Not sent)"** section

### Marking as Sent
1. Find the reminder in the **"Pending"** section
2. Click the **📤 "Mark sent"** button
3. Reminder moves to **"Sent to John [today's date]"** section
4. *(Usually done automatically by the 9 AM cron job)*

### Marking as Completed
1. Find the reminder in **"Sent"** or **"Pending"** section
2. Click the **✅ "Mark completed"** button
3. Reminder moves to **"Completed"** section (dimmed)

### Deleting a Reminder
1. Click the **🗑️ Delete** button on any reminder
2. Confirm the deletion

## Technical Details

### Component File
- Location: `jade-workspace/apps/mission-control/components/RemindersForJohn.tsx`
- Size: ~400 lines (React functional component)
- Dependencies: Lucide React icons, React hooks

### State Management
- Uses **React hooks** (`useState`, `useEffect`)
- No external state library needed
- localStorage integration for persistence

### Styling
- Tailwind CSS classes
- Color-coded sections (red/blue/green)
- Responsive design (mobile & desktop)
- Collapsible sections for better UX

## Future Enhancements

- [ ] Edit existing reminders
- [ ] Due date tracking
- [ ] Recurring reminders
- [ ] Reminder notes/description
- [ ] Filter by priority level
- [ ] Archive completed reminders
- [ ] Integration with John's calendar
- [ ] SMS/Push notification confirmations

---

**Last Updated:** 2026-02-17  
**Component Status:** ✅ Production Ready
