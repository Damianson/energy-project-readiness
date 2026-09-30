"""Deterministic mock AI provider for offline sales demos and reliable testing."""

from typing import Dict, Any, List
from .base import BaseAIProvider


class MockAIProvider(BaseAIProvider):
    """Deterministic mock provider that synthesizes realistic risk analysis
    directly from the supplied project context without requiring external API access.
    """

    def analyze_project(self, project_context: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze project data using context-aware deterministic heuristics."""
        project = project_context.get("project", {})
        name = project.get("name", "Renewable Energy Project")
        location = project.get("location") or "the project site"
        project_type = project.get("project_type", "Solar")
        capacity_mw = project.get("estimated_capacity_mw", 0)
        overall_readiness = project.get("overall_readiness", 0.0)

        blockers = project_context.get("blockers", [])
        in_progress = project_context.get("in_progress_tasks", [])

        # 1. Format current blockers from actual project data
        formatted_blockers = []
        blocked_stages = set()
        for b in blockers:
            stage_name = b.get("stage", "General")
            blocked_stages.add(stage_name)
            title = b.get("title", "Unspecified blocker")
            owner = b.get("owner") or "Unassigned"
            notes = b.get("notes")

            # Contextual impact analysis based on stage and notes
            if stage_name == "Grid":
                impact = "Halts Interconnection Agreement (IA) finalization; directly impacts COD timeline."
            elif stage_name == "Procurement":
                impact = "Long-lead equipment delivery delay risks EPC contractor mobilization schedule."
            elif stage_name == "Permits":
                impact = "Blocks local zoning certification and state environmental clearance."
            elif stage_name == "Commercial":
                impact = "Delays PPA execution and tax equity/debt financing closing."
            elif stage_name == "Site":
                impact = "Land control boundary ambiguities delay civil engineering and grading plans."
            else:
                impact = f"Delays milestone completion and readiness progression in {stage_name}."

            if notes:
                impact += f" Note: {notes}"

            formatted_blockers.append({
                "stage": stage_name,
                "issue": title,
                "impact": impact,
                "owner": owner,
            })

        # 2. Derive major risks based on actual blockers and active development tasks
        major_risks: List[Dict[str, str]] = []

        if any(b.get("stage") == "Grid" for b in blockers):
            major_risks.append({
                "stage": "Grid",
                "risk": "Interconnection queue cluster delays may push substation energization date",
                "priority": "High",
                "mitigation": "Request an expedited engineering restudy consultation with the regional RTO/ISO lead.",
            })

        if any(b.get("stage") == "Procurement" for b in blockers):
            major_risks.append({
                "stage": "Procurement",
                "risk": "Transformer and critical switchgear manufacturing lead times exceed project buffer",
                "priority": "High",
                "mitigation": "Authorize secondary equipment supplier reservations and lock manufacturing queue deposits.",
            })

        # Evaluate in-progress tasks for operational risks
        for task in in_progress:
            t_stage = task.get("stage", "")
            t_title = task.get("title", "")
            if t_stage == "Permits" and not any(r["stage"] == "Permits" for r in major_risks):
                major_risks.append({
                    "stage": "Permits",
                    "risk": f"Pending approval on '{t_title}' vulnerable to public hearing objections",
                    "priority": "Medium",
                    "mitigation": "Hold proactive stakeholder briefing sessions with county zoning commission staff.",
                })
            elif t_stage == "Commercial" and not any(r["stage"] == "Commercial" for r in major_risks):
                major_risks.append({
                    "stage": "Commercial",
                    "risk": f"Market curtailment and nodal basis spread variance during '{t_title}'",
                    "priority": "Medium",
                    "mitigation": "Incorporate revenue hedging and hybrid battery arbitrage into the financial model.",
                })

        # Ensure at least 2 structured risks are returned
        if len(major_risks) < 2:
            major_risks.append({
                "stage": "Construction",
                "risk": "Notice to Proceed (NTP) prerequisites unfulfilled before contractor mobilization deadline",
                "priority": "Medium",
                "mitigation": "Audit all preceding stage condition precedents 60 days before scheduled groundbreak.",
            })

        # 3. Determine recommended next actions based on current blockers & priorities
        next_actions = []
        for b in blockers:
            next_actions.append({
                "stage": b.get("stage", "General"),
                "action": f"Escalate and resolve blocker: '{b.get('title')}' with {b.get('owner') or 'stage lead'}.",
                "priority": "Immediate",
            })

        for task in in_progress[:2]:
            next_actions.append({
                "stage": task.get("stage", "General"),
                "action": f"Complete milestone deliverable: '{task.get('title')}' to increase stage readiness.",
                "priority": "High",
            })

        if not next_actions:
            next_actions.append({
                "stage": "General",
                "action": "Maintain weekly cross-functional stage cadence to prevent newly emerging blockers.",
                "priority": "Normal",
            })

        # 4. Synthesize comprehensive situational summary
        stage_summary_str = f" in {', '.join(sorted(blocked_stages))}" if blocked_stages else ""
        if blockers:
            summary = (
                f"Project '{name}' ({capacity_mw} MW {project_type} in {location}) has an overall "
                f"readiness score of {overall_readiness}%. The project critical path is currently constrained "
                f"by {len(blockers)} active blocker(s){stage_summary_str}. Immediate intervention is required "
                f"to prevent delivery and commercial operation milestone slippage."
            )
        else:
            summary = (
                f"Project '{name}' ({capacity_mw} MW {project_type} in {location}) has an overall "
                f"readiness score of {overall_readiness}% with zero active blockers. Development is proceeding "
                f"on schedule across all six stages."
            )

        return {
            "summary": summary,
            "current_blockers": formatted_blockers,
            "major_risks": major_risks,
            "recommended_next_actions": next_actions,
        }
