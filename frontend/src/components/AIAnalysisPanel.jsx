import React, { useState } from 'react';
import {
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
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const PRIORITY_BADGES = {
  Immediate: 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold',
  High: 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold',
  Medium: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-medium',
  Low: 'bg-slate-700/60 text-slate-300 border-slate-600 font-normal',
};

export default function AIAnalysisPanel({
  analysisData,
  loading = false,
  error = null,
  onAnalyze,
  projectName = '',
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  const analysis = analysisData?.analysis || analysisData || {};
  const provider = analysisData?.provider || 'Gemini 3.8 Flash';
  const createdAt = analysisData?.created_at;

  const hasAnalysis = Boolean(analysis && analysis.summary);
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
    <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-6 backdrop-blur shadow-sm transition-all duration-300">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500/20 via-teal-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-500/20 shrink-0">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Gemini AI Risk Analysis Panel
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
                <Cpu className="w-3.5 h-3.5" />
                {provider.includes('Gemini') ? 'Gemini 3.8 Flash' : provider}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {hasAnalysis
                ? `Synthesized project risks, dependencies & mitigations • ${formatTimestamp(createdAt) || 'Latest'}`
                : 'Run an AI assessment on 6 project development stages and critical blockers'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={onAnalyze}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 hover:from-emerald-500 hover:via-teal-400 hover:to-cyan-400 shadow-md shadow-emerald-500/25 border border-emerald-400/30 transition-all duration-200 disabled:opacity-50 cursor-pointer active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing project...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>{hasAnalysis ? 'Re-run AI Analysis' : 'Analyze Project Risks'}</span>
              </>
            )}
          </button>

          {hasAnalysis && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              aria-label={isExpanded ? 'Collapse panel' : 'Expand panel'}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Loading View */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
          <h3 className="text-sm font-bold text-white">Analyzing project with Gemini...</h3>
          <p className="text-xs text-slate-400 max-w-sm">
            Examining 6 development stages, active blockers, schedule lead-times, and regulatory dependencies...
          </p>
        </div>
      )}

      {/* Error View */}
      {!loading && error && (
        <div className="mt-4 bg-rose-950/60 border border-rose-500/50 rounded-xl p-4 flex items-center justify-between text-rose-300 text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={onAnalyze}
            className="px-3 py-1 rounded-lg bg-rose-900/60 hover:bg-rose-800 text-white font-semibold transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State (when no analysis has been run yet) */}
      {!loading && !error && !hasAnalysis && (
        <div className="text-center py-10 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mx-auto">
            <Sparkles className="w-6 h-6 text-emerald-400" />
          </div>
          <h3 className="text-sm font-bold text-white">
            No Risk Analysis Generated Yet
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Click "Analyze Project Risks" above to generate a comprehensive assessment of current blockers, major risks, and recommended actions using Gemini.
          </p>
        </div>
      )}

      {/* Expanded Content View */}
      {!loading && !error && hasAnalysis && isExpanded && (
        <div className="space-y-6 mt-6">
          {/* 1. Executive Summary */}
          <div className="bg-gradient-to-r from-emerald-950/30 via-teal-950/20 to-slate-900/60 border border-emerald-500/30 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Executive Summary
              </h3>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-normal">
              {summary}
            </p>

            {/* Quick KPI Counters */}
            <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-emerald-500/20 text-center">
              <div className="bg-slate-900/70 rounded-xl p-2.5 border border-slate-800">
                <div className="text-lg font-black text-rose-400">
                  {currentBlockers.length}
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Active Blockers
                </div>
              </div>
              <div className="bg-slate-900/70 rounded-xl p-2.5 border border-slate-800">
                <div className="text-lg font-black text-amber-400">
                  {majorRisks.length}
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Identified Risks
                </div>
              </div>
              <div className="bg-slate-900/70 rounded-xl p-2.5 border border-slate-800">
                <div className="text-lg font-black text-cyan-400">
                  {recommendedActions.length}
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
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
                      <span>
                        Owner:{' '}
                        <strong className="text-slate-300 font-medium">
                          {b.owner || 'Unassigned'}
                        </strong>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. Major Risks & Mitigations */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                Major Risks & Prioritized Exposures ({majorRisks.length})
              </h3>
              <span className="text-[11px] text-slate-400">Risk Assessment</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {majorRisks.map((r, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                        {r.stage}
                      </span>
                      <div>{formatPriorityBadge(r.priority)}</div>
                    </div>

                    <h4 className="text-sm font-bold text-white mb-2 leading-snug">
                      {r.risk}
                    </h4>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
        </div>
      )}
    </div>
  );
}
