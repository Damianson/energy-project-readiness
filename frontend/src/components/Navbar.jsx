import React from 'react';
import { Zap, Plus, Sparkles, Loader2 } from 'lucide-react';
import ProjectSelector from './ProjectSelector';

export default function Navbar({
  projects,
  selectedProjectId,
  onSelectProject,
  onLoadDemo,
  loadingDemo,
}) {
  return (
    <header className="bg-slate-900/90 backdrop-blur border-b border-slate-800 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-tight">
                Energy Project Readiness
              </span>
              <span className="ml-2.5 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                MVP Demo
              </span>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-3">
            <ProjectSelector
              projects={projects}
              selectedProjectId={selectedProjectId}
              onSelectProject={onSelectProject}
            />

            <button
              onClick={onLoadDemo}
              disabled={loadingDemo}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg text-emerald-300 bg-emerald-950/60 border border-emerald-700/60 hover:bg-emerald-900/60 hover:border-emerald-500 transition-all shadow-sm disabled:opacity-50"
              title="Seed and select Solaria Desert Demo Project"
            >
              {loadingDemo ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              )}
              Load Demo Project
            </button>

            <button
              onClick={() => alert("Project creation form will be expanded in upcoming steps. Use 'Load Demo Project' to explore.")}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              New Project
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
