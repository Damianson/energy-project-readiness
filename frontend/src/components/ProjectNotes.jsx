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
  StickyNote,
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
    <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-6 backdrop-blur space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-700/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <StickyNote className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Project Notes & Qualitative Documents
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                {notes.length}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Engineering memos, regulatory filings, and qualitative records ingested by the AI risk engine
            </p>
          </div>
        </div>

        {/* Action button */}
        {!showAddForm && (
          <button
            type="button"
            onClick={() => {
              setShowAddForm(true);
              setError(null);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 shadow-md shadow-amber-500/20 transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project Note</span>
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-rose-950/60 border border-rose-500/50 rounded-xl p-3.5 flex items-center justify-between text-xs text-rose-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-rose-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Add Note Form */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900/90 border border-amber-500/40 rounded-xl p-5 space-y-4 shadow-lg animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-400" />
              New Project Note
            </h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. CAISO Cluster 15 Restudy Notice & Timeline Shift"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Associated Stage (Optional)
              </label>
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
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
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Note Content / Intelligence <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="Record engineering assessment, regulatory delay memo, supplier quotes, or risk observations..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              disabled={submitting}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 shadow-md shadow-amber-500/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Note'
              )}
            </button>
          </div>
        </form>
      )}

      {/* Loading state */}
      {loading && notes.length === 0 && (
        <div className="flex items-center justify-center py-8 text-slate-400 text-xs">
          <Loader2 className="w-4 h-4 animate-spin text-amber-400 mr-2" />
          Loading project notes...
        </div>
      )}

      {/* Empty State */}
      {!loading && notes.length === 0 && !showAddForm && (
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-8 text-center space-y-2">
          <StickyNote className="w-8 h-8 text-slate-600 mx-auto mb-1" />
          <h3 className="text-sm font-semibold text-slate-300">
            No Project Notes Yet
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Add memos, utility notices, or field findings. The Gemini risk engine automatically inspects these notes during analysis.
          </p>
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-400 bg-amber-950/40 border border-amber-500/30 hover:bg-amber-900/50 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add First Note
          </button>
        </div>
      )}

      {/* Notes List */}
      {!loading && notes.length > 0 && (
        <div className="space-y-3">
          {/* Filter pills if multiple stages represented */}
          {stages.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                type="button"
                onClick={() => setStageFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                  stageFilter === 'ALL'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                All ({notes.length})
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
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                      stageFilter.toLowerCase() === s.name.toLowerCase()
                        ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {s.name} ({count})
                  </button>
                );
              })}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        <Layers className="w-3 h-3" />
                        {note.stage || 'General'}
                      </span>
                    </div>

                    {note.created_at && (
                      <span className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Calendar className="w-3 h-3" />
                        {formatDate(note.created_at)}
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-white mb-2 leading-snug">
                    {note.title}
                  </h4>

                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950/40 p-3 rounded-lg border border-slate-800/80">
                    {note.content}
                  </p>
                </div>

                {/* Footer with Delete Action */}
                <div className="flex items-center justify-end pt-3 mt-3 border-t border-slate-800/80 text-xs">
                  {confirmDeleteId === note.id ? (
                    <div className="flex items-center gap-1.5 bg-rose-950/60 border border-rose-500/50 px-2 py-1 rounded-lg">
                      <span className="text-rose-300 font-medium">Delete note?</span>
                      <button
                        type="button"
                        onClick={() => handleDelete(note.id)}
                        disabled={deletingId === note.id}
                        className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer disabled:opacity-50"
                      >
                        {deletingId === note.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          'Yes'
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        disabled={deletingId === note.id}
                        className="px-1.5 py-0.5 rounded text-slate-400 hover:text-white cursor-pointer"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(note.id)}
                      title="Delete Note"
                      className="inline-flex items-center gap-1 text-slate-500 hover:text-rose-400 transition-colors p-1 rounded hover:bg-slate-800 cursor-pointer"
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

