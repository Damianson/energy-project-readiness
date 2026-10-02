import React, { useState } from 'react';
import TaskRow from './TaskRow';
import { Plus, CheckCircle2, AlertOctagon, Clock, Inbox } from 'lucide-react';

export default function TaskList({
  stage,
  tasks = [],
  onUpdateTask,
  onDeleteTask,
  onOpenAddTask,
}) {
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'BLOCKED' | 'IN_PROGRESS' | 'COMPLETE'

  const completedCount = tasks.filter((t) => t.status === 'Complete').length;
  const blockedCount = tasks.filter((t) => t.is_blocker || t.status === 'Blocked').length;
  const inProgressCount = tasks.filter((t) => t.status === 'In progress').length;

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'BLOCKED') return t.is_blocker || t.status === 'Blocked';
    if (filter === 'IN_PROGRESS') return t.status === 'In progress';
    if (filter === 'COMPLETE') return t.status === 'Complete';
    return true;
  });

  return (
    <div className="space-y-3">
      {/* Header Bar with Action & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setFilter('ALL')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
              filter === 'ALL'
                ? 'bg-[#1e283d] text-white border border-[#2d3c5b]'
                : 'text-slate-400 hover:text-white hover:bg-[#161f30] border border-transparent'
            }`}
          >
            All ({tasks.length})
          </button>

          {blockedCount > 0 && (
            <button
              type="button"
              onClick={() => setFilter('BLOCKED')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer border ${
                filter === 'BLOCKED'
                  ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                  : 'text-rose-400 border-transparent hover:bg-rose-950/30'
              }`}
            >
              <AlertOctagon className="w-3 h-3 text-rose-400" />
              Blocked ({blockedCount})
            </button>
          )}

          {inProgressCount > 0 && (
            <button
              type="button"
              onClick={() => setFilter('IN_PROGRESS')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer border ${
                filter === 'IN_PROGRESS'
                  ? 'bg-[#182638] text-amber-300 border-amber-800/80'
                  : 'text-amber-400 border-transparent hover:bg-amber-950/30'
              }`}
            >
              <Clock className="w-3 h-3 text-amber-400" />
              In Progress ({inProgressCount})
            </button>
          )}

          {completedCount > 0 && (
            <button
              type="button"
              onClick={() => setFilter('COMPLETE')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer border ${
                filter === 'COMPLETE'
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                  : 'text-emerald-400 border-transparent hover:bg-emerald-950/30'
              }`}
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Complete ({completedCount})
            </button>
          )}
        </div>

        {/* Add Task Button */}
        <button
          type="button"
          onClick={onOpenAddTask}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-medium text-emerald-400 bg-[#162132] hover:bg-[#1c2a3f] border border-emerald-800/80 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Deliverable</span>
        </button>
      </div>

      {/* Task List or Empty State */}
      {filteredTasks.length === 0 ? (
        <div className="bg-[#101520] border border-[#1f283d] rounded p-8 text-center">
          <Inbox className="w-6 h-6 text-slate-600 mx-auto mb-2" />
          <p className="text-xs font-mono text-slate-400">
            {tasks.length === 0
              ? 'No deliverable tasks registered in this phase.'
              : `No tasks matching filter "${filter.toLowerCase()}".`}
          </p>
          {tasks.length === 0 && (
            <button
              type="button"
              onClick={onOpenAddTask}
              className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-mono text-emerald-400 bg-[#141b27] border border-emerald-800/60 hover:bg-[#1a2333] transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>Create Initial Deliverable</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onUpdateTask={onUpdateTask}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
}
