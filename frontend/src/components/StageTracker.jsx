import React, { useState } from 'react';
import TaskList from './TaskList';
import TaskModal from './TaskModal';
import { Layers, Plus, CheckCircle2, AlertOctagon } from 'lucide-react';

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
    <div id="stage-workspace" className="bg-[#131d2e] border border-[#1e2b45] rounded-xl p-6 shadow-sm space-y-5">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1e2b45]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
              Stage 0{activeStage.order_index}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {activeStage.name} Workspace
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            {completedTasks} of {tasks.length} deliverables completed · {activeReadiness}% stage readiness · Stage Weight: {Math.round((activeStage.weight || 1.0) * 100)}%
          </p>
        </div>

        {/* Action: Add Task */}
        <button
          type="button"
          onClick={() => setIsTaskModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Deliverable</span>
        </button>
      </div>

      {/* Stage Switching Segmented Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {stages.map((stage) => {
          const isSelected = stage.id === activeStage.id;
          const stageReadiness = Number(stage.readiness || 0);
          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => onSelectStage(stage.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#182438] border border-transparent'
              }`}
            >
              <span>Stage 0{stage.order_index}: {stage.name.split(' ')[0]}</span>
              {stage.is_blocked ? (
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" title="Blocked" />
              ) : stageReadiness === 100 ? (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Complete" />
              ) : (
                <span className="text-[11px] text-slate-400 font-normal">({stageReadiness}%)</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Deliverables List */}
      <TaskList
        stage={activeStage}
        tasks={tasks}
        onUpdateTask={onUpdateTask}
        onDeleteTask={onDeleteTask}
        onOpenAddTask={() => setIsTaskModalOpen(true)}
      />

      {/* Deliverable Creation Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleCreateTaskSubmit}
        stage={activeStage}
      />
    </div>
  );
}

