"""Default task templates for renewable energy project stages.

Provides 3-5 realistic starter tasks for each of the six stages:
1. Site
2. Grid
3. Permits
4. Commercial
5. Procurement
6. Construction
"""

DEFAULT_STAGE_TEMPLATES = [
    {
        "name": "Site",
        "order_index": 1,
        "tasks": [
            {
                "title": "Land control & option agreements executed",
                "description": "Secure ground lease options and landowner boundary agreements for all project parcels.",
                "status": "In progress",
                "owner": "Land Acquisition Lead",
                "is_blocker": False,
                "notes": "90% acreage under signed option; 1 parcel in probate negotiation.",
            },
            {
                "title": "ALTA title & boundary survey",
                "description": "Complete American Land Title Association boundary, easement, and right-of-way survey.",
                "status": "Not started",
                "owner": "Survey Lead",
                "is_blocker": False,
                "notes": None,
            },
            {
                "title": "Phase I Environmental Site Assessment (ESA)",
                "description": "Identify potential hazardous substances, recognized environmental conditions (RECs), and past land use.",
                "status": "Not started",
                "owner": "Environmental Consultant",
                "is_blocker": False,
                "notes": None,
            },
            {
                "title": "Geotechnical core drilling & soil resistivity study",
                "description": "Evaluate pile refusal depths, soil corrosive properties, and thermal conductivity.",
                "status": "Not started",
                "owner": "Civil Engineer",
                "is_blocker": False,
                "notes": None,
            },
        ],
    },
    {
        "name": "Grid",
        "order_index": 2,
        "tasks": [
            {
                "title": "Interconnection Request (IR) submission",
                "description": "Submit formal queue entry with designated point of interconnection (POI) and single line diagram (SLD).",
                "status": "Complete",
                "owner": "Interconnection Manager",
                "is_blocker": False,
                "notes": "Queue position assigned and validated by ISO.",
            },
            {
                "title": "System Impact Study (SIS) Phase II",
                "description": "Determine thermal overloads, short-circuit requirements, and system network upgrades.",
                "status": "Blocked",
                "owner": "Interconnection Manager",
                "is_blocker": True,
                "notes": "Regional RTO announced 6-month cluster restudy delay due to baseline generation changes.",
            },
            {
                "title": "Interconnection Facilities Agreement (IA)",
                "description": "Execute formal interconnection agreement defining network upgrade costs and schedule.",
                "status": "Not started",
                "owner": "Legal / Interconnection",
                "is_blocker": False,
                "notes": "Pending completion of SIS Phase II.",
            },
            {
                "title": "Point of Interconnection (POI) engineering package",
                "description": "Finalize 3-line diagrams, relay protection settings, and high-voltage breaker specs with utility.",
                "status": "Not started",
                "owner": "Electrical PE",
                "is_blocker": False,
                "notes": None,
            },
        ],
    },
    {
        "name": "Permits",
        "order_index": 3,
        "tasks": [
            {
                "title": "Conditional Use Permit (CUP) / Special Exception filing",
                "description": "Submit local zoning and land use development application to County Board of Commissioners.",
                "status": "In progress",
                "owner": "Permitting Manager",
                "is_blocker": False,
                "notes": "Application accepted; staff report published with minor setback conditions.",
            },
            {
                "title": "County Commissioners public hearing & zoning approval",
                "description": "Present project at public zoning board hearing and secure final unconditional CUP approval.",
                "status": "In progress",
                "owner": "Permitting Manager",
                "is_blocker": False,
                "notes": "Hearing docket scheduled for next month.",
            },
            {
                "title": "NPDES Stormwater & Erosion Control permit",
                "description": "Submit Stormwater Pollution Prevention Plan (SWPPP) to State Department of Environmental Protection.",
                "status": "Not started",
                "owner": "Environmental Consultant",
                "is_blocker": False,
                "notes": None,
            },
            {
                "title": "FAA Determination of No Hazard",
                "description": "Obtain airspace and glare hazard clearance for project structures and MET towers.",
                "status": "Complete",
                "owner": "Permitting Manager",
                "is_blocker": False,
                "notes": "No glare mitigation requested by FAA.",
            },
        ],
    },
    {
        "name": "Commercial",
        "order_index": 4,
        "tasks": [
            {
                "title": "Power Purchase Agreement (PPA) / Offtake term sheet",
                "description": "Negotiate contract terms, pricing settlement (busbar vs hub), and commercial operation guarantees.",
                "status": "In progress",
                "owner": "Commercial Director",
                "is_blocker": False,
                "notes": "Term sheet in second round of markups with corporate buyer.",
            },
            {
                "title": "Interconnection financial security posted",
                "description": "Issue letter of credit or cash deposit to utility for network upgrade construction readiness.",
                "status": "Not started",
                "owner": "Finance Manager",
                "is_blocker": False,
                "notes": "Requires board credit committee approval.",
            },
            {
                "title": "Merchant energy revenue & curtailment basis modeling",
                "description": "Run 8760 production simulation to estimate nodal basis risk and shape value.",
                "status": "Complete",
                "owner": "Origination Analyst",
                "is_blocker": False,
                "notes": "Financial model v2.4 approved by investment committee.",
            },
            {
                "title": "Tax equity & debt financing preliminary structuring",
                "description": "Engage prospective tax equity investor and term loan syndication leads.",
                "status": "Not started",
                "owner": "Finance Director",
                "is_blocker": False,
                "notes": None,
            },
        ],
    },
    {
        "name": "Procurement",
        "order_index": 5,
        "tasks": [
            {
                "title": "Tier 1 PV module supply agreement & capacity reservation",
                "description": "Issue RFP, evaluate cell technology (TOPCon / HJT), and reserve delivery slots.",
                "status": "Not started",
                "owner": "Procurement Lead",
                "is_blocker": False,
                "notes": "Evaluating 3 Tier-1 vendors with domestic content manufacturing.",
            },
            {
                "title": "Main Power Transformer (MPT) long-lead procurement",
                "description": "Order 34.5kV / 230kV generator step-up (GSU) transformer to meet delivery timeline.",
                "status": "Blocked",
                "owner": "Procurement Lead",
                "is_blocker": True,
                "notes": "Lead time exceeds 75 weeks; deposit needed immediately to lock production queue.",
            },
            {
                "title": "Inverter & BESS containerized enclosure specs finalized",
                "description": "Lock central vs string inverter architecture and liquid-cooled battery enclosure requirements.",
                "status": "Not started",
                "owner": "Electrical Engineering Lead",
                "is_blocker": False,
                "notes": None,
            },
            {
                "title": "EPC contractor RFP & shortlist selection",
                "description": "Issue balance-of-plant (BOP) and full EPC tender package to qualified EPC firms.",
                "status": "Not started",
                "owner": "Director of Construction",
                "is_blocker": False,
                "notes": None,
            },
        ],
    },
    {
        "name": "Construction",
        "order_index": 6,
        "tasks": [
            {
                "title": "Civil site mobilization & laydown yard preparation",
                "description": "Grade access entrances, install perimeter silt fencing, and set up construction trailers.",
                "status": "Not started",
                "owner": "Site Construction Manager",
                "is_blocker": False,
                "notes": "Awaiting Notice to Proceed (NTP).",
            },
            {
                "title": "Substation foundation civil works & dead-end structures",
                "description": "Excavate transformer oil containment pits, pour equipment pads, and erect steel towers.",
                "status": "Not started",
                "owner": "High Voltage Superintendent",
                "is_blocker": False,
                "notes": None,
            },
            {
                "title": "Racking, tracker assembly & DC wire harnessing",
                "description": "Drive steel piles, mount tracker torque tubes, attach modules, and pull DC string wiring.",
                "status": "Not started",
                "owner": "Mechanical Superintendent",
                "is_blocker": False,
                "notes": None,
            },
            {
                "title": "SCADA, revenue metering & NERC compliance commissioning",
                "description": "End-to-end commissioning of protective relays, revenue meters, RTUs, and remote telemetry.",
                "status": "Not started",
                "owner": "Commissioning Manager",
                "is_blocker": False,
                "notes": None,
            },
            {
                "title": "Commercial Operation Date (COD) formal declaration",
                "description": "Perform capacity performance test, achieve grid energization sign-off, and declare COD.",
                "status": "Not started",
                "owner": "Project Manager",
                "is_blocker": False,
                "notes": "Target COD milestone.",
            },
        ],
    },
]


def create_default_stages_and_tasks(project):
    """Instantiate and attach the default six stages and their starter tasks to a Project.
    
    Args:
        project: A Project SQLAlchemy model instance.
    
    Returns:
        List of created Stage model instances attached to project.stages.
    """
    from ..models import Stage, Task

    stages = []
    for stage_data in DEFAULT_STAGE_TEMPLATES:
        stage = Stage(
            name=stage_data["name"],
            order_index=stage_data["order_index"],
            project=project,
        )
        for task_data in stage_data["tasks"]:
            task = Task(
                title=task_data["title"],
                description=task_data.get("description"),
                status=task_data.get("status", "Not started"),
                owner=task_data.get("owner"),
                is_blocker=task_data.get("is_blocker", False),
                notes=task_data.get("notes"),
                stage=stage,
            )
            stage.tasks.append(task)
        stages.append(stage)
        project.stages.append(stage)
    
    return stages
