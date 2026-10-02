import React, { useState, useEffect } from 'react';
import { X, AlertOctagon, CheckCircle2, Calendar, User, FileText, Loader2, Plus } from 'lucide-react';

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
      setError('Task title is required');
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
      setError(err.message || 'Failed to create task');
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-[#121722] border border-[#232f46] rounded-md w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1f283d] bg-[#10141e]">
          <div>
            <h2 id="modal-title" className="text-sm font-bold text-white flex items-center gap-2 font-mono uppercase tracking-tight">
              <Plus className="w-4 h-4 text-emerald-400" />
              Register Stage Deliverable
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Stage: <span className="text-emerald-400 font-semibold">{stage?.name}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-[#1a2233] transition-colors disabled:opacity-50 cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-3.5">
          {error && (
            <div className="bg-rose-950/80 border border-rose-800 rounded p-2.5 text-xs font-mono text-rose-300">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-mono font-semibold text-slate-300 mb-1 uppercase tracking-wider">
              Deliverable Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Interconnection Facilities Study execution"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#0d121b] border border-[#222c3f] rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-mono font-semibold text-slate-300 mb-1 uppercase tracking-wider">
              Scope / Engineering Criteria
            </label>
            <textarea
              rows={2}
              placeholder="Key deliverable details, criteria or vendor scope..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#0d121b] border border-[#222c3f] rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
            />
          </div>

          {/* Status & Blocker Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full bg-[#0d121b] border border-[#222c3f] rounded px-2.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Not started">Not started</option>
                <option value="In progress">In progress</option>
                <option value="Complete">Complete</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                Critical Path Flag
              </label>
              <label className="flex items-center gap-2 h-[34px] px-3 bg-[#0d121b] border border-[#222c3f] rounded cursor-pointer hover:bg-[#151c2a] transition-colors">
                <input
                  type="checkbox"
                  checked={isBlocker}
                  onChange={(e) => setIsBlocker(e.target.checked)}
                  className="rounded border-slate-700 text-rose-500 focus:ring-rose-500 h-3.5 w-3.5 bg-slate-900"
                />
                <span className={`text-xs font-mono ${isBlocker ? 'text-rose-400 font-bold' : 'text-slate-400'}`}>
                  {isBlocker ? 'Critical Path Blocker' : 'Nominal Schedule'}
                </span>
              </label>
            </div>
          </div>

          {/* Owner & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                Owner / Lead
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. Electrical Engineering"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  className="w-full bg-[#0d121b] border border-[#222c3f] rounded pl-8 pr-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                Target Due Date
              </label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5 pointer-events-none" />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-[#0d121b] border border-[#222c3f] rounded pl-8 pr-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500 [color-scheme:dark]"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-mono font-semibold text-slate-300 mb-1 uppercase tracking-wider">
              Field Notes / Dependency Log
            </label>
            <textarea
              rows={2}
              placeholder="e.g. CAISO cluster study results pending Q3 review..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#0d121b] border border-[#222c3f] rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#1f283d] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-3 py-1.5 rounded text-xs font-mono text-slate-400 hover:text-white hover:bg-[#161f30] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-mono font-semibold text-emerald-400 bg-[#162132] hover:bg-[#1d2a3f] border border-emerald-800/80 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Committing...</span>
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
