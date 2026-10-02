import React from 'react';
import { Sparkles, Loader2, FileText, RefreshCw } from 'lucide-react';

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
    <div className="flex items-center gap-2 flex-wrap">
      {/* Primary Action Button */}
      <button
        type="button"
        onClick={hasLatest ? onViewLatest : onAnalyze}
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 hover:from-emerald-500 hover:via-teal-400 hover:to-cyan-400 shadow-md shadow-emerald-500/25 border border-emerald-400/30 transition-all duration-200 disabled:opacity-50 cursor-pointer active:scale-95"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            <span>Analyzing project...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-emerald-200 animate-pulse" />
            <span>{hasLatest ? 'View AI Risk Analysis' : 'Analyze Project Risks'}</span>
          </>
        )}
      </button>

      {/* If an analysis is already available, show quick Re-run button */}
      {hasLatest && !loading && (
        <button
          type="button"
          onClick={onAnalyze}
          title="Re-run AI analysis with current project data"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 hover:text-white border border-slate-700 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
          <span>Re-analyze</span>
          {formattedTime && (
            <span className="text-[11px] text-slate-500 ml-0.5">({formattedTime})</span>
          )}
        </button>
      )}
    </div>
  );
}
