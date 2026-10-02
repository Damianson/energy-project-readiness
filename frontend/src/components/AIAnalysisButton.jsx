import React from 'react';
import { Activity, Loader2, RefreshCw } from 'lucide-react';

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
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-mono font-medium text-slate-100 bg-[#161e2c] hover:bg-[#1d273a] border border-[#28354f] hover:border-emerald-600/60 transition-colors disabled:opacity-50 cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            <span className="text-emerald-400">Assessing Risks...</span>
          </>
        ) : (
          <>
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>{hasLatest ? 'Project Intelligence' : 'Run Intelligence Assessment'}</span>
            {hasLatest && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            )}
          </>
        )}
      </button>

      {/* If an assessment is already available, show quick re-run affordance */}
      {hasLatest && !loading && (
        <button
          type="button"
          onClick={onAnalyze}
          title="Re-run intelligence assessment with current project data"
          className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-md text-xs font-mono text-slate-400 bg-[#101520] hover:bg-[#161d2a] hover:text-slate-200 border border-[#242f46] hover:border-slate-600 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3 h-3 text-slate-400" />
          <span className="hidden sm:inline">Refresh</span>
          {formattedTime && (
            <span className="text-[10px] text-slate-400">({formattedTime})</span>
          )}
        </button>
      )}
    </div>
  );
}
