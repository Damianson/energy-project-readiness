import React, { useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

export default function AIAnalysisModal({
  isOpen,
  onClose,
  analysisData,
  loading = false,
  error = null,
  onReanalyze,
  projectName = '',
}) {
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
  const hasAnalysis = Boolean(analysis && (analysis.summary || analysis.current_blockers));

  const summary = analysis.summary || '';
  const currentBlockers = analysis.current_blockers || [];
  const majorRisks = analysis.major_risks || [];
  const recommendedActions = analysis.recommended_next_actions || [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white border border-zinc-200 rounded-lg shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-zinc-900 tracking-tight">
              Risk analysis
            </h2>
            <p className="text-[13px] text-zinc-500 mt-0.5">
              {projectName ? `${projectName} · ` : ''}Synthesized from live stage deliverables and notes
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-zinc-400 hover:text-zinc-700 p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Loading state */}
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#3B5BDB]" />
              <p className="text-sm font-medium text-zinc-800">
                Analyzing project deliverables and notes...
              </p>
              <p className="text-xs text-zinc-500 max-w-sm">
                Evaluating schedule dependencies, RTO cluster restudies, and supplier lead times.
              </p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md space-y-2">
              <div className="text-sm font-medium text-red-800">
                Analysis unavailable
              </div>
              <p className="text-xs text-red-700">{error}</p>
              {onReanalyze && (
                <button
                  type="button"
                  onClick={onReanalyze}
                  className="text-xs text-red-700 hover:underline font-medium"
                >
                  Try again
                </button>
              )}
            </div>
          )}

          {/* Analysis Results */}
          {!loading && !error && hasAnalysis && (
            <>
              {/* Executive summary */}
              <div>
                <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-wide mb-1.5">
                  Summary
                </h3>
                <p className="text-sm text-zinc-700 leading-relaxed bg-zinc-50 border border-zinc-200 rounded-md p-3.5">
                  {summary || 'No summary available.'}
                </p>
              </div>

              {/* Blockers */}
              {currentBlockers.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-wide mb-2">
                    Critical blockers ({currentBlockers.length})
                  </h3>
                  <div className="space-y-2">
                    {currentBlockers.map((b, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-md border border-red-100 bg-red-50/50 space-y-1"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-zinc-900">{b.issue}</span>
                          <span className="text-zinc-500">{b.stage}</span>
                        </div>
                        <p className="text-xs text-zinc-600">{b.impact}</p>
                        {b.owner && (
                          <div className="text-[11px] text-zinc-400 pt-0.5">
                            Owner: {b.owner}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Major Risks */}
              {majorRisks.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-wide mb-2">
                    Major risks ({majorRisks.length})
                  </h3>
                  <div className="space-y-2">
                    {majorRisks.map((r, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-md border border-zinc-200 bg-white space-y-1"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-zinc-900">{r.risk}</span>
                          <span className="text-zinc-500">{r.stage}</span>
                        </div>
                        {r.mitigation && (
                          <p className="text-xs text-zinc-600">
                            <span className="font-medium text-zinc-700">Mitigation: </span>
                            {r.mitigation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Next Actions */}
              {recommendedActions.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-wide mb-2">
                    Recommended next actions ({recommendedActions.length})
                  </h3>
                  <ol className="list-decimal list-inside space-y-1.5 text-xs text-zinc-700">
                    {recommendedActions.map((a, idx) => (
                      <li key={idx} className="leading-relaxed">
                        <span className="font-medium text-zinc-900">{a.stage}: </span>
                        {a.action}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-200 bg-zinc-50/50 flex items-center justify-end gap-2">
          {onReanalyze && !loading && (
            <button
              type="button"
              onClick={onReanalyze}
              className="px-3 py-1.5 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 rounded-md hover:bg-zinc-50 cursor-pointer"
            >
              Re-run analysis
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 rounded-md hover:bg-zinc-50 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
