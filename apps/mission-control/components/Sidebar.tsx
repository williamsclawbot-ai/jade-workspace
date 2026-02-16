'use client';

import { useState } from 'react';
import {
  LayoutGrid,
  BookOpen,
  FileText,
  CheckSquare,
  Calendar,
  Users,
  Brain,
  Settings,
  UtensilsCrossed,
  Target,
  Zap,
  TrendingUp,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navSections = [
    {
      name: 'Business Hub',
      section: 'business',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
        { id: 'guides', label: 'Guides', icon: BookOpen },
        { id: 'content', label: 'Content', icon: FileText },
        { id: 'campaigns', label: 'Campaigns', icon: Target },
        { id: 'ghl', label: 'GHL', icon: TrendingUp },
      ],
    },
    {
      name: 'Operational',
      section: 'operational',
      items: [
        { id: 'today', label: 'Today', icon: Zap },
        { id: 'hls-tasks', label: 'HLS Tasks', icon: CheckSquare },
        { id: 'tasks', label: 'Tasks', icon: CheckSquare },
        { id: 'meal-planning', label: 'Meal Planning', icon: UtensilsCrossed },
        { id: 'calendar', label: 'Calendar', icon: Calendar },
      ],
    },
    {
      name: 'Knowledge',
      section: 'knowledge',
      items: [
        { id: 'memory', label: 'Memory', icon: Brain },
      ],
    },
    {
      name: 'Settings',
      section: 'settings',
      items: [
        { id: 'office', label: 'Office', icon: Settings },
      ],
    },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 bg-white border-r border-jade-light shadow-lg transition-all duration-300 z-40 pt-0 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-jade-light bg-white">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🎯</span>
            <h1 className="text-lg font-bold text-jade-purple">Mission Control</h1>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-jade-cream rounded-lg transition-colors text-jade-purple"
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Navigation Content */}
      <div className="flex flex-col h-[calc(100vh-64px)] overflow-y-auto">
        {navSections.map((section) => (
          <nav key={section.section} className="px-2 py-4 space-y-1 border-b border-jade-light">
            {!isCollapsed && (
              <p className="text-xs font-semibold text-gray-500 uppercase px-4 mb-2">
                {section.name}
              </p>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  title={isCollapsed ? item.label : ''}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center' : 'justify-start'
                  } space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-jade-purple text-jade-cream'
                      : 'text-gray-700 hover:bg-jade-cream'
                  }`}
                >
                  <Icon size={20} />
                  {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        ))}

        {/* Footer */}
        {!isCollapsed && (
          <div className="border-t border-jade-light p-4 text-xs text-gray-600 mt-auto">
            <p className="mb-2">💾 Auto-saving</p>
            <p>🔄 Last synced: now</p>
          </div>
        )}
      </div>
    </aside>
  );
}
