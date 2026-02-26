from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime
from bson import ObjectId
from database import get_db
from models.subject import SubjectCreate, SubjectUpdate, SubjectOut
from auth_utils import get_current_user, require_contributor

router = APIRouter(prefix="/subjects", tags=["Subjects"])


def serialize_subject(doc: dict) -> dict:
    doc["id"] = str(doc.pop("_id"))
    # Normalize author user_ids to strings
    for author in doc.get("authors", []):
        if isinstance(author.get("user_id"), ObjectId):
            author["user_id"] = str(author["user_id"])
    if "submitted_by" in doc and isinstance(doc["submitted_by"], ObjectId):
        doc["submitted_by"] = str(doc["submitted_by"])
    if "reviewed_by" in doc and isinstance(doc["reviewed_by"], ObjectId):
        doc["reviewed_by"] = str(doc["reviewed_by"])
    return doc


@router.get("", response_model=list)
async def list_subjects(department: str = None, semester: int = None, search: str = None):
    """Public endpoint — returns all published subjects, with optional filters."""
    db = get_db()
    query = {"is_published": True}
    if department:
        query["course.department"] = department
    if semester:
        query["course.semester"] = semester
    if search:
        query["name"] = {"$regex": search, "$options": "i"}

    subjects = []
    async for doc in db.subjects.find(query).sort("course.semester", 1):
        subjects.append(serialize_subject(doc))
    return subjects


@router.get("/{slug}")
async def get_subject(slug: str):
    """Public endpoint — returns a single published subject by slug."""
    db = get_db()
    doc = await db.subjects.find_one({"slug": slug, "is_published": True})
    if not doc:
        raise HTTPException(status_code=404, detail="Subject not found")
    return serialize_subject(doc)


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_subject(
    payload: SubjectCreate,
    current_user: dict = Depends(require_contributor),
):
    """Contributor/Admin — creates a new subject draft (is_published=False)."""
    db = get_db()

    # Unique slug check
    if await db.subjects.find_one({"slug": payload.slug}):
        raise HTTPException(status_code=400, detail="Slug already exists, choose a different one")

    now = datetime.utcnow()
    doc = payload.model_dump()
    doc.update({
        "authors": [{"user_id": ObjectId(current_user["id"]), "display_name": current_user["display_name"]}],
        "is_published": False,
        "submitted_by": ObjectId(current_user["id"]),
        "reviewed_by": None,
        "created_at": now,
        "updated_at": now,
    })

    result = await db.subjects.insert_one(doc)
    return {"message": "Subject submitted for review", "id": str(result.inserted_id)}


@router.put("/{subject_id}")
async def update_subject(
    subject_id: str,
    payload: SubjectUpdate,
    current_user: dict = Depends(require_contributor),
):
    """Author or Admin can update a subject."""
    db = get_db()
    doc = await db.subjects.find_one({"_id": ObjectId(subject_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Subject not found")

    # Only allow author or admin to edit
    is_admin = current_user["role"] == "admin"
    is_author = any(
        str(a.get("user_id")) == current_user["id"]
        for a in doc.get("authors", [])
    )
    if not (is_admin or is_author):
        raise HTTPException(status_code=403, detail="Not authorized to edit this subject")

    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    updates["updated_at"] = datetime.utcnow()

    await db.subjects.update_one({"_id": ObjectId(subject_id)}, {"$set": updates})
    return {"message": "Subject updated"}


@router.delete("/{subject_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_subject(
    subject_id: str,
    current_user: dict = Depends(require_contributor),
):
    """Admin or Author — hard delete a subject."""
    db = get_db()
    doc = await db.subjects.find_one({"_id": ObjectId(subject_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Subject not found")

    is_admin = current_user["role"] == "admin"
    is_author = str(doc.get("submitted_by")) == current_user["id"] or any(
        str(a.get("user_id")) == current_user["id"] for a in doc.get("authors", [])
    )
    
    if not (is_admin or is_author):
        raise HTTPException(status_code=403, detail="Not authorized to delete this subject")
        
    await db.subjects.delete_one({"_id": ObjectId(subject_id)})
