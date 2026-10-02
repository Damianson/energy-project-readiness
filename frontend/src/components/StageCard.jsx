import React from 'react';
import { AlertOctagon, CheckCircle2, Clock, Circle } from 'lucide-react';

export default function StageCard({ stage, onSelectStage, isSelected = false }) {
  if (!stage) return null;

  const readiness = Number(stage.readiness || 0);
  const tasks = stage.tasks || [];
  const completedTasks = tasks.filter(
    (t) => t.status && t.status.toLowerCase() === 'complete'
  ).length;
  const totalTasks = tasks.length;
  const isBlocked = stage.is_blocked;

  // Determine stage status badge
  const getStatusBadge = () => {
    if (isBlocked) {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-rose-950/90 text-rose-300 border border-rose-800">
          <AlertOctagon className="w-3 h-3 text-rose-400" />
          Blocked
        </span>
      );
    }
    if (readiness === 100) {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-950/80 text-emerald-300 border border-emerald-800">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          Complete
        </span>
      );
    }
    if (readiness > 0) {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#182332] text-amber-300 border border-amber-800/80">
          <Clock className="w-3 h-3 text-amber-400" />
          In Progress
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium text-slate-400 bg-[#141b27] border border-[#242f44]">
        Pending
      </span>
    );
  };

  // Progress bar color
  const getProgressBarColor = () => {
    if (isBlocked) return 'bg-rose-500';
    if (readiness === 100) return 'bg-emerald-500';
    if (readiness > 0) return 'bg-amber-500';
    return 'bg-slate-700';
  };

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
      className={`rounded-md p-4 border transition-colors cursor-pointer text-left select-none relative ${
        isSelected
          ? 'bg-[#151f30] border-emerald-500 ring-1 ring-emerald-500'
          : isBlocked
          ? 'bg-[#131824] border-rose-900/60 hover:border-rose-700 hover:bg-[#181d2a]'
          : 'bg-[#131824] border-[#222c3f] hover:border-slate-600 hover:bg-[#181d2a]'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-400">
            0{stage.order_index}
          </span>
          <h3 className="font-bold text-white text-sm tracking-tight">
            {stage.name}
          </h3>
        </div>
        {getStatusBadge()}
      </div>

      {/* Progress percentage & Task ratio */}
      <div className="flex items-baseline justify-between mb-2 mt-3 font-mono">
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold text-white tabular-nums">{readiness}%</span>
          <span className="text-[11px] text-slate-400">readiness</span>
        </div>
        <span className="text-[11px] text-slate-400 tabular-nums">
          {completedTasks}/{totalTasks} tasks
        </span>
      </div>

      {/* Visual Progress Bar */}
      <div className="w-full bg-[#0d121c] rounded h-1.5 overflow-hidden border border-[#1e2638]">
        <div
          className={`h-full transition-all duration-300 ${getProgressBarColor()}`}
          style={{ width: `${Math.max(readiness, 2)}%` }}
        />
      </div>

      {/* Quick Task Status dots */}
      {tasks.length > 0 && (
        <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-[#1e2638]">
          {tasks.map((task, idx) => {
            let dotColor = 'bg-slate-700';
            let dotTitle = `${task.title} (${task.status})`;
            if (task.is_blocker || (task.status && task.status.toLowerCase() === 'blocked')) {
              dotColor = 'bg-rose-500';
            } else if (task.status && task.status.toLowerCase() === 'complete') {
              dotColor = 'bg-emerald-400';
            } else if (task.status && task.status.toLowerCase() === 'in progress') {
              dotColor = 'bg-amber-400';
            }

            return (
              <div
                key={task.id || idx}
                title={dotTitle}
                className={`w-1.5 h-1.5 rounded-sm ${dotColor}`}
              />
            );
          })}
          <span className="text-[10px] font-mono text-slate-400 ml-auto tabular-nums">
            {totalTasks} items
          </span>
        </div>
      )}
    </div>
  );
}
