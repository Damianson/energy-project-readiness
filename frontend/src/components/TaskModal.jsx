import React, { useState, useEffect } from 'react';
import { X, Calendar, User, FileText, Loader2, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050b14]/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-[#0e1624] border border-[#1e2b45] rounded-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e2b45] bg-[#101929]">
          <div>
            <h2 id="modal-title" className="text-base font-semibold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              Add Stage Deliverable
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Stage: <span className="text-emerald-400 font-medium">{stage?.name}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-[#1a263d] transition-colors disabled:opacity-50 cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="bg-rose-950/50 border border-rose-800/80 rounded-lg p-3 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Deliverable Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Interconnection Facilities Study execution"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#131d2e] border border-[#1e2b45] rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Scope / Technical Criteria
            </label>
            <textarea
              rows={2}
              placeholder="Key deliverable scope, technical requirements, or vendor criteria..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#131d2e] border border-[#1e2b45] rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors resize-none"
            />
          </div>

          {/* Status & Blocker Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Initial Status
              </label>
              <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full bg-[#131d2e] border border-[#1e2b45] rounded-lg px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="Not started">Not started</option>
                <option value="In progress">In progress</option>
                <option value="Complete">Complete</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Critical Path
              </label>
              <label className="flex items-center gap-2.5 h-[38px] px-3.5 bg-[#131d2e] border border-[#1e2b45] rounded-lg cursor-pointer hover:bg-[#182337] transition-colors">
                <input
                  type="checkbox"
                  checked={isBlocker}
                  onChange={(e) => setIsBlocker(e.target.checked)}
                  className="rounded border-slate-700 text-rose-500 focus:ring-rose-500 h-4 w-4 bg-slate-900"
                />
                <span className={`text-xs font-medium ${isBlocker ? 'text-rose-300' : 'text-slate-400'}`}>
                  {isBlocker ? 'Critical Blocker' : 'Standard deliverable'}
                </span>
              </label>
            </div>
          </div>

          {/* Owner & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Owner / Team Lead
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. Lead Electrical Engineer"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  className="w-full bg-[#131d2e] border border-[#1e2b45] rounded-lg pl-8.5 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Target Due Date
              </label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-[#131d2e] border border-[#1e2b45] rounded-lg pl-8.5 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 [color-scheme:dark]"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Deliverable Notes & Dependencies
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Utility queue study results pending Q3 review..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#131d2e] border border-[#1e2b45] rounded-lg px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#1e2b45] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-[#162134] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm shadow-emerald-950 transition-colors disabled:opacity-50 cursor-pointer"
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

