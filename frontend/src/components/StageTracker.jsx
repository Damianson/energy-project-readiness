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
    <div id="stage-workspace" className="bg-white border border-zinc-200 rounded-lg p-6 space-y-5">
      {/* Header and Add Task Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200">
        <div>
          <h2 className="text-base font-semibold text-zinc-900 tracking-tight">
            {activeStage.name} deliverables
          </h2>
          <p className="text-[13px] text-zinc-500 mt-0.5">
            Stage {activeStage.order_index} · {activeReadiness}% complete · {completedTasks} of {tasks.length} tasks complete
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsTaskModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 rounded-md hover:bg-zinc-50 hover:text-zinc-900 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 text-zinc-500" />
          <span>Add deliverable</span>
        </button>
      </div>

      {/* Stage Deliverables List */}
      <TaskList
        stage={activeStage}
        tasks={tasks}
        onUpdateTask={onUpdateTask}
        onDeleteTask={onDeleteTask}
        onOpenAddTask={() => setIsTaskModalOpen(true)}
      />

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
