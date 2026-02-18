'use client';

import { useState, useEffect } from 'react';
import { X, Send, Trash2 } from 'lucide-react';
import { sectionNotesStore, SectionNote } from '@/lib/notesStore';

interface NotesSidebarProps {
  section: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function NotesSidebar({ section, isOpen, onClose }: NotesSidebarProps) {
  const [newNoteText, setNewNoteText] = useState('');
  const [notes, setNotes] = useState<SectionNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // Load notes for this section
    const sectionNotes = sectionNotesStore.getBySection(section);
    setNotes(sectionNotes);

    // Subscribe to changes
    const unsubscribe = sectionNotesStore.subscribe(() => {
      const updated = sectionNotesStore.getBySection(section);
      setNotes(updated);
    });

    return unsubscribe;
  }, [section, isOpen]);

  const handleAddNote = () => {
    if (!newNoteText.trim()) return;

    setIsLoading(true);
    const newNote = sectionNotesStore.addNote(section, newNoteText);
    setNotes([newNote, ...notes]);
    setNewNoteText('');
    setIsLoading(false);

    // Optional: Auto-close after save
    setTimeout(() => {
      onClose();
    }, 800);
  };

  const handleDeleteNote = (id: string) => {
    if (confirm('Delete this note?')) {
      sectionNotesStore.deleteNote(id);
      setNotes(notes.filter(n => n.id !== id));
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="absolute right-0 top-0 h-screen w-96 bg-white shadow-2xl flex flex-col animation-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="font-semibold text-lg text-jade-purple">
            📝 Notes for {section}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Note Input */}
        <div className="p-4 border-b border-gray-200 space-y-3">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            Add a note for {section}
          </label>
          <textarea
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-jade-purple focus:border-transparent resize-none text-sm h-20"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                handleAddNote();
              }
            }}
          />
          <button
            onClick={handleAddNote}
            disabled={!newNoteText.trim() || isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-jade-purple text-white rounded-lg hover:bg-jade-purple/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            <Send size={16} />
            {isLoading ? 'Saving...' : 'Save Note'}
          </button>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No notes yet</p>
              <p className="text-xs mt-1">Add your first note above ↑</p>
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="p-3 bg-gradient-to-br from-jade-light to-white border border-jade-light rounded-lg hover:shadow-sm transition-shadow group"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-xs text-gray-500 font-medium">
                    {formatDate(note.timestamp)}
                  </p>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-100 text-red-600 rounded transition-all"
                    title="Delete note"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <p className="text-sm text-gray-700 break-words">{note.text}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animation-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
