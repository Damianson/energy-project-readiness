import React, { useState } from 'react';
import {
  AlertOctagon,
  CheckCircle2,
  Clock,
  Circle,
  Calendar,
  User,
  Trash2,
  Loader2,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const STATUS_CONFIG = {
  'Not started': {
    badge: 'bg-slate-800 text-slate-300 border-slate-700',
    dot: 'bg-slate-500',
  },
  'In progress': {
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    dot: 'bg-amber-400',
  },
  'Complete': {
    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    dot: 'bg-emerald-400',
  },
  'Blocked': {
    badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    dot: 'bg-rose-400',
  },
};

export default function TaskRow({ task, onUpdateTask, onDeleteTask }) {
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const currentStatus = task.status || 'Not started';
  const statusCfg = STATUS_CONFIG[currentStatus] || STATUS_CONFIG['Not started'];

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
    <div
      className={`rounded-lg border p-3.5 transition-all shadow-sm ${
        task.is_blocker
          ? 'border-rose-500/40 bg-[#161219]'
          : 'border-[#1e2b45] hover:border-slate-500 bg-[#0e1624]'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        {/* Title, Description & Metadata */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4
              className={`text-sm font-semibold tracking-tight ${
                task.status === 'Complete'
                  ? 'text-slate-400 line-through'
                  : 'text-white'
              }`}
            >
              {task.title}
            </h4>

            {task.is_blocker && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase tracking-wide">
                <AlertOctagon className="w-3 h-3 text-rose-400" />
                Critical Blocker
              </span>
            )}
          </div>

          {task.description && (
            <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Task Metadata: Owner, Due Date & Notes Trigger */}
          <div className="flex items-center gap-4 mt-2 text-xs text-slate-400 flex-wrap">
            {task.owner ? (
              <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                <User className="w-3.5 h-3.5 text-slate-400" />
                {task.owner}
              </span>
            ) : (
              <span className="text-slate-400 italic">Unassigned</span>
            )}

            {task.due_date && (
              <span className="flex items-center gap-1.5 text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Due {task.due_date}
              </span>
            )}

            {task.notes && (
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer font-medium"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{showDetails ? 'Hide Notes' : 'View Notes'}</span>
                {showDetails ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Action Controls: Status Dropdown, Blocker Toggle, Delete */}
        <div className="flex items-center gap-2 self-start shrink-0 pt-1 sm:pt-0">
          {/* Status Select */}
          <div>
            {updating ? (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-[#131d2e] border border-[#1e2b45] text-slate-400">
                <Loader2 className="w-3 h-3 animate-spin text-emerald-400" />
                <span>Syncing</span>
              </div>
            ) : (
              <select
                value={currentStatus}
                onChange={handleStatusChange}
                disabled={updating}
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-none focus:border-emerald-500 cursor-pointer transition-colors ${statusCfg.badge}`}
              >
                <option value="Not started" className="bg-[#0b1120] text-slate-300">
                  Not started
                </option>
                <option value="In progress" className="bg-[#0b1120] text-amber-300">
                  In progress
                </option>
                <option value="Complete" className="bg-[#0b1120] text-emerald-300">
                  Complete
                </option>
                <option value="Blocked" className="bg-[#0b1120] text-rose-300">
                  Blocked
                </option>
              </select>
            )}
          </div>

          {/* Blocker Flag Toggle */}
          <button
            type="button"
            onClick={handleToggleBlocker}
            disabled={updating}
            title={task.is_blocker ? 'Clear Blocker flag' : 'Mark as Critical Path Blocker'}
            className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
              task.is_blocker
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-[#131d2e] text-slate-400 border-[#1e2b45] hover:text-rose-400 hover:border-rose-500/30'
            }`}
          >
            <AlertOctagon className="w-4 h-4" />
          </button>

          {/* Delete Action with Confirmation */}
          {!showConfirmDelete ? (
            <button
              type="button"
              onClick={() => setShowConfirmDelete(true)}
              disabled={updating || deleting}
              title="Delete Deliverable"
              className="p-1.5 rounded-lg border border-[#1e2b45] text-slate-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-1.5 bg-rose-950/80 border border-rose-500/40 rounded-lg px-2 py-0.5 text-xs">
              <span className="text-rose-300">Delete?</span>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="px-1.5 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-semibold cursor-pointer disabled:opacity-50"
              >
                {deleting ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Yes'}
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmDelete(false)}
                disabled={deleting}
                className="px-1 py-0.5 rounded text-slate-400 hover:text-white cursor-pointer"
              >
                No
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Expandable Notes Panel */}
      {showDetails && task.notes && (
        <div className="mt-3 pt-3 border-t border-[#1e2b45] text-xs text-slate-300 bg-[#131d2e] border border-[#1e2b45] rounded-lg p-3">
          <div className="font-semibold text-emerald-400 mb-1 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            Deliverable Notes & Mitigation Plan:
          </div>
          <p className="whitespace-pre-line leading-relaxed text-slate-300">
            {task.notes}
          </p>
        </div>
      )}
    </div>
  );
}

