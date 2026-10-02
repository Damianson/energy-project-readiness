import React, { useState } from 'react';
import TaskRow from './TaskRow';
import { Plus } from 'lucide-react';

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
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          type="button"
          onClick={() => setFilter('ALL')}
          className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
            filter === 'ALL'
              ? 'bg-zinc-100 text-zinc-900 font-medium'
              : 'text-zinc-500 hover:text-zinc-900'
          }`}
        >
          All ({tasks.length})
        </button>

        {blockedCount > 0 && (
          <button
            type="button"
            onClick={() => setFilter('BLOCKED')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
              filter === 'BLOCKED'
                ? 'bg-red-50 text-red-700 font-medium'
                : 'text-zinc-500 hover:text-red-600'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            Blocked ({blockedCount})
          </button>
        )}

        {inProgressCount > 0 && (
          <button
            type="button"
            onClick={() => setFilter('IN_PROGRESS')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
              filter === 'IN_PROGRESS'
                ? 'bg-amber-50 text-amber-800 font-medium'
                : 'text-zinc-500 hover:text-amber-700'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            In progress ({inProgressCount})
          </button>
        )}

        {completedCount > 0 && (
          <button
            type="button"
            onClick={() => setFilter('COMPLETE')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
              filter === 'COMPLETE'
                ? 'bg-emerald-50 text-emerald-800 font-medium'
                : 'text-zinc-500 hover:text-emerald-700'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Complete ({completedCount})
          </button>
        )}
      </div>

      {/* Task List Items */}
      {filteredTasks.length === 0 ? (
        <div className="py-8 text-center text-sm text-zinc-500 border border-dashed border-zinc-200 rounded-md">
          <p>No deliverables match the selected filter.</p>
          <button
            type="button"
            onClick={() => setFilter('ALL')}
            className="mt-1 text-xs text-[#3B5BDB] hover:underline font-medium cursor-pointer"
          >
            View all deliverables
          </button>
        </div>
      ) : (
        <div className="divide-y divide-zinc-100 border-t border-b border-zinc-100">
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
