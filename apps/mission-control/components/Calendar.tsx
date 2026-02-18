'use client';

import { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Download,
} from 'lucide-react';
import CalendarStore, { KeyDate, CalendarEvent, DayDetail } from '@/lib/calendarStore';
import ContentStore, { ContentItem } from '@/lib/contentStore';

interface FilterState {
  contentTypes: Record<string, boolean>;
  contentStatus: Record<string, boolean>;
  eventTypes: Record<string, boolean>;
  showKeyDates: boolean;
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date('2026-02-18'));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    contentTypes: { Reel: true, Carousel: true, Static: true, Newsletter: true },
    contentStatus: { all: true },
    eventTypes: { 'social': true, 'key-date': true },
    showKeyDates: true,
  });

  const [dayDetail, setDayDetail] = useState<DayDetail | null>(null);
  const [allContent, setAllContent] = useState<ContentItem[]>([]);

  // Load content on mount
  useEffect(() => {
    const content = ContentStore.getAll();
    setAllContent(content);

    const handleStorageChange = () => {
      const updated = ContentStore.getAll();
      setAllContent(updated);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const weekRange = getWeekRange(currentDate);

  function getWeekRange(date: Date): { start: Date; end: Date; label: string } {
    const dayOfWeek = date.getDay();
    const start = new Date(date);
    start.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const label = `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

    return { start, end, label };
  }

  const getEventColor = (event: CalendarEvent): string => {
    if (event.type === 'key-date') {
      return {
        purple: 'bg-purple-100 border-purple-300',
        red: 'bg-red-100 border-red-300',
        cyan: 'bg-cyan-100 border-cyan-300',
        orange: 'bg-orange-100 border-orange-300',
        yellow: 'bg-yellow-100 border-yellow-300',
        blue: 'bg-blue-100 border-blue-300',
      }[event.color as keyof typeof colors] || 'bg-gray-100 border-gray-300';
    }

    // Social content colors
    const colors: Record<string, string> = {
      Reel: 'bg-blue-100 border-blue-300',
      Carousel: 'bg-blue-50 border-blue-200',
      Static: 'bg-blue-50 border-blue-200',
    };
    return colors[event.subType || 'Static'] || 'bg-gray-100 border-gray-300';
  };

  const getEventTextColor = (event: CalendarEvent): string => {
    if (event.type === 'key-date') {
      return {
        purple: 'text-purple-800',
        red: 'text-red-800',
        cyan: 'text-cyan-800',
        orange: 'text-orange-800',
        yellow: 'text-yellow-800',
        blue: 'text-blue-800',
      }[event.color as keyof typeof colors] || 'text-gray-800';
    }
    return 'text-blue-800';
  };

  const colors: Record<string, string> = {};

  const handleDragStart = (e: React.DragEvent, contentId: string) => {
    setDraggedItem(contentId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, newDate: string) => {
    e.preventDefault();
    if (!draggedItem) return;

    const success = CalendarStore.rescheduleContent(draggedItem, newDate);
    if (success) {
      setAllContent(ContentStore.getAll());
      setDayDetail(CalendarStore.getDayDetail(newDate));
    }
    setDraggedItem(null);
  };

  const toggleFilter = (category: 'contentTypes' | 'eventTypes', key: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key],
      },
    }));
  };

  const toggleKeyDates = () => {
    setFilters(prev => ({
      ...prev,
      showKeyDates: !prev.showKeyDates,
    }));
  };

  const shouldShowEvent = (event: CalendarEvent): boolean => {
    if (!filters.showKeyDates && event.type === 'key-date') return false;
    if (!filters.eventTypes[event.type]) return false;
    if (event.type === 'social' && !filters.contentTypes[event.subType || 'Static']) return false;
    return true;
  };

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  const prevWeek = () => setCurrentDate(new Date(currentDate.getDate() - 7));
  const nextWeek = () => setCurrentDate(new Date(currentDate.getDate() + 7));
  const goToday = () => setCurrentDate(new Date('2026-02-18'));

  // Day view
  if (selectedDate && dayDetail) {
    return (
      <div className="h-full flex flex-col bg-white">
        {/* Header */}
        <div className="border-b border-jade-light px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <button onClick={() => setSelectedDate(null)} className="p-2 hover:bg-jade-cream rounded-lg">
                <ArrowLeft size={24} className="text-jade-purple" />
              </button>
              <div>
                <h2 className="text-3xl font-bold text-jade-purple">
                  {new Date(selectedDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {dayDetail.contentCount.total} social post{dayDetail.contentCount.total !== 1 ? 's' : ''} • {dayDetail.keyDates.length} key date{dayDetail.keyDates.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content and Events */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Key Dates */}
            {dayDetail.keyDates.length > 0 && (
              <div className="lg:col-span-1">
                <h3 className="text-lg font-bold text-jade-purple mb-4">📅 Key Dates</h3>
                <div className="space-y-3">
                  {dayDetail.keyDates.map(kd => (
                    <div key={kd.id} className="p-4 rounded-lg border-l-4" style={{
                      backgroundColor: `${kd.color === 'purple' ? 'bg-purple-50' : kd.color === 'red' ? 'bg-red-50' : 'bg-gray-50'}`,
                      borderLeftColor: `${kd.color === 'purple' ? '#a855f7' : kd.color === 'red' ? '#ef4444' : '#999'}`,
                    }}>
                      <h4 className="font-bold text-gray-900">{kd.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">{kd.description}</p>
                      {kd.importance === 'high' && <span className="inline-block mt-2 px-2 py-1 bg-red-200 text-red-800 text-xs font-bold rounded">HIGH PRIORITY</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Social Content */}
            <div className={dayDetail.keyDates.length > 0 ? 'lg:col-span-2' : 'lg:col-span-3'}>
              <h3 className="text-lg font-bold text-jade-purple mb-4">📱 Social Content</h3>
              {dayDetail.socialContent.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No social content scheduled for this day</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dayDetail.socialContent.map(content => (
                    <div key={content.id} className="p-4 rounded-lg border border-blue-200 bg-blue-50 hover:shadow-md transition">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="inline-block px-2 py-1 bg-blue-200 text-blue-800 text-xs font-bold rounded">
                            {content.type}
                          </span>
                          <span className="ml-2 inline-block px-2 py-1 text-xs font-medium rounded" style={{
                            backgroundColor: content.status === 'Due for Review' ? '#fef08a' : content.status === 'Posted' ? '#dcfce7' : '#f3f4f6',
                            color: content.status === 'Due for Review' ? '#92400e' : content.status === 'Posted' ? '#166534' : '#374151',
                          }}>
                            {content.status}
                          </span>
                        </div>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-1">{content.title}</h4>
                      <p className="text-sm text-gray-700">{content.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Content Stats */}
              {dayDetail.contentCount.total > 0 && (
                <div className="mt-6 p-4 bg-jade-cream rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Content Breakdown:</p>
                  <div className="flex gap-4">
                    {dayDetail.contentCount.reels > 0 && <span className="text-xs">🎬 {dayDetail.contentCount.reels} Reel{dayDetail.contentCount.reels !== 1 ? 's' : ''}</span>}
                    {dayDetail.contentCount.carousels > 0 && <span className="text-xs">📚 {dayDetail.contentCount.carousels} Carousel{dayDetail.contentCount.carousels !== 1 ? 's' : ''}</span>}
                    {dayDetail.contentCount.static > 0 && <span className="text-xs">🖼️ {dayDetail.contentCount.static} Static</span>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Month View
  if (viewMode === 'month') {
    const firstDay = getFirstDayOfMonth(currentDate);
    const daysInMonth = getDaysInMonth(currentDate);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyDays = Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }, () => null);

    const getEventsForDate = (day: number) => {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const events = CalendarStore.getCalendarEventsForDay(dateStr);
      return events.filter(shouldShowEvent);
    };

    const isToday = (day: number) => {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return dateStr === '2026-02-18';
    };

    return (
      <div className="h-full flex flex-col bg-white">
        {/* Header */}
        <div className="border-b border-jade-light px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <CalendarIcon size={32} className="text-jade-purple" />
              <div>
                <h2 className="text-2xl font-bold text-jade-purple">Content Calendar</h2>
                <p className="text-sm text-gray-600">Plan and manage your content across the year</p>
              </div>
            </div>
            <button className="flex items-center space-x-2 bg-jade-purple text-jade-cream px-4 py-2 rounded-lg hover:opacity-90 transition">
              <Download size={18} />
              <span>Export</span>
            </button>
          </div>

          {/* Navigation and View Controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="p-2 hover:bg-jade-cream rounded-lg">
                <ChevronLeft size={24} className="text-jade-purple" />
              </button>
              <h3 className="text-xl font-bold text-jade-purple min-w-64 text-center">{monthName}</h3>
              <button onClick={nextMonth} className="p-2 hover:bg-jade-cream rounded-lg">
                <ChevronRight size={24} className="text-jade-purple" />
              </button>
              <button onClick={goToday} className="ml-4 px-4 py-2 text-sm font-medium bg-jade-cream text-jade-purple rounded-lg hover:opacity-80 transition">
                Today
              </button>
            </div>

            <div className="flex gap-2">
              {(['month', 'week'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                    viewMode === mode
                      ? 'bg-jade-purple text-jade-cream'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {mode === 'month' ? '📅 Month' : '📊 Week'}
                </button>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">CONTENT TYPES</p>
              <div className="flex gap-2 flex-wrap">
                {['Reel', 'Carousel', 'Static', 'Newsletter'].map(type => (
                  <button
                    key={type}
                    onClick={() => toggleFilter('contentTypes', type)}
                    className={`px-3 py-1 rounded text-xs font-medium transition ${
                      filters.contentTypes[type]
                        ? 'bg-blue-200 text-blue-800'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {type === 'Reel' && '🎬'} {type === 'Carousel' && '📚'} {type === 'Static' && '🖼️'} {type === 'Newsletter' && '📧'} {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2">EVENT TYPES</p>
                <div className="flex gap-2">
                  {['social', 'key-date'].map(type => (
                    <button
                      key={type}
                      onClick={() => toggleFilter('eventTypes', type)}
                      className={`px-3 py-1 rounded text-xs font-medium transition ${
                        filters.eventTypes[type]
                          ? 'bg-purple-200 text-purple-800'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {type === 'social' ? '📱 Social' : '🎉 Key Dates'}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={toggleKeyDates}
                className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-medium transition ${
                  filters.showKeyDates
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {filters.showKeyDates ? <Eye size={14} /> : <EyeOff size={14} />}
                Key Dates
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-auto p-8">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-bold text-sm text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {emptyDays.map((_, idx) => (
              <div key={`empty-${idx}`} className="aspect-square bg-gray-50 rounded-lg"></div>
            ))}

            {days.map(day => {
              const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayEvents = getEventsForDate(day);

              return (
                <button
                  key={day}
                  onClick={() => {
                    setSelectedDate(dateStr);
                    setDayDetail(CalendarStore.getDayDetail(dateStr));
                  }}
                  onDragOver={handleDragOver}
                  onDrop={e => handleDrop(e, dateStr)}
                  className={`aspect-square rounded-lg p-2 flex flex-col items-start justify-start transition-all hover:shadow-md cursor-pointer border-2 ${
                    isToday(day)
                      ? 'bg-jade-purple text-jade-cream border-jade-light'
                      : 'bg-white border-gray-200 hover:border-jade-light'
                  }`}
                >
                  <span className={`text-sm font-bold ${isToday(day) ? 'text-jade-cream' : 'text-gray-800'}`}>
                    {day}
                  </span>

                  {dayEvents.length > 0 && (
                    <div className="mt-1 w-full flex flex-col gap-1">
                      {dayEvents.slice(0, 2).map((event, idx) => (
                        <div
                          key={idx}
                          className="text-xs font-medium truncate px-1 py-0.5 rounded" 
                          style={{
                            backgroundColor: event.color,
                            color: event.type === 'key-date' ? '#374151' : '#1e40af',
                          }}
                          title={event.title}
                        >
                          {event.type === 'social' ? '📱' : '🎉'} {event.title.slice(0, 15)}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <span className={`text-xs font-bold ${isToday(day) ? 'text-jade-cream' : 'text-gray-600'}`}>
                          +{dayEvents.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="border-t border-jade-light px-8 py-4 bg-jade-cream/30">
          <p className="text-xs font-semibold text-gray-600 mb-2">LEGEND</p>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3 text-xs">
            <div className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: '#1e40af' }}></span>
              <span>Reel</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: '#0ea5e9' }}></span>
              <span>Carousel</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: '#7dd3fc' }}></span>
              <span>Static</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: '#22c55e' }}></span>
              <span>Newsletter</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: '#a855f7' }}></span>
              <span>Awareness</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: '#ef4444' }}></span>
              <span>Holiday</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: '#06b6d4' }}></span>
              <span>Seasonal</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: '#f97316' }}></span>
              <span>Campaign</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Week View
  const weekStart = weekRange.start;
  const weekEnd = weekRange.end;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-jade-light px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <CalendarIcon size={32} className="text-jade-purple" />
            <div>
              <h2 className="text-2xl font-bold text-jade-purple">Content Calendar</h2>
              <p className="text-sm text-gray-600">Week view - {weekRange.label}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={prevWeek} className="p-2 hover:bg-jade-cream rounded-lg">
              <ChevronLeft size={24} className="text-jade-purple" />
            </button>
            <h3 className="text-lg font-bold text-jade-purple min-w-96 text-center">{weekRange.label}</h3>
            <button onClick={nextWeek} className="p-2 hover:bg-jade-cream rounded-lg">
              <ChevronRight size={24} className="text-jade-purple" />
            </button>
            <button onClick={goToday} className="ml-4 px-4 py-2 text-sm font-medium bg-jade-cream text-jade-purple rounded-lg">
              Today
            </button>
          </div>

          <div className="flex gap-2">
            {(['month', 'week'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                  viewMode === mode
                    ? 'bg-jade-purple text-jade-cream'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {mode === 'month' ? '📅 Month' : '📊 Week'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Week Grid */}
      <div className="flex-1 overflow-auto p-8">
        <div className="grid grid-cols-7 gap-4">
          {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((dayName, dayIdx) => {
            const date = new Date(weekStart);
            date.setDate(weekStart.getDate() + dayIdx);
            const dateStr = date.toISOString().split('T')[0];
            const dayEvents = CalendarStore.getCalendarEventsForDay(dateStr).filter(shouldShowEvent);

            return (
              <div
                key={dayName}
                className="border border-gray-200 rounded-lg overflow-hidden flex flex-col hover:shadow-md transition"
                onDragOver={handleDragOver}
                onDrop={e => handleDrop(e, dateStr)}
              >
                {/* Day Header */}
                <div className="bg-jade-purple text-jade-cream p-3 text-center">
                  <p className="font-bold text-sm">{dayName.slice(0, 3)}</p>
                  <p className="text-xs mt-1">{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                </div>

                {/* Events */}
                <div className="flex-1 p-2 overflow-y-auto space-y-2">
                  {dayEvents.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 text-xs">No events</div>
                  ) : (
                    dayEvents.map((event, idx) => (
                      <div
                        key={idx}
                        draggable={event.type === 'social'}
                        onDragStart={e => handleDragStart(e, event.contentId || '')}
                        className={`p-2 rounded text-xs border ${getEventColor(event)} ${event.type === 'social' ? 'cursor-move hover:opacity-75' : ''}`}
                      >
                        <p className="font-bold truncate">{event.title}</p>
                        {event.type === 'social' && (
                          <p className="text-xs opacity-75">{event.subType}</p>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Add Event Button */}
                <div className="border-t border-gray-200 p-2">
                  <button className="w-full text-xs font-medium text-jade-purple hover:bg-jade-cream rounded py-1 transition">
                    + Add
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
