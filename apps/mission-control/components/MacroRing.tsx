'use client';

interface MacroRingProps {
  value: number;
  max: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'purple' | 'green' | 'blue' | 'amber' | 'pink';
  label: string;
  unit?: string;
  className?: string;
}

export default function MacroRing({
  value,
  max,
  size = 'md',
  color = 'purple',
  label,
  unit = 'g',
  className = '',
}: MacroRingProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const remaining = Math.max(0, max - value);
  
  const sizeClasses = {
    sm: { container: 'w-16 h-16', text: 'text-sm', label: 'text-xs' },
    md: { container: 'w-20 h-20', text: 'text-base', label: 'text-xs' },
    lg: { container: 'w-28 h-28', text: 'text-xl', label: 'text-sm' },
  };

  const colorClasses = {
    purple: 'stroke-[#563f57]',
    green: 'stroke-green-500',
    blue: 'stroke-blue-500',
    amber: 'stroke-amber-500',
    pink: 'stroke-pink-500',
  };

  const sizes = sizeClasses[size];
  const strokeColor = colorClasses[color];
  const strokeWidth = size === 'sm' ? 3 : size === 'md' ? 4 : 5;
  const radius = size === 'sm' ? 26 : size === 'md' ? 34 : 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Determine status color
  let statusColor = 'text-gray-900';
  if (percentage > 100) statusColor = 'text-red-600';
  else if (percentage >= 90) statusColor = 'text-green-600';
  else if (percentage >= 70) statusColor = 'text-amber-600';

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className={`${sizes.container} relative`}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            className={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold ${sizes.text} ${statusColor}`}>
            {Math.round(value)}
          </span>
          <span className="text-xs text-gray-400">{unit}</span>
        </div>
      </div>
      <span className={`${sizes.label} font-medium text-gray-600 mt-1`}>{label}</span>
      <span className="text-xs text-gray-400">{Math.round(percentage)}%</span>
    </div>
  );
}
