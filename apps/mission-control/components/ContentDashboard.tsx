'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, BookOpen, Lightbulb, FileText, Calendar, BarChart3, Download } from 'lucide-react';
import weeklyContentData from '../lib/weeklyContentData.json';

interface ContentPost {
  id: number;
  title: string;
  platform: string;
  description: string;
  status: 'Draft' | 'Scheduled' | 'Published' | 'Ready to Film' | 'Ready to Schedule';
  created: string;
  date?: string;
  type?: string;
}

interface ContentTemplate {
  id: number;
  name: string;
  content: string;
  created: string;
}

interface ContentIdea {
  id: number;
  text: string;
  created: string;
}

type TabType = 'content-board' | 'ideas' | 'templates' | 'today' | 'stats';

const CURATED_IDEAS = {
  instagram: [
    'Sleep Myth Busting: "Myth: Babies sleep better when tired" — debunk with science',
    'Parent Wins: Celebrate small wins (first nap time, bedtime routine established)',
    'Seasonal Sleep: How daylight saving changes sleep schedules',
    'Q&A Series: Answer common parent questions (co-sleeping, nap transitions, etc.)',
    'Before/After Stories: Real parent sleep journey transformations',
    'Quick Tips: 30-second carousel tips (breathing techniques, wind-down routine, etc.)',
    'Behind the Scenes: Your consulting work, client success stories (with permission)',
    'Reels Ideas: Short demos (how to settle a baby, bedtime routine timelapse)'
  ],
  tiktok: [
    'Day in the Life: Your morning routine, working from home, nap time workflow',
    'Sleep Hacks: "3 things you didn\'t know about toddler sleep"',
    'Myth vs Reality: Common baby sleep myths (trending sounds)',
    'Relatable Moments: Funny parenting fails, sleep deprivation realness',
    'Client Testimonials: Short clips of success stories (consent required)',
    'Trending Sounds: Use trending audio with HLS messaging (sleep, parenting themes)',
    'Quick Wins: "What I tell parents on Day 1 of sleep support"',
    'Educational: Bite-sized sleep science for TikTok audience'
  ],
  blog: [
    'Sleep Training Methods: Gentle vs gradual approaches (long-form guide)',
    'Seasonal Guides: Sleep during daylight saving, heat waves, school holidays',
    'Age-Specific Strategies: Newborn sleep vs 6-month vs 2-year different needs',
    'Parent Mental Health: Sleep deprivation impact on parents (relatable, supportive)',
    'Ebook Companion Content: Expanded sections from your daycare guide',
    'Case Studies: "How we helped families with [specific challenge]"',
    'FAQ Roundups: Monthly/seasonal questions from your audience'
  ],
  email: [
    'Weekly Insights: One sleep tip + one parenting win + one resource',
    'Seasonal Updates: How to handle daylight saving, school holidays, seasonal changes',
    'Client Stories: "From exhausted mum to confident sleeper" success stories',
    'Resource Roundups: Curated sleep tools, books, products you recommend',
    'Ask Me Anything: "Send me your sleep questions — I\'ll feature the best ones"',
    'Launch Announcements: New guides, courses, services',
    'Limited Offers: Early access to new ebooks, course launches'
  ]
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

export default function ContentDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('content-board');
  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [templates, setTemplates] = useState<ContentTemplate[]>([]);
  const [customIdeas, setCustomIdeas] = useState<ContentIdea[]>([]);

  const [contentTitle, setContentTitle] = useState('');
  const [contentPlatform, setContentPlatform] = useState('');
  const [contentDesc, setContentDesc] = useState('');
  const [customIdea, setCustomIdea] = useState('');
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

  const handleLoadWeeklyContent = () => {
    if (weeklyContentData && weeklyContentData.posts) {
      const convertedPosts: ContentPost[] = weeklyContentData.posts.map(post => ({
        id: post.id,
        title: post.title,
        platform: post.platform,
        description: post.description,
        status: (post.status as any),
        created: post.dateStr || new Date().toLocaleDateString(),
        date: post.date,
        type: post.type
      }));

      const updated = [...posts, ...convertedPosts];
      setPosts(updated);
      saveData(updated, templates, customIdeas);
      alert(`✅ Loaded ${convertedPosts.length} posts for this week!`);
    }
  };

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

  const handleSaveIdea = () => {
    if (!customIdea.trim()) {
      alert('Please write an idea');
      return;
    }

    const newIdea: ContentIdea = {
      id: Date.now(),
      text: customIdea.trim(),
      created: new Date().toLocaleDateString()
    };

    const updated = [...customIdeas, newIdea];
    setCustomIdeas(updated);
    saveData(posts, templates, updated);
    setCustomIdea('');
  };

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

  const todayPosts = posts.filter(p => p.status === 'Draft');

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-jade-light px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText size={32} className="text-jade-purple" />
            <div>
              <h2 className="text-2xl font-bold text-jade-purple">Content Dashboard</h2>
              <p className="text-sm text-gray-600">Plan, track, and organize HLS content</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-jade-light px-6 py-4 flex items-center space-x-2 overflow-x-auto">
        {[
          { id: 'content-board', label: '📋 Content Board', icon: null },
          { id: 'ideas', label: '💡 Ideas', icon: null },
          { id: 'templates', label: '📝 Templates', icon: null },
          { id: 'today', label: '📅 Today', icon: null },
          { id: 'stats', label: '📊 Stats', icon: null }
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
        {/* Content Board Tab */}
        {activeTab === 'content-board' && (
          <div>
            {/* Weekly Content Loader */}
            <div className="mb-6 bg-gradient-to-r from-jade-light to-jade-cream p-4 rounded-lg border-2 border-jade-purple">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-jade-purple mb-1">📅 This Week's Content Ready!</h3>
                  <p className="text-sm text-gray-700">Load all 7 posts (Mon-Sat) + newsletter. Ready to film/schedule.</p>
                </div>
                <button
                  onClick={handleLoadWeeklyContent}
                  className="bg-jade-purple text-jade-cream px-4 py-3 rounded hover:bg-jade-light hover:text-jade-purple transition-colors flex items-center space-x-2 text-sm font-semibold whitespace-nowrap"
                >
                  <Download size={18} />
                  <span>Load Weekly Plan</span>
                </button>
              </div>
            </div>

            <h3 className="text-lg font-bold text-jade-purple mb-4">Add New Content</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-jade-cream p-4 rounded-lg">
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
                className="bg-jade-purple text-jade-cream px-4 py-2 rounded hover:bg-jade-light hover:text-jade-purple transition-colors flex items-center justify-center space-x-2 text-sm font-medium col-span-1 md:col-span-3"
              >
                <Plus size={16} />
                <span>Add to Board</span>
              </button>
              <textarea
                placeholder="What's this post about? (optional)"
                value={contentDesc}
                onChange={(e) => setContentDesc(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-jade-purple col-span-1 md:col-span-3"
                rows={3}
              />
            </div>

            <h3 className="text-lg font-bold text-jade-purple mb-4">Your Content</h3>
            {posts.length === 0 ? (
              <div className="bg-gray-50 p-8 rounded text-center text-gray-600">
                <p>No content yet. Add your first post above!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {posts.map(post => (
                  <div key={post.id} className="bg-white p-4 rounded border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{post.title}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {post.type && <span className="mr-3 inline-block font-medium">{post.type}</span>}
                          {post.platform && <span className="mr-3 inline-block">📱 {post.platform}</span>}
                          {post.date && <span className="mr-3 inline-block">📅 {post.date}</span>}
                          <span className="text-xs text-gray-500">{post.created}</span>
                        </div>
                        {post.description && (
                          <div className="text-sm text-gray-700 mt-2 p-2 bg-gray-50 rounded line-clamp-2 hover:line-clamp-none">
                            {post.description.substring(0, 150)}...
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <select
                        value={post.status}
                        onChange={(e) => handleUpdateStatus(post.id, e.target.value as any)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-jade-purple"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Published">Published</option>
                        <option value="Ready to Film">Ready to Film</option>
                        <option value="Ready to Schedule">Ready to Schedule</option>
                      </select>
                      <div className={`px-3 py-1 rounded text-sm font-semibold text-center min-w-24 ml-2 ${
                        post.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                        post.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                        post.status === 'Published' ? 'bg-green-100 text-green-800' :
                        post.status === 'Ready to Film' ? 'bg-purple-100 text-purple-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {post.status}
                      </div>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="ml-2 bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1 rounded text-sm font-semibold transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Ideas Tab */}
        {activeTab === 'ideas' && (
          <div>
            <h3 className="text-lg font-bold text-jade-purple mb-4">Content Ideas & Inspiration</h3>
            
            {['instagram', 'tiktok', 'blog', 'email'].map(platform => (
              <div key={platform} className="mb-6 bg-yellow-50 p-4 rounded border-l-4 border-jade-light">
                <h4 className="font-semibold text-jade-purple mb-3 capitalize">
                  {platform === 'instagram' && '📸 Instagram Ideas'}
                  {platform === 'tiktok' && '🎵 TikTok Ideas'}
                  {platform === 'blog' && '📖 Blog Ideas'}
                  {platform === 'email' && '📧 Email & Newsletter Ideas'}
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  {CURATED_IDEAS[platform as keyof typeof CURATED_IDEAS].map((idea, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-jade-purple font-bold mt-0.5">•</span>
                      <span>{idea}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <h3 className="text-lg font-bold text-jade-purple mb-4 mt-6">Add Your Own Ideas</h3>
            <div className="bg-jade-cream p-4 rounded space-y-3">
              <textarea
                placeholder="Add your own content idea, inspiration, or reminder..."
                value={customIdea}
                onChange={(e) => setCustomIdea(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-jade-purple w-full"
                rows={4}
              />
              <button
                onClick={handleSaveIdea}
                className="bg-jade-purple text-jade-cream px-4 py-2 rounded hover:bg-jade-light hover:text-jade-purple transition-colors text-sm font-medium"
              >
                Save Idea
              </button>
            </div>

            {customIdeas.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-bold text-jade-purple mb-4">Your Saved Ideas</h3>
                <div className="space-y-3">
                  {customIdeas.map(idea => (
                    <div key={idea.id} className="bg-white p-4 rounded border border-gray-200">
                      <p className="text-gray-800">{idea.text}</p>
                      <p className="text-xs text-gray-500 mt-2">{idea.created}</p>
                    </div>
                  ))}
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
                <div className="bg-gray-100 p-4 rounded border border-gray-300 text-sm text-gray-700 font-mono whitespace-pre-wrap">
                  {template.content}
                </div>
              </div>
            ))}

            <h3 className="text-lg font-bold text-jade-purple mb-4 mt-6">Add Your Own Template</h3>
            <div className="bg-jade-cream p-4 rounded space-y-3">
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
              <div className="mt-6">
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

        {/* Today's Content Tab */}
        {activeTab === 'today' && (
          <div>
            <h3 className="text-lg font-bold text-jade-purple mb-4">Today's Content Queue</h3>
            {todayPosts.length === 0 ? (
              <div className="bg-gray-50 p-8 rounded text-center text-gray-600">
                <p>No drafts to work on today.</p>
                <p className="text-sm">Add new posts or change their status to "Draft" when you're ready to work.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todayPosts.map(post => (
                  <div key={post.id} className="bg-gray-50 p-4 rounded border-l-4 border-jade-light">
                    <div className="font-semibold text-gray-800 mb-2">{post.title}</div>
                    <div className="text-sm text-gray-600 mb-2">📱 {post.platform}</div>
                    {post.description && <div className="text-sm text-gray-700 mb-3">{post.description}</div>}
                    <button
                      onClick={() => handleUpdateStatus(post.id, 'Scheduled')}
                      className="bg-jade-purple text-jade-cream px-3 py-1 rounded text-sm font-semibold hover:bg-jade-light hover:text-jade-purple transition-colors"
                    >
                      Mark Scheduled
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div>
            <h3 className="text-lg font-bold text-jade-purple mb-4">Content Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-jade-light to-white p-4 rounded border border-jade-light text-center">
                <div className="text-3xl font-bold text-jade-purple">{stats.draft}</div>
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
              {Object.entries(platformStats).map(([platform, count]) => (
                <div key={platform} className="bg-gradient-to-br from-jade-light to-white p-4 rounded border border-jade-light text-center">
                  <div className="text-2xl font-bold text-jade-purple">{count}</div>
                  <div className="text-sm text-gray-600 mt-1">{platform}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-yellow-50 p-4 rounded border-l-4 border-jade-light">
              <p className="text-sm text-gray-700">
                <strong>💡 Tip:</strong> Track what platforms get the most content and which ones need love. Balance is key for growing Hello Little Sleepers across all channels!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
