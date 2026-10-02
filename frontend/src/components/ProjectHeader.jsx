import React from 'react';
import { MapPin, SunMedium, BatteryCharging, Gauge, Layers } from 'lucide-react';
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

  return (
    <div className="bg-[#121722] border border-[#1f283d] rounded-lg p-5">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
        {/* Project Identity */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider bg-[#182030] text-emerald-400 border border-emerald-900/60">
              <Layers className="w-3 h-3 text-emerald-400" />
              {project.project_type || 'Renewable Asset'}
            </span>
            {project.location && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-mono">
                <MapPin className="w-3 h-3 text-slate-400" />
                {project.location}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono text-slate-400 bg-[#161d2a] border border-[#242f46]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ACTIVE ASSET
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {project.name}
          </h1>

          {project.description && (
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
              {project.description}
            </p>
          )}
        </div>

        {/* Technical Capacity & Readiness Control Telemetry */}
        <div className="flex flex-wrap items-center gap-3 pt-3 xl:pt-0 border-t xl:border-t-0 border-[#1f283d]">
          {/* Capacity Spec */}
          <div className="bg-[#151c2a] border border-[#242f46] rounded-md px-3.5 py-2 min-w-[110px]">
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
              <SunMedium className="w-3.5 h-3.5 text-amber-400" />
              Solar PV
            </div>
            <div className="text-lg font-mono font-bold text-white tabular-nums">
              {project.estimated_capacity_mw}{' '}
              <span className="text-xs font-normal text-slate-400">MW</span>
            </div>
          </div>

          {/* Storage Spec */}
          {project.battery_capacity_mwh ? (
            <div className="bg-[#151c2a] border border-[#242f46] rounded-md px-3.5 py-2 min-w-[110px]">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                BESS Storage
              </div>
              <div className="text-lg font-mono font-bold text-white tabular-nums">
                {project.battery_capacity_mwh}{' '}
                <span className="text-xs font-normal text-slate-400">MWh</span>
              </div>
            </div>
          ) : null}

          {/* Overall Readiness Gauge */}
          <div className="bg-[#151c2a] border border-[#242f46] rounded-md px-3.5 py-2 min-w-[130px]">
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
              <Gauge className="w-3.5 h-3.5 text-emerald-400" />
              Overall Readiness
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-mono font-bold text-emerald-400 tabular-nums">
                {readiness}%
              </span>
              <div className="w-16 bg-[#0f141f] rounded h-1.5 overflow-hidden border border-[#2a364e]">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${Math.max(readiness, 4)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Project Intelligence Action */}
          <div className="pl-1">
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
