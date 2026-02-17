'use client';

import DashboardExpanded from './DashboardExpanded';

interface DashboardProps {
  onNavigate?: (tab: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  return <DashboardExpanded onNavigate={onNavigate} />;
}
