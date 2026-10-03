import React from 'react';

export default function StageCard({ stage, onSelectStage, isSelected = false }) {
  if (!stage) return null;

  const readiness = Number(stage.readiness || 0);
  const tasks = stage.tasks || [];
  const completedTasks = tasks.filter(
    (t) => t.status && t.status.toLowerCase() === 'complete'
  ).length;
  const totalTasks = tasks.length;
  const isBlocked = stage.is_blocked;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelectStage && onSelectStage(stage.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelectStage && onSelectStage(stage.id);
        }
      }}
      className={`p-3.5 border rounded-md transition-all cursor-pointer text-left select-none relative flex flex-col justify-between ${
        isSelected
          ? 'bg-forest-50/70 border-forest-800'
          : isBlocked
          ? 'bg-white border-red-200 hover:border-red-400'
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
    >
      <div>
        <div className="flex items-center justify-between text-[11px] font-semibold text-gray-500 mb-1">
          <span>Stage 0{stage.order_index}</span>
          {isBlocked ? (
            <span className="text-red-700 font-semibold">Blocked</span>
          ) : readiness === 100 ? (
            <span className="text-forest-700 font-semibold">Complete</span>
          ) : readiness > 0 ? (
            <span className="text-amber-700 font-semibold">Active</span>
          ) : (
            <span className="text-gray-400">Pending</span>
          )}
        </div>
        <h3 className="font-semibold text-gray-900 text-sm leading-snug">
          {stage.name}
        </h3>
      </div>

      <div className="mt-3 pt-2 border-t border-gray-100">
        <div className="flex items-baseline justify-between mb-1 text-xs">
          <span className="font-semibold text-gray-900 tabular-nums">{readiness}%</span>
          <span className="text-gray-500 text-[11px] tabular-nums">
            {completedTasks}/{totalTasks} items
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
          <div
            className={`h-full ${isBlocked ? 'bg-red-600' : 'bg-forest-700'}`}
            style={{ width: `${Math.max(readiness, 2)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
