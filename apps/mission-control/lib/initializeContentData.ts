/**
 * Content Data Initialization Utility
 * Loads weeklyContentData.json into localStorage on app startup
 */

export interface ContentPost {
  id: number;
  title: string;
  platform: string;
  type: 'Reel' | 'Carousel' | 'Static' | 'Newsletter' | 'Email';
  date?: string;
  dateStr?: string;
  status: 'due-for-review' | 'ready-to-film' | 'ready-to-schedule' | 'posted';
  reviewStatus?: 'pending' | 'approved' | 'changes-requested' | 'needs-review';
  reviewDueDate?: string;
  filmsDate?: string;
  approvalDate?: string | null;
  script?: string;
  onScreenText?: string;
  caption?: string;
  description?: string;
  duration?: string;
  setting?: string;
  postTime?: string;
}

export interface JadeContentData {
  posts: ContentPost[];
  templates?: any[];
  customIdeas?: any[];
}

/**
 * Initialize content data from JSON file into localStorage
 * Only runs if localStorage doesn't already have 'jadeContentData'
 */
export function initializeWeeklyContent(weeklyContentData: any) {
  try {
    const storageKey = 'jadeContentData';
    const existing = localStorage.getItem(storageKey);
    
    if (!existing) {
      // First time: Initialize with full weekly content data
      const contentData: JadeContentData = {
        posts: weeklyContentData.posts || [],
        templates: [],
        customIdeas: []
      };
      
      localStorage.setItem(storageKey, JSON.stringify(contentData));
      console.log('✅ Weekly content data initialized');
      console.log(`📊 Loaded ${contentData.posts.length} content items`);
      
      // Log summary
      const dueForeview = contentData.posts.filter(p => p.status === 'due-for-review').length;
      const ready = contentData.posts.filter(p => 
        p.status === 'ready-to-film' || p.status === 'ready-to-schedule'
      ).length;
      
      console.log(`  - Due for Review: ${dueForeview}`);
      console.log(`  - Ready to Film/Schedule: ${ready}`);
      
      return true;
    } else {
      console.log('✓ Content data already initialized');
      return false;
    }
  } catch (error) {
    console.error('❌ Error initializing weekly content:', error);
    return false;
  }
}

/**
 * Force reload content data from source
 * Useful for debugging or manual resets
 */
export function reloadContentData(weeklyContentData: any) {
  try {
    const storageKey = 'jadeContentData';
    const contentData: JadeContentData = {
      posts: weeklyContentData.posts || [],
      templates: [],
      customIdeas: []
    };
    
    localStorage.setItem(storageKey, JSON.stringify(contentData));
    console.log('✅ Content data reloaded');
    
    // Dispatch storage event to notify other tabs/windows
    window.dispatchEvent(new StorageEvent('storage', {
      key: storageKey,
      newValue: JSON.stringify(contentData)
    }));
    
    return true;
  } catch (error) {
    console.error('❌ Error reloading content data:', error);
    return false;
  }
}

/**
 * Get content statistics
 */
export function getContentStats() {
  try {
    const stored = localStorage.getItem('jadeContentData');
    if (!stored) return null;
    
    const data: JadeContentData = JSON.parse(stored);
    const posts = data.posts || [];
    
    return {
      total: posts.length,
      dueForReview: posts.filter(p => p.status === 'due-for-review').length,
      readyToFilm: posts.filter(p => p.status === 'ready-to-film').length,
      readyToSchedule: posts.filter(p => p.status === 'ready-to-schedule').length,
      posted: posts.filter(p => p.status === 'posted').length,
    };
  } catch (error) {
    console.error('Error getting content stats:', error);
    return null;
  }
}

/**
 * Clear all content data from localStorage
 * WARNING: This is destructive!
 */
export function clearContentData() {
  try {
    localStorage.removeItem('jadeContentData');
    console.log('⚠️ Content data cleared');
    window.dispatchEvent(new StorageEvent('storage', { key: 'jadeContentData' }));
    return true;
  } catch (error) {
    console.error('Error clearing content data:', error);
    return false;
  }
}
