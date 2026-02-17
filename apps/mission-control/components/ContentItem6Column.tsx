'use client';

import { parseScriptSections, extractOnScreenText, extractCaption, hasStructuredSections } from '@/lib/scriptSectionParser';
// Force rebuild

interface ContentItem6ColumnProps {
  script?: string;
  onScreenText?: string;
  caption?: string;
  setting?: string;
  description?: string;
  statusColor?: 'green' | 'red' | 'blue' | 'purple';
}

// Extract hook (first line or first 1-2 sentences)
const extractHook = (script: string): string => {
  if (!script) return '';
  const lines = script.split('\n');
  const firstLine = lines[0];
  
  // If it looks like a hook (short, punchy, ends with ?)
  if (firstLine.includes('Hook:') || firstLine.includes('hook:')) {
    const hookMatch = firstLine.match(/[Hh]ook:?\s*["']?([^"'\n]+)["']?/);
    if (hookMatch) return hookMatch[1].trim();
  }
  
  // Otherwise, get first 1-2 sentences
  const hookCandidates = script.split('?').slice(0, 1);
  if (hookCandidates[0]) {
    return hookCandidates[0].trim() + (script.includes('?') ? '?' : '');
  }
  
  return firstLine.substring(0, 100).trim();
};

// Extract on-screen hook text (usually in ON SCREEN HOOK TEXT or first timing block)
const extractOnScreenHookText = (script: string, onScreenText?: string): string => {
  if (!script && !onScreenText) return '';
  
  let text = onScreenText || '';
  
  // Look for hook-specific timing in on-screen text
  if (text.includes('Hook') || text.includes('hook')) {
    const hookMatch = text.match(/\[0-[\d\s\w]+\][:\s]*["']?([^"'\n]+)["']?/);
    if (hookMatch) return hookMatch[1].trim();
  }
  
  // Fall back to first timing block
  const firstTimingMatch = text.match(/\[[\d\s\-]+[:\s]+[^\]]*\][:\s]*["']?([^"'\n]+)["']?/);
  if (firstTimingMatch) return firstTimingMatch[1].trim();
  
  return '';
};

// Extract setting from script or description
const extractSetting = (script: string, setting?: string, description?: string): string => {
  if (setting) return setting;
  if (description) return description;
  
  // Look for setting keywords in script
  const settingMatch = script.match(/[Ss]etting:?\s*["']?([^"'\n]+)["']?/);
  if (settingMatch) return settingMatch[1].trim();
  
  return 'On location';
};

export default function ContentItem6Column({
  script,
  onScreenText: externalOnScreenText,
  caption: externalCaption,
  setting,
  description,
  statusColor = 'green',
}: ContentItem6ColumnProps) {
  if (!script) return null;

  // Parse data
  const hasStructure = hasStructuredSections(script);
  const sections = hasStructure ? parseScriptSections(script) : [];
  
  const embeddedOnScreenText = extractOnScreenText(script);
  const embeddedCaption = extractCaption(script);
  
  const onScreenText = externalOnScreenText || embeddedOnScreenText || '';
  const captionText = externalCaption || embeddedCaption || '';
  
  const hook = extractHook(script);
  const hookText = extractOnScreenHookText(script, onScreenText);
  const settingText = extractSetting(script, setting, description);

  // Color mappings
  const colorClasses = {
    green: {
      cardBorder: 'border-green-200',
      cardBg: 'bg-green-50',
      header: 'bg-green-100 text-green-900',
    },
    red: {
      cardBorder: 'border-red-200',
      cardBg: 'bg-red-50',
      header: 'bg-red-100 text-red-900',
    },
    blue: {
      cardBorder: 'border-blue-200',
      cardBg: 'bg-blue-50',
      header: 'bg-blue-100 text-blue-900',
    },
    purple: {
      cardBorder: 'border-purple-200',
      cardBg: 'bg-purple-50',
      header: 'bg-purple-100 text-purple-900',
    },
  };

  const colors = colorClasses[statusColor];

  const ColumnCard = ({
    icon,
    label,
    content,
    full = false,
  }: {
    icon: string;
    label: string;
    content: string | React.ReactNode;
    full?: boolean;
  }) => (
    <div className={`flex flex-col h-full bg-white rounded-lg border-2 ${colors.cardBorder} shadow-sm hover:shadow-md transition-shadow overflow-hidden`}>
      <div className={`${colors.header} px-3 py-2 font-semibold text-xs uppercase tracking-wide flex items-center gap-2`}>
        <span className="text-base">{icon}</span>
        <span>{label}</span>
      </div>
      <div className="flex-1 p-3 overflow-y-auto text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">
        {content}
      </div>
    </div>
  );

  return (
    <div className={`bg-gradient-to-br ${colors.cardBg} rounded-lg p-4 border-2 ${colors.cardBorder}`}>
      {/* 6-COLUMN GRID LAYOUT - RESPONSIVE */}
      {/* Mobile: 1 column | Tablet: 3 columns | Desktop: 6 columns (2 rows of 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-3 auto-rows-[300px]">
        {/* ROW 1 */}
        {/* Column 1: HOOK */}
        <ColumnCard
          icon="🎣"
          label="HOOK"
          content={hook || '(No hook text)'}
        />

        {/* Column 2: SETTING */}
        <ColumnCard
          icon="📍"
          label="SETTING"
          content={settingText || '(Not specified)'}
        />

        {/* Column 3: SCRIPT */}
        <ColumnCard
          icon="📝"
          label="SCRIPT"
          content={script || '(No script)'}
        />

        {/* ROW 2 */}
        {/* Column 4: ON SCREEN HOOK TEXT */}
        <ColumnCard
          icon="📺"
          label="ON SCREEN HOOK TEXT"
          content={hookText || '(No hook text)'}
        />

        {/* Column 5: ON SCREEN TEXT */}
        <ColumnCard
          icon="✍️"
          label="ON SCREEN TEXT"
          content={onScreenText || '(No on-screen text)'}
        />

        {/* Column 6: CAPTION */}
        <ColumnCard
          icon="💬"
          label="CAPTION"
          content={captionText || '(No caption)'}
        />
      </div>
    </div>
  );
}
