import React, { useEffect } from 'react';
import {
  X,
  Sparkles,
  AlertOctagon,
  ShieldAlert,
  ArrowRightCircle,
  Clock,
  User,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Loader2,
  Cpu,
} from 'lucide-react';

const PRIORITY_BADGES = {
  Immediate: 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold',
  High: 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold',
  Medium: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-medium',
  Low: 'bg-slate-700/60 text-slate-300 border-slate-600 font-normal',
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
  const provider = analysisData?.provider || 'AI Engine';
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
        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] uppercase tracking-wider border ${classes}`}
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-analysis-title"
    >
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-800/50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500/20 via-teal-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-500/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2
                  id="ai-analysis-title"
                  className="text-lg font-bold text-white tracking-tight"
                >
                  AI Risk & Readiness Analysis
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
                  <Cpu className="w-3 h-3" />
                  {provider.includes('Gemini') ? 'Gemini 3.8 Flash' : provider}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {projectName ? `${projectName} • ` : ''}
                {createdAt ? `Generated ${formatTimestamp(createdAt)}` : 'Live Project Assessment'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onReanalyze && !loading && (
              <button
                type="button"
                onClick={onReanalyze}
                title="Re-run AI analysis with current project data"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-run Analysis</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
              aria-label="Close analysis dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Loading View */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
                  <Sparkles className="w-8 h-8 animate-spin" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">
                  Analyzing project...
                </h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  Synthesizing development stages, critical path blockers, procurement leads, and regulatory milestones...
                </p>
              </div>
            </div>
          )}

          {/* Error View */}
          {!loading && error && (
            <div className="bg-rose-950/60 border border-rose-500/50 rounded-2xl p-6 text-center space-y-3">
              <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto" />
              <h3 className="text-base font-bold text-rose-200">
                Failed to Generate Analysis
              </h3>
              <p className="text-xs text-rose-300/80 max-w-md mx-auto">
                {error}
              </p>
              {onReanalyze && (
                <button
                  type="button"
                  onClick={onReanalyze}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Try Again
                </button>
              )}
            </div>
          )}

          {/* Analysis Content View */}
          {!loading && !error && (
            <>
              {/* 1. Executive Summary */}
              <div className="bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900 border border-emerald-500/30 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Executive Summary
                  </h3>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-normal">
                  {summary || 'No summary provided for this project.'}
                </p>

                {/* Quick Indicators */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-emerald-500/20 text-center">
                  <div className="bg-slate-900/60 rounded-xl p-2 border border-slate-800">
                    <div className="text-base font-black text-rose-400">
                      {currentBlockers.length}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                      Active Blockers
                    </div>
                  </div>
                  <div className="bg-slate-900/60 rounded-xl p-2 border border-slate-800">
                    <div className="text-base font-black text-amber-400">
                      {majorRisks.length}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                      Identified Risks
                    </div>
                  </div>
                  <div className="bg-slate-900/60 rounded-xl p-2 border border-slate-800">
                    <div className="text-base font-black text-cyan-400">
                      {recommendedActions.length}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                      Next Actions
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Current Blockers */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
                    <AlertOctagon className="w-4 h-4 text-rose-400" />
                    Current Blockers ({currentBlockers.length})
                  </h3>
                  <span className="text-[11px] text-slate-400">Critical Path Obstacles</span>
                </div>

                {currentBlockers.length === 0 ? (
                  <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-4 text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>No active blockers identified by AI analysis.</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentBlockers.map((b, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-900/90 border border-rose-500/30 rounded-xl p-4 flex flex-col justify-between shadow-sm"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                              Stage: {b.stage}
                            </span>
                            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                              Blocker
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-white mb-1.5 leading-snug">
                            {b.issue}
                          </h4>

                          <p className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 leading-relaxed">
                            <strong className="text-slate-400 block text-[10px] uppercase tracking-wider mb-0.5">
                              Impact:
                            </strong>
                            {b.impact}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-3 pt-2.5 border-t border-slate-800">
                          <User className="w-3.5 h-3.5 text-slate-500" />
                          <span>Owner: <strong className="text-slate-300 font-medium">{b.owner || 'Unassigned'}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Major Risks */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    Major Risks & Vulnerabilities ({majorRisks.length})
                  </h3>
                  <span className="text-[11px] text-slate-400">Prioritized Exposure</span>
                </div>

                <div className="space-y-2.5">
                  {majorRisks.map((r, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                            {r.stage}
                          </span>
                          <h4 className="text-sm font-bold text-white">
                            {r.risk}
                          </h4>
                        </div>
                        <div>{formatPriorityBadge(r.priority)}</div>
                      </div>

                      <div className="bg-slate-950/60 rounded-lg p-2.5 border border-slate-800/60 text-xs text-slate-300 mt-2">
                        <span className="text-emerald-400 font-semibold block text-[11px] mb-0.5">
                          Recommended Mitigation:
                        </span>
                        <p className="leading-relaxed">{r.mitigation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Recommended Next Actions */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                    <ArrowRightCircle className="w-4 h-4 text-cyan-400" />
                    Recommended Next Actions ({recommendedActions.length})
                  </h3>
                  <span className="text-[11px] text-slate-400">Immediate Roadmap</span>
                </div>

                <div className="space-y-2">
                  {recommendedActions.map((a, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5 flex items-start justify-between gap-3"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[11px] font-semibold text-slate-400">
                              {a.stage}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-200 leading-snug">
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
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-800/40 flex items-center justify-between">
          <div className="text-xs text-slate-400 hidden sm:block">
            Deterministic analysis synthesized from current project stages & deliverables.
          </div>
          <div className="flex items-center gap-3 ml-auto">
            {onReanalyze && !loading && (
              <button
                type="button"
                onClick={onReanalyze}
                className="sm:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-run</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-1.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
