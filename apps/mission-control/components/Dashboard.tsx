'use client';

import KanbanDashboard from './KanbanDashboard';

interface DashboardProps {
  onNavigate?: (tab: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  return <KanbanDashboard onNavigate={onNavigate} />;
}
