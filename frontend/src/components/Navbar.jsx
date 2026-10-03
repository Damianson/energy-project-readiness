import React from 'react';
import { Plus, Database, Loader2, Play } from 'lucide-react';
import ProjectSelector from './ProjectSelector';

export default function Navbar({
  projects,
  selectedProjectId,
  onSelectProject,
  onLoadDemo,
  loadingDemo,
  onAnalyzeRisks,
  isAnalyzing,
}) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Left: Product Name & Project Selector */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-forest-800 flex items-center justify-center text-white shrink-0">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <span className="font-semibold text-sm text-gray-900 tracking-tight">
                Energy Project Readiness
              </span>
            </div>

            <div className="hidden sm:block h-4 w-px bg-gray-200" />

            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Project:</span>
              <ProjectSelector
                projects={projects}
                selectedProjectId={selectedProjectId}
                onSelectProject={onSelectProject}
              />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2.5">
            <div className="sm:hidden">
              <ProjectSelector
                projects={projects}
                selectedProjectId={selectedProjectId}
                onSelectProject={onSelectProject}
              />
            </div>

            <button
              type="button"
              onClick={onLoadDemo}
              disabled={loadingDemo}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-900 transition-colors disabled:opacity-50 cursor-pointer"
              title="Reset or load sample reference project"
            >
              {loadingDemo ? (
                <Loader2 className="w-3 h-3 animate-spin text-gray-500" />
              ) : (
                <Database className="w-3 h-3 text-gray-500" />
              )}
              <span className="hidden md:inline">Sample Data</span>
            </button>

            <button
              type="button"
              onClick={() => alert("New project creation wizard will be available in future releases. Please use existing project or Sample Data.")}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-gray-500" />
              <span>New Project</span>
            </button>

            {onAnalyzeRisks && (
              <button
                type="button"
                onClick={onAnalyzeRisks}
                disabled={isAnalyzing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded text-white bg-forest-800 hover:bg-forest-900 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-current" />
                    <span>Run Risk Assessment</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
