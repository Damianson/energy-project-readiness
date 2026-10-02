import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Calendar,
  Layers,
  Loader2,
  AlertCircle,
  X,
  CheckCircle2,
} from 'lucide-react';

export default function ProjectNotes({
  notes = [],
  stages = [],
  loading = false,
  onCreateNote,
  onDeleteNote,
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedStage, setSelectedStage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [error, setError] = useState(null);
  const [stageFilter, setStageFilter] = useState('ALL');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Note title is required');
      return;
    }
    if (!content.trim()) {
      setError('Note content is required');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await onCreateNote({
        title: title.trim(),
        content: content.trim(),
        stage: selectedStage || null,
      });
      setTitle('');
      setContent('');
      setSelectedStage('');
      setShowAddForm(false);
    } catch (err) {
      setError(err.message || 'Failed to save note');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (noteId) => {
    setDeletingId(noteId);
    setError(null);
    try {
      await onDeleteNote(noteId);
      setConfirmDeleteId(null);
    } catch (err) {
      setError(err.message || 'Failed to delete note');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  const filteredNotes = notes.filter((n) => {
    if (stageFilter === 'ALL') return true;
    return (n.stage || '').toLowerCase() === stageFilter.toLowerCase();
  });

  return (
    <div className="bg-[#0e1624] border border-[#1e2b45] rounded-xl p-5 sm:p-6 space-y-5 shadow-sm">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1e2b45]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#131d2e] border border-[#1e2b45] flex items-center justify-center text-slate-300 shrink-0">
            <FileText className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-semibold text-white tracking-tight">
                Operations Log & Project Notes
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#131d2e] text-slate-300 border border-[#1e2b45] tabular-nums">
                {notes.length}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Engineering memos, regulatory filings, and qualitative records ingested during risk assessment.
            </p>
          </div>
        </div>

        {/* Action Button */}
        {!showAddForm && (
          <button
            type="button"
            onClick={() => {
              setShowAddForm(true);
              setError(null);
            }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors cursor-pointer self-start sm:self-auto shadow-sm shadow-emerald-950"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Note</span>
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-rose-950/40 border border-rose-800/80 rounded-lg p-3.5 flex items-center justify-between text-xs text-rose-300">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-rose-400 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Add Record Form */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-[#101929] border border-[#1e2b45] rounded-xl p-5 space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#1e2b45]">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              New Operations Note
            </h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#1a263d] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Note Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. CAISO Cluster 15 Restudy Notice & Timeline Shift"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#131d2e] border border-[#1e2b45] rounded-lg px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Associated Stage (Optional)
              </label>
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="w-full bg-[#131d2e] border border-[#1e2b45] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="">General / Project-wide</option>
                {stages.map((s) => (
                  <option key={s.id || s.name} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Note Content / Operational Details <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="Record engineering assessment, regulatory delay memo, supplier quotes, or risk observations..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-[#131d2e] border border-[#1e2b45] rounded-lg px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none leading-relaxed font-sans"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#1e2b45]">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              disabled={submitting}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-[#162134] transition-colors"
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
                  Saving Note...
                </>
              ) : (
                'Save Note'
              )}
            </button>
          </div>
        </form>
      )}

      {/* Loading State */}
      {loading && notes.length === 0 && (
        <div className="flex items-center justify-center py-8 text-slate-400 text-xs">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-400 mr-2" />
          Loading project notes...
        </div>
      )}

      {/* Empty State */}
      {!loading && notes.length === 0 && !showAddForm && (
        <div className="bg-[#101929] border border-[#1e2b45] rounded-xl p-8 text-center space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#131d2e] border border-[#1e2b45] flex items-center justify-center text-slate-400 mx-auto">
            <FileText className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="text-sm font-semibold text-white">
            No Project Notes Recorded
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Add engineering memos, utility notices, or site survey findings. The Project Intelligence risk engine automatically parses these records during analysis.
          </p>
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors cursor-pointer shadow-sm shadow-emerald-950"
          >
            <Plus className="w-4 h-4" />
            Add First Note
          </button>
        </div>
      )}

      {/* Records Ledger */}
      {!loading && notes.length > 0 && (
        <div className="space-y-4">
          {/* Stage Filter Tabs */}
          {stages.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                type="button"
                onClick={() => setStageFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  stageFilter === 'ALL'
                    ? 'bg-emerald-600/15 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white bg-[#101929] border border-[#1e2b45]'
                }`}
              >
                All Stages ({notes.length})
              </button>
              {stages.map((s) => {
                const count = notes.filter(
                  (n) => (n.stage || '').toLowerCase() === s.name.toLowerCase()
                ).length;
                if (count === 0) return null;
                return (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => setStageFilter(s.name)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      stageFilter.toLowerCase() === s.name.toLowerCase()
                        ? 'bg-emerald-600/15 text-emerald-400 border border-emerald-500/30'
                        : 'text-slate-400 hover:text-white bg-[#101929] border border-[#1e2b45]'
                    }`}
                  >
                    {s.name} ({count})
                  </button>
                );
              })}
            </div>
          )}

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="bg-[#101929] border border-[#1e2b45] hover:border-[#2a3854] rounded-xl p-4 sm:p-5 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-[#162134] text-slate-300 border border-[#22334f]">
                      <Layers className="w-3 h-3 text-slate-400" />
                      {note.stage ? note.stage : 'General / Project-wide'}
                    </span>

                    {note.created_at && (
                      <span className="flex items-center gap-1.5 text-xs text-slate-500 tabular-nums">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(note.created_at)}
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-semibold text-white mb-2 leading-snug">
                    {note.title}
                  </h4>

                  <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-[#0a101b] p-3 rounded-lg border border-[#172236] font-sans">
                    {note.content}
                  </div>
                </div>

                {/* Footer with Delete Action */}
                <div className="flex items-center justify-end pt-3 mt-3 border-t border-[#1e2b45] text-xs">
                  {confirmDeleteId === note.id ? (
                    <div className="flex items-center gap-2 bg-rose-950/40 border border-rose-900/80 px-2.5 py-1 rounded-lg">
                      <span className="text-xs text-rose-300 font-medium">Delete note?</span>
                      <button
                        type="button"
                        onClick={() => handleDelete(note.id)}
                        disabled={deletingId === note.id}
                        className="px-2 py-0.5 rounded bg-rose-700 hover:bg-rose-600 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
                      >
                        {deletingId === note.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          'Delete'
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        disabled={deletingId === note.id}
                        className="px-2 py-0.5 rounded text-slate-400 hover:text-white text-xs font-medium cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(note.id)}
                      title="Delete Note"
                      className="inline-flex items-center gap-1.5 text-slate-500 hover:text-rose-400 transition-colors p-1 rounded text-xs font-medium cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

