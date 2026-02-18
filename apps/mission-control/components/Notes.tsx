'use client';

import { useState, useEffect } from 'react';
import { Search, Trash2, Filter } from 'lucide-react';
import { sectionNotesStore, SectionNote } from '@/lib/notesStore';

export default function Notes() {
  const [notes, setNotes] = useState<SectionNote[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('All');
  const [sections, setSections] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load all notes and sections
    const allNotes = sectionNotesStore.getNotes();
    setNotes(allNotes);

    const uniqueSections = sectionNotesStore.getSections();
    setSections(['All', ...uniqueSections.map(s => s.section)]);
    setIsLoading(false);

    // Subscribe to changes
    const unsubscribe = sectionNotesStore.subscribe(() => {
      const updated = sectionNotesStore.getNotes();
      setNotes(updated);

      const updatedSections = sectionNotesStore.getSections();
      setSections(['All', ...updatedSections.map(s => s.section)]);
    });

    return unsubscribe;
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Delete this note?')) {
      sectionNotesStore.deleteNote(id);
    }
  };

  // Filter notes based on search and section selection
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.section.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSection = selectedSection === 'All' || note.section === selectedSection;
    return matchesSearch && matchesSection;
  });

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const getStatusColor = (section: string) => {
    const colors: Record<string, string> = {
      'Content': 'bg-blue-50 border-blue-200',
      'Newsletter': 'bg-purple-50 border-purple-200',
      'Meals': 'bg-green-50 border-green-200',
      'Cleaning': 'bg-orange-50 border-orange-200',
      'Appointments': 'bg-pink-50 border-pink-200',
      'Tasks': 'bg-yellow-50 border-yellow-200',
      'Decisions': 'bg-indigo-50 border-indigo-200',
      'Campaigns': 'bg-red-50 border-red-200',
    };
    return colors[section] || 'bg-gray-50 border-gray-200';
  };

  const getSectionBadgeColor = (section: string) => {
    const colors: Record<string, string> = {
      'Content': 'bg-blue-100 text-blue-800',
      'Newsletter': 'bg-purple-100 text-purple-800',
      'Meals': 'bg-green-100 text-green-800',
      'Cleaning': 'bg-orange-100 text-orange-800',
      'Appointments': 'bg-pink-100 text-pink-800',
      'Tasks': 'bg-yellow-100 text-yellow-800',
      'Decisions': 'bg-indigo-100 text-indigo-800',
      'Campaigns': 'bg-red-100 text-red-800',
    };
    return colors[section] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-jade-purple mb-2">📝 Notes</h2>
        <p className="text-gray-600">View and manage all notes from across Mission Control</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-jade-light rounded-lg p-4">
          <p className="text-sm text-gray-600">Total Notes</p>
          <p className="text-2xl font-bold text-jade-purple">{notes.length}</p>
        </div>
        <div className="bg-white border border-jade-light rounded-lg p-4">
          <p className="text-sm text-gray-600">Sections</p>
          <p className="text-2xl font-bold text-jade-purple">{sections.length - 1}</p>
        </div>
        <div className="bg-white border border-jade-light rounded-lg p-4">
          <p className="text-sm text-gray-600">Today</p>
          <p className="text-2xl font-bold text-jade-purple">
            {notes.filter(n => {
              const noteDate = new Date(n.timestamp);
              const today = new Date();
              return noteDate.toDateString() === today.toDateString();
            }).length}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes by text or section..."
            className="w-full pl-10 pr-4 py-2 border border-jade-light rounded-lg focus:ring-2 focus:ring-jade-purple focus:border-transparent"
          />
        </div>

        {/* Section Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter size={18} className="text-gray-600 flex-shrink-0" />
          {sections.map(section => (
            <button
              key={section}
              onClick={() => setSelectedSection(section)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex-shrink-0 ${
                selectedSection === section
                  ? 'bg-jade-purple text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {section}
              {section !== 'All' && (
                <span className="ml-2 opacity-75">
                  {notes.filter(n => n.section === section).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notes List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading notes...</p>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchQuery || selectedSection !== 'All'
                ? 'No notes found. Try adjusting your filters.'
                : 'No notes yet. Add notes from any tab to see them here! 💭'}
            </p>
          </div>
        ) : (
          filteredNotes.map(note => (
            <div
              key={note.id}
              className={`border rounded-lg p-4 transition-all hover:shadow-md ${getStatusColor(note.section)}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Section Badge and Date */}
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${getSectionBadgeColor(note.section)}`}>
                      {note.section}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(note.timestamp)}
                    </span>
                  </div>

                  {/* Note Text */}
                  <p className="text-sm text-gray-800 break-words leading-relaxed">
                    {note.text}
                  </p>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(note.id)}
                  className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors flex-shrink-0"
                  title="Delete note"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
