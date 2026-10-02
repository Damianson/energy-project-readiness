import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export default function BlockersAndRisks({
  blockers = [],
  stages = [],
  analysis = null,
  onSelectStage,
}) {
  const [expandedId, setExpandedId] = useState(null);

  // 1. Prepare blockers list (from project.blockers)
  const aiBlockers = analysis?.current_blockers || [];
  const aiRisks = analysis?.major_risks || [];

  const combinedItems = [];

  // Add all active project blockers
  blockers.forEach((b, idx) => {
    // Check if AI analysis has enriched impact note for this stage/issue
    const matchedAi = aiBlockers.find(
      (ab) =>
        (ab.stage && b.stage_name && ab.stage.toLowerCase() === b.stage_name.toLowerCase()) ||
        (ab.issue && b.title && ab.issue.toLowerCase().includes(b.title.toLowerCase()))
    );

    const impact =
      matchedAi?.impact ||
      b.notes ||
      b.description ||
      'Critical path milestone pending resolution.';

    // Find stage id for navigation
    const stageObj = stages.find(
      (s) =>
        (s.name && b.stage_name && s.name.toLowerCase() === b.stage_name.toLowerCase()) ||
        s.id === b.stage_id
    );

    combinedItems.push({
      id: `blocker-${b.id || idx}`,
      type: 'blocker',
      issue: b.title || b.issue,
      stage: b.stage_name || b.stage || 'General',
      stageId: stageObj?.id,
      owner: b.owner || 'Unassigned',
      impact,
      severity: 'Blocked',
      severityColor: 'bg-red-500',
      textColor: 'text-red-700',
      details: b.notes || matchedAi?.impact || b.description || 'Deliverable is blocking stage progress.',
      mitigation: null,
    });
  });

  // Add major risks from AI analysis (deduplicating against already listed blockers)
  aiRisks.forEach((r, idx) => {
    // Avoid duplicating if the risk issue is virtually identical to an already listed blocker
    const isDuplicate = blockers.some(
      (b) => b.title && r.risk && b.title.toLowerCase().includes(r.risk.toLowerCase().slice(0, 15))
    );
    if (isDuplicate) return;

    let sev = 'Medium risk';
    let dotColor = 'bg-amber-500';
    let textColor = 'text-amber-700';

    if (r.priority === 'Immediate' || r.priority === 'High') {
      sev = 'High risk';
      dotColor = 'bg-amber-500';
      textColor = 'text-amber-800';
    } else if (r.priority === 'Low') {
      sev = 'Low risk';
      dotColor = 'bg-zinc-400';
      textColor = 'text-zinc-600';
    }

    const stageObj = stages.find(
      (s) => s.name && r.stage && s.name.toLowerCase() === r.stage.toLowerCase()
    );

    combinedItems.push({
      id: `risk-${idx}`,
      type: 'risk',
      issue: r.risk,
      stage: r.stage || 'Project-wide',
      stageId: stageObj?.id,
      owner: r.owner || 'Stage team',
      impact: r.mitigation ? 'Identified exposure requiring mitigation.' : 'Timeline or cost exposure.',
      severity: sev,
      severityColor: dotColor,
      textColor,
      details: null,
      mitigation: r.mitigation || 'Review with engineering lead and monitor status.',
    });
  });

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-zinc-900 tracking-tight">
            Blockers & risks
          </h2>
          <p className="text-[13px] text-zinc-500 mt-0.5">
            Critical path items and risk exposures across development stages
          </p>
        </div>
        <div className="text-xs text-zinc-400">
          {combinedItems.length} {combinedItems.length === 1 ? 'item' : 'items'}
        </div>
      </div>

      {/* Table */}
      {combinedItems.length === 0 ? (
        <div className="p-8 text-center text-sm text-zinc-500">
          No active blockers or risks identified. All development stages are on track.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50/75 border-b border-zinc-200 text-[13px] text-zinc-500 font-medium">
              <tr>
                <th className="py-2.5 px-6 font-medium">Issue</th>
                <th className="py-2.5 px-4 font-medium">Stage</th>
                <th className="py-2.5 px-4 font-medium">Owner</th>
                <th className="py-2.5 px-4 font-medium">Impact</th>
                <th className="py-2.5 px-4 font-medium">Severity</th>
                <th className="py-2.5 px-6 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {combinedItems.map((item) => {
                const isExpanded = expandedId === item.id;
                return (
                  <React.Fragment key={item.id}>
                    <tr className="hover:bg-zinc-50/50 transition-colors">
                      <td className="py-3 px-6 text-zinc-900 font-medium">
                        {item.issue}
                      </td>

                      <td className="py-3 px-4 text-[13px] text-zinc-600 whitespace-nowrap">
                        {item.stageId && onSelectStage ? (
                          <button
                            type="button"
                            onClick={() => onSelectStage(item.stageId)}
                            className="hover:text-[#3B5BDB] hover:underline text-left cursor-pointer"
                            title="Jump to this stage in workspace"
                          >
                            {item.stage}
                          </button>
                        ) : (
                          item.stage
                        )}
                      </td>

                      <td className="py-3 px-4 text-[13px] text-zinc-600 whitespace-nowrap">
                        {item.owner}
                      </td>

                      <td className="py-3 px-4 text-[13px] text-zinc-500 max-w-xs truncate">
                        {item.impact}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 text-xs text-zinc-700">
                          <span className={`w-1.5 h-1.5 rounded-full ${item.severityColor}`} />
                          {item.severity}
                        </span>
                      </td>

                      <td className="py-3 px-6 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => toggleExpand(item.id)}
                          className="inline-flex items-center gap-1 text-[13px] text-[#3B5BDB] hover:text-[#364fc7] font-medium cursor-pointer"
                        >
                          <span>{isExpanded ? 'Hide details' : 'View details'}</span>
                          {isExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </td>
                    </tr>

                    {/* Secondary details expander */}
                    {isExpanded && (
                      <tr className="bg-zinc-50/75">
                        <td colSpan={6} className="px-6 py-3.5 border-t border-zinc-100">
                          <div className="space-y-2 text-[13px]">
                            {item.details && (
                              <div>
                                <span className="font-medium text-zinc-700">Notes / Impact: </span>
                                <span className="text-zinc-600">{item.details}</span>
                              </div>
                            )}

                            {item.mitigation && (
                              <div>
                                <span className="font-medium text-zinc-700">Recommended mitigation: </span>
                                <span className="text-zinc-600">{item.mitigation}</span>
                              </div>
                            )}

                            {item.stageId && onSelectStage && (
                              <div className="pt-1">
                                <button
                                  type="button"
                                  onClick={() => onSelectStage(item.stageId)}
                                  className="text-xs text-[#3B5BDB] hover:underline font-medium cursor-pointer"
                                >
                                  Go to {item.stage} deliverables →
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
