import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function BlockerBanner({ blockers = [], stages = [], onSelectStage }) {
  const hasBlockers = blockers && blockers.length > 0;

  const getStageInfo = (blocker) => {
    if (blocker.stage_id) {
      const stageObj = stages.find((s) => s.id === blocker.stage_id);
      return {
        id: blocker.stage_id,
        name: stageObj ? stageObj.name : blocker.stage || 'Development',
        order: stageObj ? stageObj.order_index : null,
      };
    }
    const stageObj = stages.find(
      (s) => s.name && blocker.stage && s.name.toLowerCase() === blocker.stage.toLowerCase()
    );
    return {
      id: stageObj ? stageObj.id : null,
      name: blocker.stage || 'Development',
      order: stageObj ? stageObj.order_index : null,
    };
  };

  return (
    <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
      {/* Header Bar */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-gray-900 tracking-tight">
              What is currently blocking this project?
            </span>
            {hasBlockers ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-red-50 text-red-700 border border-red-200">
                {blockers.length} Critical {blockers.length === 1 ? 'Blocker' : 'Blockers'}
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-forest-50 text-forest-800 border border-forest-200">
                Path Clear
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            {hasBlockers
              ? 'Deliverables flagged as critical path impediments halting milestone progression.'
              : 'All stage gates are clear with no active critical path blockers.'}
          </p>
        </div>
      </div>

      {/* Compact Table Structure */}
      {hasBlockers ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-2.5 px-4 w-28">Stage</th>
                <th className="py-2.5 px-4 w-72">Blocker</th>
                <th className="py-2.5 px-4">Schedule Impact</th>
                <th className="py-2.5 px-4 w-44">Owner</th>
                <th className="py-2.5 px-4 w-28 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {blockers.map((blocker, index) => {
                const stageInfo = getStageInfo(blocker);
                return (
                  <tr key={blocker.id || index} className="hover:bg-gray-50/60 transition-colors">
                    {/* Stage */}
                    <td className="py-3 px-4 font-medium text-gray-800 whitespace-nowrap align-top">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                        {stageInfo.name.split(' ')[0]}
                      </span>
                    </td>

                    {/* Blocker */}
                    <td className="py-3 px-4 align-top">
                      <div className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0" />
                        <div>
                          <div className="font-semibold text-gray-900 leading-snug">
                            {blocker.title}
                          </div>
                          {blocker.description && (
                            <div className="text-gray-500 text-[11px] mt-0.5">
                              {blocker.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Impact */}
                    <td className="py-3 px-4 text-gray-600 leading-relaxed align-top">
                      {blocker.notes || 'Awaiting schedule impact analysis.'}
                    </td>

                    {/* Owner */}
                    <td className="py-3 px-4 text-gray-700 font-medium whitespace-nowrap align-top">
                      {blocker.owner || <span className="text-gray-400 italic font-normal">Unassigned</span>}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right whitespace-nowrap align-top">
                      {stageInfo.id && onSelectStage && (
                        <button
                          type="button"
                          onClick={() => onSelectStage(stageInfo.id)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-forest-800 hover:text-forest-900 hover:underline cursor-pointer"
                        >
                          <span>Inspect</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-4 flex items-center gap-2.5 text-xs text-forest-800 bg-forest-50/40">
          <CheckCircle2 className="w-4 h-4 text-forest-700 shrink-0" />
          <span>
            Critical path is clear. All deliverables are advancing through development gates without critical impediments.
          </span>
        </div>
      )}
    </div>
  );
}
