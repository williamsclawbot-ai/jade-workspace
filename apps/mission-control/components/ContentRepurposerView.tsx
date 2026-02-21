'use client';

import { useState } from 'react';
import { Copy, Loader2, AlertCircle } from 'lucide-react';

interface ContentVariation {
  platform: 'instagram' | 'tiktok' | 'email' | 'newsletter';
  content: string;
  characterCount: number;
  hashtags?: string[];
  cta?: string;
}

const platformConfig = {
  instagram: {
    icon: '📸',
    color: 'from-pink-500 to-purple-500',
    maxChars: 2200,
    description: 'Instagram Caption'
  },
  tiktok: {
    icon: '🎵',
    color: 'from-black to-gray-800',
    maxChars: 1000,
    description: 'TikTok Script'
  },
  email: {
    icon: '✉️',
    color: 'from-blue-500 to-cyan-500',
    maxChars: 3000,
    description: 'Email Body'
  },
  newsletter: {
    icon: '📬',
    color: 'from-green-500 to-emerald-500',
    maxChars: 1500,
    description: 'Newsletter Section'
  }
};

export default function ContentRepurposerView() {
  const [originalContent, setOriginalContent] = useState('');
  const [contentType, setContentType] = useState<'guide_excerpt' | 'reel_script' | 'article' | 'story' | 'research'>('guide_excerpt');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram', 'tiktok', 'email', 'newsletter']);
  const [variations, setVariations] = useState<ContentVariation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleRepurpose = async () => {
    if (!originalContent.trim()) {
      setError('Please enter content to repurpose');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/content/repurpose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalContent,
          contentType,
          targetPlatforms: selectedPlatforms
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to repurpose content');
      }

      const data = await response.json();
      setVariations(data.variations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setVariations([]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, platform: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(platform);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Content Repurposer</h1>
        <p className="text-gray-600 mt-2">Write once. Adapt for every platform.</p>
      </div>

      {/* Source Content */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Source Content
          </label>
          <textarea
            value={originalContent}
            onChange={e => setOriginalContent(e.target.value)}
            placeholder="Paste your content here (guide excerpt, article, script, story, research...)"
            className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">{originalContent.length} characters</p>
        </div>

        {/* Content Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content Type
          </label>
          <select
            value={contentType}
            onChange={e => setContentType(e.target.value as any)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="guide_excerpt">Guide Excerpt</option>
            <option value="reel_script">Reel Script</option>
            <option value="article">Article</option>
            <option value="story">Story</option>
            <option value="research">Research</option>
          </select>
        </div>

        {/* Target Platforms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Platforms
          </label>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(platformConfig).map(([platform, config]) => (
              <button
                key={platform}
                onClick={() => togglePlatform(platform)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedPlatforms.includes(platform)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedPlatforms.includes(platform)}
                    onChange={() => {}}
                    className="w-4 h-4"
                  />
                  <span>{config.icon}</span>
                  <span className="text-sm font-medium">{config.description}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleRepurpose}
        disabled={loading || !originalContent.trim() || selectedPlatforms.length === 0}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Repurposing...
          </>
        ) : (
          'Generate Variations'
        )}
      </button>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-900">Error</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Variations */}
      {variations.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Repurposed Variations</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {variations.map(variation => {
              const config = platformConfig[variation.platform];
              const isCopied = copiedId === variation.platform;

              return (
                <div
                  key={variation.platform}
                  className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Platform Header */}
                  <div className={`bg-gradient-to-r ${config.color} text-white p-4`}>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{config.icon}</span>
                      <div>
                        <p className="font-semibold">{config.description}</p>
                        <p className="text-sm opacity-90">
                          {variation.characterCount} / {config.maxChars} chars
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                      {variation.content}
                    </p>

                    {/* Hashtags */}
                    {variation.hashtags && variation.hashtags.length > 0 && (
                      <div className="pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-600 font-medium mb-2">Suggested hashtags:</p>
                        <div className="flex flex-wrap gap-2">
                          {variation.hashtags.map(tag => (
                            <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* CTA */}
                    {variation.cta && (
                      <div className="pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-600 font-medium mb-2">Call-to-action:</p>
                        <p className="text-sm text-gray-700 italic">"{variation.cta}"</p>
                      </div>
                    )}

                    {/* Copy Button */}
                    <button
                      onClick={() => copyToClipboard(variation.content, variation.platform)}
                      className={`w-full mt-4 py-2 px-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 font-medium text-sm ${
                        isCopied
                          ? 'bg-green-50 border-green-500 text-green-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      <Copy className="w-4 h-4" />
                      {isCopied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && variations.length === 0 && originalContent.trim() && (
        <div className="text-center py-8 text-gray-500">
          <p>Click "Generate Variations" to repurpose your content</p>
        </div>
      )}
    </div>
  );
}
