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
    <div className="bg-[#111622] border border-[#222d42] rounded-md p-5 space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1e273a]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#161f2e] border border-[#26354f] flex items-center justify-center text-slate-300 shrink-0">
            <FileText className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-mono font-bold tracking-wider uppercase text-slate-200">
                Operations Log & Qualitative Records
              </h2>
              <span className="px-1.5 py-0.5 rounded text-[11px] font-mono font-bold bg-[#17202f] text-slate-300 border border-[#26354f] tabular-nums">
                {notes.length}
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5">
              Engineering memos, regulatory filings, and qualitative records ingested by risk assessment models.
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
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium text-slate-200 hover:text-white bg-[#161f2e] hover:bg-[#1e2b40] border border-[#2a3854] transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Record Entry</span>
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-rose-950/60 border border-rose-800/80 rounded p-3 flex items-center justify-between text-xs font-mono text-rose-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-rose-400 hover:text-white p-0.5 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Add Record Form */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-[#0e131d] border border-[#2a3854] rounded-md p-4 space-y-3"
        >
          <div className="flex items-center justify-between pb-2 border-b border-[#1c2637]">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              New Operations Log Entry
            </h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-slate-400 hover:text-white p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase mb-1">
                Entry Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. CAISO Cluster 15 Restudy Notice & Timeline Shift"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#131924] border border-[#26354f] focus:border-emerald-500 rounded px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase mb-1">
                Associated Stage (Optional)
              </label>
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="w-full bg-[#131924] border border-[#26354f] focus:border-emerald-500 rounded px-2 py-1.5 text-xs text-white focus:outline-none font-mono"
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
            <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase mb-1">
              Record Content / Operational Detail <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="Record engineering assessment, regulatory delay memo, supplier quotes, or risk observations..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-[#131924] border border-[#26354f] focus:border-emerald-500 rounded px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none resize-none leading-relaxed font-sans"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1c2637]">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              disabled={submitting}
              className="px-3 py-1.5 rounded text-xs font-mono text-slate-400 hover:text-white bg-[#141b27] border border-[#222d42] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium text-white bg-emerald-700 hover:bg-emerald-600 border border-emerald-600 transition-colors disabled:opacity-50 cursor-pointer"
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
        <div className="flex items-center justify-center py-6 text-slate-400 text-xs font-mono">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-400 mr-2" />
          Loading project log records...
        </div>
      )}

      {/* Empty State */}
      {!loading && notes.length === 0 && !showAddForm && (
        <div className="bg-[#0e131d] border border-[#1e273a] rounded p-6 text-center space-y-2">
          <FileText className="w-6 h-6 text-slate-600 mx-auto" />
          <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
            No Operational Records Logged
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Log engineering memos, utility notices, or site survey findings. The Project Intelligence risk engine automatically parses these records during analysis.
          </p>
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium text-emerald-400 bg-[#141d1a] border border-emerald-800/60 hover:bg-[#182622] transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Record Initial Entry
          </button>
        </div>
      )}

      {/* Records Ledger */}
      {!loading && notes.length > 0 && (
        <div className="space-y-3">
          {/* Stage Filter Tabs */}
          {stages.length > 0 && (
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
              <button
                type="button"
                onClick={() => setStageFilter('ALL')}
                className={`px-2 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                  stageFilter === 'ALL'
                    ? 'bg-[#1e293b] text-white border border-[#334155]'
                    : 'text-slate-400 hover:text-white bg-[#121824] border border-[#1e273a]'
                }`}
              >
                ALL ({notes.length})
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
                    className={`px-2 py-1 rounded text-[11px] font-mono uppercase transition-colors cursor-pointer ${
                      stageFilter.toLowerCase() === s.name.toLowerCase()
                        ? 'bg-[#1e293b] text-emerald-400 border border-emerald-600/40'
                        : 'text-slate-400 hover:text-white bg-[#121824] border border-[#1e273a]'
                    }`}
                  >
                    {s.name} ({count})
                  </button>
                );
              })}
            </div>
          )}

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="bg-[#141b27] border border-[#222d42] hover:border-[#2a3854] rounded-md p-3.5 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#1a2336] text-slate-300 border border-[#2c3b58]">
                      <Layers className="w-3 h-3 text-slate-400" />
                      {note.stage ? note.stage.toUpperCase() : 'GENERAL / OVERALL'}
                    </span>

                    {note.created_at && (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-slate-500 tabular-nums">
                        <Calendar className="w-3 h-3" />
                        {formatDate(note.created_at)}
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs sm:text-sm font-semibold text-white mb-2 leading-snug">
                    {note.title}
                  </h4>

                  <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-[#0d121c] p-2.5 rounded border border-[#1b2334] font-sans">
                    {note.content}
                  </div>
                </div>

                {/* Footer with Delete Action */}
                <div className="flex items-center justify-end pt-2.5 mt-2.5 border-t border-[#1e273a] text-xs">
                  {confirmDeleteId === note.id ? (
                    <div className="flex items-center gap-1.5 bg-[#201015] border border-rose-900/80 px-2 py-0.5 rounded">
                      <span className="text-[11px] font-mono text-rose-300">Delete record?</span>
                      <button
                        type="button"
                        onClick={() => handleDelete(note.id)}
                        disabled={deletingId === note.id}
                        className="px-1.5 py-0.5 rounded bg-rose-700 hover:bg-rose-600 text-white font-mono text-[10px] cursor-pointer disabled:opacity-50"
                      >
                        {deletingId === note.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          'CONFIRM'
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        disabled={deletingId === note.id}
                        className="px-1 py-0.5 rounded text-slate-400 hover:text-white font-mono text-[10px] cursor-pointer"
                      >
                        CANCEL
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(note.id)}
                      title="Delete Record"
                      className="inline-flex items-center gap-1 text-slate-500 hover:text-rose-400 transition-colors p-1 rounded font-mono text-[11px] cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
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

