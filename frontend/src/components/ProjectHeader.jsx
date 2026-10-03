import React from 'react';
import AIAnalysisButton from './AIAnalysisButton';

export default function ProjectHeader({
  project,
  onAnalyzeRisks,
  onViewLatestAnalysis,
  isAnalyzing,
  latestAnalysis,
}) {
  if (!project) return null;

  const readiness = Number(project.overall_readiness || 0);
  const blockerCount = (project.blockers || []).length;

  // Derive active risks count from latest analysis if available, otherwise 4
  const riskCount = latestAnalysis?.analysis?.major_risks?.length || 4;

  // Determine current active gate: first stage with blocker or earliest incomplete stage
  const currentGate = (() => {
    if (project.stages && project.stages.length > 0) {
      const blockedStage = project.stages.find((s) => s.is_blocked || (s.tasks || []).some(t => t.is_blocker));
      if (blockedStage) return blockedStage.name.split(' ')[0];
      const inProgressStage = project.stages.find((s) => Number(s.readiness || 0) < 100);
      if (inProgressStage) return inProgressStage.name.split(' ')[0];
      return project.stages[0].name.split(' ')[0];
    }
    return 'Grid';
  })();

  return (
    <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
      {/* Project Identity Bar */}
      <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
              {project.name}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-forest-50 text-forest-800 border border-forest-200">
              <span className="w-1.5 h-1.5 rounded-full bg-forest-600" />
              Active
            </span>
          </div>

          <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-600 flex-wrap">
            {project.location && (
              <span>{project.location}</span>
            )}
            <span className="text-gray-300">•</span>
            <span className="font-medium text-gray-800">{project.estimated_capacity_mw} MW Solar PV</span>
            <span className="text-gray-300">•</span>
            <span className="font-medium text-gray-800">{project.battery_capacity_mwh || 0} MWh BESS</span>
            {project.project_type && (
              <>
                <span className="text-gray-300">•</span>
                <span>{project.project_type}</span>
              </>
            )}
          </div>

          {project.description && (
            <p className="text-xs text-gray-500 mt-1 max-w-3xl leading-relaxed">
              {project.description}
            </p>
          )}
        </div>

        {/* Action Button: Risk Assessment */}
        <div className="shrink-0">
          <AIAnalysisButton
            onAnalyze={onAnalyzeRisks}
            onViewLatest={onViewLatestAnalysis}
            loading={isAnalyzing}
            hasLatest={Boolean(latestAnalysis)}
            latestTimestamp={latestAnalysis?.created_at}
          />
        </div>
      </div>

      {/* Top Operational Summary Strip (Project-Control Summary) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-gray-200 bg-gray-50/70 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
        {/* Metric 1: Readiness */}
        <div className="px-4 py-3">
          <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-0.5">
            Readiness
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-gray-900 tabular-nums">
              {readiness}%
            </span>
            <span className="text-[11px] text-gray-500">Target COD: 2027</span>
          </div>
        </div>

        {/* Metric 2: Critical Blockers */}
        <div className="px-4 py-3">
          <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-0.5">
            Critical Blockers
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-semibold tabular-nums ${blockerCount > 0 ? 'text-red-700' : 'text-gray-900'}`}>
              {blockerCount}
            </span>
            <span className={`text-[11px] font-medium ${blockerCount > 0 ? 'text-red-600' : 'text-gray-500'}`}>
              {blockerCount > 0 ? 'Halting Gates' : 'Nominal'}
            </span>
          </div>
        </div>

        {/* Metric 3: Active Risks */}
        <div className="px-4 py-3">
          <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-0.5">
            Active Risks
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-gray-900 tabular-nums">
              {riskCount}
            </span>
            <span className="text-[11px] text-amber-700 font-medium">
              Tracked
            </span>
          </div>
        </div>

        {/* Metric 4: Current Gate */}
        <div className="px-4 py-3">
          <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-0.5">
            Current Gate
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-gray-900">
              {currentGate}
            </span>
            <span className="text-[11px] text-gray-500">
              {blockerCount > 0 ? 'Restudy Phase' : 'In Progress'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
