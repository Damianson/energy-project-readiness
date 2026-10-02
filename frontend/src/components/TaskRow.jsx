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
    badge: 'bg-slate-800 text-slate-400 border-slate-700',
    icon: Circle,
    iconColor: 'text-slate-500',
  },
  'In progress': {
    badge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    icon: Clock,
    iconColor: 'text-cyan-400',
  },
  'Complete': {
    badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    icon: CheckCircle2,
    iconColor: 'text-emerald-400',
  },
  'Blocked': {
    badge: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    icon: AlertOctagon,
    iconColor: 'text-rose-400',
  },
};

export default function TaskRow({ task, onUpdateTask, onDeleteTask }) {
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const currentStatus = task.status || 'Not started';
  const statusCfg = STATUS_CONFIG[currentStatus] || STATUS_CONFIG['Not started'];
  const StatusIcon = statusCfg.icon;

  // Handle status select change
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    if (newStatus === currentStatus) return;

    setUpdating(true);
    try {
      // Backend automatically sets is_blocker=True for 'Blocked'
      // and is_blocker=False for 'Complete' unless specified.
      await onUpdateTask(task.id, { status: newStatus });
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdating(false);
    }
  };

  // Toggle blocker flag
  const handleToggleBlocker = async () => {
    setUpdating(true);
    try {
      const nextIsBlocker = !task.is_blocker;
      const updates = { is_blocker: nextIsBlocker };
      // If setting blocker to true, optionally suggest or align with Blocked status if user wishes,
      // but let's send is_blocker explicitly as per spec
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

  // Handle delete confirmation
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
      className={`rounded-xl border transition-all duration-200 bg-slate-900/60 p-4 ${
        task.is_blocker
          ? 'border-rose-500/50 bg-rose-950/10 shadow-sm shadow-rose-950/40'
          : 'border-slate-800 hover:border-slate-700/80 hover:bg-slate-900/80'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        {/* Main Title & Meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4
              className={`text-sm font-semibold tracking-tight ${
                task.status === 'Complete'
                  ? 'text-slate-300 line-through decoration-slate-600'
                  : 'text-white'
              }`}
            >
              {task.title}
            </h4>

            {/* Blocker Flag Badge */}
            {task.is_blocker && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 tracking-wider uppercase animate-pulse">
                <AlertOctagon className="w-3 h-3 text-rose-400" />
                Active Blocker
              </span>
            )}
          </div>

          {/* Description snippet */}
          {task.description && (
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Task Metadata Row: Owner & Due Date */}
          <div className="flex items-center gap-4 mt-2.5 text-xs text-slate-400 flex-wrap">
            {task.owner ? (
              <span className="flex items-center gap-1.5 text-slate-300">
                <User className="w-3.5 h-3.5 text-slate-500" />
                {task.owner}
              </span>
            ) : (
              <span className="text-slate-500 italic">Unassigned</span>
            )}

            {task.due_date && (
              <span className="flex items-center gap-1.5 text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Due {task.due_date}
              </span>
            )}

            {task.notes && (
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-1 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
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
          {/* Status Select with custom badge appearance */}
          <div className="relative">
            {updating ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-slate-800 border border-slate-700 text-slate-400">
                <Loader2 className="w-3 h-3 animate-spin text-emerald-400" />
                Updating...
              </div>
            ) : (
              <select
                value={currentStatus}
                onChange={handleStatusChange}
                disabled={updating}
                className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer transition-colors ${statusCfg.badge}`}
              >
                <option value="Not started" className="bg-slate-900 text-slate-300">
                  Not started
                </option>
                <option value="In progress" className="bg-slate-900 text-cyan-300">
                  In progress
                </option>
                <option value="Complete" className="bg-slate-900 text-emerald-300">
                  Complete
                </option>
                <option value="Blocked" className="bg-slate-900 text-rose-300">
                  Blocked
                </option>
              </select>
            )}
          </div>

          {/* Toggle Blocker Button */}
          <button
            type="button"
            onClick={handleToggleBlocker}
            disabled={updating}
            title={task.is_blocker ? 'Clear Blocker status' : 'Flag as Critical Blocker'}
            className={`p-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
              task.is_blocker
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-rose-400 hover:border-rose-500/40'
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
              title="Delete Task"
              className="p-1.5 rounded-lg border border-slate-800 text-slate-500 hover:text-rose-400 hover:border-rose-500/40 hover:bg-rose-950/20 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-1.5 bg-rose-950/70 border border-rose-500/60 rounded-lg px-2 py-1 text-xs">
              <span className="text-rose-300 font-medium">Delete?</span>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer disabled:opacity-50"
              >
                {deleting ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Yes'}
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmDelete(false)}
                disabled={deleting}
                className="px-1.5 py-0.5 rounded text-slate-400 hover:text-white cursor-pointer"
              >
                No
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Expandable Notes Section */}
      {showDetails && task.notes && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-300 bg-slate-950/40 rounded-lg p-3">
          <div className="font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            Stage Notes / Action Plan:
          </div>
          <p className="whitespace-pre-line leading-relaxed text-slate-300">
            {task.notes}
          </p>
        </div>
      )}
    </div>
  );
}
