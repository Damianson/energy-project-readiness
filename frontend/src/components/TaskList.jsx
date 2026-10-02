import React, { useState } from 'react';
import TaskRow from './TaskRow';
import { Plus, CheckCircle2, AlertOctagon, Clock, ListFilter, Inbox } from 'lucide-react';

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
      {/* Header Bar with Action & Quick Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filter === 'ALL'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            All Tasks ({tasks.length})
          </button>

          {blockedCount > 0 && (
            <button
              type="button"
              onClick={() => setFilter('BLOCKED')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filter === 'BLOCKED'
                  ? 'bg-rose-500/25 text-rose-300 border border-rose-500/40'
                  : 'text-rose-400 hover:bg-rose-950/30'
              }`}
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              Blocked ({blockedCount})
            </button>
          )}

          {inProgressCount > 0 && (
            <button
              type="button"
              onClick={() => setFilter('IN_PROGRESS')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filter === 'IN_PROGRESS'
                  ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/40'
                  : 'text-cyan-400 hover:bg-cyan-950/30'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              In Progress ({inProgressCount})
            </button>
          )}

          {completedCount > 0 && (
            <button
              type="button"
              onClick={() => setFilter('COMPLETE')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filter === 'COMPLETE'
                  ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40'
                  : 'text-emerald-400 hover:bg-emerald-950/30'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Complete ({completedCount})
            </button>
          )}
        </div>

        {/* Add Task Button */}
        <button
          type="button"
          onClick={onOpenAddTask}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      {/* Task List or Empty State */}
      {filteredTasks.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-8 text-center">
          <Inbox className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-400">
            {tasks.length === 0
              ? 'No tasks in this stage yet.'
              : `No tasks match filter "${filter.toLowerCase()}".`}
          </p>
          {tasks.length === 0 && (
            <button
              type="button"
              onClick={onOpenAddTask}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-900/50 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Create First Task
            </button>
          )}
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
