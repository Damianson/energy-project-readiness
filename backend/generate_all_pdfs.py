"""
High-Fidelity PDF Generator for Energy Project Readiness Platform
Generates two comprehensive executive publications:
1. Energy_Project_Readiness_User_Guide_Walkthrough.pdf
2. Energy_Project_Readiness_Architecture_Code_Review_Guide.pdf
"""

import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfgen import canvas

# ==============================================================================
# NUMBERED CANVAS FOR DYNAMIC PAGE X OF Y & RUNNING HEADERS
# ==============================================================================
class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        if self._pageNumber == 1:
            # Suppress headers/footers on Cover Page
            return

        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#475569"))

        # Running Header
        doc_title = getattr(self, "doc_title", "ENERGY PROJECT READINESS OPERATIONS CONTROL")
        self.drawString(54, 750, doc_title.upper())
        self.setFont("Helvetica", 8)
        self.drawRightString(558, 750, "RENEWABLE ASSET OPERATIONS PLATFORM")
        
        # Header separator line
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.75)
        self.line(54, 742, 558, 742)

        # Running Footer
        self.line(54, 45, 558, 45)
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        self.drawString(54, 32, "CONFIDENTIAL & PROPRIETARY — ENERGY PROJECT READINESS CONTROL CENTER")
        
        # Page Number Right Aligned
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 32, page_text)
        self.restoreState()


class UserGuideCanvas(NumberedCanvas):
    doc_title = "ENERGY PROJECT READINESS — OPERATIONS MANUAL & FEATURE GUIDE"


class ArchitectureCanvas(NumberedCanvas):
    doc_title = "ENERGY PROJECT READINESS — SYSTEM ARCHITECTURE & CODE REVIEW GUIDE"


# ==============================================================================
# STYLE SETUP
# ==============================================================================
def setup_custom_styles():
    styles = getSampleStyleSheet()

    # Palette
    c_primary = colors.HexColor("#0f172a")     # Deep Slate
    c_secondary = colors.HexColor("#1e293b")   # Dark Navy
    c_accent = colors.HexColor("#059669")      # Emerald 600
    c_text = colors.HexColor("#334155")        # Slate 700
    c_muted = colors.HexColor("#64748b")       # Slate 500

    styles.add(ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=28,
        leading=34,
        textColor=colors.HexColor("#0f172a"),
        alignment=0, # Left-aligned
        spaceAfter=10
    ))

    styles.add(ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=13,
        leading=18,
        textColor=colors.HexColor("#475569"),
        alignment=0,
        spaceAfter=25
    ))

    styles.add(ParagraphStyle(
        'CoverBadge',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#047857"),
        spaceAfter=12
    ))

    styles.add(ParagraphStyle(
        'CoverMeta',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=14,
        textColor=colors.HexColor("#64748b"),
    ))

    styles.add(ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor("#0f172a"),
        spaceBefore=18,
        spaceAfter=8,
        keepWithNext=True
    ))

    styles.add(ParagraphStyle(
        'SectionH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#1e293b"),
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    ))

    styles.add(ParagraphStyle(
        'SectionH3',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#334155"),
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    ))

    styles.add(ParagraphStyle(
        'CustomBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=c_text,
        spaceAfter=7
    ))

    styles.add(ParagraphStyle(
        'CustomBullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13.5,
        textColor=c_text,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=4
    ))

    styles.add(ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13.5,
        textColor=colors.HexColor("#1e293b")
    ))

    styles.add(ParagraphStyle(
        'CalloutTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor("#0f172a"),
        spaceAfter=3
    ))

    styles.add(ParagraphStyle(
        'CodeSnippet',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#0f172a")
    ))

    styles.add(ParagraphStyle(
        'TableHead',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#ffffff"),
        alignment=0
    ))

    styles.add(ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor("#1e293b"),
        alignment=0
    ))

    styles.add(ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor("#0f172a"),
        alignment=0
    ))

    styles.add(ParagraphStyle(
        'TableCellMono',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8,
        leading=10.5,
        textColor=colors.HexColor("#047857"),
        alignment=0
    ))

    styles.add(ParagraphStyle(
        'QAQuestion',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#0f172a"),
        spaceBefore=10,
        spaceAfter=3,
        keepWithNext=True
    ))

    styles.add(ParagraphStyle(
        'QAAnswer',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13.5,
        textColor=c_text,
        spaceAfter=8
    ))

    return styles


# ==============================================================================
# HELPER FLOWABLE BUILDERS
# ==============================================================================
def make_callout(title, text, styles, box_type="info"):
    bg_map = {
        "info": ("#f1f5f9", "#cbd5e1", "#0284c7"),      # Slate / Cyan
        "success": ("#f0fdf4", "#bbf7d0", "#16a34a"),   # Emerald
        "warning": ("#fffbeb", "#fef3c7", "#d97706"),   # Amber
        "danger": ("#fef2f2", "#fecaca", "#dc2626")     # Rose
    }
    bg, border, accent = bg_map.get(box_type, bg_map["info"])

    content = [
        Paragraph(f"<font color='{accent}'><b>{title.upper()}</b></font>", styles['CalloutTitle']),
        Paragraph(text, styles['CalloutText'])
    ]

    t = Table([[content]], colWidths=[504])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor(bg)),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor(border)),
        ('LINEBEFORE', (0,0), (0,-1), 4, colors.HexColor(accent)),
        ('TOPPADDING', (0,0), (-1,-1), 7),
        ('BOTTOMPADDING', (0,0), (-1,-1), 7),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    return t


