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

  let statusDot = 'bg-zinc-300';
  let statusText = 'Not started';

  if (isBlocked) {
    statusDot = 'bg-red-500';
    statusText = 'Blocked';
  } else if (readiness === 100) {
    statusDot = 'bg-emerald-500';
    statusText = 'Complete';
  } else if (readiness > 0) {
    statusDot = 'bg-amber-500';
    statusText = 'In progress';
  }

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
      className={`rounded-md p-4 border transition-colors cursor-pointer text-left select-none ${
        isSelected
          ? 'bg-zinc-50 border-zinc-400 shadow-sm'
          : 'bg-white border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/50'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-zinc-400">
          Stage {stage.order_index}
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs text-zinc-600">
          <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
          {statusText}
        </span>
      </div>

      <h3 className="font-medium text-zinc-900 text-sm">
        {stage.name}
      </h3>

      <div className="flex items-baseline justify-between mt-3 text-xs text-zinc-500">
        <span className="font-semibold text-zinc-900 text-base">{readiness}%</span>
        <span>
          {completedTasks} of {totalTasks} completed
        </span>
      </div>
    </div>
  );
}
