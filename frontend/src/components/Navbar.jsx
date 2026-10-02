import React from 'react';
import { Activity, Plus, Database, Loader2 } from 'lucide-react';
import ProjectSelector from './ProjectSelector';

export default function Navbar({
  projects,
  selectedProjectId,
  onSelectProject,
  onLoadDemo,
  loadingDemo,
}) {
  return (
    <header className="bg-[#101520] border-b border-[#1f283d] sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Industrial Brand Mark & Ops Identifier */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[#161d2c] border border-[#28344e] flex items-center justify-center text-emerald-400 shrink-0">
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-center gap-2.5">
              <span className="font-semibold text-sm sm:text-base text-slate-100 tracking-tight uppercase">
                Energy Project Readiness
              </span>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-[#161d2c] text-emerald-400 border border-emerald-900/60">
                Ops Control
              </span>
            </div>
          </div>

          {/* Operations Action Bar */}
          <div className="flex items-center gap-2.5">
            <ProjectSelector
              projects={projects}
              selectedProjectId={selectedProjectId}
              onSelectProject={onSelectProject}
            />

            <button
              type="button"
              onClick={onLoadDemo}
              disabled={loadingDemo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-md text-emerald-400 bg-[#141b27] border border-emerald-800/60 hover:bg-[#1a2333] hover:border-emerald-700 transition-colors disabled:opacity-50 cursor-pointer"
              title="Seed and select Solaria Desert Demo Project"
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
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-md text-slate-300 bg-[#161d2c] hover:bg-[#1f283d] border border-[#28344e] transition-colors cursor-pointer"
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
