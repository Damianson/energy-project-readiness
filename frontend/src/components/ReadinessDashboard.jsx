import React from 'react';
import StageCard from './StageCard';
import { GitCommit, AlertOctagon, CheckCircle2, ChevronRight, ArrowRight } from 'lucide-react';

export default function ReadinessDashboard({
  project,
  selectedStageId,
  onSelectStage,
}) {
  if (!project) return null;

  const overallReadiness = Number(project.overall_readiness || 0);
  const stages = [...(project.stages || [])].sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
  const blockedStagesCount = stages.filter((s) => s.is_blocked).length;
  const completedStagesCount = stages.filter((s) => Number(s.readiness) === 100).length;

  return (
    <div className="space-y-4">
      {/* Connected Development Lifecycle Progression Control Panel */}
      <div className="bg-[#121722] border border-[#1f283d] rounded-lg p-4 sm:p-5">
        {/* Header & Lifecycle Flow Label */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[#1f283d]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <GitCommit className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white tracking-tight uppercase font-mono">
                Project Development Lifecycle
              </h2>
            </div>
            {/* Explicit Site -> Grid -> Permits -> Commercial -> Procurement -> Construction representation */}
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 flex-wrap">
              <span className="text-slate-300">Progression:</span>
              <span>Site</span>
              <ArrowRight className="w-3 h-3 text-slate-400 inline" />
              <span>Grid</span>
              <ArrowRight className="w-3 h-3 text-slate-400 inline" />
              <span>Permits</span>
              <ArrowRight className="w-3 h-3 text-slate-400 inline" />
              <span>Commercial</span>
              <ArrowRight className="w-3 h-3 text-slate-400 inline" />
              <span>Procurement</span>
              <ArrowRight className="w-3 h-3 text-slate-400 inline" />
              <span>Construction</span>
            </div>
          </div>

          {/* Aggregate Telemetry */}
          <div className="flex items-center gap-4 self-start md:self-auto">
            <div className="text-right font-mono">
              <div className="text-lg sm:text-xl font-bold text-emerald-400 tabular-nums">
                {overallReadiness}%
              </div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400">
                Composite Score
              </div>
            </div>

            <div className="h-8 w-px bg-[#1f283d]" />

            <div className="text-left font-mono">
              <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                {blockedStagesCount > 0 ? (
                  <span className="text-rose-400 flex items-center gap-1">
                    <AlertOctagon className="w-3.5 h-3.5" />
                    {blockedStagesCount} of 6 Blocked
                  </span>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    6 of 6 Clear
                  </span>
                )}
              </div>
              <div className="text-[10px] text-slate-400">
                {completedStagesCount} Complete
              </div>
            </div>
          </div>
        </div>

        {/* Connected Linear Lifecycle Progression Pipeline (Rail) */}
        <div className="mt-4 pt-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {stages.map((stage, idx) => {
              const isSelected = stage.id === selectedStageId;
              const readiness = Number(stage.readiness || 0);
              const isBlocked = stage.is_blocked;
              const isLast = idx === stages.length - 1;

              let statusColor = 'text-slate-400 border-slate-700 bg-[#141b27]';
              let statusText = 'Pending';
              if (isBlocked) {
                statusColor = 'text-rose-300 border-rose-800 bg-rose-950/80';
                statusText = 'Blocked';
              } else if (readiness === 100) {
                statusColor = 'text-emerald-300 border-emerald-800 bg-emerald-950/80';
                statusText = 'Complete';
              } else if (readiness > 0) {
                statusColor = 'text-amber-300 border-amber-800/80 bg-[#182332]';
                statusText = 'Active';
              }

              return (
                <div
                  key={stage.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectStage && onSelectStage(stage.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      onSelectStage && onSelectStage(stage.id);
                    }
                  }}
                  className={`p-2.5 rounded border transition-colors cursor-pointer text-left select-none relative group ${
                    isSelected
                      ? 'bg-[#152032] border-emerald-500 ring-1 ring-emerald-500/80'
                      : 'bg-[#131824] border-[#1e273a] hover:bg-[#182030] hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      0{stage.order_index}
                    </span>
                    <span className={`px-1 py-0.2 text-[9px] font-mono uppercase font-bold rounded border ${statusColor}`}>
                      {statusText}
                    </span>
                  </div>

                  <div className="font-semibold text-xs text-white truncate mb-1.5">
                    {stage.name}
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                    <span>{readiness}%</span>
                    <span>{stage.tasks?.length || 0} tasks</span>
                  </div>

                  {/* Micro Progress Bar */}
                  <div className="w-full bg-[#0d121c] rounded h-1 overflow-hidden border border-[#1e2638]">
                    <div
                      className={`h-full ${
                        isBlocked
                          ? 'bg-rose-500'
                          : readiness === 100
                          ? 'bg-emerald-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.max(readiness, 3)}%` }}
                    />
                  </div>

                  {/* Indicator Arrow connecting to next phase on large screens */}
                  {!isLast && (
                    <div className="hidden lg:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-4 h-4 rounded-full bg-[#0b0f17] border border-[#2b374e] items-center justify-center text-slate-400">
                      <ChevronRight className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stage Detail Grid Breakdown */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-1">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            Stage Deliverables & Verification Matrix
          </h3>
          <span className="text-[11px] font-mono text-slate-400">
            Click any phase to inspect tasks below
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {stages.map((stage) => (
            <StageCard
              key={stage.id || stage.name}
              stage={stage}
              isSelected={stage.id === selectedStageId}
              onSelectStage={onSelectStage}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
