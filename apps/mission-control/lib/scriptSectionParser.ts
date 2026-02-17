/**
 * Parse script content into organized sections
 * Supports patterns like:
 * - [HOOK]
 * - Hook:
 * - Hook /
 * - [HOOK / QUESTION]
 */

export interface ScriptSection {
  name: string;
  content: string;
  label: string;
}

export function parseScriptSections(script: string): ScriptSection[] {
  if (!script) return [];

  const sections: ScriptSection[] = [];
  
  // Define the patterns we're looking for
  const sectionPatterns = [
    { pattern: /\[?HOOK[^\]]*\]?:?\s*(.*?)(?=\[?(?:VULNERABILITY|QUESTION|CONTENT|Body|REFRAME|REAL\s*TALK|CLOSE|CTA|On[\-\s]?Screen|CAPTION|$))/is, name: 'HOOK', label: 'HOOK' },
    { pattern: /\[?VULNERABILITY\]?:?\s*(.*?)(?=\[?(?:REFRAME|REAL\s*TALK|CLOSE|CTA|On[\-\s]?Screen|CAPTION|$))/is, name: 'VULNERABILITY', label: 'VULNERABILITY' },
    { pattern: /\[?REFRAME\]?:?\s*(.*?)(?=\[?(?:REAL\s*TALK|CLOSE|CTA|On[\-\s]?Screen|CAPTION|$))/is, name: 'REFRAME', label: 'REFRAME' },
    { pattern: /\[?REAL\s*TALK\]?:?\s*(.*?)(?=\[?(?:CLOSE|CTA|On[\-\s]?Screen|CAPTION|$))/is, name: 'REAL_TALK', label: 'REAL TALK' },
    { pattern: /\[?CLOSE\]?:?\s*(.*?)(?=\[?(?:CTA|On[\-\s]?Screen|CAPTION|$))/is, name: 'CLOSE', label: 'CLOSE' },
    { pattern: /\[?CTA\]?:?\s*(.*?)(?=\[?(?:On[\-\s]?Screen|CAPTION|$))/is, name: 'CTA', label: 'CTA' },
  ];

  // Try to match each pattern
  sectionPatterns.forEach(({ pattern, name, label }) => {
    const match = script.match(pattern);
    if (match && match[1]) {
      const content = match[1].trim().replace(/\n\n+/g, '\n').substring(0, 500);
      if (content && content.length > 5) {
        sections.push({
          name,
          content,
          label,
        });
      }
    }
  });

  // If we found sections, return them
  if (sections.length > 0) {
    return sections;
  }

  // Fallback: try to extract major sections with looser patterns
  const hookMatch = script.match(/hook[:\s]+([^\n]*(?:\n(?!(?:vulnerability|reframe|real\s*talk|close|cta|caption|on[\-\s]?screen))[^\n]*)*)/i);
  if (hookMatch) {
    sections.push({
      name: 'HOOK',
      content: hookMatch[1].trim().substring(0, 500),
      label: 'HOOK',
    });
  }

  return sections;
}

/**
 * Check if script has structured sections
 */
export function hasStructuredSections(script: string): boolean {
  if (!script) return false;
  const structurePatterns = [
    /\[?HOOK[^\]]*\]/i,
    /\[?VULNERABILITY\]/i,
    /\[?REFRAME\]/i,
    /\[?REAL\s*TALK\]/i,
    /\[?CLOSE\]/i,
    /\[?CTA\]/i,
    /Hook:/i,
    /Vulnerability:/i,
  ];
  
  return structurePatterns.some(pattern => pattern.test(script));
}

/**
 * Extract on-screen text if it exists as a separate section
 */
export function extractOnScreenText(script: string): string | null {
  if (!script) return null;
  
  const pattern = /\[?On[\-\s]?Screen(?:\s+Text)?[\]:]?\s*(.*?)(?=\[?(?:CAPTION|$))/is;
  const match = script.match(pattern);
  
  if (match && match[1]) {
    return match[1].trim();
  }
  
  return null;
}

/**
 * Extract caption if it exists as a separate section
 */
export function extractCaption(script: string): string | null {
  if (!script) return null;
  
  const pattern = /\[?CAPTION[\]:]?\s*(.*?)$/is;
  const match = script.match(pattern);
  
  if (match && match[1]) {
    return match[1].trim();
  }
  
  return null;
}
