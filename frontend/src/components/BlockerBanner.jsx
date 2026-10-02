import React from 'react';
import { AlertTriangle, ShieldCheck, User, Tag, ArrowRight } from 'lucide-react';

export default function BlockerBanner({ blockers = [], stages = [] }) {
  const hasBlockers = blockers && blockers.length > 0;

  // Helper to resolve stage name if only stage_id is present
  const getStageName = (blocker) => {
    if (blocker.stage) return blocker.stage;
    const stageObj = stages.find((s) => s.id === blocker.stage_id);
    return stageObj ? stageObj.name : 'Development';
  };

  return (
    <div
      className={`rounded-2xl p-6 border transition-all duration-300 shadow-md ${
        hasBlockers
          ? 'bg-gradient-to-r from-rose-950/40 via-amber-950/30 to-slate-900/60 border-rose-600/40'
          : 'bg-emerald-950/20 border-emerald-500/30'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              hasBlockers
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}
          >
            {hasBlockers ? (
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              What is currently blocking this project?
            </h2>
            <p className="text-xs text-slate-400">
              {hasBlockers
                ? `${blockers.length} critical blocker${
                    blockers.length > 1 ? 's' : ''
                  } requiring immediate team resolution before milestone progression.`
                : 'All stages are clear of active blocker flags. Ready for phase progression.'}
            </p>
          </div>
        </div>

        {hasBlockers && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 self-start sm:self-auto">
            {blockers.length} Open Blocker{blockers.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Blockers List or Clear State */}
      {hasBlockers ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-2">
          {blockers.map((blocker, index) => {
            const stageName = getStageName(blocker);
            return (
              <div
                key={blocker.id || index}
                className="bg-slate-900/90 border border-slate-800 hover:border-rose-600/50 rounded-xl p-4 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/20">
                      <Tag className="w-3 h-3" />
                      Stage: {stageName}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-red-950/80 text-rose-400 border border-rose-800/80">
                      Blocked
                    </span>
                  </div>

                  <h3 className="font-semibold text-slate-100 text-sm leading-snug">
                    {blocker.title}
                  </h3>

                  {blocker.notes && (
                    <p className="text-xs text-slate-400 mt-1.5 italic bg-slate-950/50 p-2 rounded-lg border border-slate-800/60">
                      "{blocker.notes}"
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-2.5 border-t border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{blocker.owner || 'Unassigned'}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Critical Path</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-sm text-emerald-300">
            <strong>No active blockers found.</strong> All stage requirements and tasks are moving without reported impediments.
          </div>
        </div>
      )}
    </div>
  );
}
