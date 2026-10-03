import React from 'react';

export default function ProjectSelector({ projects, selectedProjectId, onSelectProject }) {
  if (!projects || projects.length === 0) {
    return (
      <div className="text-xs text-gray-400 italic">
        No projects available
      </div>
    );
  }

  return (
    <div className="relative inline-flex items-center">
      <select
        value={selectedProjectId || ''}
        onChange={(e) => onSelectProject(Number(e.target.value))}
        className="bg-white text-gray-900 text-xs font-medium rounded pl-3 pr-7 py-1.5 border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-forest-700 focus:border-forest-700 appearance-none cursor-pointer"
      >
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} ({p.estimated_capacity_mw} MW)
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
        <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  );
}
