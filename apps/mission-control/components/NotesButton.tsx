'use client';

import { useState, useEffect } from 'react';
import { BookmarkPlus } from 'lucide-react';
import NotesSidebar from './NotesSidebar';
import { sectionNotesStore } from '@/lib/notesStore';

interface NotesButtonProps {
  section: string; // e.g., 'Content', 'Meals', etc.
}

export default function NotesButton({ section }: NotesButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [noteCount, setNoteCount] = useState(0);

  useEffect(() => {
    // Load initial count
    const notes = sectionNotesStore.getBySection(section);
    setNoteCount(notes.length);

    // Subscribe to changes
    const unsubscribe = sectionNotesStore.subscribe(() => {
      const updated = sectionNotesStore.getBySection(section);
      setNoteCount(updated.length);
    });

    return unsubscribe;
  }, [section]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative inline-flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors group"
        title={`Notes for ${section}`}
      >
        <BookmarkPlus size={20} className="text-gray-600 group-hover:text-jade-purple" />
        {noteCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-jade-purple text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {noteCount > 9 ? '9+' : noteCount}
          </span>
        )}
      </button>

      {isOpen && (
        <NotesSidebar
          section={section}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
