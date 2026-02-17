'use client';

import { useState, useEffect } from 'react';
import { Plus, Pin, PinOff, Trash2, Search, Copy, Check } from 'lucide-react';
import { noteColors } from '@/lib/statusColors';

interface Note {
  id: string;
  title: string;
  content: string;
  color: 'urgent' | 'question' | 'idea' | 'insight' | 'content' | 'general';
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Revenue target for March',
      content: 'Target $10k MRR by end of March. Current: $4k. Need 2.5x growth. Focus on nurture sequence + guide bundle.',
      color: 'urgent',
      pinned: true,
      createdAt: '2026-02-18T02:00:00Z',
      updatedAt: '2026-02-18T02:00:00Z',
    },
    {
      id: '2',
      title: 'Content calendar idea',
      content: 'Red Nose Day Feb 24 - create awareness content. Daylight savings Feb 22 - sleep disruption tips post.',
      color: 'content',
      pinned: true,
      createdAt: '2026-02-18T02:05:00Z',
      updatedAt: '2026-02-18T02:05:00Z',
    },
  ]);

  const [newNoteContent, setNewNoteContent] = useState('');
  const [selectedColor, setSelectedColor] = useState<'urgent' | 'question' | 'idea' | 'insight' | 'content' | 'general'>('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('mission-control-notes');
    if (saved) {
      try {
        setNotes(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load notes:', e);
      }
    }
  }, []);

  // Save to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('mission-control-notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (!newNoteContent.trim()) return;

    const firstLine = newNoteContent.split('\n')[0].substring(0, 50);
    const newNote: Note = {
      id: Date.now().toString(),
      title: firstLine || 'Untitled',
      content: newNoteContent,
      color: selectedColor,
      pinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setNotes([newNote, ...notes]);
    setNewNoteContent('');
    setSelectedColor('general');
  };

  const togglePin = (id: string) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, pinned: !note.pinned } : note
    ));
  };

  const deleteNote = (id: string) => {
    if (confirm('Delete this note?')) {
      setNotes(notes.filter(note => note.id !== id));
    }
  };

  const copyNote = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedNotes = filteredNotes.filter(n => n.pinned);
  const unpinnedNotes = filteredNotes.filter(n => !n.pinned);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-jade-purple mb-2">📝 Notes</h2>
        <p className="text-gray-600">Capture thoughts, ideas, reminders. Quick and searchable.</p>
      </div>

      {/* Quick Add Section */}
      <div className="bg-gradient-to-br from-jade-light to-white border border-jade-light rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-jade-purple">Quick Add Note</h3>

        <textarea
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.metaKey) {
              addNote();
            }
          }}
          placeholder="What's on your mind? Type here... (Cmd+Enter to save)"
          className="w-full h-24 p-4 border border-jade-light rounded-lg focus:ring-2 focus:ring-jade-purple focus:border-transparent resize-none text-sm"
        />

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {Object.entries(noteColors).map(([key, color]) => (
              <button
                key={key}
                onClick={() => setSelectedColor(key as any)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  selectedColor === key
                    ? `${color.bg} ${color.text} ring-2 ring-offset-2 ring-jade-purple`
                    : `${color.bg} ${color.text} opacity-60 hover:opacity-100`
                }`}
              >
                {color.label}
              </button>
            ))}
          </div>

          <button
            onClick={addNote}
            disabled={!newNoteContent.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-jade-purple text-white rounded-lg hover:bg-jade-purple/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <Plus size={16} /> Save Note
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search notes..."
          className="w-full pl-10 pr-4 py-2 border border-jade-light rounded-lg focus:ring-2 focus:ring-jade-purple focus:border-transparent"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-jade-light rounded-lg p-4">
          <p className="text-sm text-gray-600">Total Notes</p>
          <p className="text-2xl font-bold text-jade-purple">{notes.length}</p>
        </div>
        <div className="bg-white border border-jade-light rounded-lg p-4">
          <p className="text-sm text-gray-600">Pinned</p>
          <p className="text-2xl font-bold text-jade-purple">{pinnedNotes.length}</p>
        </div>
        <div className="bg-white border border-jade-light rounded-lg p-4">
          <p className="text-sm text-gray-600">Today</p>
          <p className="text-2xl font-bold text-jade-purple">
            {notes.filter(n => new Date(n.createdAt).toDateString() === new Date().toDateString()).length}
          </p>
        </div>
      </div>

      {/* Pinned Notes */}
      {pinnedNotes.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Pinned</h3>
          <div className="space-y-3">
            {pinnedNotes.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                onTogglePin={togglePin}
                onDelete={deleteNote}
                onCopy={copyNote}
                isCopied={copiedId === note.id}
                isExpanded={expandedId === note.id}
                onToggleExpand={() =>
                  setExpandedId(expandedId === note.id ? null : note.id)
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* Unpinned Notes */}
      {unpinnedNotes.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            {pinnedNotes.length > 0 ? 'Other Notes' : 'All Notes'}
          </h3>
          <div className="space-y-3">
            {unpinnedNotes.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                onTogglePin={togglePin}
                onDelete={deleteNote}
                onCopy={copyNote}
                isCopied={copiedId === note.id}
                isExpanded={expandedId === note.id}
                onToggleExpand={() =>
                  setExpandedId(expandedId === note.id ? null : note.id)
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredNotes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {searchQuery ? 'No notes found.' : 'No notes yet. Start by adding one above! 💭'}
          </p>
        </div>
      )}
    </div>
  );
}

interface NoteCardProps {
  note: Note;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
  onCopy: (content: string, id: string) => void;
  isCopied: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

function NoteCard({
  note,
  onTogglePin,
  onDelete,
  onCopy,
  isCopied,
  isExpanded,
  onToggleExpand,
}: NoteCardProps) {
  const colorConfig = noteColors[note.color];
  const preview = note.content.substring(0, 100);
  const needsExpansion = note.content.length > 100;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className={`border-l-4 rounded-lg p-4 transition-all ${colorConfig.bg} border border-gray-200`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 mb-1">{note.title}</h4>
          <p className={`text-sm ${colorConfig.text} mb-2`}>
            {isExpanded ? note.content : preview + (needsExpansion ? '...' : '')}
          </p>
          <p className="text-xs text-gray-500">{formatDate(note.updatedAt)}</p>
        </div>

        <div className="flex gap-2">
          {needsExpansion && (
            <button
              onClick={onToggleExpand}
              className="p-1.5 hover:bg-gray-200/50 rounded transition-colors"
              title={isExpanded ? 'Show less' : 'Show more'}
            >
              {isExpanded ? '▲' : '▼'}
            </button>
          )}

          <button
            onClick={() => onCopy(note.content, note.id)}
            className="p-1.5 hover:bg-gray-200/50 rounded transition-colors"
            title="Copy note"
          >
            {isCopied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
          </button>

          <button
            onClick={() => onTogglePin(note.id)}
            className="p-1.5 hover:bg-gray-200/50 rounded transition-colors"
            title={note.pinned ? 'Unpin' : 'Pin note'}
          >
            {note.pinned ? <PinOff size={16} /> : <Pin size={16} />}
          </button>

          <button
            onClick={() => onDelete(note.id)}
            className="p-1.5 hover:bg-red-100 text-red-600 rounded transition-colors"
            title="Delete note"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
