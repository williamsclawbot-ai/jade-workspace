'use client';

interface MacroValues {
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
}

interface MacrosDisplayProps {
  actual: MacroValues;
  target?: MacroValues;
  showRemaining?: boolean;
  compact?: boolean;
}

const JADE_TARGETS = {
  calories: 1550,
  protein: 120,
  fats: 45,
  carbs: 166,
};

export default function MacrosDisplay({
  actual,
  target = JADE_TARGETS,
  showRemaining = true,
  compact = false,
}: MacrosDisplayProps) {
  const calculatePercent = (value: number, targetValue: number) => {
    return Math.min(100, (value / targetValue) * 100);
  };

  const macros = [
    {
      label: 'Cal',
      actual: Math.round(actual.calories),
      target: target.calories,
      suffix: '',
      color: 'from-orange-400 to-orange-500',
    },
    {
      label: 'Pro',
      actual: Math.round(actual.protein),
      target: target.protein,
      suffix: 'g',
      color: 'from-red-400 to-red-500',
    },
    {
      label: 'Fat',
      actual: Math.round(actual.fats),
      target: target.fats,
      suffix: 'g',
      color: 'from-yellow-400 to-yellow-500',
    },
    {
      label: 'Carb',
      actual: Math.round(actual.carbs),
      target: target.carbs,
      suffix: 'g',
      color: 'from-green-400 to-green-500',
    },
  ];

  if (compact) {
    return (
      <div className="grid grid-cols-4 gap-2">
        {macros.map(macro => (
          <div key={macro.label} className="text-center">
            <p className="text-xs text-gray-600 font-semibold">{macro.label}</p>
            <p className="text-lg font-bold text-gray-800">
              {macro.actual}{macro.suffix}
            </p>
            <p className="text-xs text-gray-500">{macro.target}{macro.suffix}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-jade-light to-white p-4 rounded-lg border border-jade-light space-y-3">
      {macros.map(macro => {
        const percent = calculatePercent(macro.actual, macro.target);
        const remaining = Math.max(0, macro.target - macro.actual);
        const isOver = macro.actual > macro.target;

        return (
          <div key={macro.label} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-jade-purple text-sm">{macro.label}</span>
              <div className="text-right">
                <span className={`font-bold ${isOver ? 'text-red-600' : 'text-gray-800'}`}>
                  {macro.actual}{macro.suffix}
                </span>
                <span className="text-gray-500 text-xs ml-2">
                  / {macro.target}{macro.suffix}
                </span>
                {showRemaining && (
                  <span className={`text-xs ml-2 ${remaining > 20 ? 'text-green-600' : 'text-orange-600'}`}>
                    {remaining}{macro.suffix} left
                  </span>
                )}
              </div>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${macro.color} rounded-full transition-all`}
                style={{ width: `${percent}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
