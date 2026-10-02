import React from 'react';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';

export default function AIAnalysisButton({
  onAnalyze,
  onViewLatest,
  loading = false,
  hasLatest = false,
  latestTimestamp = null,
}) {
  const formatTime = (ts) => {
    if (!ts) return null;
    try {
      const d = new Date(ts);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return null;
    }
  };

  const formattedTime = formatTime(latestTimestamp);

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={hasLatest ? onViewLatest : onAnalyze}
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-sm shadow-emerald-500/20 transition-all disabled:opacity-50 cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            <span>Analyzing Risks...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>{hasLatest ? 'View Risk Analysis' : 'Analyze Project Risks'}</span>
          </>
        )}
      </button>

      {hasLatest && !loading && (
        <button
          type="button"
          onClick={onAnalyze}
          title="Re-run AI risk analysis with current project context"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 bg-[#0e1624] hover:bg-[#182438] hover:text-white border border-[#1e2b45] transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Refresh</span>
          {formattedTime && (
            <span className="text-[11px] text-slate-400">({formattedTime})</span>
          )}
        </button>
      )}
    </div>
  );
}

