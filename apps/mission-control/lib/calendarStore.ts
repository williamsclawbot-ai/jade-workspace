import ContentStore, { ContentItem } from './contentStore';

export interface KeyDate {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  type: 'awareness' | 'seasonal' | 'holiday' | 'school' | 'campaign' | 'reminder';
  description: string;
  color: string;
  importance: 'high' | 'medium' | 'low';
  endDate?: string; // For multi-day events
  reminderDaysBefore?: number; // Days to set reminder
}

export interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  type: 'social' | 'newsletter' | 'campaign' | 'key-date';
  subType?: 'Reel' | 'Carousel' | 'Static' | string;
  status: string;
  color: string;
  contentId?: string;
  description: string;
}

export interface DayDetail {
  date: string;
  socialContent: ContentItem[];
  keyDates: KeyDate[];
  newsletters?: string[];
  campaigns?: string[];
  contentCount: {
    reels: number;
    carousels: number;
    static: number;
    total: number;
  };
}

class CalendarStoreClass {
  private keyDates: KeyDate[] = [];

  constructor() {
    this.initializeKeyDates();
  }

  private initializeKeyDates() {
    // All key dates for 2026
    const dates = [
      // January
      { date: '2026-01-01', title: 'New Year', type: 'holiday' as const, importance: 'high' },

      // February
      { date: '2026-02-14', title: 'Valentine\'s Day', type: 'holiday' as const, importance: 'low' },

      // March
      { date: '2026-03-01', title: 'Autumn Begins (Southern Hemisphere)', type: 'seasonal' as const, importance: 'medium' },
      { date: '2026-03-08', title: 'International Women\'s Day', type: 'awareness' as const, importance: 'high' },
      { date: '2026-03-13', title: 'World Sleep Day', type: 'awareness' as const, importance: 'high' },
      { date: '2026-03-01', title: 'Gidget Foundation 100km Walk', type: 'campaign' as const, importance: 'high', endDate: '2026-03-31' },

      // April
      { date: '2026-04-05', title: 'Easter Sunday', type: 'holiday' as const, importance: 'high' },
      { date: '2026-04-06', title: 'Easter Monday', type: 'holiday' as const, importance: 'high' },

      // May
      { date: '2026-05-06', title: 'World Maternal Mental Health Day', type: 'awareness' as const, importance: 'high' },
      { date: '2026-05-10', title: 'Mother\'s Day (Australia)', type: 'holiday' as const, importance: 'high' },
      { date: '2026-05-15', title: 'International Day of Families', type: 'awareness' as const, importance: 'medium' },

      // June
      { date: '2026-06-01', title: 'Winter Begins (Southern Hemisphere)', type: 'seasonal' as const, importance: 'medium' },
      { date: '2026-06-01', title: 'Global Day of Parents', type: 'awareness' as const, importance: 'medium' },

      // July
      { date: '2026-07-01', title: 'Mid-year Point', type: 'reminder' as const, importance: 'low' },

      // August

      // September
      { date: '2026-09-01', title: 'Baby Sleep Day', type: 'awareness' as const, importance: 'high' },
      { date: '2026-09-01', title: 'Spring Begins (Southern Hemisphere)', type: 'seasonal' as const, importance: 'medium' },
      { date: '2026-09-06', title: 'Father\'s Day (Australia)', type: 'holiday' as const, importance: 'high' },

      // October
      { date: '2026-10-04', title: 'Daylight Saving Begins (Australia)', type: 'seasonal' as const, importance: 'medium' },
      { date: '2026-10-15', title: 'Pregnancy & Infant Loss Awareness Day', type: 'awareness' as const, importance: 'high' },
      { date: '2026-10-27', title: 'Red Nose Day Australia', type: 'awareness' as const, importance: 'high' },

      // November
      { date: '2026-11-09', title: 'Perinatal Mental Health Week Begins', type: 'awareness' as const, importance: 'high', endDate: '2026-11-15' },
      { date: '2026-11-20', title: 'Universal Children\'s Day', type: 'awareness' as const, importance: 'medium' },

      // December
      { date: '2026-12-01', title: 'Summer Begins (Southern Hemisphere)', type: 'seasonal' as const, importance: 'medium' },
      { date: '2026-12-25', title: 'Christmas Day', type: 'holiday' as const, importance: 'high' },
      { date: '2026-12-26', title: 'Boxing Day', type: 'holiday' as const, importance: 'medium' },
      { date: '2026-12-31', title: 'New Year\'s Eve', type: 'holiday' as const, importance: 'low' },

      // Sleep regression windows (general awareness)
      { date: '2026-01-15', title: 'Sleep Regression Window: 4 Months', type: 'reminder' as const, importance: 'medium' },
      { date: '2026-03-15', title: 'Sleep Regression Window: 8 Months', type: 'reminder' as const, importance: 'medium' },
      { date: '2026-05-15', title: 'Sleep Regression Window: 12 Months', type: 'reminder' as const, importance: 'medium' },
      { date: '2026-07-15', title: 'Sleep Regression Window: 18 Months', type: 'reminder' as const, importance: 'medium' },
      { date: '2026-09-15', title: 'Sleep Regression Window: 2 Years', type: 'reminder' as const, importance: 'medium' },

      // DST end
      { date: '2027-04-03', title: 'Daylight Saving Ends (Australia)', type: 'seasonal' as const, importance: 'medium' },
    ];

    this.keyDates = dates.map((d, idx) => ({
      id: `key-date-${idx}`,
      date: d.date,
      title: d.title,
      type: d.type,
      description: this.getDescriptionForDate(d.title, d.type),
      color: this.getColorForType(d.type),
      importance: d.importance as 'high' | 'medium' | 'low',
      endDate: d.endDate,
      reminderDaysBefore: d.type === 'holiday' || d.type === 'awareness' ? 7 : undefined,
    }));
  }

