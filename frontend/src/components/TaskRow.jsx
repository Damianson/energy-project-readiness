import React, { useState } from 'react';
import {
  Trash2,
  Loader2,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const STATUS_CONFIG = {
  'Not started': {
    dot: 'bg-gray-400',
    text: 'text-gray-700',
  },
  'In progress': {
    dot: 'bg-amber-500',
    text: 'text-amber-800',
  },
  'Complete': {
    dot: 'bg-forest-600',
    text: 'text-forest-800',
  },
  'Blocked': {
    dot: 'bg-red-600',
    text: 'text-red-800',
  },
};

export default function TaskRow({ task, onUpdateTask, onDeleteTask }) {
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

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
    <>
      <tr className={`hover:bg-gray-50/70 transition-colors ${task.is_blocker ? 'bg-red-50/20' : ''}`}>
        {/* Deliverable & Scope */}
        <td className="py-3 px-3.5 align-top">
          <div className="flex items-start gap-2">
            {task.is_blocker && (
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0" title="Critical Blocker" />
            )}
            <div className="min-w-0">
              <span
                className={`font-semibold text-xs leading-snug ${
                  task.status === 'Complete'
                    ? 'text-gray-400 line-through'
                    : 'text-gray-900'
                }`}
              >
                {task.title}
              </span>
              {task.description && (
                <div className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                  {task.description}
                </div>
              )}
              {task.notes && (
                <button
                  type="button"
                  onClick={() => setShowNotes(!showNotes)}
                  className="inline-flex items-center gap-1 text-[11px] text-forest-800 hover:text-forest-900 mt-1 cursor-pointer font-medium"
                >
                  <FileText className="w-3 h-3" />
                  <span>{showNotes ? 'Hide Notes' : 'View Field Notes'}</span>
                  {showNotes ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              )}
            </div>
          </div>
        </td>

        {/* Owner */}
        <td className="py-3 px-3 align-top whitespace-nowrap text-xs text-gray-700 font-medium">
          {task.owner || <span className="text-gray-400 font-normal italic">Unassigned</span>}
        </td>

        {/* Status Dropdown */}
        <td className="py-3 px-3 align-top whitespace-nowrap">
          {updating ? (
            <div className="flex items-center gap-1 text-gray-400 text-xs">
              <Loader2 className="w-3 h-3 animate-spin text-forest-700" />
              <span>Saving...</span>
            </div>
          ) : (
            <div className="relative inline-flex items-center">
              <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot} absolute left-2 pointer-events-none`} />
              <select
                value={currentStatus}
                onChange={handleStatusChange}
                disabled={updating}
                className={`text-xs font-medium pl-5 pr-6 py-1 rounded border border-gray-300 hover:border-gray-400 bg-white focus:outline-none focus:ring-1 focus:ring-forest-700 cursor-pointer ${statusCfg.text}`}
              >
                <option value="Not started">Not started</option>
                <option value="In progress">In progress</option>
                <option value="Complete">Complete</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>
          )}
        </td>

        {/* Due Date */}
        <td className="py-3 px-3 align-top whitespace-nowrap text-xs text-gray-600">
          {task.due_date || <span className="text-gray-400 italic">None</span>}
        </td>

        {/* Critical Path Toggle */}
        <td className="py-3 px-3 align-top whitespace-nowrap">
          <button
            type="button"
            onClick={handleToggleBlocker}
            disabled={updating}
            title={task.is_blocker ? 'Click to clear blocker' : 'Click to flag as critical blocker'}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border cursor-pointer transition-colors ${
              task.is_blocker
                ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${task.is_blocker ? 'bg-red-600' : 'bg-gray-400'}`} />
            <span>{task.is_blocker ? 'Blocker' : 'Nominal'}</span>
          </button>
        </td>

        {/* Actions */}
        <td className="py-3 px-3 align-top text-right whitespace-nowrap">
          {!showConfirmDelete ? (
            <button
              type="button"
              onClick={() => setShowConfirmDelete(true)}
              disabled={updating || deleting}
              title="Delete Deliverable"
              className="text-gray-400 hover:text-red-600 p-1 rounded transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 rounded px-1.5 py-0.5 text-[11px]">
              <span className="text-red-700 font-medium">Delete?</span>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="font-semibold text-red-700 hover:text-red-900 cursor-pointer"
              >
                {deleting ? <Loader2 className="w-3 h-3 animate-spin inline" /> : 'Yes'}
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmDelete(false)}
                disabled={deleting}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                No
              </button>
            </div>
          )}
        </td>
      </tr>

      {/* Expandable Notes Row */}
      {showNotes && task.notes && (
        <tr className="bg-gray-50/50 border-b border-gray-200">
          <td colSpan={6} className="px-4 py-2.5 text-xs text-gray-700 border-l-2 border-forest-700">
            <span className="font-semibold text-gray-800 mr-2">Field Notes:</span>
            <span className="whitespace-pre-line leading-relaxed">{task.notes}</span>
          </td>
        </tr>
      )}
    </>
  );
}
