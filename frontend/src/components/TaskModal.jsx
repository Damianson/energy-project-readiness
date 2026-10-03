import React, { useState, useEffect } from 'react';
import { X, Loader2, Plus, AlertCircle } from 'lucide-react';

export default function TaskModal({ isOpen, onClose, onSubmit, stage }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Not started');
  const [owner, setOwner] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isBlocker, setIsBlocker] = useState(false);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setStatus('Not started');
      setOwner('');
      setDueDate('');
      setIsBlocker(false);
      setNotes('');
      setError(null);
      setSubmitting(false);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !submitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, submitting, onClose]);

  if (!isOpen) return null;

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    if (newStatus === 'Blocked') {
      setIsBlocker(true);
    } else if (newStatus === 'Complete') {
      setIsBlocker(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Deliverable title is required');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || null,
        status,
        owner: owner.trim() || null,
        due_date: dueDate || null,
        is_blocker: isBlocker,
        notes: notes.trim() || null,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create deliverable');
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-[1px] animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white border border-gray-300 rounded-md w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 bg-gray-50">
          <div>
            <h2 id="modal-title" className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-forest-800" />
              Add Stage Deliverable
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Stage: <span className="text-gray-800 font-medium">{stage?.name}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="text-gray-400 hover:text-gray-700 p-1 rounded hover:bg-gray-200/60 transition-colors disabled:opacity-50 cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-3.5 text-xs">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-2.5 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Deliverable Title <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Interconnection Facilities Study execution"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-forest-700 focus:border-forest-700"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Scope / Technical Criteria
            </label>
            <textarea
              rows={2}
              placeholder="Key deliverable scope, technical requirements, or vendor criteria..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-forest-700 focus:border-forest-700 resize-none"
            />
          </div>

          {/* Status & Blocker Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Initial Status
              </label>
              <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-forest-700 focus:border-forest-700"
              >
                <option value="Not started">Not started</option>
                <option value="In progress">In progress</option>
                <option value="Complete">Complete</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Critical Path Flag
              </label>
              <label className="flex items-center gap-2 h-[34px] px-3 bg-white border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={isBlocker}
                  onChange={(e) => setIsBlocker(e.target.checked)}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500 h-3.5 w-3.5"
                />
                <span className={`text-xs ${isBlocker ? 'text-red-700 font-semibold' : 'text-gray-600'}`}>
                  {isBlocker ? 'Critical Path Blocker' : 'Nominal Schedule'}
                </span>
              </label>
            </div>
          </div>

          {/* Owner & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Owner / Team Lead
              </label>
              <input
                type="text"
                placeholder="e.g. Electrical Engineering"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-forest-700 focus:border-forest-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Target Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-forest-700 focus:border-forest-700"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Field Notes / Dependencies
            </label>
            <textarea
              rows={2}
              placeholder="e.g. CAISO cluster study results pending Q3 review..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-forest-700 focus:border-forest-700 resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-3 py-1.5 rounded text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-medium text-white bg-forest-800 hover:bg-forest-900 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                'Save Deliverable'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