  private getDescriptionForDate(title: string, type: string): string {
    const descriptions: Record<string, string> = {
      'World Sleep Day': 'Annual awareness day promoting healthy sleep habits and sleep science',
      'International Women\'s Day': 'Global celebration of women\'s achievements and empowerment',
      'World Maternal Mental Health Day': 'Focus on maternal mental health awareness and support',
      'Mother\'s Day (Australia)': 'Second Sunday in May - celebrate motherhood',
      'Father\'s Day (Australia)': 'First Sunday in September - celebrate fatherhood',
      'Baby Sleep Day': 'Awareness day focusing on infant and baby sleep',
      'Pregnancy & Infant Loss Awareness Day': 'Remember and honor pregnancy and infant loss',
      'Red Nose Day Australia': 'Fundraising day for SIDS prevention and support',
      'Universal Children\'s Day': 'Celebrate children\'s rights and welfare',
      'International Day of Families': 'Promote families and family values',
      'Global Day of Parents': 'Celebrate parents\' role in children\'s development',
      'Perinatal Mental Health Week': 'Focus on mental health during pregnancy and postpartum',
      'Gidget Foundation 100km Walk': 'Month-long fundraising walk for mental health support',
      'Autumn Begins (Southern Hemisphere)': 'Seasonal change marking autumn',
      'Winter Begins (Southern Hemisphere)': 'Seasonal change marking winter',
      'Spring Begins (Southern Hemisphere)': 'Seasonal change marking spring',
      'Summer Begins (Southern Hemisphere)': 'Seasonal change marking summer',
      'Daylight Saving Begins (Australia)': 'Clocks move forward 1 hour (2am → 3am)',
      'Daylight Saving Ends (Australia)': 'Clocks move back 1 hour (2am → 1am)',
      'Easter Sunday': 'Major Christian holiday',
      'Easter Monday': 'Public holiday following Easter',
      'Christmas Day': 'Major holiday - family-focused content',
      'Boxing Day': 'Public holiday following Christmas',
      'New Year': 'Start of new year - resolutions and fresh starts',
      'New Year\'s Eve': 'Last day of the year - celebration and reflection',
    };
    return descriptions[title] || 'Important date for content planning';
  }

  private getColorForType(type: string): string {
    const colors: Record<string, string> = {
      'awareness': 'purple',
      'seasonal': 'cyan',
      'holiday': 'red',
      'school': 'blue',
      'campaign': 'orange',
      'reminder': 'yellow',
    };
    return colors[type] || 'gray';
  }

  // Get all key dates
  getAllKeyDates(): KeyDate[] {
    return this.keyDates;
  }

  // Get key dates for a specific month
  getKeyDatesByMonth(year: number, month: number): KeyDate[] {
    const monthStr = String(month).padStart(2, '0');
    return this.keyDates.filter(d => d.date.startsWith(`${year}-${monthStr}`));
  }

