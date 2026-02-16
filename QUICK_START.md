# Quick Start Guide

Get the Jade Workspace app running in 5 minutes.

## Prerequisites

- Node.js 18+ (check: `node --version`)
- npm 9+ (check: `npm --version`)

## Installation

```bash
# 1. Navigate to project
cd jade-workspace

# 2. Install dependencies (2-3 minutes)
npm install

# 3. Start development servers
npm run dev
```

**That's it!** Both apps will start automatically:

- **Mission Control**: http://localhost:3000
- **2nd Brain**: http://localhost:3001

## What to Try

### Mission Control
1. Click tabs at top: Dashboard → Kanban → Metrics
2. Try adding a task card in Kanban board
3. Click the purple "Add Project" button
4. Explore metrics with 7-day trends

### 2nd Brain
1. Expand folders in sidebar (Concepts, Learnings, etc.)
2. Click documents to view them
3. Search for keywords like "child" or "javascript"
4. Download a document as markdown
5. Copy content to clipboard

## Troubleshooting

### Dependencies fail
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Port already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different ports
PORT=3100 npm run dev --workspace=mission-control
PORT=3101 npm run dev --workspace=second-brain
```

### Build errors
```bash
# Verify all deps installed
npm ci  # Clean install

# Check Node version
node --version  # Should be 18+

# Try again
npm run dev
```

## Project Structure

```
jade-workspace/
├── apps/
│   ├── mission-control/          ← Dashboard
│   └── second-brain/             ← Knowledge base
├── README.md                      ← Full documentation
├── DEPLOYMENT.md                  ← Deploy to Vercel
└── BUILD_SUMMARY.md              ← What was built
```

## Next: Deploy to Vercel

When ready, follow DEPLOYMENT.md:

```bash
git push origin main
# Then configure in Vercel Dashboard
```

## Files You'll See

**Mission Control**:
- Dashboard.tsx - Project overview
- KanbanBoard.tsx - Task management
- Metrics.tsx - Analytics charts
- Navigation.tsx - Top menu bar

**2nd Brain**:
- DocumentViewer.tsx - Markdown reader
- Sidebar.tsx - Folder navigator
- SearchBar.tsx - Search engine

## Testing the Features

### ✅ Dashboard
- See 4 stat cards (Subscribers, Revenue, Deals, Pipeline)
- View 5 sample projects with progress bars
- Check task list with priority colors

### ✅ Kanban
- Click columns to add new cards
- Type task title and press Enter
- Delete cards with the trash button
- See 4 columns: Todo, In Progress, Review, Done

### ✅ Metrics
- View 7-day bar charts
- Check detailed performance table
- See growth percentages

### ✅ 2nd Brain
- Expand folders in sidebar
- Click documents to view
- Search finds documents instantly
- Copy, download, or share

## Development Tips

### Add a new component
```tsx
// components/MyComponent.tsx
export default function MyComponent() {
  return <div>Hello</div>;
}

// Then import in app/page.tsx
import MyComponent from '@/components/MyComponent';
```

### Modify colors
Edit `tailwind.config.js`:
```js
colors: {
  'jade-cream': '#fbecdb',
  'jade-purple': '#563f57',
  'jade-light': '#e5ccc6',
  // Add more...
}
```

### Check logs
```bash
# Terminal shows all errors
# Browser DevTools (F12) for client errors
```

## Time Estimates

| Task | Time |
|------|------|
| Install dependencies | 2-3 min |
| Start dev server | 30 sec |
| Test both apps | 5 min |
| Make first change | 1 min |
| Redeploy | 1 min |

## Success!

If you see:
- ✅ Mission Control at localhost:3000
- ✅ 2nd Brain at localhost:3001
- ✅ Both load without errors
- ✅ Can click buttons and add tasks

**You're all set!** 🎉

## Next Steps

1. **Explore**: Click around both apps
2. **Review**: Read BUILD_SUMMARY.md
3. **Deploy**: Follow DEPLOYMENT.md
4. **Iterate**: Jade will provide feedback

## Support

- Check README.md for full docs
- See DEPLOYMENT.md for production setup
- Review BUILD_SUMMARY.md for statistics
- Inspect browser console (F12) for errors

---

**Happy building!** 🚀
