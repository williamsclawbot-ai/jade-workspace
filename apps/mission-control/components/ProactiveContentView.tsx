'use client';

import { useState, useEffect } from 'react';
import { Lightbulb, Zap, Users, Target, TrendingUp, Copy, CheckCircle } from 'lucide-react';

interface HookVariation {
  angle: string;
  text: string;
  segment: string;
}

interface ProactiveContent {
  id: string;
  day: string;
  title: string;
  description: string;
  type: 'Reel' | 'Carousel' | 'Static';
  pillar: string;
  primarySegment: string;
  hookVariations: HookVariation[];
  competitivePosition?: string;
  newsletterData?: {
    subject: string;
    angle: string;
  };
}

export default function ProactiveContentView() {
  const [topics, setTopics] = useState<ProactiveContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<ProactiveContent | null>(null);
  const [generating, setGenerating] = useState(false);
  const [showStrategy, setShowStrategy] = useState(false);

  // Fetch strategy framework on mount
  useEffect(() => {
    fetchStrategy();
  }, []);

  async function fetchStrategy() {
    try {
      const res = await fetch('/api/content/proactive-weekly');
      const data = await res.json();
      if (data.data?.weeklyTopics) {
        setTopics(data.data.weeklyTopics);
      }
    } catch (error) {
      console.error('Error fetching strategy:', error);
    }
  }

  async function generateAllContent() {
    setGenerating(true);
    try {
      const res = await fetch('/api/content/proactive-weekly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ generateFullScripts: true }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log('Generated content:', data);
        // In real implementation, would add these to content store
        alert(`Generated ${data.count} content pieces! Check the Content tab to review.`);
      }
    } catch (error) {
      console.error('Generation error:', error);
      alert('Failed to generate content');
    } finally {
      setGenerating(false);
    }
  }

  const getPillarColor = (pillar: string) => {
    const colors: Record<string, string> = {
      'Parental Wellbeing First': 'bg-rose-50 border-rose-200',
      'Responsive Not Rigid': 'bg-blue-50 border-blue-200',
      'Communication Not Crying': 'bg-amber-50 border-amber-200',
      'Founder Authenticity': 'bg-purple-50 border-purple-200',
    };
    return colors[pillar] || 'bg-gray-50 border-gray-200';
  };

  const getSegmentBadgeColor = (segment: string) => {
    const colors: Record<string, string> = {
      'Working Mothers': 'bg-red-100 text-red-700',
      'Gentle/Attachment Parents': 'bg-green-100 text-green-700',
      'Solo/Single Parents': 'bg-blue-100 text-blue-700',
      'Postpartum Struggling': 'bg-pink-100 text-pink-700',
      'Shift Workers': 'bg-indigo-100 text-indigo-700',
    };
    return colors[segment] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Zap className="w-8 h-8 text-amber-500" />
          <h1 className="text-3xl font-bold">Proactive Content Strategy</h1>
        </div>
        <p className="text-gray-600">
          Competitor-informed, segment-targeted content with multiple hook angles
        </p>
      </div>

      {/* Strategy Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Target className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-900">4 Brand Pillars</h3>
              <p className="text-sm text-amber-700 mt-1">
                Each week's content built on HLS differentiation (parental wellbeing, responsive methods, founder authenticity, communication-based)
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900">5 Customer Segments</h3>
              <p className="text-sm text-blue-700 mt-1">
                Working moms, gentle parents, solo parents, postpartum struggling, shift workers. Each hook variant targets a specific segment.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Action Button */}
      <div className="mb-8">
        <button
          onClick={generateAllContent}
          disabled={generating}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {generating ? '✨ Generating 7 Topics...' : '🎯 Generate Weekly Content (with Scripts)'}
        </button>
      </div>

      {/* Weekly Topics Grid */}
      <div className="grid grid-cols-1 gap-4">
        {topics.map((topic, idx) => (
          <div
            key={topic.id}
            className={`border rounded-lg p-5 cursor-pointer transition-all hover:shadow-md ${getPillarColor(
              topic.pillar
            )}`}
            onClick={() => setSelectedTopic(selectedTopic?.id === topic.id ? null : topic)}
          >
            {/* Header Row */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-1 rounded">
                    {topic.day}
                  </span>
                  <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-1 rounded">
                    {topic.type}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${getSegmentBadgeColor(topic.primarySegment)}`}>
                    {topic.primarySegment}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">{topic.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{topic.description}</p>
              </div>
              <div className="text-2xl ml-4">
                {topic.pillar === 'Parental Wellbeing First' && '❤️'}
                {topic.pillar === 'Responsive Not Rigid' && '🔄'}
                {topic.pillar === 'Communication Not Crying' && '💬'}
                {topic.pillar === 'Founder Authenticity' && '👩‍💼'}
              </div>
            </div>

            {/* Competitive Position */}
            {topic.competitivePosition && (
              <div className="bg-white bg-opacity-60 border-l-2 border-gray-400 pl-3 mb-3 text-sm text-gray-700 italic">
                <strong>Competitive Edge:</strong> {topic.competitivePosition}
              </div>
            )}

            {/* Expanded Details */}
            {selectedTopic?.id === topic.id && (
              <div className="mt-4 space-y-4 border-t pt-4">
                {/* Hook Variations */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Hook Variations ({topic.hookVariations.length})
                  </h4>
                  <div className="space-y-3">
                    {topic.hookVariations.map((hook, hidx) => (
                      <div key={hidx} className="bg-white rounded p-3 border border-gray-200">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {hook.angle}
                            </span>
                            <span className={`text-xs font-semibold ml-2 px-2 py-1 rounded ${getSegmentBadgeColor(hook.segment)}`}>
                              {hook.segment}
                            </span>
                          </div>
                          <Copy className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                        </div>
                        <p className="text-sm text-gray-700 italic">"{hook.text}"</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Newsletter Data */}
                {topic.newsletterData && (
                  <div className="bg-white rounded p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Newsletter Integration
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs font-semibold text-gray-500">Subject Line:</span>
                        <p className="text-sm text-gray-700 font-semibold">{topic.newsletterData.subject}</p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-gray-500">Email Angle:</span>
                        <p className="text-sm text-gray-700">{topic.newsletterData.angle}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <button className="flex-1 bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded hover:bg-gray-50 transition-all">
                    + Add as Draft
                  </button>
                  <button className="flex-1 bg-blue-50 border border-blue-200 text-blue-700 font-semibold py-2 px-4 rounded hover:bg-blue-100 transition-all">
                    Generate Script
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-12 p-6 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          How This Works
        </h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>
            <strong>Competitor Analysis:</strong> Topics informed by gaps in competitors' content (Baby Sleep Code, Calm
            Babies, etc.)
          </li>
          <li>
            <strong>Market Research:</strong> 5 customer segments with specific pain points + messaging angles
          </li>
          <li>
            <strong>Hook Variations:</strong> 3-5 different opening hooks per topic, each targeting a specific segment
          </li>
          <li>
            <strong>Strategic Positioning:</strong> Every topic leverages HLS brand pillars (parental wellbeing, founder
            authenticity, responsive methods)
          </li>
          <li>
            <strong>Newsletter Integration:</strong> Subject lines + email angles tied to Instagram content for cohesive
            weekly messaging
          </li>
        </ul>
      </div>
    </div>
  );
}
