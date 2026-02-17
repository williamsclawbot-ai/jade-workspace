/**
 * Unified Newsletter Topic Management
 * Single source of truth for topic ideas and selection
 */

export interface NewsletterTopicIdea {
  id: string;
  title: string;
  relevance: string;
  angle: string;
}

export interface NewsletterTopicData {
  weekStarting: string;
  topicIdeas: NewsletterTopicIdea[];
  selectedTopic: string | null;
}

// Default topic ideas (HLS/sleep themed)
const DEFAULT_TOPIC_IDEAS: NewsletterTopicIdea[] = [
  {
    id: 'topic1',
    title: "Daylight Saving Time Sleep Adjustments",
    relevance: "Seasonal",
    angle: "Tips for transitioning toddlers' sleep schedules during DST changes"
  },
  {
    id: 'topic2',
    title: "Toddler Sleep Regressions: What's Normal?",
    relevance: "Evergreen",
    angle: "Understanding developmental regressions and when to expect them"
  },
  {
    id: 'topic3',
    title: "Bedtime Connection vs. Control",
    relevance: "Evergreen",
    angle: "Building secure attachments while maintaining healthy boundaries at bedtime"
  },
  {
    id: 'topic4',
    title: "Post-Holiday Sleep Reset",
    relevance: "Seasonal",
    angle: "Practical strategies for getting back on schedule after disruptions"
  }
];

/**
 * Get the Monday of the current week
 */
export function getWeekStart(): string {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(today.setDate(diff));
  return monday.toISOString().split('T')[0];
}

/**
 * Initialize or get the topic data for the current week
 */
export function getNewsletterTopicData(): NewsletterTopicData {
  const storageKey = 'jadeNewsletterTopicData';
  const weekStart = getWeekStart();
  
  const stored = localStorage.getItem(storageKey);
  
  if (stored) {
    try {
      const data = JSON.parse(stored) as NewsletterTopicData;
      // If week has changed, reset for new week
      if (data.weekStarting !== weekStart) {
        return initializeNewWeek(weekStart);
      }
      return data;
    } catch (e) {
      console.log('Error parsing stored topic data, reinitializing');
      return initializeNewWeek(weekStart);
    }
  }
  
  return initializeNewWeek(weekStart);
}

/**
 * Initialize a new week's topic data
 */
function initializeNewWeek(weekStart: string): NewsletterTopicData {
  const data: NewsletterTopicData = {
    weekStarting: weekStart,
    topicIdeas: DEFAULT_TOPIC_IDEAS,
    selectedTopic: null,
  };
  
  saveNewsletterTopicData(data);
  return data;
}

/**
 * Save topic data to localStorage
 */
export function saveNewsletterTopicData(data: NewsletterTopicData): void {
  localStorage.setItem('jadeNewsletterTopicData', JSON.stringify(data));
}

/**
 * Select a topic
 */
export function selectTopic(topicId: string): NewsletterTopicData {
  const data = getNewsletterTopicData();
  data.selectedTopic = topicId;
  saveNewsletterTopicData(data);
  return data;
}

/**
 * Deselect a topic (reset to null)
 */
export function deselectTopic(): NewsletterTopicData {
  const data = getNewsletterTopicData();
  data.selectedTopic = null;
  saveNewsletterTopicData(data);
  return data;
}

/**
 * Get the currently selected topic idea (full object)
 */
export function getSelectedTopicIdea(): NewsletterTopicIdea | null {
  const data = getNewsletterTopicData();
  if (!data.selectedTopic) return null;
  
  return data.topicIdeas.find(idea => idea.id === data.selectedTopic) || null;
}

/**
 * Update topic ideas (for custom sets if needed in the future)
 */
export function updateTopicIdeas(ideas: NewsletterTopicIdea[]): NewsletterTopicData {
  const data = getNewsletterTopicData();
  data.topicIdeas = ideas;
  saveNewsletterTopicData(data);
  return data;
}
