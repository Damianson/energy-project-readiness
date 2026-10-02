import React from 'react';
import { MapPin, SunMedium, BatteryCharging, Calendar, Layers } from 'lucide-react';
import AIAnalysisButton from './AIAnalysisButton';

export default function ProjectHeader({
  project,
  onAnalyzeRisks,
  onViewLatestAnalysis,
  isAnalyzing,
  latestAnalysis,
}) {
  if (!project) return null;

  return (
    <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 backdrop-blur shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Project Title & Location */}
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Layers className="w-3.5 h-3.5" />
              {project.project_type || 'Renewable Energy'}
            </span>
            {project.location && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {project.location}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {project.name}
          </h1>
          {project.description && (
            <p className="mt-1 text-sm text-slate-400 max-w-3xl line-clamp-2">
              {project.description}
            </p>
          )}
        </div>

        {/* Technical Capacity Badges & AI Risk Analysis Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl px-4 py-2.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <SunMedium className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Capacity
                </div>
                <div className="text-base font-bold text-white">
                  {project.estimated_capacity_mw}{' '}
                  <span className="text-xs font-normal text-slate-400">MW</span>
                </div>
              </div>
            </div>

            {project.battery_capacity_mwh ? (
              <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl px-4 py-2.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <BatteryCharging className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Storage (BESS)
                  </div>
                  <div className="text-base font-bold text-white">
                    {project.battery_capacity_mwh}{' '}
                    <span className="text-xs font-normal text-slate-400">MWh</span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* AI Risk Analysis Action */}
          <div className="sm:border-l sm:border-slate-700/80 sm:pl-3">
            <AIAnalysisButton
              onAnalyze={onAnalyzeRisks}
              onViewLatest={onViewLatestAnalysis}
              loading={isAnalyzing}
              hasLatest={Boolean(latestAnalysis)}
              latestTimestamp={latestAnalysis?.created_at}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
