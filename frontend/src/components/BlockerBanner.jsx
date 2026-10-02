import React from 'react';
import { AlertOctagon, CheckCircle2, User, ArrowRight } from 'lucide-react';

export default function BlockerBanner({ blockers = [], stages = [], onSelectStage }) {
  const hasBlockers = blockers && blockers.length > 0;

  const getStageInfo = (blocker) => {
    if (blocker.stage_id) {
      const stageObj = stages.find((s) => s.id === blocker.stage_id);
      return {
        id: blocker.stage_id,
        name: stageObj ? stageObj.name : blocker.stage || 'Development',
        order: stageObj ? stageObj.order_index : null,
      };
    }
    const stageObj = stages.find(
      (s) => s.name && blocker.stage && s.name.toLowerCase() === blocker.stage.toLowerCase()
    );
    return {
      id: stageObj ? stageObj.id : null,
      name: blocker.stage || 'Development',
      order: stageObj ? stageObj.order_index : null,
    };
  };

  return (
    <div
      className={`rounded-xl p-5 border transition-all shadow-sm ${
        hasBlockers
          ? 'bg-[#131d2e] border-rose-500/30'
          : 'bg-[#131d2e] border-emerald-500/30'
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[#1e2b45]">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
              hasBlockers
                ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            }`}
          >
            {hasBlockers ? (
              <AlertOctagon className="w-5 h-5 text-rose-400" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                What is currently blocking this project?
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {hasBlockers
                ? `${blockers.length} critical path deliverable${blockers.length > 1 ? 's are' : ' is'} halting development gates.`
                : 'All stage gates are clear with no active critical path blockers.'}
            </p>
          </div>
        </div>

        {hasBlockers ? (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 self-start sm:self-auto">
            {blockers.length} Critical {blockers.length > 1 ? 'Blockers' : 'Blocker'}
          </span>
        ) : (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 self-start sm:self-auto">
            Path Clear
          </span>
        )}
      </div>

      {/* Blocker Cards */}
      {hasBlockers ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {blockers.map((blocker, index) => {
            const stageInfo = getStageInfo(blocker);
            return (
              <div
                key={blocker.id || index}
                className="bg-[#0e1624] border border-[#1e2b45] hover:border-rose-500/40 rounded-lg p-4 flex flex-col justify-between transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#182438] text-slate-200 border border-[#2a3b5c]">
                      {stageInfo.name}
                    </span>
                    <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wide">
                      Blocker
                    </span>
                  </div>

                  <h3 className="font-semibold text-white text-sm leading-snug">
                    {blocker.title}
                  </h3>

                  {blocker.notes && (
                    <div className="text-xs text-slate-300 bg-[#131d2e] border border-[#1e2b45] rounded-md p-2.5 leading-relaxed">
                      <span className="text-slate-400 font-semibold block text-[11px] mb-0.5">
                        Schedule & Operational Impact:
                      </span>
                      {blocker.notes}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-3 border-t border-[#1e2b45]">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>Owner: <strong className="text-slate-200 font-medium">{blocker.owner || 'Unassigned'}</strong></span>
                  </div>

                  {stageInfo.id && onSelectStage && (
                    <button
                      type="button"
                      onClick={() => onSelectStage(stageInfo.id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer"
                    >
                      <span>Inspect Stage</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#0e1624] border border-emerald-500/20 rounded-lg p-4 flex items-center gap-3 text-xs text-emerald-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>
            Critical path is clear. All deliverables are advancing through the stage gates without critical impediments.
          </span>
        </div>
      )}
    </div>
  );
}

