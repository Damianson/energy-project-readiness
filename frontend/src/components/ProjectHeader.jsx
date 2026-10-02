import React from 'react';
import { MapPin, Sun, BatteryCharging, Gauge, AlertTriangle, Layers } from 'lucide-react';
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

  return (
    <div className="bg-[#131d2e] border border-[#1e2b45] rounded-xl p-6 shadow-sm space-y-6">
      {/* Top Row: Identity, Location, and Intelligence Trigger */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div className="space-y-2">
          {/* Metadata Badges */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              {project.project_type || 'Solar PV + BESS Storage'}
            </span>

            {project.location && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-300 bg-[#0e1624] px-2.5 py-1 rounded-full border border-[#1e2b45]">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {project.location}
              </span>
            )}

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-emerald-400 bg-emerald-950/50 border border-emerald-800/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Active Project
            </span>
          </div>

          {/* Project Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {project.name}
          </h1>

          {/* Project Description */}
          {project.description && (
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              {project.description}
            </p>
          )}
        </div>

        {/* Action Button: AI Risk Assessment */}
        <div className="shrink-0 pt-1 lg:pt-0">
          <AIAnalysisButton
            onAnalyze={onAnalyzeRisks}
            onViewLatest={onViewLatestAnalysis}
            loading={isAnalyzing}
            hasLatest={Boolean(latestAnalysis)}
            latestTimestamp={latestAnalysis?.created_at}
          />
        </div>
      </div>

      {/* Sizing & Readiness Telemetry Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 pt-2 border-t border-[#1e2b45]">
        {/* 1. Solar Capacity */}
        <div className="bg-[#0e1624] border border-[#1e2b45] rounded-lg p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium">Solar PV Capacity</span>
            <Sun className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white tabular-nums">
            {project.estimated_capacity_mw}{' '}
            <span className="text-xs font-normal text-slate-400">MW</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Peak DC Generation
          </div>
        </div>

        {/* 2. Battery Storage Capacity */}
        <div className="bg-[#0e1624] border border-[#1e2b45] rounded-lg p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium">Battery Storage</span>
            <BatteryCharging className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white tabular-nums">
            {project.battery_capacity_mwh || 0}{' '}
            <span className="text-xs font-normal text-slate-400">MWh</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            4-Hour Duration BESS
          </div>
        </div>

        {/* 3. Overall Readiness */}
        <div className="bg-[#0e1624] border border-[#1e2b45] rounded-lg p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium">Overall Readiness</span>
            <Gauge className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold text-emerald-400 tabular-nums">
              {readiness}%
            </span>
            <span className="text-[11px] text-slate-400">Early Stage</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-[#182438] rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full"
              style={{ width: `${Math.max(readiness, 5)}%` }}
            />
          </div>
        </div>

        {/* 4. Active Blockers */}
        <div className="bg-[#0e1624] border border-[#1e2b45] rounded-lg p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium">Active Blockers</span>
            <AlertTriangle className={`w-4 h-4 ${blockerCount > 0 ? 'text-rose-400' : 'text-slate-500'}`} />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white tabular-nums">
            {blockerCount}{' '}
            <span className="text-xs font-normal text-slate-400">
              {blockerCount === 1 ? 'Blocker' : 'Blockers'}
            </span>
          </div>
          <div className={`text-[11px] mt-1 font-medium ${blockerCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {blockerCount > 0 ? 'Halting development gates' : 'Critical path is clear'}
          </div>
        </div>
      </div>
    </div>
  );
}

