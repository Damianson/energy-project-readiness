import React, { useState } from 'react';
import TaskRow from './TaskRow';
import { AlertOctagon, CheckCircle2, Clock, Layers } from 'lucide-react';

export default function TaskList({
  stage,
  tasks = [],
  onUpdateTask,
  onDeleteTask,
  onOpenAddTask,
}) {
  const [filter, setFilter] = useState('ALL');

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
    <div className="space-y-3.5">
      {/* Filters Bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
            filter === 'ALL'
              ? 'bg-[#1e2b45] text-white border border-slate-500'
              : 'text-slate-400 hover:text-white hover:bg-[#182438] border border-transparent'
          }`}
        >
          All ({tasks.length})
        </button>

        {blockedCount > 0 && (
          <button
            type="button"
            onClick={() => setFilter('BLOCKED')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
              filter === 'BLOCKED'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'text-rose-400 border-rose-500/20 hover:bg-rose-500/10'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
            <span>Blocked ({blockedCount})</span>
          </button>
        )}

        {inProgressCount > 0 && (
          <button
            type="button"
            onClick={() => setFilter('IN_PROGRESS')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
              filter === 'IN_PROGRESS'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'text-amber-400 border-amber-500/20 hover:bg-amber-500/10'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>In Progress ({inProgressCount})</span>
          </button>
        )}

        {completedCount > 0 && (
          <button
            type="button"
            onClick={() => setFilter('COMPLETE')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
              filter === 'COMPLETE'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Complete ({completedCount})</span>
          </button>
        )}
      </div>

      {/* Task Rows */}
      {filteredTasks.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400 bg-[#0e1624] border border-[#1e2b45] rounded-lg">
          No deliverables match the selected filter.
        </div>
      ) : (
        <div className="space-y-2.5">
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

