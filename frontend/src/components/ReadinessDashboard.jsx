import React from 'react';
import StageCard from './StageCard';
import { ArrowRight, Layers } from 'lucide-react';

export default function ReadinessDashboard({
  project,
  selectedStageId,
  onSelectStage,
}) {
  if (!project) return null;

  const stages = [...(project.stages || [])].sort((a, b) => (a.order_index || 0) - (b.order_index || 0));

  return (
    <div className="space-y-4">
      {/* Section Header & Pipeline Flow */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 px-1">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Development Lifecycle Stages
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any stage gate to inspect deliverables and manage tasks below
          </p>
        </div>

        {/* Linear Stage Pipeline Indicator */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 flex-wrap">
          <span className="text-slate-300 font-medium">Pipeline:</span>
          {stages.map((stage, idx) => (
            <React.Fragment key={stage.id}>
              <span className={`transition-colors ${stage.id === selectedStageId ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}>
                {stage.name.split(' ')[0]}
              </span>
              {idx < stages.length - 1 && (
                <ArrowRight className="w-3 h-3 text-slate-600 shrink-0 inline" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 6 Stage Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
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
  );
}

