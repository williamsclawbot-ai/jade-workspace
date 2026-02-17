'use client';

import { parseScriptSections, extractOnScreenText, extractCaption, hasStructuredSections } from '@/lib/scriptSectionParser';

interface ScriptColumnDisplayProps {
  script?: string;
  onScreenText?: string;
  caption?: string;
  statusColor?: 'green' | 'red' | 'blue' | 'purple';
}

export default function ScriptColumnDisplay({
  script,
  onScreenText: externalOnScreenText,
  caption: externalCaption,
  statusColor = 'green',
}: ScriptColumnDisplayProps) {
  if (!script) return null;

  // Check if script has structured sections
  const hasStructure = hasStructuredSections(script);

  // If no structure, show the full script as before
  if (!hasStructure) {
    return (
      <div className={`bg-white rounded p-3 border ${'border-' + statusColor + '-200'}`}>
        <p className="text-xs font-semibold text-gray-700 uppercase mb-1">📝 Script:</p>
        <p className="text-sm text-gray-800 line-clamp-3 whitespace-pre-wrap">{script}</p>
      </div>
    );
  }

  // Parse script sections
  const sections = parseScriptSections(script);
  
  // Extract on-screen text and caption if they're embedded in script
  const embeddedOnScreenText = extractOnScreenText(script);
  const embeddedCaption = extractCaption(script);
  
  // Use external versions if provided, otherwise use embedded
  const onScreenText = externalOnScreenText || embeddedOnScreenText;
  const caption = externalCaption || embeddedCaption;

  // Color mappings for different status types
  const colorClasses = {
    green: {
      border: 'border-green-200',
      bg: 'bg-green-50',
      header: 'bg-green-100 text-green-900',
      column: 'bg-white border-green-100 hover:border-green-300',
    },
    red: {
      border: 'border-red-200',
      bg: 'bg-red-50',
      header: 'bg-red-100 text-red-900',
      column: 'bg-white border-red-100 hover:border-red-300',
    },
    blue: {
      border: 'border-blue-200',
      bg: 'bg-blue-50',
      header: 'bg-blue-100 text-blue-900',
      column: 'bg-white border-blue-100 hover:border-blue-300',
    },
    purple: {
      border: 'border-purple-200',
      bg: 'bg-purple-50',
      header: 'bg-purple-100 text-purple-900',
      column: 'bg-white border-purple-100 hover:border-purple-300',
    },
  };

  const colors = colorClasses[statusColor];

  return (
    <div className={`bg-gradient-to-br ${colors.bg} rounded-lg p-4 border ${colors.border} space-y-4`}>
      {/* Row 1: Script Sections (4 columns) */}
      {sections.length > 0 && (
        <div className="space-y-3">
          <div className={`${colors.header} px-3 py-2 rounded font-semibold text-sm`}>
            📝 Script Sections
          </div>
          
          {/* First 4 sections in a 4-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {sections.slice(0, 4).map((section, idx) => (
              <div
                key={`section-${idx}`}
                className={`rounded-lg p-3 border-2 transition ${colors.column}`}
              >
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-lg">
                    {section.label === 'HOOK' && '🎣'}
                    {section.label === 'VULNERABILITY' && '💔'}
                    {section.label === 'REFRAME' && '🔄'}
                    {section.label === 'REAL TALK' && '💬'}
                  </span>
                  <h4 className="font-bold text-xs text-gray-900 uppercase">{section.label}</h4>
                </div>
                <p className="text-xs text-gray-700 line-clamp-4 leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          {/* Second row: remaining sections (3 columns) */}
          {sections.length > 4 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {sections.slice(4, 7).map((section, idx) => (
                <div
                  key={`section-${idx + 4}`}
                  className={`rounded-lg p-3 border-2 transition ${colors.column}`}
                >
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-lg">
                      {section.label === 'CLOSE' && '🎬'}
                      {section.label === 'CTA' && '🚀'}
                    </span>
                    <h4 className="font-bold text-xs text-gray-900 uppercase">{section.label}</h4>
                  </div>
                  <p className="text-xs text-gray-700 line-clamp-4 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* On-Screen Text - Full Width */}
      {onScreenText && (
        <div className="space-y-2">
          <div className={`${colors.header} px-3 py-2 rounded font-semibold text-sm`}>
            📺 On-Screen Text & Timing
          </div>
          <div className={`rounded-lg p-3 border-2 ${colors.column}`}>
            <div className="text-xs text-gray-700 whitespace-pre-wrap max-h-40 overflow-y-auto leading-relaxed">
              {onScreenText}
            </div>
          </div>
        </div>
      )}

      {/* Caption - Full Width */}
      {caption && (
        <div className="space-y-2">
          <div className={`${colors.header} px-3 py-2 rounded font-semibold text-sm`}>
            💬 Caption
          </div>
          <div className={`rounded-lg p-3 border-2 ${colors.column}`}>
            <p className="text-xs text-gray-700 line-clamp-3 leading-relaxed">
              {caption}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
