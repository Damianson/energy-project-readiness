import React, { useState } from 'react';
import { Loader2, ChevronDown, ChevronRight } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'Not started', label: 'Not started', dot: 'bg-zinc-300' },
  { value: 'In progress', label: 'In progress', dot: 'bg-amber-500' },
  { value: 'Complete', label: 'Complete', dot: 'bg-emerald-500' },
  { value: 'Blocked', label: 'Blocked', dot: 'bg-red-500' },
];

export default function TaskRow({ task, onUpdateTask, onDeleteTask }) {
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const currentStatus = task.status || 'Not started';
  const currentOpt =
    STATUS_OPTIONS.find((o) => o.value.toLowerCase() === currentStatus.toLowerCase()) ||
    STATUS_OPTIONS[0];

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    if (newStatus === currentStatus) return;

    setUpdating(true);
    try {
      await onUpdateTask(task.id, { status: newStatus });
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleBlocker = async () => {
    setUpdating(true);
    try {
      const nextIsBlocker = !task.is_blocker;
      const updates = { is_blocker: nextIsBlocker };
      if (nextIsBlocker && currentStatus !== 'Blocked') {
        updates.status = 'Blocked';
      } else if (!nextIsBlocker && currentStatus === 'Blocked') {
        updates.status = 'In progress';
      }
      await onUpdateTask(task.id, updates);
    } catch (err) {
      console.error('Failed to toggle blocker:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await onDeleteTask(task.id);
    } catch (err) {
      console.error('Failed to delete task:', err);
      setDeleting(false);
      setShowConfirmDelete(false);
    }
  };

  return (
    <div className="py-3 px-1 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        {/* Left side: Status dot, Title, Description, Meta */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Status Dropdown with Dot */}
          <div className="pt-0.5 shrink-0">
            {updating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-400 mt-1" />
            ) : (
              <div className="relative inline-flex items-center">
                <span
                  className={`w-2 h-2 rounded-full ${currentOpt.dot} absolute left-2 pointer-events-none`}
                />
                <select
                  value={currentStatus}
                  onChange={handleStatusChange}
                  disabled={updating}
                  className="bg-transparent text-xs text-zinc-700 pl-5 pr-2 py-1 border border-zinc-200 rounded hover:border-zinc-300 focus:outline-none focus:border-[#3B5BDB] cursor-pointer"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-sm font-medium ${
                  task.status === 'Complete'
                    ? 'text-zinc-400 line-through'
                    : 'text-zinc-900'
                }`}
              >
                {task.title}
              </span>

              {task.is_blocker && (
                <span className="inline-flex items-center gap-1 text-xs text-red-600 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  Blocked
                </span>
              )}
            </div>

            {task.description && (
              <p className="text-[13px] text-zinc-500 mt-0.5 line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Metadata: Owner & Due date */}
            <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-400 flex-wrap">
              {task.owner && (
                <span className="text-zinc-500">
                  {task.owner}
                </span>
              )}

              {task.due_date && (
                <span>
                  Due {task.due_date}
                </span>
              )}

              {task.notes && (
                <button
                  type="button"
                  onClick={() => setShowDetails(!showDetails)}
                  className="inline-flex items-center gap-0.5 text-[#3B5BDB] hover:underline cursor-pointer"
                >
                  <span>{showDetails ? 'Hide details' : 'View details'}</span>
                  {showDetails ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right side: Blocker toggle & Delete actions */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-center pl-8 sm:pl-0">
          <button
            type="button"
            onClick={handleToggleBlocker}
            disabled={updating}
            className={`text-xs px-2 py-1 rounded border transition-colors cursor-pointer ${
              task.is_blocker
                ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                : 'border-zinc-200 text-zinc-500 hover:text-zinc-800 hover:border-zinc-300'
            }`}
            title={task.is_blocker ? 'Clear blocker' : 'Mark as blocker'}
          >
            {task.is_blocker ? 'Clear blocker' : 'Mark blocker'}
          </button>

          {!showConfirmDelete ? (
            <button
              type="button"
              onClick={() => setShowConfirmDelete(true)}
              disabled={updating || deleting}
              className="text-xs text-zinc-400 hover:text-red-600 px-1.5 py-1 transition-colors cursor-pointer"
            >
              Delete
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-zinc-500">Delete?</span>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="text-red-600 hover:underline font-medium cursor-pointer"
              >
                {deleting ? 'Deleting...' : 'Yes'}
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmDelete(false)}
                disabled={deleting}
                className="text-zinc-400 hover:text-zinc-700 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Expandable Notes section */}
      {showDetails && task.notes && (
        <div className="mt-2.5 ml-8 p-3 rounded-md bg-zinc-50 border border-zinc-200 text-[13px] text-zinc-700 leading-relaxed whitespace-pre-line">
          <div className="font-medium text-zinc-800 mb-0.5">Notes:</div>
          {task.notes}
        </div>
      )}
    </div>
  );
}
