from flask import Blueprint, request, jsonify
from ..models import db, Project, Document

# Blueprint for project notes/documents
documents_bp = Blueprint("documents", __name__)


@documents_bp.route("/api/projects/<int:project_id>/documents", methods=["GET"])
def get_project_documents(project_id: int):
    """GET /api/projects/<id>/documents: List all notes/documents for a project."""
    project = db.session.get(Project, project_id)
    if not project:
        return jsonify({"error": f"Project with id {project_id} not found"}), 404

    docs = (
        Document.query.filter_by(project_id=project_id)
        .order_by(Document.created_at.desc())
        .all()
    )
    return jsonify([doc.to_dict() for doc in docs]), 200


@documents_bp.route("/api/projects/<int:project_id>/documents", methods=["POST"])
def create_project_document(project_id: int):
    """POST /api/projects/<id>/documents: Create a new project note."""
    project = db.session.get(Project, project_id)
    if not project:
        return jsonify({"error": f"Project with id {project_id} not found"}), 404

    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be valid JSON"}), 400

    title = data.get("title")
    if not title or not str(title).strip():
        return jsonify({"error": "Field 'title' is required"}), 400

    content = data.get("content")
    if not content or not str(content).strip():
        return jsonify({"error": "Field 'content' is required"}), 400

    stage = data.get("stage")
    if stage:
        stage = str(stage).strip() or None

    doc = Document(
        project_id=project_id,
        title=str(title).strip(),
        content=str(content).strip(),
        stage=stage,
    )

    db.session.add(doc)
    db.session.commit()

    return jsonify(doc.to_dict()), 201


@documents_bp.route("/api/documents/<int:document_id>", methods=["DELETE"])
def delete_document(document_id: int):
    """DELETE /api/documents/<id>: Delete a project note."""
    doc = db.session.get(Document, document_id)
    if not doc:
        return jsonify({"error": f"Document with id {document_id} not found"}), 404

    doc_id = doc.id
    db.session.delete(doc)
    db.session.commit()

    return jsonify({"message": "Document deleted successfully", "id": doc_id}), 200

