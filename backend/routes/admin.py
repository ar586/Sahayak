from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from bson import ObjectId
from database import get_db
from auth_utils import require_admin

router = APIRouter(prefix="/admin", tags=["Admin"])


def serialize(doc: dict) -> dict:
    doc["id"] = str(doc.pop("_id", ""))
    
    # Safely serialize authors if they exist
    if "authors" in doc and isinstance(doc["authors"], list):
        for author in doc["authors"]:
            if isinstance(author, dict) and "user_id" in author and isinstance(author["user_id"], ObjectId):
                author["user_id"] = str(author["user_id"])
                
    # Safely serialize other ObjectIds
    if "submitted_by" in doc and isinstance(doc["submitted_by"], ObjectId):
        doc["submitted_by"] = str(doc["submitted_by"])
    if "reviewed_by" in doc and isinstance(doc["reviewed_by"], ObjectId):
        doc["reviewed_by"] = str(doc["reviewed_by"])
        
    return doc


@router.get("/queue")
async def review_queue(current_user: dict = Depends(require_admin)):
    """Returns all unpublished subject drafts awaiting review."""
    db = get_db()
    drafts = []
    async for doc in db.subjects.find({"is_published": False}).sort("created_at", 1):
        drafts.append(serialize(doc))
    return drafts


@router.put("/publish/{subject_id}")
async def publish_subject(subject_id: str, current_user: dict = Depends(require_admin)):
    """Admin approves and publishes a subject."""
    db = get_db()
    result = await db.subjects.update_one(
        {"_id": ObjectId(subject_id)},
        {
            "$set": {
                "is_published": True,
                "reviewed_by": ObjectId(current_user["id"]),
                "updated_at": datetime.utcnow(),
            }
        },
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Subject not found")
    return {"message": "Subject published successfully"}


@router.put("/reject/{subject_id}")
async def reject_subject(subject_id: str, reason: str = "", current_user: dict = Depends(require_admin)):
    """Admin rejects a submission — marks it with a rejection note."""
    db = get_db()
    result = await db.subjects.update_one(
        {"_id": ObjectId(subject_id)},
        {
            "$set": {
                "is_published": False,
                "rejection_reason": reason,
                "reviewed_by": ObjectId(current_user["id"]),
                "updated_at": datetime.utcnow(),
            }
        },
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Subject not found")
    return {"message": "Subject rejected", "reason": reason}


@router.get("/users")
async def list_users(current_user: dict = Depends(require_admin)):
    """Admin — list all registered users."""
    db = get_db()
    users = []
    async for u in db.users.find({}, {"hashed_password": 0}):
        u["id"] = str(u.pop("_id"))
        users.append(u)
    return users


@router.put("/users/{user_id}/role")
async def update_user_role(user_id: str, role: str, current_user: dict = Depends(require_admin)):
    """Admin — change a user's role."""
    if role not in ("admin", "contributor", "reader"):
        raise HTTPException(status_code=400, detail="Invalid role. Must be admin, contributor, or reader")
    db = get_db()
    result = await db.users.update_one({"_id": ObjectId(user_id)}, {"$set": {"role": role}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": f"Role updated to {role}"}



