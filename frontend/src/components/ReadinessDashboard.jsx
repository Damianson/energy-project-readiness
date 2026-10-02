import React from 'react';

export default function ReadinessDashboard({
  project,
  selectedStageId,
  onSelectStage,
}) {
  if (!project) return null;

  const stages = [...(project.stages || [])].sort(
    (a, b) => (a.order_index || 0) - (b.order_index || 0)
  );

  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-zinc-900 tracking-tight">
            Development stages
          </h2>
          <p className="text-[13px] text-zinc-500 mt-0.5">
            Click a stage to view and manage its deliverables
          </p>
        </div>
      </div>

      {/* 6 Stage Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {stages.map((stage) => {
          const isSelected = stage.id === selectedStageId;
          const readiness = Number(stage.readiness || 0);
          const isBlocked = stage.is_blocked;
          const taskCount = (stage.tasks || []).length;

          let statusDot = 'bg-zinc-300';
          let statusLabel = 'Not started';

          if (isBlocked) {
            statusDot = 'bg-red-500';
            statusLabel = 'Blocked';
          } else if (readiness === 100) {
            statusDot = 'bg-emerald-500';
            statusLabel = 'Complete';
          } else if (readiness > 0) {
            statusDot = 'bg-amber-500';
            statusLabel = 'In progress';
          }

          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => onSelectStage && onSelectStage(stage.id)}
              className={`p-3 rounded-md border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-zinc-400 bg-zinc-50 shadow-sm'
                  : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50/50'
              }`}
            >
              <div className="flex items-center justify-between gap-1.5 mb-1.5">
                <span className="text-xs text-zinc-400 font-normal">
                  Stage {stage.order_index}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500">
                  <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
                  {statusLabel}
                </span>
              </div>

              <div className="text-sm font-medium text-zinc-900 truncate">
                {stage.name}
              </div>

              <div className="text-xs text-zinc-500 mt-1">
                {readiness}% · {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
