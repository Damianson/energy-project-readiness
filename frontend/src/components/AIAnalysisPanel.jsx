import React, { useState } from 'react';
import {
  Sparkles,
  AlertOctagon,
  ShieldAlert,
  ArrowRight,
  User,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Cpu,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const PRIORITY_BADGES = {
  Immediate: 'bg-rose-500/10 text-rose-400 border-rose-500/30 font-semibold',
  High: 'bg-amber-500/10 text-amber-400 border-amber-500/30 font-medium',
  Medium: 'bg-sky-500/10 text-sky-400 border-sky-500/30 font-medium',
  Low: 'bg-slate-800 text-slate-400 border-slate-700 font-normal',
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
    <div className="bg-[#0e1624] border border-[#1e2b45] rounded-xl p-5 sm:p-6 transition-colors shadow-sm">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1e2b45]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-base font-semibold text-white tracking-tight">
                Project Risk Intelligence
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-[#131d2e] text-slate-400 border border-[#1e2b45]">
                <Cpu className="w-3 h-3 text-slate-500" />
                {provider.includes('Gemini') ? 'Gemini 3.8 Flash' : provider}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {hasAnalysis
                ? `Operational risk & critical path assessment • Evaluated ${formatTimestamp(createdAt) || 'Latest'}`
                : 'Automated synthesis across all 6 project development stages and active deliverables'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={onAnalyze}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors disabled:opacity-50 cursor-pointer shadow-sm shadow-emerald-950"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Evaluating Project...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                <span>{hasAnalysis ? 'Re-evaluate Intelligence' : 'Run Intelligence Assessment'}</span>
              </>
            )}
          </button>

          {hasAnalysis && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg border border-[#1e2b45] bg-[#131d2e] hover:bg-[#1a263d] text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
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
        <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
          <Loader2 className="w-7 h-7 animate-spin text-emerald-400" />
          <h3 className="text-sm font-semibold text-white">
            Synthesizing Project Constraints...
          </h3>
          <p className="text-xs text-slate-400 max-w-sm">
            Evaluating 6 development stages, active blockers, procurement lead-times, and interconnection dependencies.
          </p>
        </div>
      )}

      {/* Error View */}
      {!loading && error && (
        <div className="mt-4 bg-rose-950/40 border border-rose-800/80 rounded-lg p-3.5 flex items-center justify-between text-rose-300 text-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={onAnalyze}
            className="px-3 py-1 rounded bg-rose-800 hover:bg-rose-700 text-white font-medium transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && !hasAnalysis && (
        <div className="text-center py-8 space-y-2.5">
          <div className="w-10 h-10 rounded-lg bg-[#131d2e] border border-[#1e2b45] flex items-center justify-center text-emerald-400 mx-auto">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-white">
            No Intelligence Assessment Generated Yet
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Click "Run Intelligence Assessment" to synthesize active blockers, technical risks, and recommended actions using the operational risk model.
          </p>
        </div>
      )}

      {/* Expanded Content View */}
      {!loading && !error && hasAnalysis && isExpanded && (
        <div className="space-y-5 mt-5">
          {/* 1. Executive Assessment */}
          <div className="bg-[#101929] border border-[#1e2b45] rounded-lg p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3 mb-2.5 pb-2.5 border-b border-[#1e2b45]">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Executive Assessment
              </h3>
              <div className="flex items-center gap-2.5 text-xs">
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
              {summary}
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
              <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-lg p-3 text-xs text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>No active critical blockers identified in the project context.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentBlockers.map((b, idx) => (
                  <div
                    key={idx}
                    className="bg-[#101929] border border-rose-900/40 rounded-lg p-4 flex flex-col justify-between"
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

                      <div className="text-xs text-slate-300 bg-[#0a101b] p-3 rounded-md border border-[#172236] leading-relaxed">
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
                  className="bg-[#101929] border border-[#1e2b45] rounded-lg p-4 flex flex-col justify-between"
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

                  <div className="bg-[#0a101b] rounded-md p-3 border border-[#172236] text-xs text-slate-300 mt-1">
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
                  className="bg-[#101929] border border-[#1e2b45] rounded-lg p-3.5 flex items-start justify-between gap-3"
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
        </div>
      )}
    </div>
  );
}

