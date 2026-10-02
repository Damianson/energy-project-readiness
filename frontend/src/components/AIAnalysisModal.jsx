import React, { useEffect } from 'react';
import {
  X,
  Sparkles,
  AlertOctagon,
  ShieldAlert,
  ArrowRight,
  User,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Loader2,
  Cpu,
} from 'lucide-react';

const PRIORITY_BADGES = {
  Immediate: 'bg-rose-500/10 text-rose-400 border-rose-500/30 font-semibold',
  High: 'bg-amber-500/10 text-amber-400 border-amber-500/30 font-medium',
  Medium: 'bg-sky-500/10 text-sky-400 border-sky-500/30 font-medium',
  Low: 'bg-slate-800 text-slate-400 border-slate-700 font-normal',
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
        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] border ${classes}`}
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#050b14]/85 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-analysis-title"
    >
      <div className="bg-[#0e1624] border border-[#1e2b45] rounded-xl w-full max-w-4xl flex flex-col max-h-[92vh] overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#1e2b45] bg-[#101929] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2
                  id="ai-analysis-title"
                  className="text-base font-semibold text-white tracking-tight"
                >
                  Project Risk Intelligence Assessment
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-[#131d2e] text-slate-400 border border-[#1e2b45]">
                  <Cpu className="w-3 h-3 text-slate-500" />
                  {provider.includes('Gemini') ? 'Gemini 3.8 Flash' : provider}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {projectName ? `${projectName} • ` : ''}
                {createdAt ? `Evaluated ${formatTimestamp(createdAt)}` : 'Live Risk Assessment'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onReanalyze && !loading && (
              <button
                type="button"
                onClick={onReanalyze}
                title="Re-run assessment with current project data"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-400 bg-[#131d2e] hover:bg-[#1a263d] border border-emerald-700/60 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-evaluate</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-[#1a263d] transition-colors disabled:opacity-50 cursor-pointer"
              aria-label="Close analysis dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Loading View */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-white">
                  Evaluating Project Constraints...
                </h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  Synthesizing development stages, critical path blockers, procurement lead-times, and regulatory dependencies...
                </p>
              </div>
            </div>
          )}

          {/* Error View */}
          {!loading && error && (
            <div className="bg-rose-950/40 border border-rose-800/80 rounded-xl p-5 text-center space-y-3">
              <AlertTriangle className="w-6 h-6 text-rose-400 mx-auto" />
              <h3 className="text-sm font-semibold text-rose-200">
                Assessment Failed
              </h3>
              <p className="text-xs text-rose-300 max-w-md mx-auto">
                {error}
              </p>
              {onReanalyze && (
                <button
                  type="button"
                  onClick={onReanalyze}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-rose-800 hover:bg-rose-700 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Retry Evaluation
                </button>
              )}
            </div>
          )}

          {/* Analysis Content View */}
          {!loading && !error && (
            <>
              {/* 1. Executive Summary */}
              <div className="bg-[#101929] border border-[#1e2b45] rounded-xl p-5">
                <div className="flex items-center justify-between gap-3 mb-2.5 pb-2.5 border-b border-[#1e2b45]">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Executive Assessment
                  </h3>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-rose-400 font-medium tabular-nums">
                      {currentBlockers.length} Blockers
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-amber-400 font-medium tabular-nums">
                      {majorRisks.length} Risks
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-300 font-medium tabular-nums">
                      {recommendedActions.length} Actions
                    </span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                  {summary || 'No summary provided for this project.'}
                </p>
              </div>

              {/* 2. Current Blockers */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                    <AlertOctagon className="w-4 h-4 text-rose-400" />
                    Active Critical Path Blockers ({currentBlockers.length})
                  </h3>
                  <span className="text-xs text-slate-400">Critical Impediments</span>
                </div>

                {currentBlockers.length === 0 ? (
                  <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-xl p-3 text-xs text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>No active critical blockers identified in the project context.</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentBlockers.map((b, idx) => (
                      <div
                        key={idx}
                        className="bg-[#101929] border border-rose-900/40 rounded-xl p-4 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#162134] text-slate-200 border border-[#22334f]">
                              Stage: {b.stage}
                            </span>
                            <span className="text-[11px] font-semibold text-rose-400">
                              Critical Blocker
                            </span>
                          </div>

                          <h4 className="text-sm font-semibold text-white mb-2 leading-snug">
                            {b.issue}
                          </h4>

                          <div className="text-xs text-slate-300 bg-[#0a101b] p-3 rounded-lg border border-[#172236] leading-relaxed">
                            <span className="text-slate-400 font-semibold">Impact: </span>
                            {b.impact}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-3 pt-2.5 border-t border-[#1e2b45]">
                          <User className="w-3.5 h-3.5 text-slate-500" />
                          <span>Owner: <strong className="text-slate-200 font-medium">{b.owner || 'Unassigned'}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Major Risks & Mitigations */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    Major Risks & Prioritized Exposures ({majorRisks.length})
                  </h3>
                  <span className="text-xs text-slate-400">Risk Matrix</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {majorRisks.map((r, idx) => (
                    <div
                      key={idx}
                      className="bg-[#101929] border border-[#1e2b45] rounded-xl p-4 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium text-slate-300 bg-[#162134] border border-[#22334f]">
                            {r.stage}
                          </span>
                          <div>{formatPriorityBadge(r.priority)}</div>
                        </div>

                        <h4 className="text-sm font-semibold text-white mb-2 leading-snug">
                          {r.risk}
                        </h4>
                      </div>

                      <div className="bg-[#0a101b] rounded-lg p-3 border border-[#172236] text-xs text-slate-300 mt-1">
                        <span className="text-emerald-400 font-semibold block text-[11px] uppercase tracking-wider mb-1">
                          Recommended Mitigation
                        </span>
                        <p className="leading-relaxed">{r.mitigation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Recommended Next Actions */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <ArrowRight className="w-4 h-4 text-emerald-400" />
                    Recommended Next Actions ({recommendedActions.length})
                  </h3>
                  <span className="text-xs text-slate-400">Next Steps</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {recommendedActions.map((a, idx) => (
                    <div
                      key={idx}
                      className="bg-[#101929] border border-[#1e2b45] rounded-xl p-3.5 flex items-start justify-between gap-3"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-md bg-[#162134] border border-[#22334f] text-slate-300 text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="text-[11px] font-medium text-slate-400 mb-0.5">
                            {a.stage}
                          </div>
                          <p className="text-xs text-slate-200 leading-snug font-medium">
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
        <div className="px-6 py-3.5 border-t border-[#1e2b45] bg-[#0a101b] flex items-center justify-between">
          <div className="text-xs text-slate-500 hidden sm:block">
            Risk intelligence synthesized from live stage deliverables and operations notes.
          </div>
          <div className="flex items-center gap-2.5 ml-auto">
            {onReanalyze && !loading && (
              <button
                type="button"
                onClick={onReanalyze}
                className="sm:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-[#131d2e] hover:bg-[#1a263d] border border-[#1e2b45] cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-run</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-200 hover:text-white bg-[#131d2e] hover:bg-[#1a263d] border border-[#1e2b45] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

