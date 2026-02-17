/**
 * Custom hook for managing shared newsletter topic data
 * Syncs across tabs and components using localStorage events
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  getNewsletterTopicData, 
  selectTopic, 
  deselectTopic,
  type NewsletterTopicData 
} from './newsletterTopicUtils';

export function useNewsletterTopic() {
  const [topicData, setTopicData] = useState<NewsletterTopicData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data and set up listener for storage changes
  useEffect(() => {
    // Initial load
    const data = getNewsletterTopicData();
    setTopicData(data);
    setIsLoading(false);

    // Listen for changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'jadeNewsletterTopicData') {
        const updated = getNewsletterTopicData();
        setTopicData(updated);
      }
    };

    // Listen for storage events from other tabs
    window.addEventListener('storage', handleStorageChange);

    // Custom event listener for same-tab updates
    const handleCustomChange = () => {
      const updated = getNewsletterTopicData();
      setTopicData(updated);
    };

    window.addEventListener('newsletterTopicChanged', handleCustomChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('newsletterTopicChanged', handleCustomChange);
    };
  }, []);

  const handleSelectTopic = useCallback((topicId: string) => {
    const updated = selectTopic(topicId);
    setTopicData(updated);
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event('newsletterTopicChanged'));
  }, []);

  const handleDeselectTopic = useCallback(() => {
    const updated = deselectTopic();
    setTopicData(updated);
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event('newsletterTopicChanged'));
  }, []);

  return {
    topicData,
    isLoading,
    selectTopic: handleSelectTopic,
    deselectTopic: handleDeselectTopic,
  };
}
