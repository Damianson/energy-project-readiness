from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import CheckConstraint

db = SQLAlchemy()

ALLOWED_TASK_STATUSES = ("Not started", "In progress", "Complete", "Blocked")
DEFAULT_STAGES = (
    ("Site", 1),
    ("Grid", 2),
    ("Permits", 3),
    ("Commercial", 4),
    ("Procurement", 5),
    ("Construction", 6),
)

def utcnow():
    """Returns current UTC datetime with timezone awareness."""
    return datetime.now(timezone.utc)


class Project(db.Model):
    """Renewable energy project."""
    __tablename__ = "projects"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    location = db.Column(db.String(200), nullable=True)
    project_type = db.Column(db.String(100), nullable=False)
    estimated_capacity_mw = db.Column(db.Float, nullable=False)
    battery_capacity_mwh = db.Column(db.Float, nullable=True)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=utcnow, onupdate=utcnow, nullable=False)

    # Relationships
    stages = db.relationship(
        "Stage",
        back_populates="project",
        cascade="all, delete-orphan",
        order_by="Stage.order_index",
        lazy="selectin",
    )
    documents = db.relationship(
        "Document",
        back_populates="project",
        cascade="all, delete-orphan",
        order_by="Document.created_at.desc()",
        lazy="selectin",
    )

    def to_dict(self, include_stages=False):
        """Serialize project to dictionary."""
        data = {
            "id": self.id,
            "name": self.name,
            "location": self.location,
            "project_type": self.project_type,
            "estimated_capacity_mw": self.estimated_capacity_mw,
            "battery_capacity_mwh": self.battery_capacity_mwh,
            "description": self.description,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
        if include_stages:
            data["stages"] = [stage.to_dict(include_tasks=True) for stage in self.stages]
        return data

    def __repr__(self):
        return f"<Project id={self.id} name='{self.name}' type='{self.project_type}'>"


class Stage(db.Model):
    """Development stage for a renewable energy project."""
    __tablename__ = "stages"

    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(
        db.Integer,
        db.ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    name = db.Column(db.String(50), nullable=False)
    order_index = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=utcnow, nullable=False)

    # Relationships
    project = db.relationship("Project", back_populates="stages")
    tasks = db.relationship(
        "Task",
        back_populates="stage",
        cascade="all, delete-orphan",
        order_by="Task.id",
        lazy="selectin",
    )

    def to_dict(self, include_tasks=False):
        """Serialize stage to dictionary."""
        data = {
            "id": self.id,
            "project_id": self.project_id,
            "name": self.name,
            "order_index": self.order_index,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
        if include_tasks:
            data["tasks"] = [task.to_dict() for task in self.tasks]
        return data

    def __repr__(self):
        return f"<Stage id={self.id} name='{self.name}' order={self.order_index} project_id={self.project_id}>"


class Task(db.Model):
    """Actionable checklist item or milestone within a project stage."""
    __tablename__ = "tasks"

    id = db.Column(db.Integer, primary_key=True)
    stage_id = db.Column(
        db.Integer,
        db.ForeignKey("stages.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(
        db.String(30),
        nullable=False,
        default="Not started",
    )
    owner = db.Column(db.String(100), nullable=True)
    due_date = db.Column(db.Date, nullable=True)
    is_blocker = db.Column(db.Boolean, nullable=False, default=False)
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=utcnow, onupdate=utcnow, nullable=False)

    # Database-level constraint on allowed status values
    __table_args__ = (
        CheckConstraint(
            f"status IN {ALLOWED_TASK_STATUSES}",
            name="check_valid_task_status",
        ),
    )

    # Relationships
    stage = db.relationship("Stage", back_populates="tasks")

    def to_dict(self):
        """Serialize task to dictionary."""
        return {
            "id": self.id,
            "stage_id": self.stage_id,
            "title": self.title,
            "description": self.description,
            "status": self.status,
            "owner": self.owner,
            "due_date": self.due_date.isoformat() if self.due_date else None,
            "is_blocker": self.is_blocker,
            "notes": self.notes,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

    def __repr__(self):
        return f"<Task id={self.id} title='{self.title}' status='{self.status}' blocker={self.is_blocker}>"


class AIAnalysis(db.Model):
    """Historical record of an AI risk analysis run for a project."""
    __tablename__ = "ai_analyses"

    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(
        db.Integer,
        db.ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    summary = db.Column(db.Text, nullable=False)
    results_json = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=utcnow, nullable=False)

    # Relationships
    project = db.relationship(
        "Project",
        backref=db.backref(
            "analyses",
            cascade="all, delete-orphan",
            order_by="AIAnalysis.created_at.desc()",
        ),
    )

    def to_dict(self):
        """Serialize analysis record."""
        import json
        try:
            analysis_data = json.loads(self.results_json)
        except Exception:
            analysis_data = {}
        return {
            "id": self.id,
            "project_id": self.project_id,
            "summary": self.summary,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "analysis": analysis_data,
        }

    def __repr__(self):
        return f"<AIAnalysis id={self.id} project_id={self.project_id} created_at='{self.created_at}'>"


class Document(db.Model):
    """Project document or note containing qualitative intelligence."""
    __tablename__ = "documents"

    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(
        db.Integer,
        db.ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    stage = db.Column(db.String(50), nullable=True)
    created_at = db.Column(db.DateTime, default=utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=utcnow, onupdate=utcnow, nullable=False)

    # Relationships
    project = db.relationship("Project", back_populates="documents")

    def to_dict(self):
        """Serialize document/note to dictionary."""
        return {
            "id": self.id,
            "project_id": self.project_id,
            "title": self.title,
            "content": self.content,
            "stage": self.stage,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

    def __repr__(self):
        return f"<Document id={self.id} project_id={self.project_id} title='{self.title}'>"

