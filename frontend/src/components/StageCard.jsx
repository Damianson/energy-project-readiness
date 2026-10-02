import React from 'react';
import { AlertCircle, CheckCircle2, Clock, Check } from 'lucide-react';

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
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
          <AlertCircle className="w-3 h-3" />
          Blocked
        </span>
      );
    }
    if (readiness === 100) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="w-3 h-3" />
          Complete
        </span>
      );
    }
    if (readiness > 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
          <Clock className="w-3 h-3" />
          In Progress
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
        Not Started
      </span>
    );
  };

  // Progress bar color
  const getProgressBarColor = () => {
    if (isBlocked) return 'bg-gradient-to-r from-rose-500 to-amber-500';
    if (readiness === 100) return 'bg-gradient-to-r from-emerald-500 to-teal-400';
    if (readiness > 0) return 'bg-gradient-to-r from-cyan-500 to-emerald-500';
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
      className={`rounded-xl p-5 border transition-all duration-200 cursor-pointer text-left select-none ${
        isSelected
          ? 'bg-slate-800/90 border-emerald-500/80 ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-950/30'
          : isBlocked
          ? 'bg-slate-800/50 border-rose-600/40 hover:border-rose-500 hover:bg-slate-800/80 shadow-sm shadow-rose-950/40'
          : 'bg-slate-800/50 border-slate-700/60 hover:border-slate-500 hover:bg-slate-800/80 shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold text-slate-400">
            0{stage.order_index}
          </span>
          <h3 className="font-bold text-white text-base tracking-tight">
            {stage.name}
          </h3>
        </div>
        {getStatusBadge()}
      </div>

      {/* Progress percentage & Task ratio */}
      <div className="flex items-baseline justify-between mb-2 mt-4">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-white">{readiness}%</span>
          <span className="text-xs text-slate-400">readiness</span>
        </div>
        <span className="text-xs font-medium text-slate-400">
          {completedTasks} of {totalTasks} tasks
        </span>
      </div>

      {/* Visual Progress Bar */}
      <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-700/50">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor()}`}
          style={{ width: `${Math.max(readiness, 2)}%` }}
        />
      </div>

      {/* Quick Task Status dots */}
      {tasks.length > 0 && (
        <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-slate-700/40">
          {tasks.map((task, idx) => {
            let dotColor = 'bg-slate-700';
            let dotTitle = `${task.title} (${task.status})`;
            if (task.is_blocker || (task.status && task.status.toLowerCase() === 'blocked')) {
              dotColor = 'bg-rose-500 ring-2 ring-rose-500/30';
            } else if (task.status && task.status.toLowerCase() === 'complete') {
              dotColor = 'bg-emerald-400';
            } else if (task.status && task.status.toLowerCase() === 'in progress') {
              dotColor = 'bg-cyan-400';
            }

            return (
              <div
                key={task.id || idx}
                title={dotTitle}
                className={`w-2 h-2 rounded-full cursor-help transition-transform hover:scale-125 ${dotColor}`}
              />
            );
          })}
          <span className="text-[11px] text-slate-400 ml-auto">
            {totalTasks} items
          </span>
        </div>
      )}
    </div>
  );
}
