'use client';

import { useState } from 'react';
import {
  LayoutGrid,
  Trello,
  FileText,
  CheckSquare,
  Users,
  Calendar,
  FolderOpen,
  Brain,
  BookOpen,
  User,
  Settings,
  UtensilsCrossed,
  CheckCircle2,
  Zap,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid, section: 'main' },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, section: 'main' },
    { id: 'content', label: 'Content Board', icon: FileText, section: 'main' },
    { id: 'hls-tasks', label: 'HLS Tasks', icon: CheckCircle2, section: 'main' },
    { id: 'approvals', label: 'Approvals', icon: CheckSquare, section: 'main' },
    { id: 'council', label: 'Council', icon: Users, section: 'main' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, section: 'main' },
    { id: 'projects', label: 'Projects', icon: FolderOpen, section: 'main' },
    { id: 'meal-planning', label: 'Meal Planning', icon: UtensilsCrossed, section: 'main' },
    { id: 'memory', label: 'Memory', icon: Brain, section: 'secondary' },
    { id: 'docs', label: 'Docs', icon: BookOpen, section: 'secondary' },
    { id: 'people', label: 'People', icon: User, section: 'secondary' },
    { id: 'office', label: 'Office', icon: Settings, section: 'secondary' },
    { id: 'team', label: 'Team', icon: Users, section: 'secondary' },
  ];

  const mainItems = navItems.filter((item) => item.section === 'main');
  const secondaryItems = navItems.filter((item) => item.section === 'secondary');

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
            <h1 className="text-lg font-bold text-jade-purple">Jade</h1>
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
        {/* Main Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          <div className="mb-4">
            {!isCollapsed && (
              <p className="text-xs font-semibold text-gray-500 uppercase px-4 mb-2">
                Workspace
              </p>
            )}
            {mainItems.map((item) => {
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
          </div>
        </nav>

        {/* Secondary Navigation */}
        <nav className="px-2 py-4 space-y-1 border-t border-jade-light">
          {!isCollapsed && (
            <p className="text-xs font-semibold text-gray-500 uppercase px-4 mb-2">
              Knowledge
            </p>
          )}
          {secondaryItems.map((item) => {
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

        {/* Footer */}
        {!isCollapsed && (
          <div className="border-t border-jade-light p-4 text-xs text-gray-600">
            <p className="mb-2">💾 Auto-saving</p>
            <p>🔄 Last synced: now</p>
          </div>
        )}
      </div>
    </aside>
  );
}
