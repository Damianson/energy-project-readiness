import React from 'react';

export default function AIAnalysisPanel({
  analysisData,
  loading = false,
  error = null,
  onAnalyze,
}) {
  const analysis = analysisData?.analysis || analysisData || {};
  const actions = analysis.recommended_next_actions || [];

  if (!actions || actions.length === 0) return null;

  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-6 space-y-3">
      <h2 className="text-base font-semibold text-zinc-900 tracking-tight">
        Recommended next actions
      </h2>
      <p className="text-[13px] text-zinc-500">
        Prioritized roadmap generated from active stage deliverables and risk analysis
      </p>

      <ol className="divide-y divide-zinc-100 border-t border-b border-zinc-100">
        {actions.map((a, idx) => (
          <li key={idx} className="py-2.5 flex items-start gap-3 text-sm">
            <span className="text-xs font-semibold text-zinc-400 mt-0.5">
              0{idx + 1}
            </span>
            <div className="flex-1">
              <span className="text-xs font-medium text-zinc-500 mr-2">
                [{a.stage}]
              </span>
              <span className="text-zinc-800">{a.action}</span>
            </div>
            {a.priority && (
              <span className="text-xs text-zinc-500 whitespace-nowrap">
                {a.priority} priority
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
