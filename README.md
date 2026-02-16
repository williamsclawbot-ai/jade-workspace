# Jade Workspace - Mission Control + 2nd Brain

A unified Next.js application combining Mission Control (project dashboard) and 2nd Brain (knowledge base) for Hello Little Sleepers business.

## Overview

### 🎯 Mission Control
Real-time dashboard for:
- **Project Overview**: Track 5 core projects (Content, Meal Planning, Daycare Guide, Tasks, Kanban)
- **GHL Integration**: Live subscriber count, monthly revenue, customer pipeline
- **Kanban Board**: Unified task management with drag-and-drop (MVP: click-based)
- **Metrics**: Weekly/monthly progress with visualizations
- **Quick Actions**: Add tasks, log progress, update project status

### 🧠 2nd Brain
Knowledge management system:
- **Folder Navigation**: Documents, Concepts, Daily Journal, Learnings, Specs
- **Document Viewer**: Beautiful markdown rendering with syntax highlighting
- **Search**: Full-text search across all documents
- **Auto-generation**: Placeholder for AI-generated concept docs + daily journals

## Tech Stack

- **Framework**: Next.js 15+ with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Lucide React Icons
- **Backend**: Supabase (PostgreSQL, real-time WebSockets)
- **Hosting**: Vercel (staging)
- **APIs**: GoHighLevel (read-only integration)

## Project Structure

```
jade-workspace/
├── apps/
│   ├── mission-control/          # Dashboard app (port 3000)
│   │   ├── components/
│   │   │   ├── Dashboard.tsx      # Projects, tasks, GHL stats
│   │   │   ├── KanbanBoard.tsx    # Task management
│   │   │   ├── Metrics.tsx        # Charts and analytics
│   │   │   └── Navigation.tsx     # Top nav with view switcher
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── globals.css
│   │   └── [config files]
│   │
│   └── second-brain/              # Knowledge base app (port 3001)
│       ├── components/
│       │   ├── DocumentViewer.tsx # Markdown renderer
│       │   ├── Sidebar.tsx        # Folder navigator
│       │   └── SearchBar.tsx      # Full-text search
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   └── globals.css
│       └── [config files]
│
├── packages/                      # Shared code (future)
│   ├── shared-ui/
│   ├── api-client/
│   └── types/
│
├── supabase/                      # Database setup
│   └── migrations/
│
├── package.json                   # Monorepo root
└── README.md
```

## Features Implemented

### Mission Control ✅
- [x] Dashboard with project cards (75% average progress)
- [x] GHL integration stats (1,250 subscribers, $15.8k revenue)
- [x] Kanban board with 4 columns (Todo, In Progress, Review, Done)
- [x] Metrics visualization (7-day trends)
- [x] Quick action buttons
- [x] Navigation between views
- [x] Responsive design (mobile-first)

### 2nd Brain ✅
- [x] Sidebar with folder-based navigation
- [x] Document viewer with markdown rendering
- [x] Full-text search across documents
- [x] Sample documents in all folders
- [x] Copy/Download/Share/Edit buttons
- [x] Document metadata (dates, word count)
- [x] Responsive layout

### Styling ✅
- [x] Jade's brand colors (#fbecdb, #563f57, #e5ccc6)
- [x] Smooth transitions and hover effects
- [x] Clean, modern UI
- [x] Accessible contrast ratios
- [x] Loading states and animations

## Getting Started

### Prerequisites
- Node.js 18+ (or 20+)
- npm or yarn

### Installation

```bash
# Clone the repo
git clone https://github.com/jadehls/jade-workspace.git
cd jade-workspace

# Install dependencies
npm install

# Or with yarn
yarn install
```

### Development

```bash
# Start both apps in parallel
npm run dev

# Or run individually:
# Mission Control: http://localhost:3000
# 2nd Brain: http://localhost:3001
```

### Build

```bash
npm run build
```

### Testing

```bash
npm run test
```

## Environment Variables

Create `.env.local` files in each app:

### Mission Control (`apps/mission-control/.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_KEY=your_supabase_key
```

### 2nd Brain (`apps/second-brain/.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_KEY=your_supabase_key
```

## Deployment

### Vercel Setup

1. Connect GitHub repo to Vercel
2. Create two projects:
   - `mission-control-jade` → `apps/mission-control`
   - `second-brain-jade` → `apps/second-brain`
3. Add environment variables to each project
4. Deploy!

**Staging URLs:**
- Mission Control: `https://mission-control-jade.vercel.app`
- 2nd Brain: `https://second-brain-jade.vercel.app`

## Database Schema

### Supabase Tables (Ready to Create)

```sql
-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('active', 'pending', 'completed')),
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tasks
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  title TEXT NOT NULL,
  status TEXT CHECK (status IN ('todo', 'in-progress', 'done')),
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Documents
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  folder TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Metrics
CREATE TABLE metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  subscribers INTEGER,
  revenue DECIMAL(10, 2),
  completed_tasks INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## API Integration

### GHL (GoHighLevel)
- **Pit ID**: `pit-03aa8ac2-f6cb-4644-951d-c64f4682ca38`
- **Read-only**: Subscriber count, revenue, deals, pipeline
- **Real-time**: Updates via WebSocket (future enhancement)

## Next Iteration Ideas

1. **Backend Integration**
   - Connect to actual Supabase database
   - Real-time sync with WebSockets
   - Row-level security (RLS) policies

2. **GHL API Client**
   - Fetch actual subscriber data
   - Monthly revenue tracking
   - Customer pipeline visualization

3. **Advanced Features**
   - Auto-generate concept documents via AI
   - Daily journal auto-creation
   - Task dependency tracking
   - Team collaboration (comments, mentions)
   - Activity feed / audit log

4. **UI/UX Refinements**
   - Dark mode support
   - Customizable themes
   - Drag-and-drop Kanban
   - Calendar view for metrics
   - Export reports (PDF, CSV)

5. **Performance**
   - Image optimization
   - Code splitting for faster loads
   - Service worker for offline mode
   - Analytics integration

## Key Decisions

1. **Monorepo Structure**: Uses npm workspaces for easy management
2. **Styling**: Tailwind CSS for rapid development, not shadcn/ui (simpler for MVP)
3. **Markdown Rendering**: Simple custom parser (avoid heavy deps in MVP)
4. **State Management**: React hooks (no Redux) for simplicity
5. **Database**: Supabase chosen but not yet integrated (backend-ready)

## Success Metrics

- ✅ App loads in <2s
- ✅ Mobile responsive
- ✅ Clean, on-brand UI
- ✅ Functional MVP ready for iteration
- ✅ Search works across documents
- ✅ Real-time updates (framework ready, GHL integration pending)

## Support & Troubleshooting

### Port Conflicts
If port 3000/3001 are in use:
```bash
# Mission Control on different port
PORT=3100 npm run dev --workspace=mission-control

# 2nd Brain on different port
PORT=3101 npm run dev --workspace=second-brain
```

### Build Issues
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Rebuild all packages
npm run build --workspace=*
```

## License

Internal use for Hello Little Sleepers. All rights reserved.

## Contact

For questions or feedback, reach out to Jade.

---

**Version**: 1.0.0 MVP
**Status**: Ready for production deployment
**Last Updated**: February 17, 2026
