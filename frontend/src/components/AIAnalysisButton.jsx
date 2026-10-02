import React from 'react';
import { Loader2, RefreshCw } from 'lucide-react';

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
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-medium text-white bg-[#3B5BDB] hover:bg-[#364fc7] transition-colors disabled:opacity-60 cursor-pointer shadow-sm"
      >
        {loading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
            <span>Analyzing risks...</span>
          </>
        ) : (
          <span>{hasLatest ? 'View risk analysis' : 'Analyze risks'}</span>
        )}
      </button>

      {hasLatest && !loading && (
        <button
          type="button"
          onClick={onAnalyze}
          title="Re-run risk analysis"
          className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-md text-xs font-medium text-zinc-600 bg-white hover:bg-zinc-50 border border-zinc-200 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3 h-3 text-zinc-500" />
          <span>Re-run</span>
          {formattedTime && (
            <span className="text-[11px] text-zinc-400">({formattedTime})</span>
          )}
        </button>
      )}
    </div>
  );
}
