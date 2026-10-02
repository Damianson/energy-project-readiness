import React, { useEffect } from 'react';
import {
  X,
  Sparkles,
  AlertOctagon,
  ShieldAlert,
  ArrowRight,
  Clock,
  User,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Loader2,
  Cpu,
} from 'lucide-react';

const PRIORITY_BADGES = {
  Immediate: 'bg-rose-950 text-rose-300 border-rose-800 font-bold',
  High: 'bg-amber-950 text-amber-300 border-amber-800 font-semibold',
  Medium: 'bg-[#182333] text-slate-300 border-[#2a3854] font-medium',
  Low: 'bg-[#131924] text-slate-400 border-slate-700 font-normal',
};

export default function AIAnalysisModal({
  isOpen,
  onClose,
  analysisData,
  loading = false,
  error = null,
  onReanalyze,
  projectName = '',
}) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  // Extract payload whether passed as { analysis: { ... }, provider, ... } or directly { summary, ... }
  const analysis = analysisData?.analysis || analysisData || {};
  const provider = analysisData?.provider || 'Gemini 3.8 Flash';
  const createdAt = analysisData?.created_at;

  const summary = analysis.summary || '';
  const currentBlockers = analysis.current_blockers || [];
  const majorRisks = analysis.major_risks || [];
  const recommendedActions = analysis.recommended_next_actions || [];

  const formatPriorityBadge = (priority) => {
    const key = priority || 'Medium';
    const classes = PRIORITY_BADGES[key] || PRIORITY_BADGES['Medium'];
    return (
      <span
        className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border ${classes}`}
      >
        {key}
      </span>
    );
  };

  const formatTimestamp = (ts) => {
    if (!ts) return null;
    try {
      const d = new Date(ts);
      return d.toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return ts;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-analysis-title"
    >
      <div className="bg-[#121722] border border-[#232f46] rounded-md w-full max-w-4xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-[#1f283d] bg-[#10141e] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#161f30] border border-[#26344d] flex items-center justify-center text-emerald-400">
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2
                  id="ai-analysis-title"
                  className="text-sm font-bold text-white tracking-tight uppercase font-mono"
                >
                  Project Intelligence Assessment
                </h2>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase bg-[#161d2a] text-slate-400 border border-[#242f46]">
                  <Cpu className="w-3 h-3 text-slate-500" />
                  {provider.includes('Gemini') ? 'Model: Gemini 3.8 Flash' : provider}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {projectName ? `${projectName} • ` : ''}
                {createdAt ? `Evaluated ${formatTimestamp(createdAt)}` : 'Live Assessment'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onReanalyze && !loading && (
              <button
                type="button"
                onClick={onReanalyze}
                title="Re-run assessment with current project data"
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-mono text-emerald-400 bg-[#162132] hover:bg-[#1d2a3f] border border-emerald-800/80 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Re-evaluate</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-[#1a2233] transition-colors disabled:opacity-50 cursor-pointer"
              aria-label="Close analysis dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Loading View */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
              <div className="space-y-1">
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Evaluating Project Constraints...
                </h3>
                <p className="text-xs font-mono text-slate-400 max-w-sm">
                  Synthesizing development stages, critical path blockers, procurement lead-times, and regulatory dependencies...
                </p>
              </div>
            </div>
          )}

          {/* Error View */}
          {!loading && error && (
            <div className="bg-rose-950/80 border border-rose-800 rounded p-4 text-center space-y-2.5">
              <AlertTriangle className="w-6 h-6 text-rose-400 mx-auto" />
              <h3 className="text-xs font-mono font-bold text-rose-200 uppercase">
                Assessment Failed
              </h3>
              <p className="text-xs text-rose-300 max-w-md mx-auto font-mono">
                {error}
              </p>
              {onReanalyze && (
                <button
                  type="button"
                  onClick={onReanalyze}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded text-xs font-mono font-bold text-white bg-rose-800 hover:bg-rose-700 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  Retry Evaluation
                </button>
              )}
            </div>
          )}

          {/* Analysis Content View */}
          {!loading && !error && (
            <>
              {/* 1. Executive Summary */}
              <div className="bg-[#141b27] border border-[#242f46] rounded-md p-4">
                <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-[#1e273a]">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Executive Assessment
                  </h3>
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="text-rose-400 tabular-nums">
                      {currentBlockers.length} Blockers
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-amber-400 tabular-nums">
                      {majorRisks.length} Risks
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-300 tabular-nums">
                      {recommendedActions.length} Next Actions
                    </span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                  {summary || 'No summary provided for this project.'}
                </p>
              </div>

              {/* 2. Current Blockers */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                    <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                    Active Critical Path Blockers ({currentBlockers.length})
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">Critical Impediments</span>
                </div>

                {currentBlockers.length === 0 ? (
                  <div className="bg-[#10171d] border border-emerald-900/40 rounded p-3 text-xs font-mono text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>No active critical blockers identified in the project context.</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {currentBlockers.map((b, idx) => (
                      <div
                        key={idx}
                        className="bg-[#141b27] border border-rose-900/60 rounded-md p-3 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#1a2336] text-slate-200 border border-[#2c3b58]">
                              STAGE: {b.stage?.toUpperCase()}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider">
                              Blocker
                            </span>
                          </div>

                          <h4 className="text-xs sm:text-sm font-semibold text-white mb-1.5 leading-snug">
                            {b.issue}
                          </h4>

                          <div className="text-xs text-slate-300 bg-[#0d121c] p-2 rounded border border-[#1b2334] font-mono leading-relaxed">
                            <span className="text-slate-400 font-bold">Impact: </span>
                            {b.impact}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2.5 pt-2 border-t border-[#1e273a] font-mono">
                          <User className="w-3.5 h-3.5 text-slate-500" />
                          <span>Owner: <strong className="text-slate-300 font-medium">{b.owner || 'Unassigned'}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Major Risks & Mitigations */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    Major Risks & Prioritized Exposures ({majorRisks.length})
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">Risk Matrix</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {majorRisks.map((r, idx) => (
                    <div
                      key={idx}
                      className="bg-[#141b27] border border-[#222d42] rounded-md p-3 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-300 bg-[#192233] border border-[#2a3854]">
                            {r.stage?.toUpperCase()}
                          </span>
                          <div>{formatPriorityBadge(r.priority)}</div>
                        </div>

                        <h4 className="text-xs sm:text-sm font-semibold text-white mb-2 leading-snug">
                          {r.risk}
                        </h4>
                      </div>

                      <div className="bg-[#0d121c] rounded p-2 border border-[#1b2334] text-xs text-slate-300 font-mono mt-1">
                        <span className="text-emerald-400 font-bold block text-[10px] uppercase tracking-wider mb-0.5">
                          Mitigation:
                        </span>
                        <p className="leading-relaxed font-sans">{r.mitigation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Recommended Next Actions */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                    Recommended Next Actions ({recommendedActions.length})
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">Prioritized Next Steps</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {recommendedActions.map((a, idx) => (
                    <div
                      key={idx}
                      className="bg-[#141b27] border border-[#222d42] rounded p-2.5 flex items-start justify-between gap-2.5"
                    >
                      <div className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded bg-[#192233] border border-[#283650] text-slate-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase mb-0.5">
                            {a.stage}
                          </div>
                          <p className="text-xs text-slate-200 leading-snug">
                            {a.action}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0">{formatPriorityBadge(a.priority)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-[#1e273a] bg-[#0e131d] flex items-center justify-between">
          <div className="text-[11px] font-mono text-slate-500 hidden sm:block">
            Deterministic risk assessment synthesized from live stage deliverables and project notes.
          </div>
          <div className="flex items-center gap-2.5 ml-auto">
            {onReanalyze && !loading && (
              <button
                type="button"
                onClick={onReanalyze}
                className="sm:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium text-slate-300 bg-[#161f2e] hover:bg-[#1e2b40] border border-[#2a3854] cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-run</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-1.5 rounded text-xs font-mono font-medium text-slate-200 hover:text-white bg-[#161f2e] hover:bg-[#1e2b40] border border-[#2a3854] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
