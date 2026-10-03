import React, { useState } from 'react';
import TaskList from './TaskList';
import TaskModal from './TaskModal';
import { Plus } from 'lucide-react';

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
    <div id="stage-workspace" className="bg-white border border-gray-200 rounded-md overflow-hidden">
      {/* Stage Switcher Tabs Strip */}
      <div className="border-b border-gray-200 bg-gray-50/70 px-4 flex items-center gap-1 overflow-x-auto">
        {stages.map((stage) => {
          const isSelected = stage.id === activeStage.id;
          const stageReadiness = Number(stage.readiness || 0);
          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => onSelectStage(stage.id)}
              className={`flex items-center gap-1.5 py-3 px-3 text-xs font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'border-forest-800 text-gray-900 bg-white font-semibold'
                  : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100/70'
              }`}
            >
              <span>Stage 0{stage.order_index}: {stage.name.split(' ')[0]}</span>
              {stage.is_blocked ? (
                <span className="w-1.5 h-1.5 rounded-full bg-red-600" title="Blocked" />
              ) : stageReadiness === 100 ? (
                <span className="w-1.5 h-1.5 rounded-full bg-forest-600" title="Complete" />
              ) : stageReadiness > 0 ? (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="In progress" />
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Workspace Header & Actions */}
      <div className="p-4 sm:p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 tracking-tight">
              {activeStage.name} Workspace
            </h2>
            {activeStage.is_blocked && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">
                Gate Blocked
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            {completedTasks} of {tasks.length} deliverables complete • {activeReadiness}% stage readiness • Stage Weight: {Math.round((activeStage.weight || 1.0) * 100)}%
          </p>
        </div>

        {/* Action: Add Deliverable */}
        <button
          type="button"
          onClick={() => setIsTaskModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded text-white bg-forest-800 hover:bg-forest-900 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Deliverable</span>
        </button>
      </div>

      {/* Deliverables List / Table */}
      <div className="p-4 sm:p-5">
        <TaskList
          stage={activeStage}
          tasks={tasks}
          onUpdateTask={onUpdateTask}
          onDeleteTask={onDeleteTask}
          onOpenAddTask={() => setIsTaskModalOpen(true)}
        />
      </div>

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
