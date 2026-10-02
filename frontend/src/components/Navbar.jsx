import React from 'react';
import { Zap, Plus, Database, Loader2 } from 'lucide-react';
import ProjectSelector from './ProjectSelector';

export default function Navbar({
  projects,
  selectedProjectId,
  onSelectProject,
  onLoadDemo,
  loadingDemo,
}) {
  return (
    <header className="bg-[#0b1120]/95 backdrop-blur-md border-b border-[#1e2b45] sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Project Controls Badge */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base text-white tracking-tight">
                Energy Project Readiness
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Clean Energy Platform
              </span>
            </div>
          </div>

          {/* Project Selector & Actions */}
          <div className="flex items-center gap-3">
            <ProjectSelector
              projects={projects}
              selectedProjectId={selectedProjectId}
              onSelectProject={onSelectProject}
            />

            <button
              type="button"
              onClick={onLoadDemo}
              disabled={loadingDemo}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
              title="Load demo reference project (Solaria Desert)"
            >
              {loadingDemo ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              ) : (
                <Database className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span>Load Demo Data</span>
            </button>

            <button
              type="button"
              onClick={() => alert("Project creation form will be expanded in upcoming steps. Use 'Load Demo Data' to explore.")}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-300 bg-[#131d2e] hover:bg-[#182438] border border-[#1e2b45] hover:border-slate-500 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-slate-400" />
              <span>New Project</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

