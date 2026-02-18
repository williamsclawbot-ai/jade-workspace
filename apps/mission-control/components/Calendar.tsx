'use client';

import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { useState, useMemo } from 'react';

interface CalendarEvent {
  id?: string;
  date: string;
  title: string;
  type: 'holiday' | 'awareness' | 'school' | 'campaign' | 'content' | 'seasonal' | 'harvey';
  category: string;
  notes: string;
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date('2026-02-17'));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'holiday' | 'awareness' | 'school' | 'campaign' | 'content' | 'seasonal' | 'harvey'>('all');

  // Helper function to generate all Tuesdays and Wednesdays in 2026
  const generateRecurringDates = (): CalendarEvent[] => {
    const events: CalendarEvent[] = [];
    const startDate = new Date('2026-02-17');
    const endDate = new Date('2026-12-31');
    let eventId = 0;
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay();
      const dateStr = d.toISOString().split('T')[0];
      
      if (dayOfWeek === 2 || dayOfWeek === 3) {
        events.push({
          id: `recurring-harvey-${eventId++}`,
          date: dateStr,
          title: '🧒 Harvey at Mimi\'s house',
          type: 'harvey',
          category: 'Harvey',
          notes: 'Harvey is at Mimi\'s - you have blocked time for cleaning/tasks (all day)',
        });
      }
    }
    return events;
  };

  const baseCalendarEventsRaw: Array<Omit<CalendarEvent, 'id'>> = [
    { date: '2026-02-17', title: 'Today', type: 'seasonal' as const, category: 'System', notes: 'Current date' },
    { date: '2026-02-22', title: 'Daylight Saving Ends (QLD)', type: 'seasonal' as const, category: 'Time Change', notes: 'Clocks go back 1 hour (2am → 1am). Sleep disruptions expected 3-7 days.' },
    { date: '2026-02-24', title: 'Red Nose Day', type: 'awareness' as const, category: 'Awareness Day', notes: 'Annual fundraising day - potential content opportunity' },
    { date: '2026-03-03', title: 'School Holidays Begin (QLD)', type: 'school' as const, category: 'Term Dates', notes: 'QLD schools break until ~April 17. Major routine disruption.' },
    { date: '2026-04-02', title: 'Hello Little Traveller - Campaign Launch', type: 'campaign' as const, category: 'Campaign', notes: 'April school holidays marketing push begins' },
    { date: '2026-04-05', title: 'Easter Sunday', type: 'holiday' as const, category: 'Holiday', notes: 'Major holiday - content planning considerations' },
    { date: '2026-04-06', title: 'Easter Monday', type: 'holiday' as const, category: 'Holiday', notes: 'Public holiday in Australia' },
    { date: '2026-04-17', title: 'School Holidays End (QLD)', type: 'school' as const, category: 'Term Dates', notes: 'QLD schools return - routine reset' },
    { date: '2026-04-30', title: 'Hello Little Traveller - Campaign Peak', type: 'campaign' as const, category: 'Campaign', notes: 'Campaign reaches peak during school holidays' },
    { date: '2026-05-11', title: 'Mother\'s Day (Australia)', type: 'holiday' as const, category: 'Holiday', notes: 'Second Sunday in May - content & gift guide opportunity' },
    { date: '2026-05-25', title: 'Infant Loss Awareness Month (Start)', type: 'awareness' as const, category: 'Awareness Month', notes: 'Infant loss awareness month begins (May-June)' },
    { date: '2026-06-08', title: 'Father\'s Day (Australia)', type: 'holiday' as const, category: 'Holiday', notes: 'First Sunday in June - content & gift ideas' },
    { date: '2026-06-15', title: 'Infant Loss Awareness Month (End)', type: 'awareness' as const, category: 'Awareness Month', notes: 'Infant loss awareness month ends' },
    { date: '2026-07-06', title: 'School Holidays Begin (QLD)', type: 'school' as const, category: 'Term Dates', notes: 'Mid-year school holidays' },
    { date: '2026-07-17', title: 'School Holidays End (QLD)', type: 'school', category: 'Term Dates', notes: 'Schools resume after mid-year break' },
    { date: '2026-09-07', title: 'School Holidays Begin (QLD)', type: 'school', category: 'Term Dates', notes: 'Spring school holidays' },
    { date: '2026-09-18', title: 'School Holidays End (QLD)', type: 'school', category: 'Term Dates', notes: 'Schools resume after spring break' },
    { date: '2026-10-26', title: 'School Holidays Begin (QLD)', type: 'school', category: 'Term Dates', notes: 'Final school holidays of year' },
    { date: '2026-11-02', title: 'School Holidays End (QLD)', type: 'school', category: 'Term Dates', notes: 'Schools resume - last term begins' },
    { date: '2026-12-01', title: 'Daylight Saving Begins', type: 'seasonal', category: 'Time Change', notes: 'Clocks go forward 1 hour (2am → 3am)' },
    { date: '2026-12-07', title: 'School Holidays Begin (QLD)', type: 'school', category: 'Term Dates', notes: 'Final school holidays - summer break' },
    { date: '2026-12-25', title: 'Christmas Day', type: 'holiday', category: 'Holiday', notes: 'Major holiday - family-focused content' },
    { date: '2026-12-26', title: 'Boxing Day', type: 'holiday', category: 'Holiday', notes: 'Public holiday - holiday season content' },
  ];

  // Add unique IDs to each event
  const baseCalendarEvents: CalendarEvent[] = baseCalendarEventsRaw.map((event, idx) => ({
    ...event,
    id: `base-event-${idx}`
  }));

  const calendarEvents = [...baseCalendarEvents, ...generateRecurringDates()];

  const getTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'holiday': return { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' };
      case 'awareness': return { bg: 'bg-purple-100', text: 'text-purple-800', dot: 'bg-purple-500' };
      case 'school': return { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' };
      case 'campaign': return { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' };
      case 'content': return { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500' };
      case 'seasonal': return { bg: 'bg-cyan-100', text: 'text-cyan-800', dot: 'bg-cyan-500' };
      case 'harvey': return { bg: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange-500' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-500' };
    }
  };

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const firstDay = getFirstDayOfMonth(currentDate);
  const daysInMonth = getDaysInMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }, () => null);
  
  const getEventsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return calendarEvents.filter(e => e.date === dateStr);
  };

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  const goToday = () => setCurrentDate(new Date('2026-02-17'));

  const selectedDateObj = selectedDate ? new Date(selectedDate) : null;
  const selectedEvents = selectedDate ? calendarEvents.filter(e => e.date === selectedDate) : [];
  const filteredSelectedEvents = activeFilter === 'all' ? selectedEvents : selectedEvents.filter(e => e.type === activeFilter);

  // If a day is selected, show day detail view
  if (selectedDate) {
    return (
      <div className="h-full flex flex-col bg-white">
        {/* Header */}
        <div className="border-b border-jade-light px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button onClick={() => setSelectedDate(null)} className="p-2 hover:bg-jade-cream rounded-lg transition-colors">
                <ArrowLeft size={24} className="text-jade-purple" />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-jade-purple">
                  {selectedDateObj?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </h2>
                <p className="text-sm text-gray-600">{filteredSelectedEvents.length} event{filteredSelectedEvents.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="border-b border-jade-light px-6 py-4 flex items-center space-x-2 overflow-x-auto">
          {(['all', 'holiday', 'awareness', 'school', 'campaign', 'content', 'seasonal', 'harvey'] as const).map((filter) => {
            const typeColor = filter === 'all' ? { bg: 'bg-gray-100', text: 'text-gray-800' } : getTypeColor(filter);
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium whitespace-nowrap ${
                  activeFilter === filter
                    ? 'bg-jade-purple text-jade-cream'
                    : `${typeColor.bg} ${typeColor.text} hover:opacity-80`
                }`}
              >
                {filter === 'all' && '📅 All'}
                {filter === 'holiday' && '🎉 Holidays'}
                {filter === 'awareness' && '🤝 Awareness'}
                {filter === 'school' && '🎓 School'}
                {filter === 'campaign' && '🚀 Campaigns'}
                {filter === 'content' && '✍️ Content'}
                {filter === 'seasonal' && '🌡️ Seasonal'}
                {filter === 'harvey' && '🧒 Harvey'}
              </button>
            );
          })}
        </div>

        {/* Events List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredSelectedEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No events on this day</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSelectedEvents.map((event) => {
                const typeColor = getTypeColor(event.type);
                return (
                  <div
                    key={event.id || `${event.date}-${event.title}`}
                    className={`rounded-lg border-l-4 p-4 ${typeColor.bg} border-l-4`}
                    style={{ borderLeftColor: typeColor.dot.split('-')[1] ? `rgba(var(--color-${typeColor.dot}), 1)` : undefined }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className={`font-bold text-lg ${typeColor.text}`}>{event.title}</h3>
                          <span className={`text-xs font-bold px-2 py-1 rounded ${typeColor.bg} ${typeColor.text}`}>
                            {event.type.toUpperCase()}
                          </span>
                        </div>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm"><span className="font-semibold">Category:</span> {event.category}</p>
                          <p className="text-sm"><span className="font-semibold">Notes:</span> {event.notes}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Monthly grid view
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-jade-light px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <CalendarIcon size={32} className="text-jade-purple" />
            <div>
              <h2 className="text-2xl font-bold text-jade-purple">Calendar</h2>
              <p className="text-sm text-gray-600">Monthly view - click any day for details</p>
            </div>
          </div>
          <button className="flex items-center space-x-2 bg-jade-purple text-jade-cream px-4 py-2 rounded-lg hover:bg-jade-light hover:text-jade-purple transition-colors">
            <Plus size={20} />
            <span>Add Event</span>
          </button>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-jade-cream rounded-lg transition-colors"
          >
            <ChevronLeft size={24} className="text-jade-purple" />
          </button>
          <h3 className="text-xl font-bold text-jade-purple min-w-48 text-center">{monthName}</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-jade-cream rounded-lg transition-colors"
            >
              <ChevronRight size={24} className="text-jade-purple" />
            </button>
            <button
              onClick={goToday}
              className="px-3 py-1 text-sm font-medium bg-jade-cream text-jade-purple rounded-lg hover:bg-jade-light transition-colors"
            >
              Today
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-4">
          {/* Day of week headers */}
          <div className="grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="text-center font-bold text-sm text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for days before month starts */}
            {emptyDays.map((_, idx) => (
              <div key={`empty-${idx}`} className="aspect-square bg-gray-50 rounded-lg"></div>
            ))}

            {/* Days of month */}
            {days.map(day => {
              const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayEvents = getEventsForDate(day);
              const isToday = dateStr === '2026-02-17';

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`aspect-square rounded-lg p-2 flex flex-col items-start justify-start transition-all hover:shadow-md ${
                    isToday
                      ? 'bg-jade-purple text-jade-cream border-2 border-jade-light'
                      : 'bg-white border border-gray-200 hover:border-jade-light'
                  }`}
                >
                  <span className={`text-sm font-bold mb-1 ${isToday ? 'text-jade-cream' : 'text-gray-800'}`}>
                    {day}
                  </span>
                  
                  {/* Event dots */}
                  {dayEvents.length > 0 && (
                    <div className="flex flex-wrap gap-1 w-full">
                      {dayEvents.slice(0, 3).map((event) => {
                        const typeColor = getTypeColor(event.type);
                        return (
                          <div
                            key={event.id || `${dateStr}-${event.title}`}
                            className={`w-2 h-2 rounded-full ${typeColor.dot}`}
                            title={event.title}
                          ></div>
                        );
                      })}
                      {dayEvents.length > 3 && (
                        <span className={`text-xs font-bold ${isToday ? 'text-jade-cream' : 'text-gray-600'}`}>
                          +{dayEvents.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="border-t border-jade-light px-6 py-4 bg-jade-cream/30">
        <p className="text-xs font-semibold text-gray-600 mb-2">CATEGORIES</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-gray-700">Harvey</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-gray-700">Awareness</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-700">Campaigns</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-700">School Terms</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-700">Content</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-gray-700">Holidays</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
            <span className="text-gray-700">Seasonal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
