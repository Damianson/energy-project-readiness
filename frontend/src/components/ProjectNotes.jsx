import React, { useState } from 'react';
import { Plus, Trash2, X, Loader2 } from 'lucide-react';

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
      setError('Title is required');
      return;
    }
    if (!content.trim()) {
      setError('Content is required');
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
    <div className="bg-white border border-zinc-200 rounded-lg p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200">
        <div>
          <h2 className="text-base font-semibold text-zinc-900 tracking-tight">
            Project notes
          </h2>
          <p className="text-[13px] text-zinc-500 mt-0.5">
            Field observations, regulatory filings, and qualitative records included in the risk evaluation
          </p>
        </div>

        {!showAddForm && (
          <button
            type="button"
            onClick={() => {
              setShowAddForm(true);
              setError(null);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 rounded-md hover:bg-zinc-50 hover:text-zinc-900 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5 text-zinc-500" />
            <span>Add note</span>
          </button>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-800"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Add Note Form */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="p-4 bg-zinc-50 border border-zinc-200 rounded-md space-y-3"
        >
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
            <h3 className="text-sm font-medium text-zinc-900">
              New project note
            </h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-zinc-400 hover:text-zinc-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[13px] font-medium text-zinc-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. CAISO Cluster 15 restudy notice"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white border border-zinc-300 rounded-md px-3 py-1.5 text-sm text-zinc-900 focus:outline-none focus:border-[#3B5BDB]"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-zinc-700 mb-1">
                Stage (optional)
              </label>
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="w-full bg-white border border-zinc-300 rounded-md px-3 py-1.5 text-sm text-zinc-900 focus:outline-none focus:border-[#3B5BDB]"
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
            <label className="block text-[13px] font-medium text-zinc-700 mb-1">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="Record findings, regulatory memos, or risk observations..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-white border border-zinc-300 rounded-md px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-[#3B5BDB] resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-200">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              disabled={submitting}
              className="px-3 py-1.5 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 rounded-md hover:bg-zinc-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-[#3B5BDB] hover:bg-[#364fc7] rounded-md transition-colors disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  <span>Saving...</span>
                </>
              ) : (
                'Save note'
              )}
            </button>
          </div>
        </form>
      )}

      {/* Loading state */}
      {loading && notes.length === 0 && (
        <div className="py-6 text-center text-xs text-zinc-400">
          Loading project notes...
        </div>
      )}

      {/* Empty State */}
      {!loading && notes.length === 0 && !showAddForm && (
        <div className="py-8 text-center text-sm text-zinc-500 border border-dashed border-zinc-200 rounded-md">
          <p>No project notes recorded yet.</p>
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="mt-1 text-xs text-[#3B5BDB] hover:underline font-medium cursor-pointer"
          >
            Add first note
          </button>
        </div>
      )}

      {/* Notes List */}
      {!loading && notes.length > 0 && (
        <div className="space-y-3">
          {/* Stage Filter tabs */}
          {stages.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                type="button"
                onClick={() => setStageFilter('ALL')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  stageFilter === 'ALL'
                    ? 'bg-zinc-100 text-zinc-900 font-medium'
                    : 'text-zinc-500 hover:text-zinc-800'
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
                    className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                      stageFilter.toLowerCase() === s.name.toLowerCase()
                        ? 'bg-zinc-100 text-zinc-900 font-medium'
                        : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    {s.name} ({count})
                  </button>
                );
              })}
            </div>
          )}

          {/* List items */}
          <div className="divide-y divide-zinc-100 border-t border-b border-zinc-100">
            {filteredNotes.map((note) => (
              <div key={note.id} className="py-3 px-1 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-zinc-900">
                      {note.title}
                    </span>
                    {note.stage && (
                      <span className="text-xs text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded">
                        {note.stage}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-zinc-400">
                    {note.created_at && (
                      <span>{formatDate(note.created_at)}</span>
                    )}

                    {confirmDeleteId === note.id ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-zinc-600">Delete?</span>
                        <button
                          type="button"
                          onClick={() => handleDelete(note.id)}
                          disabled={deletingId === note.id}
                          className="text-red-600 hover:underline font-medium cursor-pointer"
                        >
                          {deletingId === note.id ? 'Deleting...' : 'Yes'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-zinc-400 hover:text-zinc-700 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(note.id)}
                        className="text-zinc-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Delete note"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-[13px] text-zinc-600 leading-relaxed whitespace-pre-line">
                  {note.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
