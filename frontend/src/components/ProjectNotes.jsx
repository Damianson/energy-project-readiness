import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Calendar,
  Layers,
  Loader2,
  AlertCircle,
  X,
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
      setError('Record title is required');
      return;
    }
    if (!content.trim()) {
      setError('Record content is required');
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
      setError(err.message || 'Failed to save record');
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
      setError(err.message || 'Failed to delete record');
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
    <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
      {/* Header Bar */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-gray-900 tracking-tight">
              Engineering Log & Project Records
            </h2>
            <span className="px-1.5 py-0.5 rounded text-[11px] font-semibold bg-gray-200 text-gray-700 tabular-nums">
              {notes.length}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Technical memos, regulatory filings, and qualitative records ingested during risk assessment.
          </p>
        </div>

        {/* Action Button */}
        {!showAddForm && (
          <button
            type="button"
            onClick={() => {
              setShowAddForm(true);
              setError(null);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-white bg-forest-800 hover:bg-forest-900 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Record</span>
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border-b border-red-200 flex items-center justify-between text-xs text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-red-700 hover:text-red-900 p-0.5 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Add Record Form */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="p-4 bg-gray-50 border-b border-gray-200 space-y-3 text-xs"
        >
          <div className="flex items-center justify-between pb-2 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-forest-800" />
              New Log Entry
            </h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-gray-400 hover:text-gray-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-gray-700 mb-1">
                Record Title <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. CAISO Cluster 15 Restudy Notice & Timeline Shift"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-forest-700 focus:border-forest-700"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Associated Stage (Optional)
              </label>
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded px-2 py-1.5 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-forest-700 focus:border-forest-700"
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
            <label className="block font-semibold text-gray-700 mb-1">
              Record Content / Details <span className="text-red-600">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="Record engineering assessment, regulatory delay memo, supplier quotes, or risk observations..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-forest-700 focus:border-forest-700 resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              disabled={submitting}
              className="px-3 py-1.5 rounded text-xs font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-white bg-forest-800 hover:bg-forest-900 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving Record...
                </>
              ) : (
                'Save Record'
              )}
            </button>
          </div>
        </form>
      )}

      {/* Loading State */}
      {loading && notes.length === 0 && (
        <div className="py-8 text-center text-xs text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin text-forest-800 mx-auto mb-1.5" />
          Loading project records...
        </div>
      )}

      {/* Empty State */}
      {!loading && notes.length === 0 && !showAddForm && (
        <div className="p-8 text-center space-y-2">
          <h3 className="text-xs font-semibold text-gray-800">
            No Project Records Logged
          </h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Log engineering memos, utility notices, or site survey findings. The Project Risk Assessment engine automatically reads these records during analysis.
          </p>
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-white bg-forest-800 hover:bg-forest-900 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add First Entry
          </button>
        </div>
      )}

      {/* Records Ledger / Table */}
      {!loading && notes.length > 0 && (
        <div className="p-4 sm:p-5 space-y-3">
          {/* Stage Filter Tabs */}
          {stages.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                type="button"
                onClick={() => setStageFilter('ALL')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  stageFilter === 'ALL'
                    ? 'bg-gray-200 text-gray-900 font-semibold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                All Records ({notes.length})
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
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                      stageFilter.toLowerCase() === s.name.toLowerCase()
                        ? 'bg-forest-100 text-forest-800 font-semibold'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {s.name} ({count})
                  </button>
                );
              })}
            </div>
          )}

          {/* Records Table / Register */}
          <div className="border border-gray-200 rounded-md overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-2.5 px-3.5 w-32">Date</th>
                  <th className="py-2.5 px-3 w-40">Stage</th>
                  <th className="py-2.5 px-3 w-60">Record Title</th>
                  <th className="py-2.5 px-3">Content / Details</th>
                  <th className="py-2.5 px-3 w-16 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredNotes.map((note) => (
                  <tr key={note.id} className="hover:bg-gray-50/70 transition-colors">
                    {/* Date */}
                    <td className="py-3 px-3.5 text-gray-500 whitespace-nowrap align-top tabular-nums">
                      {formatDate(note.created_at)}
                    </td>

                    {/* Stage */}
                    <td className="py-3 px-3 text-gray-700 whitespace-nowrap align-top">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-700">
                        {note.stage ? note.stage : 'General'}
                      </span>
                    </td>

                    {/* Title */}
                    <td className="py-3 px-3 font-semibold text-gray-900 align-top">
                      {note.title}
                    </td>

                    {/* Content */}
                    <td className="py-3 px-3 text-gray-700 leading-relaxed align-top whitespace-pre-line">
                      {note.content}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 align-top text-right whitespace-nowrap">
                      {confirmDeleteId === note.id ? (
                        <div className="inline-flex items-center gap-1 bg-red-50 border border-red-200 rounded px-1.5 py-0.5 text-[11px]">
                          <span className="text-red-700 font-medium">Delete?</span>
                          <button
                            type="button"
                            onClick={() => handleDelete(note.id)}
                            disabled={deletingId === note.id}
                            className="font-semibold text-red-700 hover:text-red-900 cursor-pointer"
                          >
                            {deletingId === note.id ? (
                              <Loader2 className="w-3 h-3 animate-spin inline" />
                            ) : (
                              'Yes'
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            disabled={deletingId === note.id}
                            className="text-gray-500 hover:text-gray-700 cursor-pointer"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(note.id)}
                          title="Delete Record"
                          className="text-gray-400 hover:text-red-600 p-1 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
