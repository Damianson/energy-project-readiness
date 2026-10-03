import React, { useState } from 'react';
import TaskRow from './TaskRow';

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
      {/* Restrained Filters Bar */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          type="button"
          onClick={() => setFilter('ALL')}
          className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
            filter === 'ALL'
              ? 'bg-gray-200 text-gray-900 font-semibold'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          All ({tasks.length})
        </button>

        {blockedCount > 0 && (
          <button
            type="button"
            onClick={() => setFilter('BLOCKED')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
              filter === 'BLOCKED'
                ? 'bg-red-100 text-red-800 font-semibold'
                : 'text-red-700 hover:bg-red-50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
            <span>Blocked ({blockedCount})</span>
          </button>
        )}

        {inProgressCount > 0 && (
          <button
            type="button"
            onClick={() => setFilter('IN_PROGRESS')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
              filter === 'IN_PROGRESS'
                ? 'bg-amber-100 text-amber-800 font-semibold'
                : 'text-amber-700 hover:bg-amber-50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>In Progress ({inProgressCount})</span>
          </button>
        )}

        {completedCount > 0 && (
          <button
            type="button"
            onClick={() => setFilter('COMPLETE')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
              filter === 'COMPLETE'
                ? 'bg-forest-100 text-forest-800 font-semibold'
                : 'text-forest-700 hover:bg-forest-50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-forest-600" />
            <span>Complete ({completedCount})</span>
          </button>
        )}
      </div>

      {/* Deliverables Table */}
      <div className="border border-gray-200 rounded-md overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              <th className="py-2.5 px-3.5">Deliverable & Scope</th>
              <th className="py-2.5 px-3 w-40">Owner</th>
              <th className="py-2.5 px-3 w-36">Status</th>
              <th className="py-2.5 px-3 w-32">Due Date</th>
              <th className="py-2.5 px-3 w-28">Critical Path</th>
              <th className="py-2.5 px-3 w-16 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-xs text-gray-400">
                  No deliverables match the selected filter.
                </td>
              </tr>
            ) : (
              filteredTasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onUpdateTask={onUpdateTask}
                  onDeleteTask={onDeleteTask}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
