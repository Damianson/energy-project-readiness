import React, { useState } from 'react';
import TaskList from './TaskList';
import TaskModal from './TaskModal';
import { Layers, AlertOctagon, CheckCircle2 } from 'lucide-react';

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
  const tasks = activeStage.tasks || [];
  const completedTasks = tasks.filter((t) => t.status === 'Complete').length;

  const handleCreateTaskSubmit = async (taskData) => {
    await onCreateTask(activeStage.id, taskData);
  };

  return (
    <div id="stage-workspace" className="bg-[#121722] border border-[#1f283d] rounded-lg p-5 space-y-4">
      {/* Workspace Header & Stage Navigation Tabs */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white tracking-tight uppercase font-mono">
              Stage Deliverables & Task Workspace
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Active Workspace: Phase 0{activeStage.order_index} — {activeStage.name}
          </span>
        </div>

        {/* Stage Selector Segmented Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 bg-[#0e131d] p-1.5 rounded border border-[#1f283d]">
          {stages.map((stage) => {
            const isSelected = stage.id === activeStage.id;
            const stageReadiness = Number(stage.readiness || 0);
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => onSelectStage(stage.id)}
                className={`flex flex-col items-start p-2 rounded text-left transition-colors cursor-pointer relative ${
                  isSelected
                    ? 'bg-[#182233] border border-[#2a3854] text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#131924] border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    0{stage.order_index}
                  </span>
                  {stage.is_blocked ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" title="Stage blocked" />
                  ) : stageReadiness === 100 ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Stage complete" />
                  ) : (
                    <span className="text-[10px] font-mono text-slate-400 tabular-nums">
                      {stageReadiness}%
                    </span>
                  )}
                </div>

                <div className="text-xs font-semibold truncate w-full">
                  {stage.name}
                </div>

                {isSelected && (
                  <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-emerald-500 rounded" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Stage Detail Header Panel */}
      <div className="bg-[#141b27] border border-[#222d42] rounded-md p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-3 border-b border-[#1f283d]">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-xs font-mono font-bold text-emerald-400 bg-[#162030] border border-emerald-900/60 px-2 py-0.5 rounded">
                PHASE 0{activeStage.order_index}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {activeStage.name} Operations Register
              </h3>
              {activeStage.is_blocked && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-rose-950/90 text-rose-300 border border-rose-800">
                  <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                  Stage Impeded
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-mono">
              {completedTasks} of {tasks.length} deliverables complete ({activeReadiness}% phase readiness)
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right font-mono">
              <div className="text-xl font-bold text-white tabular-nums">
                {activeReadiness}%
              </div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400">
                Phase Readiness
              </div>
            </div>

            <div className="w-24 sm:w-32 bg-[#0d121c] rounded h-2 overflow-hidden border border-[#1e2638]">
              <div
                className={`h-full transition-all duration-300 ${
                  activeStage.is_blocked
                    ? 'bg-rose-500'
                    : activeReadiness === 100
                    ? 'bg-emerald-500'
                    : 'bg-amber-500'
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
