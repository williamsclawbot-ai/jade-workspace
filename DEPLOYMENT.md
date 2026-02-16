# Deployment Guide

## Quick Start

### 1. GitHub Setup

```bash
# Create GitHub repo (via github.com)
# Repository: jadehls/jade-workspace

# Initialize git
git init
git add .
git commit -m "Initial commit: Mission Control + 2nd Brain MVP"
git branch -M main
git remote add origin https://github.com/jadehls/jade-workspace.git
git push -u origin main
```

### 2. Vercel Deployment

#### Option A: Import from GitHub (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import GitHub repo: `jadehls/jade-workspace`
4. Configure builds:
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

5. Add environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_KEY=your_key
   ```

6. Deploy!

#### Option B: CLI Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy monorepo
vercel

# Follow prompts:
# - Connect to GitHub repo
# - Select "jade-workspace"
# - Approve Vercel settings
```

### 3. Deploy Individual Apps

Since we're using a monorepo, you'll need **2 separate Vercel projects**:

**Project 1: Mission Control**
- GitHub repo: `jadehls/jade-workspace`
- Root directory: `apps/mission-control`
- Name: `mission-control-jade`
- Build: `npm run build`
- Environment: Same as above

**Project 2: 2nd Brain**
- GitHub repo: `jadehls/jade-workspace`
- Root directory: `apps/second-brain`
- Name: `second-brain-jade`
- Build: `npm run build`
- Environment: Same as above

### 4. Environment Variables (Vercel)

Add these to **each project** in Vercel settings:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_KEY=your_anon_key
```

### 5. Custom Domains (Optional)

In Vercel project settings:
- Mission Control: `mission-control.jadehls.com`
- 2nd Brain: `brain.jadehls.com`
- Or use Vercel's free `.vercel.app` domains

### 6. Testing Deployment

After deployment:

```bash
# Test Mission Control
curl https://mission-control-jade.vercel.app

# Test 2nd Brain
curl https://second-brain-jade.vercel.app

# Check performance
# Visit https://pagespeed.web.dev
```

## Post-Deployment

### Enable Advanced Features

1. **Analytics**
   - Vercel Dashboard → Project → Analytics
   - Enable Web Vitals tracking

2. **Previews**
   - Auto-preview on PR deployments
   - Share staging URLs with team

3. **Monitoring**
   - Error tracking
   - Performance monitoring
   - Error logs

### Update Production

```bash
# Make changes locally
# Commit and push
git commit -am "Update: Add new feature"
git push origin main

# Vercel auto-deploys from main branch
# Check status: https://vercel.com/dashboard
```

## Staging vs Production

**Staging** (Current setup)
- Branch: `develop` or PR previews
- URL: `mission-control-jade-staging.vercel.app`
- Auto-deploy on PR

**Production** (When ready)
- Branch: `main`
- URL: `mission-control-jade.vercel.app`
- Requires approval

## Rollback

If something breaks:

```bash
# In Vercel Dashboard:
# 1. Project → Deployments
# 2. Click the previous good deployment
# 3. Click "..." → "Promote to Production"
```

Or via CLI:
```bash
vercel rollback
```

## Database Deployment (Supabase)

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Note your project URL and API keys

### 2. Run Migrations

```bash
# Option 1: Via Supabase Dashboard
# 1. SQL Editor
# 2. Create new query
# 3. Paste migrations from supabase/migrations/

# Option 2: Via CLI
supabase link --project-ref your_project_id
supabase db push
```

### 3. Set RLS Policies

```sql
-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;

-- Create policies
-- (See supabase/migrations/ for full setup)
```

## CI/CD Pipeline

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Performance Checklist

- [ ] Page loads in <2s
- [ ] Core Web Vitals green
- [ ] Mobile responsive (< 3s on 4G)
- [ ] Images optimized
- [ ] Code splitting working
- [ ] Caching headers set
- [ ] CSS minified
- [ ] JavaScript minified

## Monitoring & Logs

### Vercel Dashboard
- Deployments → Real-time logs
- Monitoring → Performance metrics
- Errors → Error tracking

### Application Insights
- Next.js Analytics (built-in)
- Custom logging (optional)
- Error reporting

## Troubleshooting

### Build Fails
```bash
# Check build logs in Vercel
# Common issues:
# - Missing env vars
# - Node version mismatch
# - Dependencies not installed
```

### Site Loads Slow
```
# Check:
# - Vercel Analytics (Core Web Vitals)
# - Network tab in DevTools
# - Lighthouse audit
# - Image optimization
```

### 404 Errors
```
# Check:
# - Route exists in Next.js
# - Public folder files
# - Deployment status (green checkmark)
```

---

## Final Checklist

- [ ] GitHub repo created and pushed
- [ ] 2 Vercel projects configured
- [ ] Environment variables added
- [ ] Domains configured (optional)
- [ ] Monitoring enabled
- [ ] Team access granted
- [ ] Documentation updated

**Done!** 🎉 Apps are live and ready for iteration.
