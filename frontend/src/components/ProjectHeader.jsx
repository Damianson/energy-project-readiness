import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

export default function ProjectHeader({
  project,
  onAnalyzeRisks,
  onViewLatestAnalysis,
  isAnalyzing,
  latestAnalysis,
}) {
  if (!project) return null;

  const readiness = Number(project.overall_readiness || 0);
  const stages = project.stages || [];
  
  // Calculate completed vs total deliverables
  let totalTasks = 0;
  let completedTasks = 0;
  stages.forEach((s) => {
    (s.tasks || []).forEach((t) => {
      totalTasks += 1;
      if (t.status === 'Complete') completedTasks += 1;
    });
  });

  const blockerCount = (project.blockers || []).length;

  let statusSentence = `${completedTasks} of ${totalTasks} deliverables completed`;
  if (blockerCount > 0) {
    statusSentence = `Early stage development · ${completedTasks} of ${totalTasks} deliverables completed · ${blockerCount} active ${blockerCount === 1 ? 'blocker' : 'blockers'}`;
  } else if (readiness === 100) {
    statusSentence = `All stages complete · Ready for commercial operation`;
  } else if (readiness > 0) {
    statusSentence = `Development in progress · ${completedTasks} of ${totalTasks} deliverables completed`;
  }

  const summary = latestAnalysis?.summary;

  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-6 space-y-5">
      {/* Top row: Title, Metadata, and Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">
            {project.name}
          </h1>
          <p className="text-[13px] text-zinc-500 mt-1">
            {project.location ? `${project.location} · ` : ''}
            {project.estimated_capacity_mw} MW Solar PV
            {project.battery_capacity_mwh ? ` · ${project.battery_capacity_mwh} MWh Storage` : ''}
            {project.project_type ? ` · ${project.project_type}` : ''}
          </p>
        </div>

        {/* The single primary button on the page */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={onAnalyzeRisks}
            disabled={isAnalyzing}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#3B5BDB] hover:bg-[#364fc7] text-white text-sm font-medium rounded-md shadow-sm transition-colors disabled:opacity-60 cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Analyzing risks...</span>
              </>
            ) : (
              <span>{latestAnalysis ? 'Re-analyze risks' : 'Analyze risks'}</span>
            )}
          </button>
        </div>
      </div>

      {/* Overall readiness: plain large number with short status sentence */}
      <div className="pt-1">
        <div className="text-3xl font-semibold text-zinc-900 tracking-tight">
          {readiness}%
        </div>
        <div className="text-sm text-zinc-600 mt-0.5">
          {statusSentence}
        </div>
      </div>

      {/* Executive summary: 2-3 plain sentences */}
      <div className="pt-4 border-t border-zinc-100">
        {summary ? (
          <p className="text-sm text-zinc-700 leading-relaxed max-w-3xl">
            {summary}
          </p>
        ) : (
          <p className="text-sm text-zinc-500 leading-relaxed max-w-3xl">
            No risk analysis has been generated yet. Click "Analyze risks" to synthesize cross-stage blockers, timeline vulnerabilities, and recommended next actions.
          </p>
        )}
      </div>
    </div>
  );
}
