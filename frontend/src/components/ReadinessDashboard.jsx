import React from 'react';
import { ArrowRight, AlertOctagon, CheckCircle2 } from 'lucide-react';

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
    <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
      {/* Section Header */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-900 tracking-tight">
            Development Lifecycle
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Six-stage project development progression. Click any stage to open its detailed workspace.
          </p>
        </div>
      </div>

      {/* Connected Development Pipeline (Horizontal Stepper) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-y md:divide-y-0 md:divide-x divide-gray-200">
        {stages.map((stage, idx) => {
          const isSelected = stage.id === selectedStageId;
          const readiness = Number(stage.readiness || 0);
          const tasks = stage.tasks || [];
          const completedTasks = tasks.filter(
            (t) => t.status && t.status.toLowerCase() === 'complete'
          ).length;
          const totalTasks = tasks.length;
          const isBlocked = stage.is_blocked;

          return (
            <button
              key={stage.id || stage.name}
              type="button"
              onClick={() => onSelectStage && onSelectStage(stage.id)}
              className={`p-3.5 text-left transition-all cursor-pointer relative flex flex-col justify-between group ${
                isSelected
                  ? 'bg-forest-50/70 border-b-2 border-b-forest-800'
                  : 'hover:bg-gray-50/80 border-b-2 border-b-transparent'
              }`}
            >
              <div>
                {/* Stage Index & Step Name */}
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    Stage 0{stage.order_index}
                  </span>
                  {idx < stages.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-gray-300 hidden lg:block group-hover:text-gray-400" />
                  )}
                </div>

                <div className={`text-sm font-semibold leading-snug line-clamp-1 ${isSelected ? 'text-forest-900' : 'text-gray-900'}`}>
                  {stage.name}
                </div>

                {/* State Tag */}
                <div className="mt-2 flex items-center gap-1.5">
                  {isBlocked ? (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                      Blocked
                    </span>
                  ) : readiness === 100 ? (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-forest-50 text-forest-800 border border-forest-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-forest-600" />
                      Complete
                    </span>
                  ) : readiness > 0 ? (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                      Pending
                    </span>
                  )}
                </div>
              </div>

              {/* Progress & Item Count */}
              <div className="mt-3 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-gray-900 tabular-nums">
                    {readiness}%
                  </span>
                  <span className="text-[11px] text-gray-500 tabular-nums">
                    {completedTasks}/{totalTasks} items
                  </span>
                </div>

                {/* Restrained progress track */}
                <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      isBlocked
                        ? 'bg-red-600'
                        : readiness === 100
                        ? 'bg-forest-700'
                        : 'bg-forest-600'
                    }`}
                    style={{ width: `${Math.max(readiness, totalTasks > 0 ? 3 : 0)}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