def make_code_box(code_str, styles):
    content = Paragraph(code_str.replace("\n", "<br/>").replace(" ", "&nbsp;"), styles['CodeSnippet'])
    t = Table([[content]], colWidths=[504])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('BOX', (0,0), (-1,-1), 0.75, colors.HexColor("#cbd5e1")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    return t


# ==============================================================================
# DOCUMENT 1: USER GUIDE & OPERATIONAL WALKTHROUGH
# ==============================================================================
def build_user_guide_pdf(output_path):
    styles = setup_custom_styles()
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    story = []

    # --- COVER PAGE ---
    story.append(Spacer(1, 40))
    story.append(Paragraph("OPERATIONS MANUAL & FEATURE GUIDE", styles['CoverBadge']))
    story.append(Paragraph("Energy Project Readiness<br/>Control Center", styles['CoverTitle']))
    story.append(Paragraph(
        "A comprehensive operational guide to tracking development milestones, evaluating stage-gate readiness, "
        "resolving critical-path blockers, and synthesizing qualitative project intelligence for utility-scale solar and BESS assets.",
        styles['CoverSubtitle']
    ))
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor("#059669"), spaceBefore=0, spaceAfter=20))

    meta_text = """
    <b>Document Version:</b> 1.0.0 (Production Release)<br/>
    <b>Classification:</b> Operational Standard Operating Procedure (SOP)<br/>
    <b>Target Roles:</b> Renewable Project Managers, Interconnection Directors, EPC Leads, Investment Committees<br/>
    <b>Platform Architecture:</b> Flask REST Backend + React Vite Dashboard + Google Gemini Risk Engine<br/>
    <b>Reference Asset:</b> Solaria Desert Solar + BESS (150 MW PV / 60 MWh Energy Storage)
    """
    story.append(Paragraph(meta_text, styles['CoverMeta']))
    story.append(Spacer(1, 40))

    toc_data = [
        ["Section", "Title", "Core Operational Focus"],
        ["01", "Executive Mission & Industry Context", "Why clean energy projects stall & how deterministic readiness solves it"],
        ["02", "Control Center Interface & Navigation", "Platform navigation, project selection, and reference data seeding"],
        ["03", "Asset Metadata & Telemetry Readouts", "Capacity ratings (MW / MWh), location telemetry, and readiness formula"],
        ["04", "Critical Path Blocker Register", "Identifying true schedule impediments vs. standard pending deliverables"],
        ["05", "The 6-Stage Lifecycle Progression Rail", "Sequential gates: Site, Grid, Permits, Commercial, Procurement, Construction"],
        ["06", "Interactive Deliverables Ledger", "Task status transitions, critical blocker toggles, task creation & deletion"],
        ["07", "Project Intelligence (AI Risk Assessment)", "Synthesizing quantitative milestones & qualitative notes with Gemini"],
        ["08", "Operations Logbook & Field Records", "Managing engineering memos, regulatory notices, and supplier updates"],
        ["09", "Executive 5-Minute Pitch & Demo Script", "Turn-by-turn script for investor and leadership presentations"],
    ]
    toc_table = Table(
        [[Paragraph(c, styles['TableHead']) if i == 0 else Paragraph(c, styles['TableCell']) for c in row] for i, row in enumerate(toc_data)],
        colWidths=[40, 200, 264]
    )
    toc_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0f172a")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor("#ffffff"), colors.HexColor("#f8fafc")]),
    ]))
    story.append(toc_table)

    story.append(PageBreak())

    # --- SECTION 1 ---
    story.append(Paragraph("01. Executive Mission & Industry Context", styles['SectionH1']))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#cbd5e1"), spaceBefore=2, spaceAfter=10))

    story.append(Paragraph(
        "Over <b>70% of proposed utility-scale clean energy projects in North America and Europe face catastrophic timeline delays or complete abandonment</b>. "
        "While financing and solar equipment are widely available, project failures stem from the complex interplay of three critical friction points: "
        "<b>interconnection queue restudies (RTO/ISO backlogs)</b>, <b>discretionary local land-use permitting</b>, and <b>extraordinary lead times for high-voltage transformers (exceeding 75+ weeks)</b>.",
        styles['CustomBody']
    ))
    story.append(Paragraph(
        "Historically, energy developers tracked these dependencies in disconnected, unversioned Excel workbooks. "
        "When an interconnection engineer noted a 6-month restudy delay, that information remained trapped in an email thread while procurement committed capital deposits for panels. "
        "The <b>Energy Project Readiness Control Center</b> replaces this chaos with a unified, deterministic operating system.",
        styles['CustomBody']
    ))

    story.append(make_callout(
        "The Three Pillars of Project Readiness",
        "<b>1. Deterministic Single Source of Truth (SSOT):</b> Stage progress and readiness scores are computed strictly by backend mathematical formulas, eliminating optimistic developer bias.<br/>"
        "<b>2. Strict Blocker Visibility:</b> Differentiates between normal work in progress and critical path impediments that halt project development.<br/>"
        "<b>3. Qualitative Intelligence Ingestion:</b> AI risk synthesis ingests unstructured field notes, regulatory notices, and utility bulletins alongside milestone tasks.",
        styles, "success"
    ))

    # --- SECTION 2 ---
    story.append(Spacer(1, 10))
    story.append(Paragraph("02. Control Center Interface & Navigation", styles['SectionH1']))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#cbd5e1"), spaceBefore=2, spaceAfter=10))

    story.append(Paragraph(
        "The Energy Project Readiness interface is designed around an <b>industrial control center layout</b>. "
        "It prioritizes technical density, high contrast, tabular telemetry, and zero decorative visual noise.",
        styles['CustomBody']
    ))
    story.append(Paragraph("<b>Top Navigation Bar Elements:</b>", styles['SectionH2']))
    story.append(Paragraph("• <b>Operational Brand Indicator:</b> Displays the system brand mark along with active build environment tags (<font name='Courier'>OPERATIONAL CONTROLS</font> and <font name='Courier'>v0.1.0-ENG</font>).", styles['CustomBullet']))
    story.append(Paragraph("• <b>Asset Selector:</b> A dropdown allowing instant switching between managed energy projects in the database. Selection triggers atomic state updates across all dashboard widgets.", styles['CustomBullet']))
    story.append(Paragraph("• <b>'+ New Project' Action:</b> Affordance for provisioning new renewable assets with default stage-gate templates.", styles['CustomBullet']))
    story.append(Paragraph("• <b>'Load Demo Data' Action:</b> One-click idempotent seeding button that initializes the Solaria Desert reference project (150 MW Solar PV + 60 MWh BESS) with 6 stages, 23 standard deliverables, 2 active blockers, and engineering records.", styles['CustomBullet']))

    # --- SECTION 3 ---
    story.append(Spacer(1, 10))
    story.append(Paragraph("03. Asset Metadata & Telemetry Readouts", styles['SectionH1']))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#cbd5e1"), spaceBefore=2, spaceAfter=10))

    story.append(Paragraph(
        "The Project Header serves as the asset's identity card and top-level telemetry monitor. "
        "It provides immediate clarity on generation and storage sizing, location, and composite project readiness.",
        styles['CustomBody']
    ))

    header_table_data = [
        ["Telemetry Field", "Display Format", "Operational Significance"],
        ["Project Identity", "Solaria Desert Solar + BESS", "Unique asset name and technology classification"],
        ["Location", "Kern County, CA", "Jurisdictional authority, CEQA regime, and CAISO RTO territory"],
        ["Solar PV Capacity", "150.0 MW", "Nameplate peak DC/AC generation capacity for grid injection"],
        ["Storage Capacity", "60.0 MWh", "4-hour duration BESS capacity for energy arbitrage and ancillary grid services"],
        ["Readiness Index", "12.5% [EARLY STAGE]", "Weighted composite score across all 6 development stages"],
        ["Project Intelligence", "Run Intelligence Assessment", "Interactive trigger for Google Gemini qualitative risk synthesis"]
    ]
    h_table = Table(
        [[Paragraph(c, styles['TableHead']) if i == 0 else Paragraph(c, styles['TableCell']) for c in row] for i, row in enumerate(header_table_data)],
        colWidths=[110, 150, 244]
    )
    h_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0f172a")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor("#ffffff"), colors.HexColor("#f8fafc")]),
    ]))
    story.append(h_table)

    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "<b>The Mathematical Readiness Formula:</b><br/>"
        "Project readiness is computed strictly on the backend using weighted arithmetic:<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;<b>Stage Readiness %</b> = (Completed Deliverables / Total Stage Deliverables) × 100<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;<b>Overall Readiness %</b> = Σ (Stage Readiness_i × Stage Weight_i) / Σ (Stage Weight_i)<br/>"
        "Weights reflect critical-path risk: Grid Interconnection (25%), Permitting (20%), Site Control (15%), Commercial Offtake (15%), Procurement (15%), and Construction (10%).",
        styles['CustomBody']
    ))

    story.append(PageBreak())

    # --- SECTION 4 ---
    story.append(Paragraph("04. Critical Path Blocker Register", styles['SectionH1']))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#cbd5e1"), spaceBefore=2, spaceAfter=10))

    story.append(Paragraph(
        "The most critical operational question in renewable development is: <b>'What is currently blocking this project?'</b> "
        "The Blocker Register occupies a prominent, permanent position on the dashboard. It isolates tasks marked with <font name='Courier'>is_blocker=True</font>.",
        styles['CustomBody']
    ))

    story.append(make_callout(
        "Blocker vs. Normal Incomplete Task",
        "A normal pending deliverable (e.g. 'Complete Topographical Land Survey') simply represents work to be done. "
        "A <b>Critical Path Blocker</b> (e.g. 'System Impact Study Phase II Halted by RTO') halts downstream work across multiple disciplines, threatens commercial agreements, and burns development capital.",
        styles, "danger"
    ))

    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>Reference Project Active Blockers:</b>", styles['SectionH2']))
    story.append(Paragraph("1. <b>[GRID] System Impact Study (SIS) Phase II:</b> Regional RTO announced a 6-month cluster restudy delay due to baseline generation changes. Impact: Directly halts Interconnection Agreement (IA) execution and pushes Commercial Operation Date (COD). Owner: <i>Interconnection Manager</i>.", styles['CustomBullet']))
    story.append(Paragraph("2. <b>[PROCUREMENT] Main Power Transformer (MPT) Long-Lead Procurement:</b> Manufacturing queues exceed 75 weeks; production slot will be lost without an immediate 15% deposit. Impact: Threatens substation energization timeline. Owner: <i>Procurement Lead</i>.", styles['CustomBullet']))
    story.append(Paragraph("• <b>Inspect Stage Navigation:</b> Clicking 'Inspect Stage →' on any blocker card automatically shifts focus to that phase in the stage workspace and highlights the affected deliverable.", styles['CustomBullet']))

    # --- SECTION 5 ---
    story.append(Spacer(1, 10))
    story.append(Paragraph("05. The 6-Stage Lifecycle Progression Rail", styles['SectionH1']))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#cbd5e1"), spaceBefore=2, spaceAfter=10))

    story.append(Paragraph(
        "Renewable energy project development follows a rigorous, connected stage-gate pipeline. "
        "The Progression Rail displays all 6 phases as a connected horizontal progression with directional chevrons.",
        styles['CustomBody']
    ))

    stage_data = [
        ["Phase #", "Stage Gate Name", "Weight", "Key Deliverables", "Exit Criteria"],
        ["01", "Site Control", "15%", "Land options, title search, ALTA survey, boundary mapping", "100% acreage secured with 30-year lease options"],
        ["02", "Grid Interconnection", "25%", "Interconnection request, SIS Phase I/II, Facilities Study, IA", "Executed Interconnection Agreement with firm capacity"],
        ["03", "Permitting & Environmental", "20%", "Phase I ESA, CEQA/NEPA filing, CUP, biological clearance", "Unappealable Conditional Use Permit issued"],
        ["04", "Commercial & Offtake", "15%", "PPA term sheet, financial model, EPC RFP, revenue hedge", "Fully executed 15-year Busbar PPA with creditworthy offtaker"],
        ["05", "Procurement & Long-Lead", "15%", "Transformer PO, PV module supply agreement, BESS cells", "Firm delivery slots locked with deposits"],
        ["06", "Construction & COD", "10%", "Civil grading, racking, DC/AC wiring, substation, COD test", "Commercial Operation Date achieved, COD certificate"]
    ]
    s_table = Table(
        [[Paragraph(c, styles['TableHead']) if i == 0 else Paragraph(c, styles['TableCell']) for c in row] for i, row in enumerate(stage_data)],
        colWidths=[40, 110, 42, 182, 130]
    )
    s_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0f172a")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor("#ffffff"), colors.HexColor("#f8fafc")]),
    ]))
    story.append(s_table)

    # --- SECTION 6 ---
    story.append(Spacer(1, 10))
    story.append(Paragraph("06. Interactive Deliverables Ledger (Stage Workspace)", styles['SectionH1']))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#cbd5e1"), spaceBefore=2, spaceAfter=10))

    story.append(Paragraph(
        "Clicking any stage card opens the <b>Stage Workspace & Deliverables Ledger</b>. "
        "Here, project managers and engineers inspect, update, add, and delete granular milestone deliverables.",
        styles['CustomBody']
    ))
    story.append(Paragraph("<b>Supported User Interactions:</b>", styles['SectionH2']))
    story.append(Paragraph("• <b>Status Transition:</b> Dropdown allows switching status between <font name='Courier'>Not Started</font>, <font name='Courier'>In Progress</font>, <font name='Courier'>Complete</font>, and <font name='Courier'>Blocked</font>. Calls <font name='Courier'>PATCH /api/tasks/:id</font> and triggers an immediate recalculation of readiness and blocker count.", styles['CustomBullet']))
    story.append(Paragraph("• <b>Critical Blocker Toggle:</b> One-click toggle flags or clears the <font name='Courier'>is_blocker</font> boolean. If set to true, the deliverable instantly surfaces in the top Blocker Banner and alerts all stakeholders.", styles['CustomBullet']))
    story.append(Paragraph("• <b>Add Deliverable Action:</b> The '+ Add Deliverable' button opens a precision modal allowing title, description, owner, due date, blocker flag, and notes to be set. Invokes <font name='Courier'>POST /api/stages/:id/tasks</font>.", styles['CustomBullet']))
    story.append(Paragraph("• <b>Deliverable Deletion:</b> Clicking 'Delete' displays an inline safety confirmation ('Confirm' / 'Cancel') before executing <font name='Courier'>DELETE /api/tasks/:id</font>.", styles['CustomBullet']))
    story.append(Paragraph("• <b>Dynamic Filter Tabs:</b> Filter deliverables by <font name='Courier'>All</font>, <font name='Courier'>Pending</font>, <font name='Courier'>Complete</font>, or <font name='Courier'>Blocked</font> with live counts.", styles['CustomBullet']))

    story.append(PageBreak())

    # --- SECTION 7 ---
    story.append(Paragraph("07. Project Intelligence (AI Risk Assessment)", styles['SectionH1']))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#cbd5e1"), spaceBefore=2, spaceAfter=10))

    story.append(Paragraph(
        "While quantitative task checklists track known deliverables, they fail to anticipate latent cross-discipline risks. "
        "The <b>Project Intelligence Engine (powered by Google Gemini 2.5 Flash with fallback to MockAIProvider)</b> "
        "ingests project metadata, stage readiness, open blockers, task ownership, and qualitative field notes to synthesize an operational risk assessment.",
        styles['CustomBody']
    ))

    story.append(Paragraph("<b>The 4 Structured Outputs of Project Intelligence:</b>", styles['SectionH2']))
    story.append(Paragraph("1. <b>Executive Assessment:</b> High-level narrative synthesizing project health, critical bottlenecks, and schedule trajectory for leadership.", styles['CustomBullet']))
    story.append(Paragraph("2. <b>Active Critical Path Blockers:</b> Explicit verification of open blockers, quantifying their operational impact on Commercial Operation Date (COD) and identifying responsible owners.", styles['CustomBullet']))
    story.append(Paragraph("3. <b>Major Risks & Prioritized Exposures:</b> Matrix of technical and regulatory vulnerabilities categorized by priority (<font name='Courier'>Immediate</font>, <font name='Courier'>High</font>, <font name='Courier'>Medium</font>, <font name='Courier'>Low</font>) paired with concrete engineering mitigations.", styles['CustomBullet']))
    story.append(Paragraph("4. <b>Recommended Next Actions:</b> A ranked, actionable checklist of the top operational priorities needed to unlock project progression.", styles['CustomBullet']))

    story.append(Spacer(1, 4))
    story.append(make_callout(
        "Deterministic Caching vs. Re-Analysis",
        "The platform automatically caches the latest analysis in the database (<font name='Courier'>GET /api/projects/:id/analysis/latest</font>). "
        "Users can inspect existing intelligence instantly without incurring redundant API costs or latency. "
        "Clicking 'Re-analyze' or 'Run Intelligence Assessment' forces an updated synthesis using the current project state.",
        styles, "info"
    ))

    # --- SECTION 8 ---
    story.append(Spacer(1, 10))
    story.append(Paragraph("08. Operations Logbook & Qualitative Records Ledger", styles['SectionH1']))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#cbd5e1"), spaceBefore=2, spaceAfter=10))

    story.append(Paragraph(
        "Energy projects generate vast quantities of qualitative records: utility restudy bulletins, geotechnical soil reports, environmental survey memos, and equipment supplier quotes. "
        "The <b>Operations Logbook</b> provides an auditable ledger for these records and directly injects them into the Gemini risk prompt.",
        styles['CustomBody']
    ))
    story.append(Paragraph("<b>Logbook Features:</b>", styles['SectionH2']))
    story.append(Paragraph("• <b>Record Entry Form:</b> Captures record title, qualitative operational notes, and an optional stage association (e.g. associating a bedrock memo with Stage 'Site Control').", styles['CustomBullet']))
    story.append(Paragraph("• <b>Stage Filtering:</b> Filter memos by associated lifecycle stage to inspect discipline-specific records.", styles['CustomBullet']))
    story.append(Paragraph("• <b>AI Context Ingestion:</b> When Project Intelligence runs, all logged records are serialized into the AI prompt context. For example, a note regarding shallow caliche bedrock will prompt the AI to recommend pre-drilling contingency budgets.", styles['CustomBullet']))
    story.append(Paragraph("• <b>Persistence & Verification:</b> Fully backed by <font name='Courier'>POST /api/projects/:id/documents</font> and <font name='Courier'>DELETE /api/documents/:id</font>.", styles['CustomBullet']))

    # --- SECTION 9 ---
    story.append(Spacer(1, 10))
    story.append(Paragraph("09. Executive 5-Minute Pitch & Demo Script", styles['SectionH1']))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#cbd5e1"), spaceBefore=2, spaceAfter=10))

    demo_script = [
        ["Time", "Demonstration Step", "Executive Narrative"],
        ["00:00", "Load Demo Reference Data", "'Welcome. Today, 70% of solar and storage projects stall. Let's load our reference project: Solaria Desert, a 150 MW PV plus 60 MWh storage asset in Kern County.'"],
        ["01:00", "Highlight Top Telemetry & Readiness", "'Notice our top telemetry. We have 150 MW solar, 60 MWh storage, and a calculated readiness of 12.5%. This score isn't a guess; it's mathematically weighted across 6 development gates.'"],
        ["02:00", "Inspect Critical Blocker Banner", "'Right below, we answer the billion-dollar question: What is blocking this project? We see two severe blockers: a CAISO cluster restudy and a 75-week transformer lead time.'"],
        ["03:00", "Navigate Stage Workspace", "'Let's click 'Inspect Stage' on Grid. We jump straight to Stage 2. We can see our System Impact Study is Blocked. Let's imagine we negotiated an expedited review—we switch status to Complete. Watch our overall readiness instantly recalculate to 15.8%.'"],
        ["04:00", "Trigger Project Intelligence", "'Now let's click 'Run Intelligence Assessment'. Our risk engine synthesizes all tasks and field notes using Gemini 2.5 Flash, returning an executive summary, quantified risks, and our prioritized next actions.'"],
        ["04:45", "Review Operations Logbook", "'Finally, our engineers logged a caliche bedrock memo. Notice how Project Intelligence picked that up in the mitigation roadmap. That is true operational project control.'"]
    ]
    d_table = Table(
        [[Paragraph(c, styles['TableHead']) if i == 0 else Paragraph(c, styles['TableCell']) for c in row] for i, row in enumerate(demo_script)],
        colWidths=[40, 140, 324]
    )
    d_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0f172a")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor("#ffffff"), colors.HexColor("#f8fafc")]),
    ]))
    story.append(d_table)

    # Build PDF
    doc.build(story, canvasmaker=UserGuideCanvas)
    print(f"Successfully generated: {output_path}")


