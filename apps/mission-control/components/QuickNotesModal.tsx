'use client';

import { useState } from 'react';
import { X, StickyNote } from 'lucide-react';
import { sectionNotesStore, type SectionNote } from '@/lib/notesStore';

interface QuickNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: string; // e.g., 'Content', 'Newsletter', 'Meals', etc.
}

export default function QuickNotesModal({ isOpen, onClose, section }: QuickNotesModalProps) {
  const [noteContent, setNoteContent] = useState('');
  const [sectionNotes, setSectionNotes] = useState<SectionNote[]>([]);
  const [viewMode, setViewMode] = useState<'add' | 'view'>('add');

  const handleOpen = () => {
    // Load notes for this section when modal opens
    const notes = sectionNotesStore.getBySection(section);
    setSectionNotes(notes);
    setViewMode(notes.length > 0 ? 'view' : 'add');
  };

  const handleAddNote = () => {
    if (!noteContent.trim()) return;

    sectionNotesStore.addNote(section, noteContent);

    setNoteContent('');
    const updatedNotes = sectionNotesStore.getBySection(section);
    setSectionNotes(updatedNotes);
    setViewMode('view');
  };

  const handleDeleteNote = (id: string) => {
    if (confirm('Delete this note?')) {
      sectionNotesStore.deleteNote(id);
      const updatedNotes = sectionNotesStore.getBySection(section);
      setSectionNotes(updatedNotes);
    }
  };

  const handleClose = () => {
    setNoteContent('');
    setViewMode('add');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StickyNote className="text-amber-600" size={24} />
            <h3 className="text-2xl font-bold text-gray-900">{section} Notes</h3>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6">
          {viewMode === 'add' ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-gray-700 mb-2 block">Your Note</label>
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder={`Quick note for ${section}...`}
                  className="w-full h-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none text-sm"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  <span className="font-bold">Tip:</span> This note will be saved to the <span className="font-mono text-amber-900">{section}</span> section in your Notes tab and timestamped.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">
                  {sectionNotes.length} note{sectionNotes.length !== 1 ? 's' : ''} in {section}
                </p>
                <button
                  onClick={() => {
                    setNoteContent('');
                    setViewMode('add');
                  }}
                  className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 text-sm font-medium"
                >
                  + Add Note
                </button>
              </div>

              {sectionNotes.length > 0 ? (
                <div className="space-y-3">
                  {sectionNotes.map((note) => (
                    <div key={note.id} className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-xs text-gray-500">
                          {new Date(note.date).toLocaleDateString()} at{' '}
                          {new Date(note.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete note"
                        >
                          <X size={18} />
                        </button>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No notes yet. Add one to get started!</p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6 flex gap-3">
          {viewMode === 'add' ? (
            <>
              <button
                onClick={handleAddNote}
                disabled={!noteContent.trim()}
                className="flex-1 px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:bg-gray-300 font-bold"
              >
                Save Note
              </button>
              <button onClick={handleClose} className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleClose}
              className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
