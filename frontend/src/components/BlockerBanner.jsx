import React from 'react';
import { AlertOctagon, CheckCircle2, User, ArrowUpRight, ShieldCheck } from 'lucide-react';

export default function BlockerBanner({ blockers = [], stages = [], onSelectStage }) {
  const hasBlockers = blockers && blockers.length > 0;

  // Helper to resolve stage and stage id
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
      className={`rounded-lg p-4 border transition-colors ${
        hasBlockers
          ? 'bg-[#121722] border-rose-900/60'
          : 'bg-[#121722] border-[#1f283d]'
      }`}
    >
      {/* Blocker Register Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-[#1f283d]">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-7 h-7 rounded flex items-center justify-center shrink-0 border ${
              hasBlockers
                ? 'bg-[#1f161a] border-rose-800/80 text-rose-400'
                : 'bg-[#121f1d] border-emerald-800/80 text-emerald-400'
            }`}
          >
            {hasBlockers ? (
              <AlertOctagon className="w-4 h-4 text-rose-400" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-tight uppercase font-mono">
                Critical Path Blockers
              </h2>
              <span className="text-xs text-slate-400 hidden sm:inline">•</span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                What is currently blocking this project?
              </span>
            </div>
          </div>
        </div>

        {hasBlockers ? (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider bg-rose-950/70 text-rose-300 border border-rose-800/80 self-start sm:self-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            {blockers.length} Critical {blockers.length > 1 ? 'Blockers' : 'Blocker'} Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider bg-emerald-950/50 text-emerald-400 border border-emerald-900/60 self-start sm:self-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Path Clear
          </span>
        )}
      </div>

      {/* Operational Blocker Register Grid */}
      {hasBlockers ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {blockers.map((blocker, index) => {
            const stageInfo = getStageInfo(blocker);
            return (
              <div
                key={blocker.id || index}
                className="bg-[#141b27] border border-[#242f44] hover:border-slate-600 rounded-md p-3.5 flex flex-col justify-between transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-[#1a2336] text-slate-200 border border-[#2c3b58]">
                      {stageInfo.order ? `STAGE 0${stageInfo.order}: ` : 'STAGE: '}
                      {stageInfo.name.toUpperCase()}
                    </span>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-950/90 text-rose-300 border border-rose-800">
                      Blocked
                    </span>
                  </div>

                  <h3 className="font-semibold text-slate-100 text-sm leading-snug">
                    {blocker.title}
                  </h3>

                  {blocker.notes && (
                    <div className="text-xs text-slate-300 bg-[#0d121c] border border-[#1b2334] rounded p-2 font-mono leading-relaxed">
                      <span className="text-slate-400 font-bold">Schedule Impact: </span>
                      {blocker.notes}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-2.5 border-t border-[#1e273a]">
                  <div className="flex items-center gap-1.5 font-mono">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Owner: {blocker.owner || 'Unassigned'}</span>
                  </div>

                  {stageInfo.id && onSelectStage && (
                    <button
                      type="button"
                      onClick={() => onSelectStage(stageInfo.id)}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer"
                    >
                      <span>Inspect Stage</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#10171d] border border-emerald-900/40 rounded p-3 flex items-center gap-2.5 text-xs font-mono text-emerald-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            CRITICAL PATH CLEAR — 0 active stage blockers. All development phases are within nominal progress parameters.
          </span>
        </div>
      )}
    </div>
  );
}