  // Get key dates for a specific day
  getKeyDatesByDay(dateStr: string): KeyDate[] {
    return this.keyDates.filter(d => d.date === dateStr || (d.endDate && d.date <= dateStr && d.endDate >= dateStr));
  }

  // Get key dates by type
  getKeyDatesByType(type: string): KeyDate[] {
    return this.keyDates.filter(d => d.type === type);
  }

  // Get calendar events (combines key dates and social content)
  getCalendarEventsForDay(dateStr: string): CalendarEvent[] {
    const events: CalendarEvent[] = [];

    // Add key dates as events
    const keyDatesForDay = this.getKeyDatesByDay(dateStr);
    keyDatesForDay.forEach(kd => {
      events.push({
        id: kd.id,
        date: dateStr,
        title: kd.title,
        type: 'key-date',
        status: '',
        color: kd.color,
        description: kd.description,
      });
    });

    // Add social content from ContentStore
    const allContent = ContentStore.getAll();
    const contentForDay = allContent.filter(item => {
      if (!item.createdAt) return false;
      const itemDate = new Date(item.createdAt).toISOString().split('T')[0];
      return itemDate === dateStr;
    });

    contentForDay.forEach(item => {
      events.push({
        id: `content-${item.id}`,
        date: dateStr,
        title: item.title,
        type: 'social',
        subType: item.type,
        status: item.status,
        color: this.getSocialContentColor(item.type),
        contentId: item.id,
        description: item.description,
      });
    });

    return events;
  }

  // Get day detail with all information
  getDayDetail(dateStr: string): DayDetail {
    const allContent = ContentStore.getAll();
    const socialContent = allContent.filter(item => {
      if (!item.createdAt) return false;
      const itemDate = new Date(item.createdAt).toISOString().split('T')[0];
      return itemDate === dateStr;
    });

    const keyDates = this.getKeyDatesByDay(dateStr);

    const contentCount = {
      reels: socialContent.filter(c => c.type === 'Reel').length,
      carousels: socialContent.filter(c => c.type === 'Carousel').length,
      static: socialContent.filter(c => c.type === 'Static').length,
      total: socialContent.length,
    };

    return {
      date: dateStr,
      socialContent,
      keyDates,
      contentCount,
    };
  }

  private getSocialContentColor(type: string): string {
    const colors: Record<string, string> = {
      'Reel': '#1e40af', // darker blue
      'Carousel': '#0ea5e9', // medium blue
      'Static': '#7dd3fc', // lighter blue
      'Newsletter': '#22c55e', // green
    };
    return colors[type] || '#9ca3af'; // gray
  }

  // Get events for month view
  getMonthEvents(year: number, month: number): Record<number, CalendarEvent[]> {
    const result: Record<number, CalendarEvent[]> = {};
    const monthStr = String(month).padStart(2, '0');

    // Get all days in month
    const daysInMonth = new Date(year, month, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${monthStr}-${String(day).padStart(2, '0')}`;
      result[day] = this.getCalendarEventsForDay(dateStr);
    }

    return result;
  }

  // Get events for week view
  getWeekEvents(dateStr: string): Record<string, CalendarEvent[]> {
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay();
    const sunday = new Date(date);
    sunday.setDate(date.getDate() - (dayOfWeek === 0 ? 0 : dayOfWeek - 1)); // Start from Sunday

    const result: Record<string, CalendarEvent[]> = {};
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(sunday);
      currentDate.setDate(sunday.getDate() + i);
      const dateString = currentDate.toISOString().split('T')[0];
      result[days[i]] = this.getCalendarEventsForDay(dateString);
    }

    return result;
  }

  // Reschedule content to a new date
  rescheduleContent(contentId: string, newDate: string): boolean {
    const item = ContentStore.get(contentId);
    if (!item) return false;

    const updated = ContentStore.update(contentId, {
      createdAt: new Date(newDate).toISOString(),
    });

    return !!updated;
  }

  // Get reminders for a specific date
  getRemindersForDate(dateStr: string): KeyDate[] {
    return this.keyDates.filter(kd => {
      if (!kd.reminderDaysBefore) return false;
      const keyDate = new Date(kd.date);
      const reminderDate = new Date(keyDate);
      reminderDate.setDate(reminderDate.getDate() - kd.reminderDaysBefore);
      return reminderDate.toISOString().split('T')[0] === dateStr;
    });
  }
}

const CalendarStore = new CalendarStoreClass();
export default CalendarStore;
