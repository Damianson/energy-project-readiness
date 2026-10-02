import React from 'react';
import { Database, Plus, Loader2 } from 'lucide-react';
import ProjectSelector from './ProjectSelector';

export default function Navbar({
  projects,
  selectedProjectId,
  onSelectProject,
  onLoadDemo,
  loadingDemo,
}) {
  return (
    <header className="bg-white border-b border-zinc-200 sticky top-0 z-30">
      <div className="max-w-[1100px] mx-auto px-6 h-14 flex items-center justify-between">
        {/* Brand and Project Selector */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-zinc-900 tracking-tight">
              Energy Readiness
            </span>
          </div>

          <div className="h-4 w-px bg-zinc-200" />

          <ProjectSelector
            projects={projects}
            selectedProjectId={selectedProjectId}
            onSelectProject={onSelectProject}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onLoadDemo}
            disabled={loadingDemo}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 rounded-md hover:bg-zinc-50 hover:text-zinc-900 transition-colors disabled:opacity-50 cursor-pointer"
            title="Load demo reference project"
          >
            {loadingDemo ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-500" />
            ) : (
              <Database className="w-3.5 h-3.5 text-zinc-500" />
            )}
            <span>Load demo project</span>
          </button>

          <button
            type="button"
            onClick={() => alert("Project creation will be expanded in upcoming steps. Use 'Load demo project' to explore.")}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-zinc-500" />
            <span>New project</span>
          </button>
        </div>
      </div>
    </header>
  );
}
