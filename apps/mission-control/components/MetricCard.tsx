'use client';

import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  target?: number;
  actual?: number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'default' | 'green' | 'orange' | 'red' | 'plum' | 'cream';
  icon?: LucideIcon;
  onClick?: () => void;
}

export default function MetricCard({
  label,
  value,
  unit,
  target,
  actual,
  trend,
  trendValue,
  color = 'default',
  icon: Icon,
  onClick,
}: MetricCardProps) {
  // Determine status color based on target vs actual
  const getStatusColor = () => {
    if (target === undefined || actual === undefined) return 'text-[#563f57]';
    const diff = Math.abs(actual - target);
    const tolerance = target * 0.05;
    if (diff <= tolerance) return 'text-green-600';
    if (diff <= target * 0.15) return 'text-orange-500';
    return 'text-red-500';
  };

  const getBgColor = () => {
    switch (color) {
      case 'green':
        return 'bg-green-50/50 border-green-100';
      case 'orange':
        return 'bg-orange-50/50 border-orange-100';
      case 'red':
        return 'bg-red-50/50 border-red-100';
      case 'plum':
        return 'bg-[#563f57]/5 border-[#563f57]/10';
      case 'cream':
        return 'bg-[#fbecdb]/50 border-[#fbecdb]';
      default:
        return 'bg-white border-[#fbecdb]';
    }
  };

  const getIconBgColor = () => {
    switch (color) {
      case 'green':
        return 'bg-green-100 text-green-600';
      case 'orange':
        return 'bg-orange-100 text-orange-600';
      case 'red':
        return 'bg-red-100 text-red-600';
      case 'plum':
        return 'bg-[#563f57]/10 text-[#563f57]';
      case 'cream':
        return 'bg-[#fbecdb] text-[#563f57]';
      default:
        return 'bg-[#fbecdb] text-[#563f57]';
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`rounded-xl border ${getBgColor()} p-4 shadow-sm hover:shadow-md transition-all ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl sm:text-3xl font-bold tracking-tight ${getStatusColor()}`}>
              {value}
            </span>
            {unit && (
              <span className="text-sm font-medium text-gray-400">{unit}</span>
            )}
          </div>
          
          {/* Target indicator */}
          {target !== undefined && (
            <p className="text-xs text-gray-400 mt-1">
              Target: {target}{unit && unit}
            </p>
          )}
          
          {/* Trend indicator */}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              trend === 'up' ? 'text-green-600' : 
              trend === 'down' ? 'text-red-500' : 
              'text-gray-500'
            }`}>
              {trend === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
              {trend === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
              {trend === 'neutral' && <Minus className="w-3.5 h-3.5" />}
              {trendValue && <span>{trendValue}</span>}
            </div>
          )}
        </div>
        
        {Icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getIconBgColor()}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
