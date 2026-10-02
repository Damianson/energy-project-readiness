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

  const getStatusBadge = () => {
    if (isBlocked) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30">
          <AlertOctagon className="w-3 h-3 text-rose-400" />
          Blocked
        </span>
      );
    }
    if (readiness === 100) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          Complete
        </span>
      );
    }
    if (readiness > 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
          <Clock className="w-3 h-3 text-amber-400" />
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium text-slate-400 bg-slate-800/80 border border-slate-700">
        Pending
      </span>
    );
  };

  const getProgressBarColor = () => {
    if (isBlocked) return 'bg-rose-500';
    if (readiness === 100) return 'bg-emerald-500';
    if (readiness > 0) return 'bg-gradient-to-r from-amber-500 to-emerald-400';
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
      className={`rounded-xl p-4 border transition-all cursor-pointer text-left select-none relative shadow-sm flex flex-col justify-between ${
        isSelected
          ? 'bg-[#162236] border-emerald-500 ring-2 ring-emerald-500/20 shadow-emerald-500/10'
          : isBlocked
          ? 'bg-[#131d2e] border-[#1e2b45] hover:border-rose-500/50 hover:bg-[#162032]'
          : 'bg-[#131d2e] border-[#1e2b45] hover:border-slate-500 hover:bg-[#162032]'
      }`}
    >
      <div>
        {/* Top: Phase Index and Status Badge */}
        <div className="flex items-center justify-between gap-1 mb-2">
          <span className="text-xs font-semibold text-slate-400">
            Stage 0{stage.order_index}
          </span>
          {getStatusBadge()}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-white text-sm leading-snug line-clamp-2 min-h-[2.5rem]">
          {stage.name}
        </h3>
      </div>

      {/* Progress & Task Ratio */}
      <div className="mt-3 pt-2.5 border-t border-[#1e2b45]">
        <div className="flex items-baseline justify-between mb-1.5 text-xs">
          <span className="font-bold text-white text-sm tabular-nums">{readiness}%</span>
          <span className="text-slate-400 text-[11px] tabular-nums">
            {completedTasks}/{totalTasks} tasks
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[#0e1624] rounded-full h-1.5 overflow-hidden border border-[#1e2b45]">
          <div
            className={`h-full transition-all duration-300 rounded-full ${getProgressBarColor()}`}
            style={{ width: `${Math.max(readiness, 4)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

