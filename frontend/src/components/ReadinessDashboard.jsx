import React from 'react';
import StageCard from './StageCard';
import { Gauge, CheckCircle, AlertOctagon } from 'lucide-react';

export default function ReadinessDashboard({
  project,
  selectedStageId,
  onSelectStage,
}) {
  if (!project) return null;

  const overallReadiness = Number(project.overall_readiness || 0);
  const stages = project.stages || [];
  const blockedStagesCount = stages.filter((s) => s.is_blocked).length;

  return (
    <div className="space-y-6">
      {/* Overall Readiness Summary Panel */}
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-6 backdrop-blur">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Gauge className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Project Development Readiness
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Deterministic average across all 6 key development stages (Site, Grid, Permits, Commercial, Procurement, Construction).
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                {overallReadiness}%
              </div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Overall Score
              </div>
            </div>

            <div className="h-10 w-px bg-slate-700" />

            <div className="text-left">
              <div className="text-lg font-bold text-white flex items-center gap-1.5">
                {blockedStagesCount > 0 ? (
                  <span className="text-rose-400 flex items-center gap-1">
                    <AlertOctagon className="w-4 h-4" />
                    {blockedStagesCount} of 6 Blocked
                  </span>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    6 of 6 Clear
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-400">Stage Health</div>
            </div>
          </div>
        </div>

        {/* Global Progress Track */}
        <div className="w-full bg-slate-900 rounded-full h-3 mt-5 p-0.5 border border-slate-700/60 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-700 shadow-sm shadow-emerald-500/50"
            style={{ width: `${Math.max(overallReadiness, 3)}%` }}
          />
        </div>
      </div>

      {/* Six Stage Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
            Stage-by-Stage Breakdown
          </h3>
          <span className="text-xs text-slate-400">
            6 Sequential Development Phases
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stages.map((stage) => (
            <StageCard
              key={stage.id || stage.name}
              stage={stage}
              isSelected={stage.id === selectedStageId}
              onSelectStage={onSelectStage}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
