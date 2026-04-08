"use client";

interface TodayProgressBarProps {
  completed: number;
  total: number;
}

export function TodayProgressBar({ completed, total }: TodayProgressBarProps) {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium text-gray-600">Daily Progress</span>
        <span className="text-xs font-semibold text-blue-600">{percentage}%</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="text-xs text-gray-500 mt-1">
        {completed} of {total} completed
      </div>
    </div>
  );
}
