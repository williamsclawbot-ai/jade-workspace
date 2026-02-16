import { LayoutGrid, Trello, TrendingUp, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface NavigationProps {
  activeView: 'dashboard' | 'kanban' | 'metrics';
  setActiveView: (view: 'dashboard' | 'kanban' | 'metrics') => void;
}

export default function Navigation({ activeView, setActiveView }: NavigationProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'kanban', label: 'Kanban', icon: Trello },
    { id: 'metrics', label: 'Metrics', icon: TrendingUp },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-jade-purple text-jade-cream shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🎯</span>
            <h1 className="text-xl font-bold">Jade Workspace</h1>
          </div>

          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === (item.id as any);
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-jade-cream text-jade-purple'
                      : 'text-jade-cream hover:bg-jade-light hover:text-jade-purple'
                  }`}
                >
                  <Icon size={20} />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </div>

          <Link
            href="/"
            className="text-jade-cream hover:text-jade-light transition-colors flex items-center space-x-1"
          >
            <BookOpen size={20} />
            <span className="hidden sm:inline">2nd Brain</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
