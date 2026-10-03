import React, { useEffect } from 'react';
import {
  X,
  AlertTriangle,
  RefreshCw,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

const PRIORITY_BADGES = {
  Immediate: 'bg-red-50 text-red-700 border-red-200 font-semibold',
  High: 'bg-amber-50 text-amber-800 border-amber-200 font-medium',
  Medium: 'bg-gray-100 text-gray-700 border-gray-200 font-medium',
  Low: 'bg-gray-50 text-gray-500 border-gray-200 font-normal',
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
  const createdAt = analysisData?.created_at;

  const summary = analysis.summary || '';
  const currentBlockers = analysis.current_blockers || [];
  const majorRisks = analysis.major_risks || [];
  const recommendedActions = analysis.recommended_next_actions || [];

  const formatPriorityBadge = (priority) => {
    const key = priority || 'Medium';
    const classes = PRIORITY_BADGES[key] || PRIORITY_BADGES['Medium'];
    return (
      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] border ${classes}`}>
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-gray-900/40 backdrop-blur-[1px] animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-analysis-title"
    >
      <div className="bg-white border border-gray-300 rounded-md w-full max-w-4xl flex flex-col max-h-[92vh] overflow-hidden shadow-xl">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-gray-200 bg-gray-50 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2
                id="ai-analysis-title"
                className="text-sm font-semibold text-gray-900 tracking-tight"
              >
                Project Risk Assessment
              </h2>
              {createdAt && (
                <span className="text-[11px] text-gray-500">
                  • Evaluated {formatTimestamp(createdAt)}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {projectName ? `${projectName} • ` : ''}
              Operational risk and critical path assessment synthesized across all development stages.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onReanalyze && !loading && (
              <button
                type="button"
                onClick={onReanalyze}
                title="Re-run operational assessment"
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3 h-3 text-gray-500" />
                <span>Re-assess</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="text-gray-400 hover:text-gray-700 p-1 rounded hover:bg-gray-200/60 transition-colors disabled:opacity-50 cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Loading View */}
          {loading && (
            <div className="py-16 text-center space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-forest-800 mx-auto" />
              <h3 className="text-xs font-semibold text-gray-900">
                Synthesizing Project Constraints...
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Evaluating development stages, critical path blockers, procurement lead times, and regulatory dependencies...
              </p>
            </div>
          )}

          {/* Error View */}
          {!loading && error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded text-center space-y-2 text-xs text-red-700">
              <AlertTriangle className="w-5 h-5 text-red-600 mx-auto" />
              <h3 className="font-semibold text-red-900">
                Assessment Failed
              </h3>
              <p className="max-w-md mx-auto">
                {error}
              </p>
              {onReanalyze && (
                <button
                  type="button"
                  onClick={onReanalyze}
                  className="px-3 py-1 rounded text-xs font-medium text-white bg-red-700 hover:bg-red-800 transition-colors cursor-pointer"
                >
                  Retry Evaluation
                </button>
              )}
            </div>
          )}

          {/* Analysis Content View */}
          {!loading && !error && (
            <div className="space-y-5 divide-y divide-gray-200">
              {/* 1. Executive Summary */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Executive Assessment
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="text-red-700 font-semibold">{currentBlockers.length} Blockers</span>
                    <span>•</span>
                    <span className="text-amber-700 font-semibold">{majorRisks.length} Risks</span>
                    <span>•</span>
                    <span className="text-gray-800 font-medium">{recommendedActions.length} Next Actions</span>
                  </div>
                </div>
                <div className="p-3.5 bg-gray-50 rounded border border-gray-200 text-xs text-gray-800 leading-relaxed">
                  {summary || 'No summary provided for this project.'}
                </div>
              </div>

              {/* 2. Current Blockers */}
              <div className="pt-4 space-y-2.5">
                <h3 className="text-xs font-semibold text-red-800 uppercase tracking-wider">
                  Critical Path Blockers ({currentBlockers.length})
                </h3>

                {currentBlockers.length === 0 ? (
                  <div className="p-3 bg-forest-50/50 border border-forest-200 rounded text-xs text-forest-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-forest-700 shrink-0" />
                    <span>No active critical blockers identified in the project context.</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentBlockers.map((b, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 border border-red-200 bg-red-50/20 rounded flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-semibold text-gray-700 uppercase">
                              Stage: {b.stage}
                            </span>
                            <span className="text-[11px] font-semibold text-red-700">
                              Critical Blocker
                            </span>
                          </div>
                          <h4 className="text-xs font-semibold text-gray-900 mb-1 leading-snug">
                            {b.issue}
                          </h4>
                          <p className="text-xs text-gray-600 bg-white p-2 rounded border border-gray-200 leading-relaxed mt-1">
                            <strong className="text-gray-700">Impact: </strong>
                            {b.impact}
                          </p>
                        </div>
                        <div className="mt-2.5 pt-2 border-t border-red-100 text-[11px] text-gray-500">
                          Owner: <span className="font-medium text-gray-800">{b.owner || 'Unassigned'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Major Risks & Mitigations */}
              <div className="pt-4 space-y-2.5">
                <h3 className="text-xs font-semibold text-amber-900 uppercase tracking-wider">
                  Major Risks & Mitigations ({majorRisks.length})
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {majorRisks.map((r, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 border border-gray-200 bg-white rounded flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-semibold text-gray-600 uppercase text-[11px]">
                            {r.stage}
                          </span>
                          <div>{formatPriorityBadge(r.priority)}</div>
                        </div>
                        <h4 className="text-xs font-semibold text-gray-900 mb-1 leading-snug">
                          {r.risk}
                        </h4>
                      </div>
                      <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200 text-xs text-gray-700 leading-relaxed">
                        <span className="text-[11px] font-semibold text-forest-800 uppercase tracking-wider block mb-0.5">
                          Mitigation:
                        </span>
                        {r.mitigation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Recommended Next Actions */}
              <div className="pt-4 space-y-2.5">
                <h3 className="text-xs font-semibold text-gray-800 uppercase tracking-wider">
                  Recommended Next Actions ({recommendedActions.length})
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {recommendedActions.map((a, idx) => (
                    <div
                      key={idx}
                      className="p-3 border border-gray-200 bg-white rounded flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded bg-gray-100 text-gray-600 text-[11px] font-semibold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="text-[11px] font-semibold text-gray-500 uppercase">
                            {a.stage}
                          </div>
                          <div className="text-gray-900 font-medium leading-snug mt-0.5">
                            {a.action}
                          </div>
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

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="text-xs text-gray-500 hidden sm:block">
            Risk intelligence synthesized from live stage deliverables and project notes.
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-3.5 py-1.5 rounded text-xs font-medium text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-300 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
