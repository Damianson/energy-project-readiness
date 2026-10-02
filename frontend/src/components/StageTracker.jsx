import React, { useState } from 'react';
import TaskList from './TaskList';
import TaskModal from './TaskModal';
import { Layers, AlertOctagon, CheckCircle2, ChevronRight, Activity } from 'lucide-react';

export default function StageTracker({
  stages = [],
  selectedStageId,
  onSelectStage,
  onUpdateTask,
  onCreateTask,
  onDeleteTask,
}) {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Default to selectedStageId or first stage
  const activeStage =
    stages.find((s) => s.id === selectedStageId) || stages[0] || null;

  if (!activeStage) return null;

  const activeReadiness = Number(activeStage.readiness || 0);

  const handleCreateTaskSubmit = async (taskData) => {
    await onCreateTask(activeStage.id, taskData);
  };

  return (
    <div id="stage-workspace" className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-6 backdrop-blur space-y-6">
      {/* Workspace Header & Stage Navigation Tabs */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Stage & Task Management Workspace
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Select a stage below to view and edit deliverable tasks
          </span>
        </div>

        {/* Stage Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800">
          {stages.map((stage) => {
            const isSelected = stage.id === activeStage.id;
            const stageReadiness = Number(stage.readiness || 0);
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => onSelectStage(stage.id)}
                className={`flex flex-col items-start p-2.5 rounded-lg text-left transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-slate-800 border border-slate-700 shadow-sm text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-[10px] font-mono font-semibold text-slate-500">
                    0{stage.order_index}
                  </span>
                  {stage.is_blocked ? (
                    <span className="w-2 h-2 rounded-full bg-rose-500 ring-2 ring-rose-500/30" title="Stage is blocked" />
                  ) : stageReadiness === 100 ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-400" title="Stage 100% complete" />
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400">
                      {stageReadiness}%
                    </span>
                  )}
                </div>

                <div className="text-xs font-bold truncate w-full">
                  {stage.name}
                </div>

                {/* Bottom active accent line */}
                {isSelected && (
                  <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Stage Detail Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                Phase 0{activeStage.order_index}
              </span>
              <h3 className="text-xl font-black text-white tracking-tight">
                {activeStage.name}
              </h3>
              {activeStage.is_blocked && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  <AlertOctagon className="w-3.5 h-3.5" />
                  Blocked Stage
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              {activeStage.tasks?.length || 0} total milestones and deliverables tracked in this stage.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-black text-white">
                {activeReadiness}%
              </div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Stage Readiness
              </div>
            </div>

            <div className="w-28 sm:w-36 bg-slate-950 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-700/60">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  activeStage.is_blocked
                    ? 'bg-rose-500'
                    : activeReadiness === 100
                    ? 'bg-emerald-400'
                    : 'bg-cyan-400'
                }`}
                style={{ width: `${Math.max(activeReadiness, 3)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Embedded Task List */}
        <TaskList
          stage={activeStage}
          tasks={activeStage.tasks || []}
          onUpdateTask={onUpdateTask}
          onDeleteTask={onDeleteTask}
          onOpenAddTask={() => setIsTaskModalOpen(true)}
        />
      </div>

      {/* Task Creation Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleCreateTaskSubmit}
        stage={activeStage}
      />
    </div>
  );
}
