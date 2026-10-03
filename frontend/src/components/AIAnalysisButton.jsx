import React from 'react';
import { Loader2, RefreshCw, Play } from 'lucide-react';

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
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-white bg-forest-800 hover:bg-forest-900 transition-colors disabled:opacity-50 cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
            <span>Analyzing...</span>
          </>
        ) : (
          <>
            <Play className="w-3 h-3 fill-current" />
            <span>{hasLatest ? 'View Risk Assessment' : 'Run Risk Assessment'}</span>
          </>
        )}
      </button>

      {hasLatest && !loading && (
        <button
          type="button"
          onClick={onAnalyze}
          title="Re-run operational risk assessment"
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3 h-3 text-gray-500" />
          <span>Re-assess</span>
          {formattedTime && (
            <span className="text-gray-400 font-normal">({formattedTime})</span>
          )}
        </button>
      )}
    </div>
  );
}