# ==============================================================================
# DOCUMENT 2: SYSTEM ARCHITECTURE & CODE REVIEW GUIDE
# ==============================================================================
def build_architecture_guide_pdf(output_path):
    styles = setup_custom_styles()
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    story = []

    # --- COVER PAGE ---
    story.append(Spacer(1, 40))
    story.append(Paragraph("TECHNICAL SPECIFICATION & INTERVIEW GUIDE", styles['CoverBadge']))
    story.append(Paragraph("Energy Project Readiness<br/>System Architecture & Code Review", styles['CoverTitle']))
    story.append(Paragraph(
        "An in-depth technical examination of the software architecture, database models, mathematical calculation engine, "
        "REST API design, Gemini AI integration, frontend state management, production WSGI deployment, and interview defense questions.",
        styles['CoverSubtitle']
    ))
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor("#0284c7"), spaceBefore=0, spaceAfter=20))

    meta_text = """
    <b>Document Version:</b> 1.0.0 (Engineering Architecture Edition)<br/>
    <b>Classification:</b> Senior Engineering Technical Briefing & Code Review Manual<br/>
    <b>Target Roles:</b> Staff/Senior Full-Stack Engineers, System Architects, Technical Interviewers, Hiring Managers<br/>
    <b>Stack:</b> Python 3.12+ (Flask, SQLAlchemy, Gunicorn, google-genai) + React 18 (Vite, Tailwind CSS, Lucide)<br/>
    <b>Repository:</b> <font name='Courier'>https://github.com/Damianson/energy-project-readiness</font>
    """
    story.append(Paragraph(meta_text, styles['CoverMeta']))
    story.append(Spacer(1, 30))

    toc_data = [
        ["Section", "Title", "Engineering Deep Dive Topics"],
        ["01", "System Architecture & Tech Stack Rationale", "Decoupled SPA + Flask REST API + SQLite WAL mode + Gunicorn WSGI"],
        ["02", "Data Modeling & Relational Schema", "SQLAlchemy ORM models: Project, Stage, Task, Analysis, Document"],
        ["03", "Readiness Calculation Engine", "Deterministic weighted formula, edge case guards, SSOT architectural law"],
        ["04", "RESTful API Design & Route Controllers", "REST endpoints, error handling standards, idempotent database seeding"],
        ["05", "AI Risk Service & Gemini 2.5 Flash SDK", "Abstract factory, Provider pattern, schema enforcement, caching layer"],
        ["06", "Frontend Architecture & UI Engineering", "Component tree, lifted state, telemetry sync, Tailwind industrial design"],
        ["07", "Production Deployment & Static Serving", "Single-origin SPA fallback in Flask, Procfile, Render deployment config"],
        ["08", "Technical Interview & Code Review Defense", "12 rigorous technical interview questions, trade-offs & architectural defense"],
    ]
    toc_table = Table(
        [[Paragraph(c, styles['TableHead']) if i == 0 else Paragraph(c, styles['TableCell']) for c in row] for i, row in enumerate(toc_data)],
        colWidths=[40, 200, 264]
    )
    toc_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0f172a")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor("#ffffff"), colors.HexColor("#f8fafc")]),
    ]))
    story.append(toc_table)

    story.append(PageBreak())

    # --- SECTION 1 ---
    story.append(Paragraph("01. System Architecture & Tech Stack Rationale", styles['SectionH1']))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#cbd5e1"), spaceBefore=2, spaceAfter=10))

    story.append(Paragraph(
        "The application employs a <b>decoupled client-server architecture</b> that packages into a unified, high-performance "
        "production deployment suitable for cloud container platforms (Render, Heroku, AWS ECS).",
        styles['CustomBody']
    ))

    arch_diagram = """
+-----------------------------------------------------------------------------------------+
|                                    CLIENT BROWSER                                       |
|  React 18 + Vite SPA | Industrial Dark UI | JetBrains Mono Telemetry | Optimistic State  |
+--------------------------------------------+--------------------------------------------+
                                             | HTTP / REST API (JSON)
                                             v
+-----------------------------------------------------------------------------------------+
|                                    GUNICORN WSGI                                        |
|  run:app (4 Worker Processes, Master Supervisor, Signal Trapping, Port Binding)        |
+--------------------------------------------+--------------------------------------------+
                                             |
                                             v
+-----------------------------------------------------------------------------------------+
|                                     FLASK APP CORE                                      |
|  - Static Asset Handler (serves dist/index.html & assets with SPA fallback)             |
|  - Blueprints: projects, stages, tasks, documents, analysis, demo, health              |
|  - Readiness Calculation Engine (Pure Python Services)                                  |
+----------------------+------------------------------------+-----------------------------+
                       |                                    |
                       v                                    v
+------------------------------------+    +-----------------------------------------------+
|      SQLITE 3 / SQLALCHEMY ORM      |    |        GOOGLE GEMINI RISK SERVICE (AI)        |
|  - WAL mode (Write-Ahead Logging)   |    |  - Provider Pattern (GeminiProvider / Mock)   |
|  - Foreign keys & Cascade deletes   |    |  - google-genai SDK (gemini-2.5-flash)        |
|  - Deterministic cached analyses    |    |  - Pydantic-style structured JSON output      |
+------------------------------------+    +-----------------------------------------------+
    """
    story.append(make_code_box(arch_diagram, styles))

    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>Technology Decisions & Architectural Justifications:</b>", styles['SectionH2']))
    story.append(Paragraph("• <b>Flask over Django/FastAPI:</b> For a domain-driven calculation and workflow engine, Django imposes unnecessary ORM bloat, migrations overhead, and admin dependencies. Flask offers minimal, explicit routing, clean Blueprints, and zero magic. While FastAPI provides async IO, calculation services are CPU-bound and benefit from synchronous transactional clarity in Gunicorn workers.", styles['CustomBullet']))
    story.append(Paragraph("• <b>React 18 + Vite over Next.js:</b> The dashboard is a secure, authenticated enterprise operations console, not an SEO-dependent public ecommerce portal. Server-side rendering (SSR) adds server complexity, hydration mismatch bugs, and hosting overhead. Vite delivers sub-second Hot Module Replacement (HMR) and a lightning-fast 240 kB production bundle.", styles['CustomBullet']))
    story.append(Paragraph("• <b>SQLite in WAL Mode for MVP:</b> Zero-configuration serverless database eliminating external managed database costs during early validation, while supporting concurrent reads via Write-Ahead Logging (WAL). Fully decoupled via SQLAlchemy ORM for an instantaneous 1-line connection string switch to PostgreSQL in AWS RDS.", styles['CustomBullet']))

    # --- SECTION 2 ---
    story.append(Spacer(1, 10))
    story.append(Paragraph("02. Data Modeling & Relational Schema (`models.py`)", styles['SectionH1']))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#cbd5e1"), spaceBefore=2, spaceAfter=10))

    story.append(Paragraph(
        "The relational schema is implemented in <font name='Courier'>backend/app/models.py</font> using Flask-SQLAlchemy. "
        "It enforces strict referential integrity, cascading deletes, and typed enumerations.",
        styles['CustomBody']
    ))

    schema_data = [
        ["Model Name", "Primary Key", "Foreign Keys", "Key Fields & Types", "Cascade & Relationships"],
        ["Project", "id (Integer)", "None", "name (String 120), location (String 120), project_type, solar_capacity_mw (Float), battery_storage_mwh (Float), created_at", "stages (1:N, cascade='all, delete-orphan'), documents (1:N), analyses (1:N)"],
        ["Stage", "id (Integer)", "project_id -> projects.id", "name (String 80), order (Integer 1-6), weight (Float, default 1.0)", "tasks (1:N, cascade='all, delete-orphan'), project (N:1 backref)"],
        ["Task", "id (Integer)", "stage_id -> stages.id", "title (String 200), description (Text), status (Enum: Not Started, In Progress, Complete, Blocked), owner (String 80), due_date (Date), is_blocker (Boolean), notes (Text)", "stage (N:1 backref)"],
        ["Analysis", "id (Integer)", "project_id -> projects.id", "summary (Text), current_blockers (JSON), major_risks (JSON), recommended_next_actions (JSON), raw_response (Text), created_at (DateTime)", "project (N:1 backref)"],
        ["Document", "id (Integer)", "project_id -> projects.id", "title (String 200), content (Text), stage (String 80, optional), created_at (DateTime)", "project (N:1 backref)"]
    ]
    sc_table = Table(
        [[Paragraph(c, styles['TableHead']) if i == 0 else Paragraph(c, styles['TableCell']) for c in row] for i, row in enumerate(schema_data)],
        colWidths=[55, 75, 90, 164, 120]
    )
    sc_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0f172a")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor("#ffffff"), colors.HexColor("#f8fafc")]),
    ]))
    story.append(sc_table)

    story.append(PageBreak())

    # --- SECTION 3 ---
    story.append(Paragraph("03. The Readiness Calculation Engine (`readiness.py`)", styles['SectionH1']))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#cbd5e1"), spaceBefore=2, spaceAfter=10))

    story.append(Paragraph(
        "The core value proposition of the system is deterministic, auditable readiness math implemented in <font name='Courier'>backend/app/services/readiness.py</font>. "
        "The service exposes three pure functions: <font name='Courier'>calculate_stage_readiness()</font>, <font name='Courier'>calculate_overall_readiness()</font>, "
        "and <font name='Courier'>get_project_summary()</font>.",
        styles['CustomBody']
    ))

    code_readiness = """
def calculate_stage_readiness(stage: Stage) -> float:
    \"\"\"Calculates percentage readiness for a single stage [0.0 - 100.0].\"\"\"
    tasks = stage.tasks
    if not tasks:
        return 0.0
    complete_count = sum(1 for t in tasks if t.status == TaskStatus.COMPLETE.value)
    return round((complete_count / len(tasks)) * 100.0, 1)

def calculate_overall_readiness(project: Project) -> float:
    \"\"\"Calculates weighted composite readiness across all stages [0.0 - 100.0].\"\"\"
    stages = project.stages
    if not stages:
        return 0.0
    total_weighted_readiness = 0.0
    total_weight = 0.0
    for stage in stages:
        stage_readiness = calculate_stage_readiness(stage)
        weight = stage.weight if stage.weight is not None and stage.weight > 0 else 1.0
        total_weighted_readiness += stage_readiness * weight
        total_weight += weight
    if total_weight == 0:
        return 0.0
    return round(total_weighted_readiness / total_weight, 1)
    """
    story.append(make_code_box(code_readiness, styles))

    story.append(Spacer(1, 6))
    story.append(make_callout(
        "Architectural Rule: Single Source of Truth (SSOT)",
        "<b>The React frontend NEVER computes readiness or blocker counts.</b> "
        "All calculations occur on the backend inside service transactions. "
        "When a user toggles a task in the UI, React dispatches a PATCH request, refetches the canonical project object, "
        "and renders the authoritative backend calculation. This eliminates client-side rounding divergence and logic drift.",
        styles, "warning"
    ))

    # --- SECTION 4 ---
    story.append(Spacer(1, 10))
    story.append(Paragraph("04. RESTful API Design & Route Controllers (`routes/`)", styles['SectionH1']))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#cbd5e1"), spaceBefore=2, spaceAfter=10))

    story.append(Paragraph(
        "The API follows strict REST conventions with standard JSON payloads and semantic HTTP status codes. "
        "All routes are grouped into Flask Blueprints registered under the <font name='Courier'>/api</font> prefix.",
        styles['CustomBody']
    ))

    api_routes = [
        ["Method", "Endpoint Path", "Status", "Request Payload", "Response Summary"],
        ["GET", "/api/projects", "200", "None", "Array of project summaries with readiness and blocker counts"],
        ["POST", "/api/projects", "201", "{name, location, project_type, ...}", "Created project with auto-provisioned 6 stages"],
        ["GET", "/api/projects/:id", "200 / 404", "None", "Complete project tree (stages, tasks, blockers, documents)"],
        ["DELETE", "/api/projects/:id", "200 / 404", "None", "Deletes project and cascades through all child entities"],
        ["PATCH", "/api/tasks/:id", "200 / 400", "{status, is_blocker, notes, ...}", "Updated task; triggers project readiness recompute"],
        ["POST", "/api/stages/:id/tasks", "201 / 400", "{title, description, owner, ...}", "Creates milestone task under specified stage"],
        ["DELETE", "/api/tasks/:id", "200 / 404", "None", "Deletes deliverable from stage"],
        ["POST", "/api/projects/:id/documents", "201 / 400", "{title, content, stage}", "Creates qualitative note/record for project"],
        ["GET", "/api/projects/:id/documents", "200", "None", "List of qualitative notes ordered by created_at DESC"],
        ["DELETE", "/api/documents/:id", "200 / 404", "None", "Deletes qualitative note by document ID"],
        ["POST", "/api/projects/:id/analyze-risks", "200 / 500", "None", "Synthesizes live project context with Gemini AI"],
        ["GET", "/api/projects/:id/analysis/latest", "200 / 404", "None", "Returns cached latest analysis record from SQLite"],
        ["POST", "/api/demo/seed", "200 / 201", "None", "Idempotently seeds Solaria Desert reference asset"],
        ["GET", "/api/health", "200", "None", "{status: 'healthy', version: '0.1.0'}"]
    ]
    api_t = Table(
        [[Paragraph(c, styles['TableHead']) if i == 0 else Paragraph(c, styles['TableCell']) for c in row] for i, row in enumerate(api_routes)],
        colWidths=[40, 150, 48, 116, 150]
    )
    api_t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0f172a")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor("#ffffff"), colors.HexColor("#f8fafc")]),
    ]))
    story.append(api_t)

    story.append(PageBreak())

    # --- SECTION 5 ---
    story.append(Paragraph("05. AI Risk Service & Gemini 2.5 Flash SDK (`services/ai/`)", styles['SectionH1']))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#cbd5e1"), spaceBefore=2, spaceAfter=10))

    story.append(Paragraph(
        "The AI architecture is structured around the <b>Strategy and Abstract Factory Design Patterns</b>. "
        "It decouples the Flask web layer from specific LLM providers, guaranteeing zero hard-coded external dependencies.",
        styles['CustomBody']
    ))

    story.append(Paragraph("<b>Components of the AI Architecture:</b>", styles['SectionH2']))
    story.append(Paragraph("• <font name='Courier'>BaseAIProvider</font> (Abstract Base Class): Enforces the contract <font name='Courier'>analyze_project(project_data: dict) -> dict</font> returning a strictly validated schema containing: <font name='Courier'>summary</font>, <font name='Courier'>current_blockers</font>, <font name='Courier'>major_risks</font>, and <font name='Courier'>recommended_next_actions</font>.", styles['CustomBullet']))
    story.append(Paragraph("• <font name='Courier'>GeminiProvider</font>: Implements Google's official <font name='Courier'>google-genai</font> SDK using the <font name='Courier'>gemini-2.5-flash</font> model. Enforces structured JSON output via system instructions and schema definitions. Features exponential backoff retry logic and automatic model failover if Gemini is experiencing high demand (503).", styles['CustomBullet']))
    story.append(Paragraph("• <font name='Courier'>MockAIProvider</font>: A deterministic, zero-network fallback provider that dynamically parses the live project blockers, deliverable states, and qualitative notes. Guarantees that the application functions 100% offline and in CI/CD automated test pipelines without an API key.", styles['CustomBullet']))
    story.append(Paragraph("• <font name='Courier'>get_ai_provider()</font> (Factory): Inspects environment variables. If <font name='Courier'>GEMINI_API_KEY</font> is present, instantiates Gemini; otherwise seamlessly falls back to Mock provider with zero runtime exceptions.", styles['CustomBullet']))
    story.append(Paragraph("• <b>Context Serialization (<font name='Courier'>_build_project_context</font>):</b> Translates relational database entities and qualitative notes into dense, domain-specific markdown for the prompt context.", styles['CustomBullet']))

    code_gemini_snippet = """
# Provider Factory Pattern in factory.py
def get_ai_provider(force_provider: Optional[str] = None) -> BaseAIProvider:
    provider_name = force_provider or os.getenv('AI_PROVIDER', '').lower()
    api_key = os.getenv('GEMINI_API_KEY')
    if provider_name == 'gemini' or (not provider_name and api_key):
        return GeminiProvider(api_key=api_key)
    return MockAIProvider()
    """
    story.append(make_code_box(code_gemini_snippet, styles))

    # --- SECTION 6 ---
    story.append(Spacer(1, 10))
    story.append(Paragraph("06. Frontend Architecture & UI Engineering (`frontend/src/`)", styles['SectionH1']))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#cbd5e1"), spaceBefore=2, spaceAfter=10))

    story.append(Paragraph(
        "The user interface is engineered with React 18 and Tailwind CSS, structured as a high-density, high-trust project control center.",
        styles['CustomBody']
    ))
    story.append(Paragraph("<b>Component Hierarchy & State Management:</b>", styles['SectionH2']))
    story.append(Paragraph("• <font name='Courier'>App.jsx</font>: Serves as the central state coordinator. Manages <font name='Courier'>projects</font>, <font name='Courier'>selectedProjectId</font>, <font name='Courier'>projectDetails</font>, <font name='Courier'>selectedStageId</font>, <font name='Courier'>latestAnalysis</font>, and <font name='Courier'>notes</font>. Dispatches all asynchronous mutations and coordinates synchronization refetches.", styles['CustomBullet']))
    story.append(Paragraph("• <font name='Courier'>BlockerBanner.jsx</font>: Renders open blockers with impact callouts and provides an <font name='Courier'>onSelectStage</font> callback to immediately jump to that phase in the workspace.", styles['CustomBullet']))
    story.append(Paragraph("• <font name='Courier'>ReadinessDashboard.jsx</font> & <font name='Courier'>StageCard.jsx</font>: Renders the continuous 6-stage progression rail with directional chevrons, deliverable completion ratios, and stage selection highlights.", styles['CustomBullet']))
    story.append(Paragraph("• <font name='Courier'>StageTracker.jsx</font>, <font name='Courier'>TaskList.jsx</font>, <font name='Courier'>TaskRow.jsx</font>, <font name='Courier'>TaskModal.jsx</font>: Deliverables ledger supporting inline status dropdowns, blocker toggles, modal task creation, and deletion with confirmation.", styles['CustomBullet']))
    story.append(Paragraph("• <font name='Courier'>AIAnalysisPanel.jsx</font> & <font name='Courier'>AIAnalysisModal.jsx</font>: Two presentation surfaces for Project Intelligence (compact on-page view vs. deep-dive modal).", styles['CustomBullet']))
    story.append(Paragraph("• <font name='Courier'>ProjectNotes.jsx</font>: Operational logbook with stage filtering and direct integration with backend documents API.", styles['CustomBullet']))

    story.append(PageBreak())

    # --- SECTION 7 ---
    story.append(Paragraph("07. Production Deployment & Static Serving", styles['SectionH1']))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#cbd5e1"), spaceBefore=2, spaceAfter=10))

    story.append(Paragraph(
        "To maximize operational reliability and eliminate CORS issues in production, the application is packaged as a "
        "<b>single unified WSGI service</b> where Flask serves both the REST API and the compiled React SPA.",
        styles['CustomBody']
    ))

    story.append(Paragraph("<b>The Single-Origin SPA Routing Implementation:</b>", styles['SectionH2']))
    code_spa = """
# backend/app/__init__.py: Flask Static Serving & SPA Fallback
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    if path.startswith('api'):
        abort(404)  # Do NOT serve index.html on missing API routes!
    dist_dir = os.path.join(app.root_path, '..', '..', 'frontend', 'dist')
    file_path = os.path.join(dist_dir, path)
    if path != '' and os.path.exists(file_path):
        return send_from_directory(dist_dir, path)
    return send_from_directory(dist_dir, 'index.html')
    """
    story.append(make_code_box(code_spa, styles))

    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>Production Deployment Commands:</b>", styles['SectionH2']))
    story.append(Paragraph("• <b>Build Command (Render / Cloud):</b> <font name='Courier'>cd frontend && npm install && npm run build && cd ../backend && pip install -r requirements.txt</font>", styles['CustomBullet']))
    story.append(Paragraph("• <b>Start Command:</b> <font name='Courier'>cd backend && gunicorn -w 4 -b 0.0.0.0:$PORT \"run:app\"</font>", styles['CustomBullet']))
    story.append(Paragraph("• <b>Environment Variables:</b> <font name='Courier'>FLASK_ENV=production</font>, <font name='Courier'>SECRET_KEY=&lt;secure-token&gt;</font>, and optionally <font name='Courier'>GEMINI_API_KEY=&lt;key&gt;</font>.", styles['CustomBullet']))

    # --- SECTION 8 ---
    story.append(Spacer(1, 10))
    story.append(Paragraph("08. Technical Interview & Code Review Defense", styles['SectionH1']))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#cbd5e1"), spaceBefore=2, spaceAfter=10))

    story.append(Paragraph(
        "Below are <b>12 rigorous technical questions</b> that interviewers and staff engineers are most likely to ask during a code review or system architecture interview, accompanied by model technical answers.",
        styles['CustomBody']
    ))

    qa_list = [
        (
            "Q1: Why did you decide to calculate project readiness on the backend rather than in React state?",
            "Readiness is a core domain business rule that directly governs capital allocation, debt drawdown eligibility, and executive reporting. "
            "Computing it in the frontend introduces calculation drift across mobile, web, and future API clients, exposes the logic to tampering, and requires duplicate implementations across platforms. "
            "By centralizing math in readiness.py as a pure functional service, the backend remains the immutable Single Source of Truth (SSOT)."
        ),
        (
            "Q2: How does the AI risk engine guarantee valid JSON responses from Gemini without breaking at runtime?",
            "We use the modern google-genai SDK (gemini-2.5-flash) configured with response_mime_type='application/json' and explicit JSON schema declarations in the system instructions. "
            "Furthermore, the response is parsed with json.loads() and passed through a schema normalization function that validates all expected top-level keys ('summary', 'current_blockers', 'major_risks', 'recommended_next_actions'). "
            "If Gemini fails, returns malformed JSON, or throws a 503 Overload error, the factory automatically intercepts the exception and seamlessly falls back to MockAIProvider."
        ),
        (
            "Q3: What happens if two project managers simultaneously update tasks on the same project?",
            "In the current SQLite architecture, transactions are serialized at the database level with Write-Ahead Logging (WAL). "
            "For production high-concurrency environments, we would implement Optimistic Concurrency Control (OCC) by adding a version_id integer column to the Project and Task tables. "
            "If user B attempts to PATCH a task with a stale version_id, the API rejects it with HTTP 409 Conflict, prompting the client to refresh before reapplying changes."
        ),
        (
            "Q4: How would you migrate this application from SQLite to PostgreSQL in AWS RDS?",
            "Because we utilized Flask-SQLAlchemy with strict dialect-agnostic data types, migration requires zero application code changes. "
            "We only update the DATABASE_URL environment variable to postgresql://user:pass@rds-endpoint:5432/readiness_db, install psycopg2-binary in requirements.txt, "
            "and run db.create_all() or Alembic database migrations. PostgreSQL connection pooling would be managed via SQLAlchemy's QueuePool."
        ),
        (
            "Q5: How does the SPA fallback routing in Flask avoid intercepting broken API requests?",
            "In app/__init__.py, our catch-all route explicitly guards the api path prefix: if path.startswith('api'): abort(404). "
            "This ensures that if a frontend client requests an invalid endpoint like GET /api/v2/nonexistent, Flask returns a genuine HTTP 404 JSON response rather than masking the error by returning the HTML of the single-page application."
        ),
        (
            "Q6: Why use weighted arithmetic for readiness instead of a simple average of completed tasks?",
            "A flat task average treats a mundane clerical task (e.g. 'Order Site Boundary Signs') with equal weight to a critical milestone (e.g. 'Execute CAISO Interconnection Agreement'). "
            "In renewable infrastructure, Interconnection and Permitting carry over 45% of total project failure risk. Weighted arithmetic accurately mirrors capital exposure and development reality."
        ),
        (
            "Q7: How are qualitative project notes ingested into the AI risk model without exceeding context limits?",
            "In services/ai/gemini_provider.py, the _build_project_context function extracts project documents and condenses them into clean, structured markdown bullets with title, timestamp, and content. "
            "Gemini 2.5 Flash possesses a 1-million-token context window, making context exhaustion virtually impossible for project logs. For enterprise scaling, we would introduce an embedding-based RAG pipeline (using pgvector) to retrieve only the top 15 most relevant records."
        ),
        (
            "Q8: How did you verify that the demo seed functionality is idempotent?",
            "In seed_data.py, before creating any entities, we execute Project.query.filter_by(name=DEMO_PROJECT_NAME).first(). "
            "If the project already exists, the function immediately returns the existing project ID without re-inserting duplicate stages, tasks, or documents. Our test suite (test_production_readiness.py) explicitly calls the seed endpoint twice and asserts project count equals 1."
        ),
        (
            "Q9: What security measures prevent API keys or secrets from leaking to clients?",
            "1. GEMINI_API_KEY is read strictly from backend server environment variables via python-dotenv; it is never exposed in Vite client bundles (no VITE_ prefixes).<br/>"
            "2. .gitignore strictly blocks .env, *.db, and *.pdf from being committed.<br/>"
            "3. The AI provider factory safely degrades to Mock mode if the key is missing rather than halting or logging errors containing sensitive strings."
        ),
        (
            "Q10: Why did you choose Gunicorn as the WSGI server for production?",
            "Flask's built-in development server (Werkzeug) is single-threaded and not hardened against slowloris attacks or high concurrency. "
            "Gunicorn provides a pre-fork worker model (typically 2-4 workers per CPU core) managed by a robust supervisor process that gracefully restarts stalled workers, traps Unix signals, and binds efficiently to Linux network sockets."
        ),
        (
            "Q11: How would you add real-time multiplayer task updates so multiple engineers see changes instantly?",
            "We would replace HTTP polling with Server-Sent Events (SSE) or WebSockets via Flask-SocketIO backed by a Redis pub/sub message broker. "
            "When any task is updated via PATCH /api/tasks/:id, the backend emits a task:updated event to a project-specific room, prompting all active connected clients to update their local React state."
        ),
        (
            "Q12: What are the main performance bottlenecks and how would you scale to 100,000 projects?",
            "1. Database Read Load: Add composite indexes on (project_id, status) and (stage_id, status) to optimize task queries; cache project summary JSON in Redis.<br/>"
            "2. AI Latency: Offload POST /analyze-risks to a Celery/RabbitMQ asynchronous worker queue so HTTP requests return immediately with an analysis_task_id, notifying the client via webhook or WebSocket when complete."
        )
    ]

    for q, a in qa_list:
        story.append(Paragraph(q, styles['QAQuestion']))
        story.append(Paragraph(a, styles['QAAnswer']))

    # Build PDF
    doc.build(story, canvasmaker=ArchitectureCanvas)
    print(f"Successfully generated: {output_path}")


# ==============================================================================
# MAIN EXECUTION
# ==============================================================================
if __name__ == "__main__":
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    
    pdf_user_guide = os.path.join(base_dir, "Energy_Project_Readiness_User_Guide_Walkthrough.pdf")
    pdf_architecture = os.path.join(base_dir, "Energy_Project_Readiness_Architecture_Code_Review_Guide.pdf")

    print(f"Generating Document 1: {pdf_user_guide}...")
    build_user_guide_pdf(pdf_user_guide)

    print(f"Generating Document 2: {pdf_architecture}...")
    build_architecture_guide_pdf(pdf_architecture)

    print("All documents generated successfully!")
