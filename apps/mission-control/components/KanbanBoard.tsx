'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface KanbanCard {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
}

export default function KanbanBoard() {
  const [columns, setColumns] = useState<KanbanColumn[]>([
    {
      id: 'todo',
      title: 'To Do',
      cards: [
        { id: '1', title: 'Setup Supabase RLS', description: 'Configure row-level security', priority: 'high' },
        { id: '2', title: 'GHL API Integration', description: 'Connect subscriber data', priority: 'high' },
      ],
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      cards: [
        { id: '3', title: 'Dashboard UI', description: 'Build metrics cards', priority: 'high' },
        { id: '4', title: 'Document Viewer', description: 'Markdown rendering', priority: 'medium' },
      ],
    },
    {
      id: 'review',
      title: 'Review',
      cards: [
        { id: '5', title: 'Deploy to Vercel', description: 'Staging environment', priority: 'medium' },
      ],
    },
    {
      id: 'done',
      title: 'Done',
      cards: [
        { id: '6', title: 'Project Setup', description: 'Monorepo scaffolding', priority: 'low' },
        { id: '7', title: 'Tailwind Config', description: 'Brand colors and theme', priority: 'low' },
      ],
    },
  ]);

  const [newCardText, setNewCardText] = useState('');
  const [activeColumn, setActiveColumn] = useState<string | null>(null);

  const addCard = (columnId: string, title: string) => {
    if (!title.trim()) return;
    
    setColumns(columns.map(col => {
      if (col.id === columnId) {
        return {
          ...col,
          cards: [
            ...col.cards,
            {
              id: `card-${Date.now()}`,
              title,
              description: '',
              priority: 'medium',
            },
          ],
        };
      }
      return col;
    }));
    
    setNewCardText('');
    setActiveColumn(null);
  };

  const deleteCard = (columnId: string, cardId: string) => {
    setColumns(columns.map(col => {
      if (col.id === columnId) {
        return {
          ...col,
          cards: col.cards.filter(card => card.id !== cardId),
        };
      }
      return col;
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="pb-8">
      <h2 className="text-2xl font-bold text-jade-purple mb-6">Task Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div key={column.id} className="bg-gray-100 rounded-lg p-4 min-w-72">
            <h3 className="font-semibold text-jade-purple mb-4 flex items-center space-x-2">
              <span>{column.title}</span>
              <span className="bg-jade-purple text-jade-cream text-xs px-2 py-1 rounded-full">
                {column.cards.length}
              </span>
            </h3>
            
            <div className="space-y-3 mb-4">
              {column.cards.map((card) => (
                <div key={card.id} className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-800 text-sm flex-1">{card.title}</h4>
                    <button
                      onClick={() => deleteCard(column.id, card.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  {card.description && (
                    <p className="text-xs text-gray-600 mb-2">{card.description}</p>
                  )}
                  <div className={`inline-block text-xs font-semibold px-2 py-1 rounded border ${getPriorityColor(card.priority)}`}>
                    {card.priority}
                  </div>
                </div>
              ))}
            </div>

            {activeColumn === column.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Card title..."
                  value={newCardText}
                  onChange={(e) => setNewCardText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addCard(column.id, newCardText);
                    }
                  }}
                  className="w-full px-3 py-2 border border-jade-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-jade-purple"
                  autoFocus
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => addCard(column.id, newCardText)}
                    className="flex-1 bg-jade-purple text-jade-cream text-sm px-3 py-2 rounded-lg hover:bg-jade-light hover:text-jade-purple transition-colors"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setActiveColumn(null);
                      setNewCardText('');
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 text-sm px-3 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setActiveColumn(column.id)}
                className="w-full flex items-center space-x-2 text-gray-600 hover:text-jade-purple transition-colors py-2 text-sm"
              >
                <Plus size={16} />
                <span>Add Card</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
