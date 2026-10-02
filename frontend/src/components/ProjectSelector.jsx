import React from 'react';
import { Layers } from 'lucide-react';

export default function ProjectSelector({ projects, selectedProjectId, onSelectProject }) {
  if (!projects || projects.length === 0) {
    return (
      <div className="text-xs text-slate-400 italic">
        No projects available
      </div>
    );
  }

  return (
    <div className="relative inline-flex items-center">
      <Layers className="w-3.5 h-3.5 text-emerald-400 absolute left-3 pointer-events-none" />
      <select
        value={selectedProjectId || ''}
        onChange={(e) => onSelectProject(Number(e.target.value))}
        className="bg-[#131d2e] text-slate-100 text-xs font-medium rounded-lg pl-8 pr-8 py-2 border border-[#1e2b45] hover:border-slate-500 focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer transition-colors shadow-sm"
      >
        {projects.map((p) => (
          <option key={p.id} value={p.id} className="bg-[#0b1120] text-slate-200">
            {p.name} ({p.estimated_capacity_mw} MW)
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
        <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  );
}

