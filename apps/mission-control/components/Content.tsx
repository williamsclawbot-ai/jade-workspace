'use client';

import { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, Lightbulb, Calendar, BarChart3, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface ContentPost {
  id: number;
  title: string;
  platform: string;
  description: string;
  status: 'Draft' | 'Scheduled' | 'Published';
  created: string;
}

interface ContentTemplate {
  id: number;
  name: string;
  content: string;
  created: string;
}

interface ContentIdea {
  id: number;
  topic: string;
  description: string;
  useCase: string;
  created: string;
}

interface WeeklyPlan {
  week: string;
  status: 'incomplete' | 'complete';
  daysPlanned: number;
  daysTotal: number;
}

type TabType = 'content-flow' | 'ideas' | 'templates' | 'daily' | 'stats';

// Merged Ideas organized by THEME instead of platform
const CURATED_IDEAS_BY_THEME = {
  'Sleep Science & Myths': [
    { topic: 'Sleep Myths Debunked', description: 'Debunk common sleep myths with science-backed information', useCase: 'Instagram Reels, Blog post, TikTok' },
    { topic: 'Sleep Architecture', description: 'Explain REM vs NREM sleep cycles for babies and toddlers', useCase: 'Blog, Newsletter, Video content' },
    { topic: 'Circadian Rhythm Basics', description: 'How natural light affects baby sleep patterns', useCase: 'Educational carousel, Instagram post' },
  ],
  'Parent Wins & Stories': [
    { topic: 'Success Stories', description: 'Real parent transformations from sleep struggles to success', useCase: 'Before/after reels, testimonial videos' },
    { topic: 'Parent Wins Celebration', description: 'Celebrate small parenting wins to build community', useCase: 'Instagram stories, TikTok duets' },
    { topic: 'Day in the Life', description: 'Show your work, consulting process, and daily routine', useCase: 'TikTok, Behind-the-scenes Reels' },
  ],
  'Quick Tips & Hacks': [
    { topic: 'Wind-Down Routine Tips', description: 'Quick 30-second tips for bedtime routines', useCase: 'Instagram carousel, TikTok, Pinterest' },
    { topic: 'Sleep Hacks', description: '3-5 minute practical strategies parents can use today', useCase: 'Short-form video, Instagram captions' },
    { topic: 'Seasonal Sleep Adjustments', description: 'How to handle DST, heat waves, holidays', useCase: 'Blog guide, Newsletter, Seasonal reels' },
  ],
  'Relatable & Funny': [
    { topic: 'Sleep Deprivation Realness', description: 'Funny, relatable moments of exhausted parenting', useCase: 'TikTok trends, Instagram reels, Funny shorts' },
    { topic: 'Parenting Fails & Humor', description: 'Lighthearted moments that make parents laugh', useCase: 'Short-form video, Trending sounds' },
    { topic: 'Trending Sounds Usage', description: 'Apply trending audio to parenting/sleep content', useCase: 'TikTok, Instagram Reels' },
  ],
  'Expert Content': [
    { topic: 'Age-Specific Strategies', description: 'Different approaches for newborns, 6-month, 2-year sleep', useCase: 'Blog guide, Comprehensive carousel, Newsletter' },
    { topic: 'Sleep Training Methods', description: 'Gentle vs gradual approaches comparison', useCase: 'Long-form blog post, Video guide' },
    { topic: 'Parent Mental Health', description: 'Sleep deprivation impact and self-care strategies', useCase: 'Blog post, Newsletter, Supportive video' },
  ],
  'Resources & Community': [
    { topic: 'Resource Roundups', description: 'Curated sleep tools, books, products you recommend', useCase: 'Newsletter, Blog roundup, Instagram carousel' },
    { topic: 'FAQ Responses', description: 'Answer common questions from your audience', useCase: 'Blog post, TikTok Q&A, Email newsletter' },
    { topic: 'Email Newsletter Hooks', description: 'Curiosity-driven subject lines and opens', useCase: 'Email subject line, Newsletter, Blog intro' },
  ],
};

const DEFAULT_TEMPLATES = [
  {
    name: '📸 Instagram Caption',
    content: `[HOOK / QUESTION]
E.g., "Does your toddler fight bedtime every night?"

[RELATABLE SCENARIO]
Most parents think [myth]...
But here's what science says:

[SOLUTION / INSIGHT]
Instead, try:
• Point 1
• Point 2
• Point 3

[CALL TO ACTION]
Have you tried this? Drop a comment 👇
Or DM me about your sleep journey.

[TAG]
#HelloLittleSleepers #GentleSleep #ToddlerParenting`
  },
  {
    name: '🎵 TikTok Script',
    content: `[HOOK - 0-3 SEC]
"This is what nobody tells new parents..."
OR
"Parents always get this wrong..."

[TREND / TRENDING AUDIO]
Use trending sound (check TikTok Sounds page)

[CONTENT - 3-15 SEC]
Show / explain / demonstrate
Cut frequently (every 2-3 sec)
Keep energy UP

[CTA - LAST 3 SEC]
"What's YOUR biggest sleep challenge?"
"Follow for more sleep tips 👇"

[HASHTAGS]
#SleepTips #ToddlerLife #ParentingHacks`
  },
  {
    name: '📧 Email Opening',
    content: `Subject: [PERSONALIZED / CURIOSITY]
E.g., "The sleep mistake I see most (and how to fix it)"

---

Hi [Name],

[OPENING - RELATABLE]
Remember when I told you about [situation]?
I got so many emails about this...

[INSIGHT / STORY]
Here's what I learned from working with families:

[SOLUTION]
Try this instead:
1. Step 1
2. Step 2

[CLOSE]
How's your sleep journey going?
Reply with your biggest challenge.

— Jade
🤍 Hello Little Sleepers`
  }
];

export default function Content() {
  const [activeTab, setActiveTab] = useState<TabType>('content-flow');
  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [templates, setTemplates] = useState<ContentTemplate[]>([]);
  const [customIdeas, setCustomIdeas] = useState<ContentIdea[]>([]);
  const [dailyView, setDailyView] = useState<'today' | 'week' | 'upcoming'>('today');

  const [contentTitle, setContentTitle] = useState('');
  const [contentPlatform, setContentPlatform] = useState('');
  const [contentDesc, setContentDesc] = useState('');
  const [customIdea, setCustomIdea] = useState('');
  const [ideaTopic, setIdeaTopic] = useState('');
  const [ideaPlatform, setIdeaPlatform] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [templateContent, setTemplateContent] = useState('');

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('jadeContentData');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setPosts(data.posts || []);
        setTemplates(data.templates || []);
        setCustomIdeas(data.customIdeas || []);
      } catch (e) {
        console.log('No saved data');
      }
    }
  }, []);

  // Save to localStorage
  const saveData = (newPosts: ContentPost[], newTemplates: ContentTemplate[], newIdeas: ContentIdea[]) => {
    const data = {
      posts: newPosts,
      templates: newTemplates,
      customIdeas: newIdeas
    };
    localStorage.setItem('jadeContentData', JSON.stringify(data));
  };

  // Content Management
  const handleAddContent = () => {
    if (!contentTitle.trim() || !contentPlatform) {
      alert('Please fill in title and platform');
      return;
    }

    const newPost: ContentPost = {
      id: Date.now(),
      title: contentTitle.trim(),
      platform: contentPlatform,
      description: contentDesc.trim(),
      status: 'Draft',
      created: new Date().toLocaleDateString()
    };

    const updated = [...posts, newPost];
    setPosts(updated);
    saveData(updated, templates, customIdeas);
    setContentTitle('');
    setContentPlatform('');
    setContentDesc('');
  };

  const handleDeletePost = (id: number) => {
    if (confirm('Delete this post?')) {
      const updated = posts.filter(p => p.id !== id);
      setPosts(updated);
      saveData(updated, templates, customIdeas);
    }
  };

  const handleUpdateStatus = (id: number, newStatus: 'Draft' | 'Scheduled' | 'Published') => {
    const updated = posts.map(p =>
      p.id === id ? { ...p, status: newStatus } : p
    );
    setPosts(updated);
    saveData(updated, templates, customIdeas);
  };

  // Ideas Management
  const handleSaveIdea = () => {
    if (!customIdea.trim()) {
      alert('Please write an idea');
      return;
    }

    const newIdea: ContentIdea = {
      id: Date.now(),
      topic: ideaTopic.trim() || 'Quick Idea',
      description: customIdea.trim(),
      useCase: ideaPlatform.trim() || 'Multi-platform',
      created: new Date().toLocaleDateString()
    };

    const updated = [...customIdeas, newIdea];
    setCustomIdeas(updated);
    saveData(posts, templates, updated);
    setCustomIdea('');
    setIdeaTopic('');
    setIdeaPlatform('');
  };

  const handleDeleteIdea = (id: number) => {
    if (confirm('Delete this idea?')) {
      const updated = customIdeas.filter(i => i.id !== id);
      setCustomIdeas(updated);
      saveData(posts, templates, updated);
    }
  };

  // Templates Management
  const handleSaveTemplate = () => {
    if (!templateName.trim() || !templateContent.trim()) {
      alert('Please fill in template name and content');
      return;
    }

    const newTemplate: ContentTemplate = {
      id: Date.now(),
      name: templateName.trim(),
      content: templateContent.trim(),
      created: new Date().toLocaleDateString()
    };

    const updated = [...templates, newTemplate];
    setTemplates(updated);
    saveData(posts, updated, customIdeas);
    setTemplateName('');
    setTemplateContent('');
  };

  const handleDeleteTemplate = (id: number) => {
    if (confirm('Delete this template?')) {
      const updated = templates.filter(t => t.id !== id);
      setTemplates(updated);
      saveData(posts, updated, customIdeas);
    }
  };

  // Calculate stats
  const stats = {
    draft: posts.filter(p => p.status === 'Draft').length,
    scheduled: posts.filter(p => p.status === 'Scheduled').length,
    published: posts.filter(p => p.status === 'Published').length,
    total: posts.length
  };

  const platformStats = posts.reduce((acc, post) => {
    acc[post.platform] = (acc[post.platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Daily Content data
  const todayContent = {
    date: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
    draftCount: posts.filter(p => p.status === 'Draft').length,
  };

  const thisWeekPlan: WeeklyPlan = {
    week: 'This Week',
    status: posts.filter(p => p.status === 'Scheduled').length >= 3 ? 'complete' : 'incomplete',
    daysPlanned: posts.filter(p => p.status === 'Scheduled' || p.status === 'Draft').length,
    daysTotal: 7,
  };

  const getStatusColor = (status: ContentPost['status']) => {
    switch (status) {
      case 'Published':
        return 'bg-green-100 text-green-700';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'Draft':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-jade-light px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText size={32} className="text-jade-purple" />
            <div>
              <h2 className="text-2xl font-bold text-jade-purple">Content Management</h2>
              <p className="text-sm text-gray-600">Unified content planning, drafting & scheduling</p>
            </div>
          </div>
          <button className="flex items-center space-x-2 bg-jade-purple text-jade-cream px-4 py-2 rounded-lg hover:bg-jade-light hover:text-jade-purple transition-colors">
            <Plus size={20} />
            <span>New Content</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-jade-light px-6 py-4 flex items-center space-x-2 overflow-x-auto">
        {[
          { id: 'content-flow', label: '📋 Content Flow' },
          { id: 'ideas', label: '💡 Ideas (By Theme)' },
          { id: 'daily', label: '📅 Daily & Weekly' },
          { id: 'templates', label: '📝 Templates' },
          { id: 'stats', label: '📊 Stats' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-jade-purple text-jade-cream'
                : 'bg-jade-cream text-jade-purple hover:bg-jade-light'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Content Flow Tab */}
        {activeTab === 'content-flow' && (
          <div>
            <h3 className="text-lg font-bold text-jade-purple mb-4">Content Progression: Draft → Scheduled → Published</h3>
            
            {/* Quick Add */}
            <div className="bg-jade-cream p-4 rounded-lg mb-6">
              <h4 className="font-semibold text-jade-purple mb-3">Add New Content</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <input
                  type="text"
                  placeholder="Post title or idea"
                  value={contentTitle}
                  onChange={(e) => setContentTitle(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-jade-purple"
                />
                <select
                  value={contentPlatform}
                  onChange={(e) => setContentPlatform(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-jade-purple"
                >
                  <option value="">-- Select Platform --</option>
                  <option value="Instagram">📸 Instagram</option>
                  <option value="TikTok">🎵 TikTok</option>
                  <option value="Blog">📖 Blog</option>
                  <option value="Email">📧 Email</option>
                  <option value="Newsletter">📰 Newsletter</option>
                </select>
                <button
                  onClick={handleAddContent}
                  className="bg-jade-purple text-jade-cream px-4 py-2 rounded hover:bg-jade-light hover:text-jade-purple transition-colors flex items-center justify-center space-x-2 text-sm font-medium"
                >
                  <Plus size={16} />
                  <span>Add</span>
                </button>
              </div>
              <textarea
                placeholder="What's this post about? (optional)"
                value={contentDesc}
                onChange={(e) => setContentDesc(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-jade-purple w-full"
                rows={2}
              />
            </div>

            {/* Content by Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Drafted */}
              <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
                <h4 className="font-bold text-yellow-900 mb-3 flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Drafted ({stats.draft})</span>
                </h4>
                <div className="space-y-2">
                  {posts.filter(p => p.status === 'Draft').map(post => (
                    <div key={post.id} className="bg-white p-3 rounded border border-yellow-100 text-sm">
                      <div className="font-semibold text-gray-900 mb-1">{post.title}</div>
                      <div className="text-xs text-gray-600 mb-2">{post.platform}</div>
                      <select
                        value={post.status}
                        onChange={(e) => handleUpdateStatus(post.id, e.target.value as any)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-jade-purple mb-2"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Published">Published</option>
                      </select>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="text-red-600 hover:text-red-800 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                  {stats.draft === 0 && <p className="text-gray-600 text-sm italic">No drafts yet</p>}
                </div>
              </div>

              {/* Scheduled */}
              <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                <h4 className="font-bold text-blue-900 mb-3 flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Scheduled ({stats.scheduled})</span>
                </h4>
                <div className="space-y-2">
                  {posts.filter(p => p.status === 'Scheduled').map(post => (
                    <div key={post.id} className="bg-white p-3 rounded border border-blue-100 text-sm">
                      <div className="font-semibold text-gray-900 mb-1">{post.title}</div>
                      <div className="text-xs text-gray-600 mb-2">{post.platform}</div>
                      <select
                        value={post.status}
                        onChange={(e) => handleUpdateStatus(post.id, e.target.value as any)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-jade-purple mb-2"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Published">Published</option>
                      </select>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="text-red-600 hover:text-red-800 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                  {stats.scheduled === 0 && <p className="text-gray-600 text-sm italic">No scheduled posts</p>}
                </div>
              </div>

              {/* Published */}
              <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                <h4 className="font-bold text-green-900 mb-3 flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Published ({stats.published})</span>
                </h4>
                <div className="space-y-2">
                  {posts.filter(p => p.status === 'Published').map(post => (
                    <div key={post.id} className="bg-white p-3 rounded border border-green-100 text-sm">
                      <div className="font-semibold text-gray-900 mb-1">{post.title}</div>
                      <div className="text-xs text-gray-600 mb-2">{post.platform}</div>
                      <select
                        value={post.status}
                        onChange={(e) => handleUpdateStatus(post.id, e.target.value as any)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-jade-purple mb-2"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Published">Published</option>
                      </select>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="text-red-600 hover:text-red-800 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                  {stats.published === 0 && <p className="text-gray-600 text-sm italic">No published posts</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ideas Tab - Organized by Theme */}
        {activeTab === 'ideas' && (
          <div>
            <h3 className="text-lg font-bold text-jade-purple mb-6">Ideas Organized by Theme</h3>
            <p className="text-gray-600 mb-6">Quick visual picking of content ideas. Mix and match themes across all platforms.</p>

            {/* Curated Ideas by Theme */}
            <div className="space-y-4 mb-8">
              {Object.entries(CURATED_IDEAS_BY_THEME).map(([theme, ideas]) => (
                <div key={theme} className="bg-white rounded-lg border border-jade-light p-5">
                  <h4 className="font-bold text-jade-purple mb-3 text-lg">{theme}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {ideas.map((idea, idx) => (
                      <div key={idx} className="bg-jade-cream/50 p-4 rounded border border-jade-light hover:shadow-md transition-shadow">
                        <p className="font-semibold text-jade-purple mb-2">{idea.topic}</p>
                        <p className="text-sm text-gray-700 mb-3">{idea.description}</p>
                        <p className="text-xs text-gray-600 italic">💡 {idea.useCase}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Ideas Section */}
            <h3 className="text-lg font-bold text-jade-purple mb-4 mt-8">Add Your Own Ideas</h3>
            <div className="bg-jade-cream p-4 rounded-lg mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <input
                  type="text"
                  placeholder="Topic/Theme"
                  value={ideaTopic}
                  onChange={(e) => setIdeaTopic(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-jade-purple"
                />
                <input
                  type="text"
                  placeholder="Best use case (e.g., TikTok, Blog)"
                  value={ideaPlatform}
                  onChange={(e) => setIdeaPlatform(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-jade-purple"
                />
                <button
                  onClick={handleSaveIdea}
                  className="bg-jade-purple text-jade-cream px-4 py-2 rounded hover:bg-jade-light hover:text-jade-purple transition-colors text-sm font-medium"
                >
                  Save Idea
                </button>
              </div>
              <textarea
                placeholder="Describe your idea briefly..."
                value={customIdea}
                onChange={(e) => setCustomIdea(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-jade-purple w-full"
                rows={3}
              />
            </div>

            {customIdeas.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-jade-purple mb-4">Your Saved Ideas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {customIdeas.map(idea => (
                    <div key={idea.id} className="bg-white p-4 rounded border border-jade-light">
                      <p className="font-semibold text-jade-purple mb-2">{idea.topic}</p>
                      <p className="text-sm text-gray-700 mb-3">{idea.description}</p>
                      <p className="text-xs text-gray-600 mb-3">💡 {idea.useCase}</p>
                      <p className="text-xs text-gray-500 mb-3">{idea.created}</p>
                      <button
                        onClick={() => handleDeleteIdea(idea.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Daily & Weekly Tab */}
        {activeTab === 'daily' && (
          <div>
            {/* View Tabs */}
            <div className="flex items-center space-x-2 mb-6">
              {(['today', 'week', 'upcoming'] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setDailyView(view)}
                  className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium whitespace-nowrap ${
                    dailyView === view
                      ? 'bg-jade-purple text-jade-cream'
                      : 'bg-jade-cream text-jade-purple hover:bg-jade-light'
                  }`}
                >
                  {view === 'today' && "📅 Today's Draft"}
                  {view === 'week' && '📆 This Week'}
                  {view === 'upcoming' && '🔮 Upcoming'}
                </button>
              ))}
            </div>

            {/* Today's Content */}
            {dailyView === 'today' && (
              <div className="space-y-6">
                {/* Today's Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-jade-purple">
                    <p className="text-sm text-gray-600 mb-2">Date</p>
                    <p className="text-lg font-semibold text-jade-purple">{todayContent.date}</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-500">
                    <p className="text-sm text-gray-600 mb-2">Drafts Ready</p>
                    <p className="text-lg font-semibold text-yellow-600">{todayContent.draftCount} posts</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
                    <p className="text-sm text-gray-600 mb-2">Status</p>
                    <p className="text-lg font-semibold text-green-600">Ready to work</p>
                  </div>
                </div>

                {/* Today's Drafts to Work On */}
                <div className="bg-gradient-to-r from-jade-purple to-jade-light rounded-lg shadow-lg p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Today's Content Queue</h3>
                  <p className="text-jade-cream opacity-90">Work through these drafts and move them to scheduled when ready</p>
                </div>

                {posts.filter(p => p.status === 'Draft').length > 0 ? (
                  <div className="space-y-3">
                    {posts.filter(p => p.status === 'Draft').map(post => (
                      <div key={post.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-jade-light">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{post.title}</p>
                            <p className="text-sm text-gray-600">📱 {post.platform}</p>
                            {post.description && <p className="text-sm text-gray-700 mt-2">{post.description}</p>}
                          </div>
                          <button
                            onClick={() => handleUpdateStatus(post.id, 'Scheduled')}
                            className="bg-jade-purple text-jade-cream px-4 py-2 rounded-lg hover:bg-jade-light hover:text-jade-purple transition-colors font-medium text-sm whitespace-nowrap"
                          >
                            Mark Scheduled
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-jade-cream/50 rounded-lg p-8 text-center">
                    <p className="text-gray-700">No drafts today. Great work! 🎉</p>
                  </div>
                )}
              </div>
            )}

            {/* This Week */}
            {dailyView === 'week' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-jade-purple to-jade-light rounded-lg shadow-lg p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">This Week's Content Plan</h3>
                  <p className="text-jade-cream opacity-90">Target: Full week planned by end of week</p>
                </div>

                {/* Weekly Progress */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-jade-purple">Progress: {thisWeekPlan.daysPlanned} / {thisWeekPlan.daysTotal} days planned</h3>
                    <span className={`text-sm font-semibold px-3 py-1 rounded ${
                      thisWeekPlan.status === 'complete' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {thisWeekPlan.status === 'complete' ? 'Complete' : 'In Progress'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-jade-purple h-3 rounded-full transition-all"
                      style={{ width: `${(thisWeekPlan.daysPlanned / thisWeekPlan.daysTotal) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Weekly Breakdown by Day */}
                <div className="space-y-3">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <div key={day} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-jade-light">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{day}</p>
                          <p className="text-sm text-gray-600">Content items pending for this day</p>
                        </div>
                        <button className="text-jade-purple hover:text-jade-purple/80 font-medium text-sm">
                          Plan Day →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming */}
            {dailyView === 'upcoming' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-purple-600 to-purple-400 rounded-lg shadow-lg p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Next Week's Planning</h3>
                  <p className="text-purple-100 opacity-90">Get ahead with planning for next week</p>
                </div>

                {/* Next Week Status */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-jade-purple">Next Week: 0 / 7 days planned</h3>
                    <button className="bg-jade-purple text-jade-cream px-4 py-2 rounded-lg hover:bg-jade-light hover:text-jade-purple transition-colors font-medium">
                      Start Planning
                    </button>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-purple-600 h-3 rounded-full transition-all"
                      style={{ width: '0%' }}
                    />
                  </div>
                </div>

                <div className="bg-jade-cream/50 rounded-lg p-6 text-center">
                  <p className="text-gray-700">Next week's planning will appear here once you start adding items.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div>
            <h3 className="text-lg font-bold text-jade-purple mb-4">Content Scripts & Templates</h3>

            {DEFAULT_TEMPLATES.map((template, idx) => (
              <div key={idx} className="mb-6">
                <h4 className="font-semibold text-jade-purple mb-3">{template.name}</h4>
                <div className="bg-gray-100 p-4 rounded border border-gray-300 text-sm text-gray-700 font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {template.content}
                </div>
              </div>
            ))}

            <h3 className="text-lg font-bold text-jade-purple mb-4 mt-6">Add Your Own Template</h3>
            <div className="bg-jade-cream p-4 rounded space-y-3 mb-6">
              <input
                type="text"
                placeholder="Template name (e.g., 'Myth-Busting Post')"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-jade-purple w-full"
              />
              <textarea
                placeholder="Paste your template here..."
                value={templateContent}
                onChange={(e) => setTemplateContent(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-jade-purple w-full font-mono"
                rows={6}
              />
              <button
                onClick={handleSaveTemplate}
                className="bg-jade-purple text-jade-cream px-4 py-2 rounded hover:bg-jade-light hover:text-jade-purple transition-colors text-sm font-medium"
              >
                Save Template
              </button>
            </div>

            {templates.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-jade-purple mb-4">Your Saved Templates</h3>
                <div className="space-y-4">
                  {templates.map(template => (
                    <div key={template.id} className="bg-gray-50 p-4 rounded border border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-semibold text-gray-800">{template.name}</h5>
                        <button
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="bg-white p-3 rounded border border-gray-300 text-sm text-gray-700 font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                        {template.content}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Created: {template.created}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div>
            <h3 className="text-lg font-bold text-jade-purple mb-4">Content Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-yellow-100 to-white p-4 rounded border border-yellow-200 text-center">
                <div className="text-3xl font-bold text-yellow-600">{stats.draft}</div>
                <div className="text-sm text-gray-600 mt-1">Drafts</div>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-white p-4 rounded border border-blue-200 text-center">
                <div className="text-3xl font-bold text-blue-600">{stats.scheduled}</div>
                <div className="text-sm text-gray-600 mt-1">Scheduled</div>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-white p-4 rounded border border-green-200 text-center">
                <div className="text-3xl font-bold text-green-600">{stats.published}</div>
                <div className="text-sm text-gray-600 mt-1">Published</div>
              </div>
              <div className="bg-gradient-to-br from-purple-100 to-white p-4 rounded border border-purple-200 text-center">
                <div className="text-3xl font-bold text-purple-600">{stats.total}</div>
                <div className="text-sm text-gray-600 mt-1">Total Posts</div>
              </div>
            </div>

            <h3 className="text-lg font-bold text-jade-purple mb-4">Content by Platform</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.entries(platformStats).length > 0 ? (
                Object.entries(platformStats).map(([platform, count]) => (
                  <div key={platform} className="bg-gradient-to-br from-jade-light to-white p-4 rounded border border-jade-light text-center">
                    <div className="text-2xl font-bold text-jade-purple">{count}</div>
                    <div className="text-sm text-gray-600 mt-1">{platform}</div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No content yet. Start adding to see stats!</p>
              )}
            </div>

            <div className="mt-6 bg-yellow-50 p-4 rounded border-l-4 border-jade-light">
              <p className="text-sm text-gray-700">
                <strong>💡 Tip:</strong> Balance content across platforms for maximum reach. Track which platforms get the most engagement and adjust your strategy accordingly.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
